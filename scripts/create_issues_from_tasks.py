#!/usr/bin/env python3
"""
GitHub Issues 생성 스크립트
Tasks 폴더의 마크다운 파일을 읽어서 GitHub Issues를 자동 생성합니다.
- 중복 체크 기능 포함
- 'Issue Automation' 라벨 자동 추가
"""

import os
import re
import yaml
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Set

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
            ['gh', 'repo', 'view', '--json', 'nameWithOwner'],
            capture_output=True,
            text=True,
            check=True
        )
        repo_info = json.loads(result.stdout)
        owner, repo = repo_info['nameWithOwner'].split('/')
        return owner, repo
    except (subprocess.CalledProcessError, json.JSONDecodeError, ValueError):
        # 대체 방법: git remote 사용
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

def get_existing_issues(owner: str, repo: str) -> Set[str]:
    """기존 Issues의 제목 목록을 가져옵니다."""
    existing_titles = set()
    try:
        # 모든 열린 이슈 가져오기
        result = subprocess.run(
            ['gh', 'issue', 'list', '--repo', f'{owner}/{repo}', 
             '--state', 'all', '--limit', '1000', '--json', 'title,number'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        if result.stdout:
            issues = json.loads(result.stdout)
            for issue in issues:
                existing_titles.add(issue['title'].strip())
            print(f"📋 기존 Issues {len(existing_titles)}개 발견")
    except (subprocess.CalledProcessError, json.JSONDecodeError) as e:
        print(f"⚠️  기존 Issues 조회 실패 (계속 진행): {str(e)}")
    return existing_titles

def ensure_label_exists(owner: str, repo: str, label: str, color: str = "0E8A16") -> bool:
    """라벨이 존재하는지 확인하고 없으면 생성합니다."""
    try:
        # 라벨 목록 확인
        result = subprocess.run(
            ['gh', 'label', 'list', '--repo', f'{owner}/{repo}', '--json', 'name'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        if result.stdout:
            labels = json.loads(result.stdout)
            label_names = [l['name'] for l in labels]
            
            if label in label_names:
                print(f"✅ 라벨 '{label}' 이미 존재함")
                return True
        
        # 라벨 생성
        subprocess.run(
            ['gh', 'label', 'create', label, '--repo', f'{owner}/{repo}', 
             '--color', color, '--description', 'Automatically created issues'],
            capture_output=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        print(f"✅ 라벨 '{label}' 생성 완료")
        return True
    except subprocess.CalledProcessError as e:
        # 라벨이 이미 존재할 수도 있음 (에러 무시)
        print(f"⚠️  라벨 '{label}' 처리 중 경고 (계속 진행)")
        return True  # 계속 진행
    except json.JSONDecodeError:
        # JSON 파싱 실패 시에도 계속 진행
        print(f"⚠️  라벨 목록 파싱 실패 (계속 진행)")
        return True

def ensure_labels_exist(owner: str, repo: str, labels: List[str]) -> List[str]:
    """라벨들이 존재하는지 확인하고 없으면 생성합니다."""
    valid_labels = []
    
    # 한 번에 모든 라벨 조회
    existing_labels = set()
    try:
        result = subprocess.run(
            ['gh', 'label', 'list', '--repo', f'{owner}/{repo}', '--json', 'name'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        if result.stdout:
            existing_labels = {l['name'] for l in json.loads(result.stdout)}
    except (subprocess.CalledProcessError, json.JSONDecodeError):
        pass
    
    # 각 라벨 확인 및 생성
    for label in labels:
        if label in existing_labels:
            valid_labels.append(label)
        else:
            # 라벨 생성 시도
            try:
                color = "0E8A16" if label == "Issue Automation" else "0052CC"
                subprocess.run(
                    ['gh', 'label', 'create', label, '--repo', f'{owner}/{repo}', 
                     '--color', color, '--description', 'Auto-created label'],
                    capture_output=True,
                    encoding='utf-8',
                    errors='ignore',
                    check=True
                )
                valid_labels.append(label)
                existing_labels.add(label)  # 캐시 업데이트
                print(f"   ✅ 라벨 '{label}' 생성됨")
            except subprocess.CalledProcessError:
                print(f"   ⚠️  라벨 '{label}' 생성 실패 (건너뜀)")
    
    return valid_labels

def create_issue(owner: str, repo: str, title: str, body: str, 
                labels: List[str] = None) -> Optional[str]:
    """GitHub CLI를 사용하여 Issue를 생성합니다."""
    # 라벨 확인 및 생성
    valid_labels = []
    if labels:
        valid_labels = ensure_labels_exist(owner, repo, labels)
    
    cmd = ['gh', 'issue', 'create', '--repo', f'{owner}/{repo}', 
           '--title', title, '--body', body]
    
    if valid_labels:
        cmd.extend(['--label', ','.join(valid_labels)])
    
    try:
        result = subprocess.run(
            cmd, 
            capture_output=True, 
            text=True, 
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        issue_url = result.stdout.strip()
        issue_number = re.search(r'/(\d+)$', issue_url)
        if issue_number:
            label_info = f" (라벨: {', '.join(valid_labels)})" if valid_labels else ""
            print(f"✅ Issue #{issue_number.group(1)} 생성 완료: {issue_url}{label_info}")
            return issue_url
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr if e.stderr else str(e)
        print(f"❌ Issue 생성 실패: {error_msg}")
        return None
    return None

def extract_issue_content(frontmatter: Dict, body: str, file_path: Path) -> Dict:
    """마크다운 파일에서 Issue 내용을 추출합니다."""
    # 제목 추출
    title = frontmatter.get('title', file_path.stem)
    
    # 본문 구성
    issue_body_parts = []
    
    # 메타데이터 섹션
    if frontmatter.get('epic') or frontmatter.get('source'):
        issue_body_parts.append("## 📋 메타데이터\n")
        if frontmatter.get('epic'):
            issue_body_parts.append(f"- **EPIC**: {frontmatter['epic']}\n")
        if frontmatter.get('source'):
            issue_body_parts.append(f"- **출처**: {frontmatter['source']}\n")
        if frontmatter.get('priority'):
            issue_body_parts.append(f"- **우선순위**: {frontmatter['priority']}\n")
        if frontmatter.get('status'):
            issue_body_parts.append(f"- **상태**: {frontmatter['status']}\n")
        issue_body_parts.append("\n")
    
    # 일정 정보
    if frontmatter.get('start-date') or frontmatter.get('due-date') or frontmatter.get('target-date'):
        issue_body_parts.append("## 📅 일정 정보\n")
        if frontmatter.get('start-date'):
            issue_body_parts.append(f"- **시작일**: {frontmatter['start-date']}\n")
        if frontmatter.get('due-date'):
            issue_body_parts.append(f"- **마감일**: {frontmatter['due-date']}\n")
        elif frontmatter.get('target-date'):
            issue_body_parts.append(f"- **목표일**: {frontmatter['target-date']}\n")
        issue_body_parts.append("\n")
    
    # 원본 본문 추가
    issue_body_parts.append("## 📝 상세 내용\n\n")
    issue_body_parts.append(body)
    
    # 파일 경로 추가
    try:
        relative_path = file_path.relative_to(Path.cwd())
    except ValueError:
        # 상대 경로 계산 실패 시 절대 경로 사용
        relative_path = file_path
    issue_body_parts.append(f"\n\n---\n*원본 파일: `{relative_path}`*")
    
    issue_body = ''.join(issue_body_parts)
    
    # 라벨 구성
    labels = ['Issue Automation']
    if frontmatter.get('priority'):
        priority_label = frontmatter['priority'].lower()
        labels.append(priority_label)
    if frontmatter.get('epic'):
        epic_label = frontmatter['epic'].replace(' ', '-').replace('(', '').replace(')', '').lower()
        labels.append(epic_label)
    
    return {
        'title': title,
        'body': issue_body,
        'labels': labels
    }

def process_task_files(tasks_dir: Path) -> List[Dict]:
    """Tasks 폴더의 모든 마크다운 파일을 처리합니다."""
    issues = []
    
    # Priority 폴더의 파일들만 처리 (루트의 다른 파일 제외)
    priority_dirs = ['Priority_1', 'Priority_2', 'Priority_3']
    
    for priority_dir in priority_dirs:
        priority_path = tasks_dir / priority_dir
        if not priority_path.exists():
            continue
        
        for md_file in sorted(priority_path.glob('*.md')):
            try:
                rel_path = str(md_file).replace(str(Path.cwd()), '').lstrip('\\/').replace('\\', '/')
                print(f"\n📄 처리 중: {rel_path}")
                
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                frontmatter, body = parse_frontmatter(content)
                
                if not frontmatter:
                    print(f"⚠️  Frontmatter가 없습니다. 건너뜁니다.")
                    continue
                
                issue_content = extract_issue_content(frontmatter, body, md_file)
                issue_content['file'] = md_file
                issues.append(issue_content)
            except Exception as e:
                print(f"❌ 파일 처리 중 오류 발생: {md_file} - {e}")
                continue
    
    return issues

def main():
    """메인 함수"""
    import sys
    
    # 자동 실행 옵션 확인
    auto_yes = '--yes' in sys.argv or '-y' in sys.argv
    
    print("🚀 GitHub Issues 생성 스크립트")
    print("=" * 60)
    
    # 리포지토리 확인
    repo_info = get_github_repo()
    if not repo_info:
        print("❌ Git 리포지토리를 찾을 수 없습니다.")
        print("   현재 디렉토리가 Git 리포지토리인지 확인해주세요.")
        return
    
    owner, repo = repo_info
    print(f"📦 리포지토리: {owner}/{repo}")
    
    # 'Issue Automation' 라벨 확인/생성
    print("\n🏷️  라벨 확인 중...")
    ensure_label_exists(owner, repo, 'Issue Automation')
    print("   (추가 라벨은 Issue 생성 시 자동으로 생성됩니다)")
    
    # 기존 Issues 조회
    print("\n🔍 기존 Issues 확인 중...")
    existing_titles = get_existing_issues(owner, repo)
    
    # Tasks 디렉토리 확인
    tasks_dir = Path('Tasks')
    if not tasks_dir.exists():
        print(f"❌ Tasks 디렉토리를 찾을 수 없습니다.")
        return
    
    # 마크다운 파일 처리
    print("\n📚 Task 파일 처리 중...")
    issues = process_task_files(tasks_dir)
    
    if not issues:
        print("\n❌ 처리할 파일이 없습니다.")
        return
    
    # 중복 제거
    new_issues = [issue for issue in issues if issue['title'] not in existing_titles]
    skipped_issues = [issue for issue in issues if issue['title'] in existing_titles]
    
    print(f"\n📊 통계:")
    print(f"   - 총 Task 파일: {len(issues)}개")
    print(f"   - 새로 생성할 Issues: {len(new_issues)}개")
    print(f"   - 이미 존재하는 Issues: {len(skipped_issues)}개")
    
    if skipped_issues:
        print(f"\n⏭️  건너뛸 Issues:")
        for issue in skipped_issues:
            print(f"   - {issue['title']}")
    
    if not new_issues:
        print("\n✅ 모든 Issues가 이미 존재합니다.")
        return
    
    # 사용자 확인
    if not auto_yes:
        print(f"\n⚠️  {len(new_issues)}개의 Issue를 생성하시겠습니까?")
        response = input("계속하시겠습니까? (y/N): ")
        if response.lower() != 'y':
            print("취소되었습니다.")
            return
    else:
        print(f"\n🚀 자동 모드: {len(new_issues)}개의 Issue를 생성합니다...")
    
    # Issue 생성
    print("\n" + "=" * 60)
    print("GitHub Issues 생성 중...")
    print("=" * 60)
    
    created_count = 0
    failed_count = 0
    
    for issue in new_issues:
        print(f"\n📝 Issue: {issue['title']}")
        
        success = create_issue(
            owner=owner,
            repo=repo,
            title=issue['title'],
            body=issue['body'],
            labels=issue['labels']
        )
        
        if success:
            created_count += 1
        else:
            failed_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ 완료!")
    print(f"   - 성공: {created_count}개")
    print(f"   - 실패: {failed_count}개")
    print(f"   - 건너뜀: {len(skipped_issues)}개")
    print(f"\n🔗 GitHub에서 확인: https://github.com/{owner}/{repo}/issues")

if __name__ == '__main__':
    main()

