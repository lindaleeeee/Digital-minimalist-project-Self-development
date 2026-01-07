# GitHub Issue 생성 절차 (마일스톤 제외)

로컬 `Tasks/` 디렉토리의 마크다운 문서를 기반으로 GitHub 원격 저장소에 이슈를 발행하는 절차입니다.

## 📋 사전 준비

### 1. GitHub CLI 설치 및 인증 확인

```bash
# gh CLI 설치 확인
gh --version

# GitHub 인증 상태 확인
gh auth status

# 인증이 안 되어 있다면
gh auth login
```

### 2. 저장소 연결 확인

```bash
# 현재 저장소 확인
git remote -v

# GitHub 저장소가 연결되어 있지 않다면
gh repo set-default <owner>/<repo-name>
```

## 🔄 이슈 생성 절차

### Step 1: Task 파일 구조 파악

각 Task 마크다운 파일은 다음 구조를 가집니다:

```yaml
---
title: "Task 001: 프로젝트 초기화 및 기본 환경 설정"
epic: "EPIC-0 (INIT_CONFIG)"
source: "6. Task추출결과.md"
start-date: 2025-12-24
target-date: 2025-12-31
due-date: 2025-12-31
priority: "High"
status: "To Do"
---

# Task 001: ...
## 🎯 목표
...
## ✅ 세부 할 일 (Sub-Tasks)
...
```

### Step 2: 마크다운 파일에서 메타데이터 추출

각 Task 파일의 frontmatter에서 다음 정보를 추출합니다:
- `title`: 이슈 제목
- `epic`: EPIC 정보 (라벨 또는 본문에 포함)
- `priority`: 우선순위 (라벨로 사용)
- `start-date`, `target-date`, `due-date`: 날짜 정보
- `status`: 상태 정보

### Step 3: 이슈 본문 구성

이슈 본문은 다음 형식으로 구성합니다:

```markdown
> **관련 EPIC:** [EPIC 정보]
> **출처:** [source 필드]
> **시작일자:** [start-date]
> **목표일자:** [target-date]
> **마감일자:** [due-date]

## 🎯 목표
[마크다운 파일의 목표 섹션 내용]

## ✅ 세부 할 일 (Sub-Tasks)
[마크다운 파일의 세부 할 일 섹션 내용]
```

### Step 4: gh CLI로 이슈 생성

#### 기본 명령어 형식

```bash
gh issue create \
  --title "[제목]" \
  --body "[본문]" \
  --label "[라벨1],[라벨2]" \
  --assignee "[사용자명]"
```

#### 실제 사용 예시

```bash
# Priority_1 디렉토리의 모든 파일 처리
cd Tasks/Priority_1

# 단일 파일 처리 예시
gh issue create \
  --title "Task 001: 프로젝트 초기화 및 기본 환경 설정 (Init & Config)" \
  --body "$(cat 001_Init_Config.md | sed '1,10d')" \
  --label "priority:high,epic:EPIC-0,status:todo"
```

## 🛠️ 자동화 스크립트 예시

### Bash 스크립트 (create_issues.sh)

