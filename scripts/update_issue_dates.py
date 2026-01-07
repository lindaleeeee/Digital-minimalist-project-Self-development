#!/usr/bin/env python3
"""
GitHub Issues의 날짜 필드 업데이트 스크립트
생성된 Issues에 시작일자와 종료일자를 설정합니다.
"""

import json
import subprocess
import re
from typing import Optional, Tuple

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

def get_issues_with_label(owner: str, repo: str, label: str) -> list:
    """특정 라벨이 있는 Issues를 가져옵니다."""
    try:
        result = subprocess.run(
            ['gh', 'issue', 'list', '--repo', f'{owner}/{repo}',
             '--label', label, '--state', 'all', '--limit', '100',
             '--json', 'number,title,body,url'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        if result.stdout:
            return json.loads(result.stdout)
    except Exception as e:
        print(f"⚠️  Issues 조회 실패: {e}")
    return []

def update_issue_body(owner: str, repo: str, issue_number: int, 
                     start_date: str, end_date: str) -> bool:
    """Issue 본문에 날짜 정보를 추가/업데이트합니다."""
    try:
        # 현재 Issue 본문 가져오기
        result = subprocess.run(
            ['gh', 'issue', 'view', str(issue_number), '--repo', f'{owner}/{repo}',
             '--json', 'body'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        
        current_body = json.loads(result.stdout)['body'] or ''
        
        # 날짜 정보 섹션 찾기 또는 추가
        date_section_pattern = r'## 📅 일정 정보\n(.*?)\n\n'
        date_info = f"""## 📅 일정 정보
- **시작일**: {start_date}
- **마감일**: {end_date}

"""
        
        if re.search(date_section_pattern, current_body, re.DOTALL):
            # 기존 날짜 섹션 업데이트
            new_body = re.sub(
                date_section_pattern,
                date_info,
                current_body,
                flags=re.DOTALL
            )
        else:
            # 날짜 섹션이 없으면 본문 앞에 추가
            if '## 📋 메타데이터' in current_body:
                new_body = current_body.replace('## 📋 메타데이터', date_info + '## 📋 메타데이터')
            elif '## 📝 상세 내용' in current_body:
                new_body = current_body.replace('## 📝 상세 내용', date_info + '## 📝 상세 내용')
            else:
                new_body = date_info + current_body
        
        # Issue 업데이트
        subprocess.run(
            ['gh', 'issue', 'edit', str(issue_number), '--repo', f'{owner}/{repo}',
             '--body', new_body],
            capture_output=True,
            encoding='utf-8',
            errors='ignore',
            check=True
        )
        return True
    except Exception as e:
        print(f"   ❌ 업데이트 실패: {e}")
        return False

def main():
    """메인 함수"""
    print("📅 GitHub Issues 날짜 업데이트 스크립트")
    print("=" * 60)
    
    repo_info = get_github_repo()
    if not repo_info:
        print("❌ Git 리포지토리를 찾을 수 없습니다.")
        return
    
    owner, repo = repo_info
    print(f"📦 리포지토리: {owner}/{repo}")
    
    # 'Issue Automation' 라벨이 있는 Issues 가져오기
    print("\n🔍 'Issue Automation' 라벨이 있는 Issues 조회 중...")
    issues = get_issues_with_label(owner, repo, 'Issue Automation')
    
    if not issues:
        print("❌ 해당 라벨이 있는 Issues를 찾을 수 없습니다.")
        return
    
    print(f"📋 총 {len(issues)}개의 Issues 발견")
    
    # 날짜 설정
    start_date = "2025-12-24"
    end_date = "2025-12-31"
    
    print(f"\n📅 날짜 설정:")
    print(f"   - 시작일: {start_date}")
    print(f"   - 종료일: {end_date}")
    
    # 각 Issue 업데이트
    print(f"\n🔄 Issues 업데이트 중...")
    print("=" * 60)
    
    updated_count = 0
    failed_count = 0
    
    for issue in issues:
        print(f"\n📝 Issue #{issue['number']}: {issue['title']}")
        
        if update_issue_body(owner, repo, issue['number'], start_date, end_date):
            print(f"   ✅ 날짜 정보 업데이트 완료")
            updated_count += 1
        else:
            failed_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ 완료!")
    print(f"   - 업데이트 성공: {updated_count}개")
    print(f"   - 실패: {failed_count}개")
    print(f"\n🔗 GitHub에서 확인: https://github.com/{owner}/{repo}/issues")

if __name__ == '__main__':
    main()

