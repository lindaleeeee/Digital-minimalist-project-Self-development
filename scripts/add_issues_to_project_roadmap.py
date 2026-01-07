#!/usr/bin/env python3
"""
GitHub Projects 로드맵에 Issues 추가 및 날짜 설정 스크립트
Issues를 Project에 추가하고 시작일/종료일을 설정합니다.
"""

import json
import subprocess
import re
from typing import Optional, Tuple, Dict, List

def get_github_repo() -> Optional[Tuple[str, str]]:
    """현재 Git 리포지토리 정보를 가져옵니다."""
    try:
        result = subprocess.run(
            ['gh', 'repo', 'view', '--json', 'nameWithOwner'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        repo_info = json.loads(result.stdout)
        owner, repo = repo_info['nameWithOwner'].split('/')
        return owner, repo
    except Exception:
        return None

def get_owner_type(owner: str) -> str:
    """Owner가 Organization인지 User인지 확인합니다."""
    try:
        result = subprocess.run(
            ['gh', 'api', f'users/{owner}'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        user_data = json.loads(result.stdout)
        return 'organization' if user_data.get('type') == 'Organization' else 'user'
    except Exception:
        return 'user'  # 기본값

def list_projects(owner: str, owner_type: str) -> List[Dict]:
    """사용 가능한 Projects 목록을 가져옵니다."""
    projects = []
    try:
        if owner_type == 'organization':
            query = f"""
            {{
              organization(login: "{owner}") {{
                projectsV2(first: 20) {{
                  nodes {{
                    id
                    number
                    title
                    url
                  }}
                }}
              }}
            }}
            """
        else:
            query = f"""
            {{
              user(login: "{owner}") {{
                projectsV2(first: 20) {{
                  nodes {{
                    id
                    number
                    title
                    url
                  }}
                }}
              }}
            }}
            """
        
        result = subprocess.run(
            ['gh', 'api', 'graphql', '-f', f'query={query}'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        
        data = json.loads(result.stdout)
        if owner_type == 'organization':
            projects_data = data.get('data', {}).get('organization', {}).get('projectsV2', {}).get('nodes', [])
        else:
            projects_data = data.get('data', {}).get('user', {}).get('projectsV2', {}).get('nodes', [])
        
        for project in projects_data:
            projects.append({
                'id': project['id'],
                'number': project['number'],
                'title': project['title'],
                'url': project['url']
            })
    except Exception as e:
        print(f"⚠️  Projects 조회 실패: {e}")
    
    return projects

def get_project_fields(project_id: str) -> Dict[str, str]:
    """Project의 필드 목록을 가져옵니다 (특히 Date 필드)."""
    fields = {}
    try:
        query = f"""
        {{
          node(id: "{project_id}") {{
            ... on ProjectV2 {{
              fields(first: 20) {{
                nodes {{
                  ... on ProjectV2Field {{
                    id
                    name
                    dataType
                  }}
                  ... on ProjectV2IterationField {{
                    id
                    name
                    dataType
                  }}
                  ... on ProjectV2SingleSelectField {{
                    id
                    name
                    dataType
                  }}
                }}
              }}
            }}
          }}
        }}
        """
        
        result = subprocess.run(
            ['gh', 'api', 'graphql', '-f', f'query={query}'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        
        data = json.loads(result.stdout)
        field_nodes = data.get('data', {}).get('node', {}).get('fields', {}).get('nodes', [])
        
        for field in field_nodes:
            if field.get('dataType') == 'DATE':
                fields[field['name'].lower()] = field['id']
    except Exception as e:
        print(f"⚠️  필드 조회 실패: {e}")
    
    return fields

def get_issues_with_label(owner: str, repo: str, label: str) -> List[Dict]:
    """특정 라벨이 있는 Issues를 가져옵니다."""
    issues = []
    try:
        result = subprocess.run(
            ['gh', 'issue', 'list', '--repo', f'{owner}/{repo}',
             '--label', label, '--state', 'all', '--limit', '100',
             '--json', 'number,title,id,body'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        if result.stdout:
            issues = json.loads(result.stdout)
    except Exception as e:
        print(f"⚠️  Issues 조회 실패: {e}")
    return issues

def extract_dates_from_body(body: str) -> Tuple[Optional[str], Optional[str]]:
    """Issue 본문에서 날짜 정보를 추출합니다."""
    start_date = None
    end_date = None
    
    # 날짜 정보 섹션 찾기
    date_pattern = r'## 📅 일정 정보\n.*?\*\*시작일\*\*: (\d{4}-\d{2}-\d{2}).*?\*\*마감일\*\*: (\d{4}-\d{2}-\d{2})'
    match = re.search(date_pattern, body, re.DOTALL)
    if match:
        start_date = match.group(1)
        end_date = match.group(2)
    
    return start_date, end_date

def get_issue_node_id(owner: str, repo: str, issue_number: int) -> Optional[str]:
    """Issue의 Node ID를 가져옵니다."""
    try:
        query = f"""
        {{
          repository(owner: "{owner}", name: "{repo}") {{
            issue(number: {issue_number}) {{
              id
            }}
          }}
        }}
        """
        
        result = subprocess.run(
            ['gh', 'api', 'graphql', '-f', f'query={query}'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        
        data = json.loads(result.stdout)
        issue_id = data.get('data', {}).get('repository', {}).get('issue', {}).get('id')
        return issue_id
    except Exception as e:
        print(f"   ⚠️  Issue Node ID 조회 실패: {e}")
        return None

def add_issue_to_project(project_id: str, issue_id: str) -> Optional[str]:
    """Issue를 Project에 추가합니다."""
    try:
        mutation = f"""
        mutation {{
          addProjectV2ItemById(input: {{
            projectId: "{project_id}",
            contentId: "{issue_id}"
          }}) {{
            item {{
              id
            }}
          }}
        }}
        """
        
        result = subprocess.run(
            ['gh', 'api', 'graphql', '-f', f'query={mutation}'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        
        data = json.loads(result.stdout)
        item_id = data.get('data', {}).get('addProjectV2ItemById', {}).get('item', {}).get('id')
        return item_id
    except Exception as e:
        error_msg = str(e)
        if 'already exists' in error_msg.lower() or 'already added' in error_msg.lower():
            return 'exists'  # 이미 추가됨
        return None

def update_project_item_date(item_id: str, field_id: str, date_value: str) -> bool:
    """Project Item의 날짜 필드를 업데이트합니다."""
    try:
        mutation = f"""
        mutation {{
          updateProjectV2ItemFieldValue(input: {{
            projectId: "{item_id.split('/')[0]}",
            itemId: "{item_id}",
            fieldId: "{field_id}",
            value: {{
              date: "{date_value}"
            }}
          }}) {{
            projectV2Item {{
              id
            }}
          }}
        }}
        """
        
        # Project ID와 Item ID 분리
        parts = item_id.split('_')
        if len(parts) >= 2:
            project_node_id = '_'.join(parts[:-1])
            item_node_id = item_id
        else:
            return False
        
        mutation = f"""
        mutation {{
          updateProjectV2ItemFieldValue(input: {{
            itemId: "{item_id}",
            fieldId: "{field_id}",
            value: {{
              date: "{date_value}"
            }}
          }}) {{
            projectV2Item {{
              id
            }}
          }}
        }}
        """
        
        result = subprocess.run(
            ['gh', 'api', 'graphql', '-f', f'query={mutation}'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        
        return True
    except Exception as e:
        print(f"   ⚠️  날짜 필드 업데이트 실패: {e}")
        return False

def main():
    """메인 함수"""
    print("🗺️  GitHub Projects 로드맵 연동 스크립트")
    print("=" * 60)
    
    repo_info = get_github_repo()
    if not repo_info:
        print("❌ Git 리포지토리를 찾을 수 없습니다.")
        return
    
    owner, repo = repo_info
    print(f"📦 리포지토리: {owner}/{repo}")
    
    # Owner 타입 확인
    print(f"\n👤 Owner 타입 확인 중...")
    owner_type = get_owner_type(owner)
    print(f"   타입: {owner_type}")
    
    # Projects 목록 조회
    print(f"\n📊 Projects 목록 조회 중...")
    projects = list_projects(owner, owner_type)
    
    if not projects:
        print("❌ Projects를 찾을 수 없습니다.")
        print("   GitHub에서 Project를 먼저 생성해주세요.")
        return
    
    print(f"\n📋 사용 가능한 Projects:")
    for i, project in enumerate(projects, 1):
        print(f"   {i}. [{project['number']}] {project['title']}")
    
    # Project 선택 (명령줄 인자 또는 기본값)
    import sys
    project_choice = None
    if len(sys.argv) > 1:
        try:
            project_choice = int(sys.argv[1])
        except ValueError:
            pass
    
    if project_choice is None:
        try:
            choice = input(f"\n사용할 Project 번호를 선택하세요 (1-{len(projects)}, 기본값: 1): ")
            project_choice = int(choice) if choice.strip() else 1
        except (ValueError, KeyboardInterrupt):
            project_choice = 1  # 기본값
    
    try:
        selected_project = projects[project_choice - 1]
        project_id = selected_project['id']
        project_number = selected_project['number']
        project_title = selected_project['title']
        print(f"\n✅ 선택된 Project: [{project_number}] {project_title}")
    except (ValueError, IndexError):
        print(f"❌ 잘못된 선택입니다. Project 1번을 사용합니다.")
        selected_project = projects[0]
        project_id = selected_project['id']
        project_number = selected_project['number']
        project_title = selected_project['title']
    
    # Project 필드 조회
    print(f"\n🔍 Project 필드 조회 중...")
    fields = get_project_fields(project_id)
    
    start_field_id = None
    end_field_id = None
    
    # Date 필드 찾기
    for field_name, field_id in fields.items():
        if 'start' in field_name or '시작' in field_name:
            start_field_id = field_id
        elif 'end' in field_name or 'due' in field_name or '마감' in field_name or '종료' in field_name:
            end_field_id = field_id
    
    if not start_field_id or not end_field_id:
        print("⚠️  시작일/종료일 필드를 찾을 수 없습니다.")
        print("   GitHub Projects에서 Date 필드를 추가해주세요.")
        print("   필드 이름 예시: 'Start Date', 'End Date', 'Due Date'")
        use_fields = False
    else:
        print(f"✅ Date 필드 발견:")
        print(f"   - 시작일 필드 ID: {start_field_id}")
        print(f"   - 종료일 필드 ID: {end_field_id}")
        use_fields = True
    
    # Issues 조회
    print(f"\n🔍 'Issue Automation' 라벨이 있는 Issues 조회 중...")
    issues = get_issues_with_label(owner, repo, 'Issue Automation')
    
    if not issues:
        print("❌ 해당 라벨이 있는 Issues를 찾을 수 없습니다.")
        return
    
    print(f"📋 총 {len(issues)}개의 Issues 발견")
    
    # 사용자 확인 (자동 모드 옵션)
    import sys
    auto_yes = '--yes' in sys.argv or '-y' in sys.argv
    
    if not auto_yes:
        response = input(f"\n{len(issues)}개의 Issues를 Project에 추가하시겠습니까? (y/N): ")
        if response.lower() != 'y':
            print("취소되었습니다.")
            return
    else:
        print(f"\n🚀 자동 모드: {len(issues)}개의 Issues를 Project에 추가합니다...")
    
    # Issues를 Project에 추가
    print(f"\n🔄 Issues를 Project에 추가 중...")
    print("=" * 60)
    
    added_count = 0
    updated_count = 0
    skipped_count = 0
    failed_count = 0
    
    for issue in issues:
        print(f"\n📝 Issue #{issue['number']}: {issue['title']}")
        
        # Issue Node ID 가져오기
        issue_node_id = get_issue_node_id(owner, repo, issue['number'])
        if not issue_node_id:
            print(f"   ❌ Issue Node ID를 가져올 수 없습니다.")
            failed_count += 1
            continue
        
        # Project에 추가
        item_id = add_issue_to_project(project_id, issue_node_id)
        
        if item_id == 'exists':
            print(f"   ⏭️  이미 Project에 추가되어 있습니다.")
            skipped_count += 1
            item_id = None  # 날짜 업데이트는 시도하지 않음
        elif item_id:
            print(f"   ✅ Project에 추가 완료")
            added_count += 1
        else:
            print(f"   ❌ Project 추가 실패")
            failed_count += 1
            continue
        
        # 날짜 필드 업데이트
        if use_fields and item_id:
            start_date, end_date = extract_dates_from_body(issue.get('body', ''))
            
            if start_date and start_field_id:
                if update_project_item_date(item_id, start_field_id, start_date):
                    print(f"   📅 시작일 설정: {start_date}")
                    updated_count += 1
            
            if end_date and end_field_id:
                if update_project_item_date(item_id, end_field_id, end_date):
                    print(f"   📅 종료일 설정: {end_date}")
    
    print("\n" + "=" * 60)
    print(f"✅ 완료!")
    print(f"   - Project에 추가: {added_count}개")
    print(f"   - 날짜 필드 업데이트: {updated_count}개")
    print(f"   - 이미 추가됨: {skipped_count}개")
    print(f"   - 실패: {failed_count}개")
    print(f"\n🔗 Project에서 확인: {selected_project['url']}")

if __name__ == '__main__':
    main()

