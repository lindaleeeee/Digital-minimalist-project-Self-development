# GitHub Issues 생성 스크립트

이 스크립트는 `Tasks/` 폴더의 마크다운 파일을 읽어서 GitHub Issues를 자동으로 생성합니다.

## 사전 요구사항

1. **GitHub CLI 설치**
   ```bash
   # macOS
   brew install gh
   
   # Windows (Chocolatey)
   choco install gh
   
   # Linux
   # https://cli.github.com/manual/installation 참고
   ```

2. **GitHub CLI 인증**
   ```bash
   gh auth login
   ```

## 사용 방법

### 기본 사용
```bash
python scripts/create_github_issues.py
```

### 스크립트에 실행 권한 부여 (Linux/macOS)
```bash
chmod +x scripts/create_github_issues.py
./scripts/create_github_issues.py
```

## 작동 방식

1. `Tasks/` 디렉토리의 모든 `.md` 파일을 스캔
2. 각 파일의 YAML frontmatter를 파싱
3. GitHub CLI를 사용하여 Issues 생성
4. 라벨, 우선순위, EPIC 정보 자동 설정

## 필요한 Python 패키지

```bash
pip install pyyaml
```

## GitHub Projects 연동

### 방법 1: 수동 연동
1. GitHub에서 Project 생성
2. 생성된 Issues를 Project에 드래그 앤 드롭
3. 로드맵 뷰에서 날짜 설정

### 방법 2: GitHub CLI로 Project에 추가
```bash
# Project ID 확인
gh project list

# Issue를 Project에 추가
gh project item-add <PROJECT_ID> --owner <OWNER> --repo <REPO> --url <ISSUE_URL>
```

### 방법 3: GitHub Projects API 사용 (고급)
`scripts/create_github_issues_with_projects.py` 스크립트를 사용하면 Projects API를 통해 자동으로 연동할 수 있습니다.

## 문제 해결

### "GitHub CLI가 설치되어 있지 않습니다"
- GitHub CLI를 설치하고 `gh auth login`을 실행하세요.

### "Git 리포지토리를 찾을 수 없습니다"
- 현재 디렉토리가 Git 리포지토리인지 확인하세요.
- `git remote -v`로 원격 리포지토리가 설정되어 있는지 확인하세요.

### Issues는 생성되지만 Projects에 추가되지 않음
- GitHub Projects v2 API를 사용하는 고급 스크립트를 사용하거나
- 수동으로 Issues를 Project에 추가하세요.

