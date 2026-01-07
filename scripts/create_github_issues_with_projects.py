#!/usr/bin/env python3
"""
GitHub Issues 및 Projects 연동 스크립트 (고급 버전)
GitHub Projects API를 사용하여 Issues를 생성하고 Projects에 자동으로 추가합니다.
"""

import os
import re
import yaml
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime

def parse_frontmatter(content: str) -> tuple[Optional[Dict], str]:
    """마크다운 파일에서 YAML frontmatter를 파싱합니다."""
    if not content.startswith('---'):
        return None, content
    
    parts = content.split('---', 2)
    if len(parts) < 3:
        return None, content
    
    try:
        frontmatter = yaml.safe_load(parts[1])
        body = parts[2].strip()
        return frontmatter, body
    except yaml.YAMLError:
        return None, content

def get_github_repo() -> Optional[tuple[str, str]]:
    """현재 Git 리포지토리 정보를 가져옵니다. (owner, repo)"""
    try:
        result = subprocess.run(
            ['git', 'remote', 'get-url', 'origin'],
            capture_output=True,
            text=True,
            check=True
        )
        url = result.stdout.strip()
        match = re.search(r'github\.com[:/]([^/]+)/([^/]+?)(?:\.git)?$', url)
        if match:
            return match.group(1), match.group(2)
    except subprocess.CalledProcessError:
        pass
    return None

def create_issue_via_api(owner: str, repo: str, title: str, body: str, 
                        labels: List[str] = None) -> Optional[str]:
    """GitHub API를 사용하여 Issue를 생성합니다."""
    issue_data = {
        'title': title,
        'body': body
    }
    
    if labels:
        issue_data['labels'] = labels
    
    try:
        result = subprocess.run(
            ['gh', 'api', 'repos', owner, repo, 'issues', 
             '--method', 'POST', '--input', '-'],
            input=json.dumps(issue_data),
            capture_output=True,
            text=True,
            check=True
        )
        
        issue = json.loads(result.stdout)
        issue_number = issue['number']
        issue_url = issue['html_url']
        print(f"✅ Issue #{issue_number} 생성 완료: {issue_url}")
        return str(issue['id'])  # Node ID 반환
    except subprocess.CalledProcessError as e:
        print(f"❌ Issue 생성 실패: {e.stderr}")
        return None

def get_project_id(owner: str, project_number: int) -> Optional[str]:
    """GitHub Project의 Node ID를 가져옵니다."""
    try:
        # GitHub Projects v2 API 사용
        query = f"""
        {{
          organization(login: "{owner}") {{
            projectV2(number: {project_number}) {{
              id
              title
            }}
          }}
        }}
        """
        
        result = subprocess.run(
            ['gh', 'api', 'graphql', '-f', f'query={query}'],
            capture_output=True,
            text=True,
            check=True
        )
        
        data = json.loads(result.stdout)
        project = data.get('data', {}).get('organization', {}).get('projectV2')
        if project:
            print(f"📊 Project 찾음: {project['title']} (ID: {project['id']})")
            return project['id']
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Project 조회 실패: {e.stderr}")
    
    return None

def add_issue_to_project(project_id: str, issue_id: str, 
                        start_date: str = None, due_date: str = None) -> bool:
    """Issue를 Project에 추가하고 날짜 필드를 설정합니다."""
    try:
        # Issue를 Project에 추가
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
            check=True
        )
        
        data = json.loads(result.stdout)
        item_id = data.get('data', {}).get('addProjectV2ItemById', {}).get('item', {}).get('id')
        
        if item_id:
            print(f"✅ Project에 추가 완료 (Item ID: {item_id})")
            
            # 날짜 필드 설정 (Project에 Date 필드가 있는 경우)
            if start_date or due_date:
                print(f"📅 날짜 정보: 시작일={start_date}, 마감일={due_date}")
                print(f"   (Project에서 Date 필드를 수동으로 설정해주세요)")
            
            return True
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Project 추가 실패: {e.stderr}")
        return False
    
    return False