```bash
#!/bin/bash

# 설정
REPO_OWNER="your-username"
REPO_NAME="your-repo"
TASKS_DIR="Tasks"

# Priority별 라벨 매핑
declare -A PRIORITY_LABELS=(
  ["Priority_1"]="priority:high"
  ["Priority_2"]="priority:medium"
  ["Priority_3"]="priority:low"
)

# 함수: 마크다운 파일에서 frontmatter 추출
extract_frontmatter() {
  local file=$1
  local key=$2
  awk -v key="$key" '
    /^---$/ { in_frontmatter=!in_frontmatter; next }
    in_frontmatter && $1 == key":" {
      gsub(/^[^:]+:[[:space:]]*"/, "", $0)
      gsub(/"$/, "", $0)
      print $0
    }
  ' "$file"
}

# 함수: 마크다운 본문 추출 (frontmatter 제외)
extract_body() {
  local file=$1
  awk '
    /^---$/ { frontmatter_count++; next }
    frontmatter_count >= 2 { print }
  ' "$file"
}

# 함수: 이슈 생성
create_issue() {
  local file=$1
  local priority_dir=$2
  
  # Frontmatter에서 정보 추출
  local title=$(extract_frontmatter "$file" "title")
  local epic=$(extract_frontmatter "$file" "epic")
  local source=$(extract_frontmatter "$file" "source")
  local start_date=$(extract_frontmatter "$file" "start-date")
  local target_date=$(extract_frontmatter "$file" "target-date")
  local due_date=$(extract_frontmatter "$file" "due-date")
  local priority=$(extract_frontmatter "$file" "priority")
  local status=$(extract_frontmatter "$file" "status")
  
  # 본문 추출
  local body=$(extract_body "$file")
  
  # 이슈 본문에 메타데이터 추가
  local full_body="> **관련 EPIC:** ${epic}
> **출처:** ${source}
> **시작일자:** ${start_date}
> **목표일자:** ${target_date}
> **마감일자:** ${due_date}

${body}"
  
  # 라벨 구성
  local labels="${PRIORITY_LABELS[$priority_dir]}"
  
  # EPIC 라벨 추가
  if [ -n "$epic" ]; then
    local epic_label=$(echo "$epic" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
    labels="${labels},epic:${epic_label}"
  fi
  
  # 상태 라벨 추가
  if [ -n "$status" ]; then
    local status_label=$(echo "$status" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
    labels="${labels},status:${status_label}"
  fi
  
  # 이슈 생성
  echo "Creating issue: $title"
  gh issue create \
    --title "$title" \
    --body "$full_body" \
    --label "$labels" \
    --repo "${REPO_OWNER}/${REPO_NAME}"
  
  echo "✅ Created: $title"
  echo ""
}

# 메인 실행
main() {
  # Priority 디렉토리 순회
  for priority_dir in Priority_1 Priority_2 Priority_3; do
    if [ -d "${TASKS_DIR}/${priority_dir}" ]; then
      echo "Processing ${priority_dir}..."
      
      # 각 마크다운 파일 처리
      for file in "${TASKS_DIR}/${priority_dir}"/*.md; do
        if [ -f "$file" ]; then
          create_issue "$file" "$priority_dir"
          sleep 1  # API rate limit 방지
        fi
      done
    fi
  done
}

# 실행
main
```

### Python 스크립트 (create_issues.py)

```python
#!/usr/bin/env python3
"""
GitHub Issue 생성 스크립트
로컬 Tasks 마크다운 파일을 기반으로 GitHub 이슈를 생성합니다.
"""

import os
import re
import subprocess
import yaml
from pathlib import Path
from typing import Dict, Optional

# 설정
TASKS_DIR = Path("Tasks")
PRIORITY_LABELS = {
    "Priority_1": "priority:high",
    "Priority_2": "priority:medium",
    "Priority_3": "priority:low",
}


def extract_frontmatter(file_path: Path) -> Dict[str, str]:
    """마크다운 파일에서 frontmatter 추출"""
    content = file_path.read_text(encoding="utf-8")
    
    # Frontmatter 패턴 매칭
    frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not frontmatter_match:
        return {}
    
    frontmatter_text = frontmatter_match.group(1)
    try:
        return yaml.safe_load(frontmatter_text) or {}
    except yaml.YAMLError:
        return {}


def extract_body(file_path: Path) -> str:
    """마크다운 파일에서 본문 추출 (frontmatter 제외)"""
    content = file_path.read_text(encoding="utf-8")
    
    # Frontmatter 제거
    body_match = re.search(r'^---\n.*?\n---\n\n(.*)', content, re.DOTALL)
    if body_match:
        return body_match.group(1).strip()
    return content.strip()


def build_issue_body(frontmatter: Dict[str, str], body: str) -> str:
    """이슈 본문 구성"""
    epic = frontmatter.get("epic", "")
    source = frontmatter.get("source", "")
    start_date = frontmatter.get("start-date", "")
    target_date = frontmatter.get("target-date", "")
    due_date = frontmatter.get("due-date", "")
    
    metadata = f"""> **관련 EPIC:** {epic}
> **출처:** {source}
> **시작일자:** {start_date}
> **목표일자:** {target_date}
> **마감일자:** {due_date}

"""
    
    return metadata + body


def build_labels(frontmatter: Dict[str, str], priority_dir: str) -> str:
    """라벨 문자열 구성"""
    labels = [PRIORITY_LABELS.get(priority_dir, "")]
    
    # EPIC 라벨 추가
    epic = frontmatter.get("epic", "")
    if epic:
        epic_label = epic.lower().replace(" ", "-").replace("(", "").replace(")", "")
        labels.append(f"epic:{epic_label}")
    
    # 상태 라벨 추가
    status = frontmatter.get("status", "")
    if status:
        status_label = status.lower().replace(" ", "-")
        labels.append(f"status:{status_label}")
    
    return ",".join(filter(None, labels))


def create_issue(file_path: Path, priority_dir: str) -> bool:
    """GitHub 이슈 생성"""
    frontmatter = extract_frontmatter(file_path)
    body = extract_body(file_path)
    
    title = frontmatter.get("title", file_path.stem)
    issue_body = build_issue_body(frontmatter, body)
    labels = build_labels(frontmatter, priority_dir)
    
    # gh CLI 명령어 실행
    cmd = [
        "gh", "issue", "create",
        "--title", title,
        "--body", issue_body,
        "--label", labels,
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"✅ Created: {title}")
        print(f"   URL: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to create issue: {title}")
        print(f"   Error: {e.stderr}")
        return False


def main():
    """메인 실행 함수"""
    if not TASKS_DIR.exists():
        print(f"❌ Tasks directory not found: {TASKS_DIR}")
        return
    
    # Priority 디렉토리 순회
    for priority_dir in ["Priority_1", "Priority_2", "Priority_3"]:
        priority_path = TASKS_DIR / priority_dir
        if not priority_path.exists():
            continue
        
        print(f"\n📁 Processing {priority_dir}...")
        
        # 마크다운 파일 처리
        for md_file in sorted(priority_path.glob("*.md")):
            create_issue(md_file, priority_dir)
            # API rate limit 방지
            import time
            time.sleep(1)


if __name__ == "__main__":
    main()
```

