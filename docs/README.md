# 프로젝트 문서 (Project Documentation)

이 디렉토리는 **Digital Minimalist Project**의 아키텍처, 코드 품질, 개발 가이드라인을 포함합니다. 개발 작업 전에 해당 문서들을 참고하여 프로젝트의 구조와 규칙을 숙지하시기 바랍니다.

## 📚 문서 목록

### 1. [01-component-structure-analysis.md](01-component-structure-analysis.md)
*   **내용**: 컴포넌트 트리, 계층 구조, 데이터 흐름 분석
*   **활용**: 새로운 기능 추가 시 기존 구조 파악, 컴포넌트 재사용성 확인

### 2. [02-code-quality-assessment.md](02-code-quality-assessment.md)
*   **내용**: 현재 코드의 품질 평가, 주요 강점 및 개선 필요 영역(Refactoring 포인트)
*   **활용**: 기술 부채 파악, 성능 최적화 및 리팩토링 계획 수립

### 3. [03-code-documentation-guide.md](03-code-documentation-guide.md)
*   **내용**: JSDoc 주석 표준, 컴포넌트 및 함수 문서화 규칙
*   **활용**: 코드 리뷰 기준, 신규 코드 작성 시 주석 템플릿 참조

### 4. [04-function-call-hierarchy.md](04-function-call-hierarchy.md)
*   **내용**: 주요 함수 호출 흐름, 이벤트 시퀀스(Mermaid), 파일별 핵심 로직 매핑
*   **활용**: 버그 트러블슈팅, 로직 흐름 추적, 사이드 이펙트 분석

## 💡 활용 팁
1.  **개발 시**: 작업하려는 파일 상단의 JSDoc을 먼저 확인하세요.
2.  **디버깅 시**: `04-function-call-hierarchy.md`를 참고하여 데이터 흐름을 추적하세요.
3.  **AI 협업 시**: 이 `docs/` 폴더의 내용을 AI에게 컨텍스트로 제공하면 더 정확한 도움을 받을 수 있습니다.

