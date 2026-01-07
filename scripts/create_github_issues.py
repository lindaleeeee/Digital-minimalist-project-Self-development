#!/usr/bin/env python3
"""
GitHub Issues 생성 스크립트
Tasks 폴더의 마크다운 파일을 읽어서 GitHub Issues를 자동 생성합니다.
"""

import os
import re
import yaml
import subprocess
from pathlib import Path
from typing import Dict, List, Optional

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

def get_github_repo() -> Optional[str]:
    """현재 Git 리포지토리 정보를 가져옵니다."""
    try:
        result = subprocess.run(
            ['git', 'remote', 'get-url', 'origin'],
            capture_output=True,
            text=True,
            check=True
        )
        url = result.stdout.strip()
        # git@github.com:user/repo.git 또는 https://github.com/user/repo.git 형식
        match = re.search(r'github\.com[:/]([^/]+/[^/]+?)(?:\.git)?$', url)
        if match:
            return match.group(1)
    except subprocess.CalledProcessError:
        pass
    return None

def create_issue_using_gh_cli(title: str, body: str, labels: List[str] = None, 
                               project: str = None, start_date: str = None, 
                               due_date: str = None) -> bool:
    """GitHub CLI를 사용하여 Issue를 생성합니다."""
    cmd = ['gh', 'issue', 'create', '--title', title, '--body', body]
    
    if labels:
        cmd.extend(['--label', ','.join(labels)])
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        issue_url = result.stdout.strip()
        print(f"✅ Issue 생성 완료: {issue_url}")
        
        # Projects에 추가 (GitHub CLI v2.0+)
        if project:
            issue_number = issue_url.split('/')[-1]
            try:
                subprocess.run(
                    ['gh', 'project', 'item-add', project, '--owner', issue_url.split('/')[3], 
                     '--repo', issue_url.split('/')[4], '--url', issue_url],
                    check=True
                )
                print(f"✅ Project에 추가 완료: {project}")
            except subprocess.CalledProcessError:
                print(f"⚠️  Project 추가 실패 (수동으로 추가해주세요)")
        
        # 날짜 필드 설정 (GitHub Projects v2 API 사용)
        if start_date or due_date:
            issue_number = issue_url.split('/')[-1]
            print(f"📅 날짜 정보: 시작일={start_date}, 마감일={due_date}")
            print(f"   (GitHub Projects에서 수동으로 날짜를 설정해주세요)")
        
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Issue 생성 실패: {e.stderr}")
        return False
    except FileNotFoundError:
        print("❌ GitHub CLI (gh)가 설치되어 있지 않습니다.")
        print("   설치 방법: https://cli.github.com/")
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
        
        # 라벨 생성
        labels = []
        if frontmatter.get('priority'):
            labels.append(frontmatter['priority'].lower())
        if frontmatter.get('epic'):
            labels.append(frontmatter['epic'].replace(' ', '-').lower())
        if frontmatter.get('status'):
            labels.append(frontmatter['status'].replace(' ', '-').lower())
        
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
    print("🚀 GitHub Issues 생성 스크립트")
    print("=" * 50)
    
    # 리포지토리 확인
    repo = get_github_repo()
    if not repo:
        print("❌ Git 리포지토리를 찾을 수 없습니다.")
        print("   현재 디렉토리가 Git 리포지토리인지 확인해주세요.")
        return
    
    print(f"📦 리포지토리: {repo}")
    
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
    
    # Issue 생성
    print("\n" + "=" * 50)
    print("GitHub Issues 생성 중...")
    print("=" * 50)
    
    created_count = 0
    for issue in issues:
        print(f"\n📝 Issue: {issue['title']}")
        
        # Body에 메타데이터 추가
        body_with_meta = issue['body']
        if issue['start_date'] or issue['due_date']:
            body_with_meta = f"""## 📅 일정 정보
- **시작일**: {issue['start_date'] or '미정'}
- **마감일**: {issue['due_date'] or '미정'}

## 📋 상세 내용

{issue['body']}"""
        
        success = create_issue_using_gh_cli(
            title=issue['title'],
            body=body_with_meta,
            labels=issue['labels'],
            start_date=issue['start_date'],
            due_date=issue['due_date']
        )
        
        if success:
            created_count += 1
    
    print("\n" + "=" * 50)
    print(f"✅ 완료! {created_count}/{len(issues)}개의 Issue가 생성되었습니다.")
    print("\n💡 다음 단계:")
    print("   1. GitHub Projects에서 Issues를 확인하세요")
    print("   2. 로드맵 뷰에서 날짜를 수동으로 설정하세요")
    print("   3. 또는 GitHub Projects API를 사용하여 자동화하세요")

if __name__ == '__main__':
    main()