## 📝 수동 생성 절차 (참고용)

스크립트를 사용하지 않고 수동으로 생성하는 경우:

### 1. 파일 내용 확인

```bash
cat Tasks/Priority_1/001_Init_Config.md
```

### 2. Frontmatter에서 정보 추출

- 제목: `title` 필드
- EPIC: `epic` 필드
- 우선순위: `priority` 필드
- 날짜 정보: `start-date`, `target-date`, `due-date`

### 3. 본문 구성

```bash
# 본문만 추출 (frontmatter 제외)
tail -n +11 Tasks/Priority_1/001_Init_Config.md > body.txt
```

### 4. 이슈 생성

```bash
gh issue create \
  --title "Task 001: 프로젝트 초기화 및 기본 환경 설정 (Init & Config)" \
  --body-file body.txt \
  --label "priority:high,epic:EPIC-0,status:todo"
```

## ⚠️ 주의사항

1. **API Rate Limit**: GitHub API는 시간당 제한이 있으므로, 여러 이슈를 생성할 때는 적절한 딜레이를 추가하세요.

2. **라벨 사전 생성**: 사용할 라벨들이 GitHub 저장소에 미리 생성되어 있어야 합니다:
   ```bash
   # 라벨 생성 예시
   gh label create "priority:high" --description "High priority" --color "d73a4a"
   gh label create "priority:medium" --description "Medium priority" --color "fbca04"
   gh label create "priority:low" --description "Low priority" --color "0e8a16"
   gh label create "status:todo" --description "To Do status" --color "ededed"
   ```

3. **중복 방지**: 이미 생성된 이슈를 다시 생성하지 않도록 확인하세요:
   ```bash
   # 기존 이슈 확인
   gh issue list --label "priority:high" --limit 100
   ```

4. **에러 처리**: 스크립트 실행 시 에러가 발생하면 로그를 확인하고 수동으로 처리하세요.

## 🔍 검증 및 확인

### 생성된 이슈 확인

```bash
# 모든 이슈 목록 확인
gh issue list

# 특정 라벨로 필터링
gh issue list --label "priority:high"

# 특정 EPIC으로 필터링
gh issue list --label "epic:EPIC-0"
```

### 이슈 상세 확인

```bash
# 특정 이슈 번호로 상세 확인
gh issue view <issue-number>
```

## 📚 참고 자료

- [GitHub CLI 공식 문서](https://cli.github.com/manual/gh_issue_create)
- [GitHub API Rate Limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)