def process_task_files(tasks_dir: Path) -> List[Dict]:
    """Tasks 폴더의 모든 마크다운 파일을 처리합니다."""
    issues = []
    
    for md_file in sorted(tasks_dir.rglob('*.md')):
        if md_file.name.startswith('.'):
            continue
        
        print(f"\n📄 처리 중: {md_file.relative_to(tasks_dir.parent)}")
        
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        frontmatter, body = parse_frontmatter(content)
        
        if not frontmatter:
            print(f"⚠️  Frontmatter가 없습니다. 건너뜁니다.")
            continue
        
        labels = []
        if frontmatter.get('priority'):
            labels.append(frontmatter['priority'].lower())
        if frontmatter.get('epic'):
            labels.append(frontmatter['epic'].replace(' ', '-').lower())
        
        issues.append({
            'title': frontmatter.get('title', md_file.stem),
            'body': body,
            'labels': labels,
            'start_date': frontmatter.get('start-date'),
            'due_date': frontmatter.get('due-date') or frontmatter.get('target-date'),
            'epic': frontmatter.get('epic'),
            'priority': frontmatter.get('priority'),
            'file': md_file
        })
    
    return issues

def main():
    """메인 함수"""
    print("🚀 GitHub Issues 및 Projects 연동 스크립트 (고급 버전)")
    print("=" * 60)
    
    # 리포지토리 확인
    repo_info = get_github_repo()
    if not repo_info:
        print("❌ Git 리포지토리를 찾을 수 없습니다.")
        return
    
    owner, repo = repo_info
    print(f"📦 리포지토리: {owner}/{repo}")
    
    # Project 번호 입력
    project_number = input("\nGitHub Project 번호를 입력하세요 (예: 1): ")
    try:
        project_number = int(project_number)
    except ValueError:
        print("❌ 유효한 숫자를 입력해주세요.")
        return
    
    # Project ID 조회
    project_id = get_project_id(owner, project_number)
    if not project_id:
        print("❌ Project를 찾을 수 없습니다.")
        print("   Project 번호를 확인하거나 Organization/User 이름을 확인해주세요.")
        return
    
    # Tasks 디렉토리 확인
    tasks_dir = Path('Tasks')
    if not tasks_dir.exists():
        print(f"❌ Tasks 디렉토리를 찾을 수 없습니다.")
        return
    
    # 마크다운 파일 처리
    issues = process_task_files(tasks_dir)
    
    if not issues:
        print("\n❌ 처리할 파일이 없습니다.")
        return
    
    print(f"\n📊 총 {len(issues)}개의 Issue를 생성할 예정입니다.")
    
    # 사용자 확인
    response = input("\n계속하시겠습니까? (y/N): ")
    if response.lower() != 'y':
        print("취소되었습니다.")
        return
    
    # Issue 생성 및 Project 추가
    print("\n" + "=" * 60)
    print("GitHub Issues 생성 및 Projects 연동 중...")
    print("=" * 60)
    
    created_count = 0
    for issue in issues:
        print(f"\n📝 Issue: {issue['title']}")
        
        # Body에 메타데이터 추가
        body_with_meta = f"""## 📅 일정 정보
- **시작일**: {issue['start_date'] or '미정'}
- **마감일**: {issue['due_date'] or '미정'}

## 📋 상세 내용

{issue['body']}"""
        
        # Issue 생성
        issue_id = create_issue_via_api(
            owner=owner,
            repo=repo,
            title=issue['title'],
            body=body_with_meta,
            labels=issue['labels']
        )
        
        if issue_id:
            # Project에 추가
            add_issue_to_project(
                project_id=project_id,
                issue_id=issue_id,
                start_date=issue['start_date'],
                due_date=issue['due_date']
            )
            created_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ 완료! {created_count}/{len(issues)}개의 Issue가 생성되고 Project에 추가되었습니다.")
    print(f"\n🔗 GitHub에서 확인: https://github.com/{owner}/{repo}/projects/{project_number}")

if __name__ == '__main__':
    main()

