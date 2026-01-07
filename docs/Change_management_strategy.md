# PRD-SRS-Task 변경 관리 전략

> **참조 문서:** `6-1.MVP개발-Task추출통합작업계획.md` (단계 9)  
> **목적:** PRD, SRS, Task 간 변경사항 추적 및 정합성 유지  
> **작성일:** 2025-01-XX

---

## 1. 개요

본 문서는 **PRD → SRS → Task** 3단계 변경 관리 전략을 정의합니다. 각 레벨에서 발생하는 변경사항이 하위 레벨에 미치는 영향을 체계적으로 추적하고, WBS/DAG와의 정합성을 유지합니다.

### 1.1 변경 관리 원칙

- **단방향 추적성**: PRD → SRS → Task 방향으로 변경사항이 전파됨
- **정합성 유지**: 변경 시 하위 레벨의 모든 관련 문서/구조를 동기화
- **버전 관리**: 각 레벨별 버전을 명시하여 변경 이력 추적
- **영향 범위 분석**: 변경 전 반드시 영향 범위를 분석하고 승인 프로세스 진행

---

## 2. 변경 시나리오별 관리 전략

### 2.1 PRD 레벨 변경

#### 변경 유형
- 기능 추가/삭제/수정
- 비즈니스 요구사항 변경
- 사용자 여정 변경
- 우선순위 조정

#### 영향 범위
1. **SRS 레벨**
   - 관련 REQ-FUNC/REQ-NF 추가/수정/삭제
   - 시퀀스 다이어그램 업데이트
   - 엔티티/API 스펙 변경

2. **Task 레벨**
   - 관련 Task 추가/수정/삭제
   - Task 간 의존성 재정의
   - WBS/DAG 구조 업데이트

#### 처리 절차
```
1. PRD 변경 요청 접수
   ↓
2. 변경 영향 범위 분석 (SRS/Task 매핑 테이블 참조)
   ↓
3. 변경 승인 (Stakeholder Review)
   ↓
4. PRD 버전 업데이트 (vX.Y → vX.Y+1)
   ↓
5. SRS 업데이트 (관련 REQ 수정/추가)
   ↓
6. Task 업데이트 (WBS/DAG 재구성)
   ↓
7. 변경 로그 기록
```

### 2.2 SRS 레벨 변경

#### 변경 유형
- REQ-FUNC 추가/수정/삭제
- REQ-NF 추가/수정/삭제
- API 엔드포인트 변경
- 엔티티 스키마 변경
- 시퀀스 다이어그램 수정

#### 영향 범위
1. **Task 레벨**
   - `req_ids` 필드 업데이트
   - `context.apis`, `context.entities` 수정
   - `inputs`/`outputs` 재정의
   - `dependencies` 재검토

2. **WBS/DAG**
   - Task 노드 추가/삭제
   - 의존성 엣지 수정

#### 처리 절차
```
1. SRS 변경 요청 접수
   ↓
2. 관련 Task 목록 식별 (`req_ids` 매핑)
   ↓
3. 변경 승인 (Technical Review)
   ↓
4. SRS 버전 업데이트 (vX.Y → vX.Y+1)
   ↓
5. 관련 Task 파일 업데이트
   ↓
6. WBS/DAG 재생성
   ↓
7. 변경 로그 기록
```

### 2.3 Task 레벨 변경

#### 변경 유형
- Task 세부사항 수정 (`steps_hint`, `inputs`, `outputs`)
- Task 메타데이터 수정 (`priority`, `estimated_effort`)
- Task 의존성 추가/삭제
- Task 병렬화 가능 여부 변경

#### 영향 범위
1. **WBS/DAG**
   - Task 노드 속성 업데이트
   - 의존성 그래프 재구성
   - 크리티컬 패스 재계산

2. **스프린트 계획**
   - 작업 순서 조정
   - 병렬 작업 영역 재정의

#### 처리 절차
```
1. Task 변경 요청 접수
   ↓
2. 의존성 Task 영향 분석
   ↓
3. 변경 승인 (Team Lead Review)
   ↓
4. Task 파일 업데이트
   ↓
5. DAG 재생성 및 검증
   ↓
6. 변경 로그 기록
```

---

## 3. 변경 로그 형식

### 3.1 변경 로그 항목

각 변경사항은 다음 형식으로 기록합니다:

```yaml
change_id: CHG-YYYYMMDD-XXX
date: YYYY-MM-DD
level: PRD | SRS | Task
change_type: ADD | MODIFY | DELETE
affected_ids:
  - PRD: [섹션/항목 ID]
  - SRS: [REQ-FUNC-XXX, REQ-NF-XXX]
  - Task: [TASK-ID-XXX]
reason: [변경 사유]
impact_analysis: [영향 범위 설명]
approved_by: [승인자]
status: PENDING | APPROVED | REJECTED | COMPLETED
```

### 3.2 변경 로그 예시

```yaml
change_id: CHG-20250115-001
date: 2025-01-15
level: SRS
change_type: MODIFY
affected_ids:
  - SRS: REQ-FUNC-001
  - Task: REQ-FUNC-001-BE-001, REQ-FUNC-001-FE-001
reason: API 엔드포인트 시그니처 변경 (인증 방식 추가)
impact_analysis: 
  - Backend Task: 인증 로직 추가 필요
  - Frontend Task: API 호출 시 헤더 추가 필요
  - DAG: 의존성 변경 없음
approved_by: Tech Lead
status: COMPLETED
```

---

## 4. 버전 관리 전략

### 4.1 문서 버전 체계

- **PRD**: `PRD-v{Major}.{Minor}.md`
  - Major: 큰 기능 변경/아키텍처 변경
  - Minor: 세부 요구사항 변경

- **SRS**: `SRS-v{Major}.{Minor}.md`
  - Major: REQ 대규모 추가/삭제
  - Minor: REQ 수정/세부사항 변경

- **Task**: `Task-v{Major}.{Minor}.md` 또는 개별 Task 파일의 `version` 필드
  - Major: Task 구조 변경
  - Minor: Task 세부사항 변경

### 4.2 버전 동기화 규칙

- PRD 변경 시: SRS 버전도 함께 업데이트 (최소 Minor 버전)
- SRS 변경 시: 관련 Task의 `req_ids` 버전 참조 업데이트
- Task 변경 시: DAG/WBS 버전 업데이트

---

## 5. 도구 연동 및 자동화

### 5.1 GitHub Issues 연동

- 변경 요청은 GitHub Issue로 관리
- Issue 템플릿:
  - `change-request-prd.md`
  - `change-request-srs.md`
  - `change-request-task.md`

### 5.2 자동화 스크립트

#### 변경 영향 범위 분석 스크립트

```bash
# SRS 변경 시 관련 Task 찾기
./scripts/analyze_srs_change.sh REQ-FUNC-001

# Task 변경 시 의존성 Task 찾기
./scripts/analyze_task_dependencies.sh TASK-ID-XXX

# DAG 재생성
./scripts/regenerate_dag.sh
```

### 5.3 검증 체크리스트

변경 완료 후 다음 항목을 검증:

- [ ] 변경 로그 기록 완료
- [ ] 관련 문서 버전 업데이트 완료
- [ ] WBS/DAG 재생성 및 검증 완료
- [ ] GitHub Issues 상태 업데이트 완료
- [ ] 팀 공지 완료

---

## 6. 운영 플로우

### 6.1 일상적인 변경 프로세스

```
[변경 요청] → [영향 분석] → [승인] → [구현] → [검증] → [동기화] → [완료]
```

### 6.2 긴급 변경 프로세스

긴급 버그 수정 등 즉시 반영이 필요한 경우:

1. 변경 요청 접수
2. 최소 영향 범위만 변경 (Hotfix)
3. 변경 로그 기록 (사후)
4. 정식 변경 프로세스로 후속 처리

---

## 7. 참고 자료

- [6-1.MVP개발-Task추출통합작업계획.md](../개발기반%20자료/Digital-minimalist-project_Self-development/6-1.MVP개발-Task추출통합작업계획.md) - 단계 9
- [GITHUB_ISSUE_CREATION_PROCESS.md](./GITHUB_ISSUE_CREATION_PROCESS.md) - GitHub Issues 연동 절차
- [Integrated_WBS_dag.md](./Integrated_WBS_dag.md) - WBS/DAG 구조 참조

---

## 부록: 변경 관리 체크리스트

### PRD 변경 시
- [ ] PRD 버전 업데이트
- [ ] 영향받는 SRS 섹션 식별
- [ ] SRS 업데이트 계획 수립
- [ ] 관련 Task 영향 범위 분석
- [ ] 변경 로그 기록

### SRS 변경 시
- [ ] SRS 버전 업데이트
- [ ] 관련 REQ-FUNC/REQ-NF 목록 정리
- [ ] 관련 Task 파일 식별 (`req_ids` 매핑)
- [ ] Task 업데이트 계획 수립
- [ ] DAG 재생성 필요 여부 확인
- [ ] 변경 로그 기록

### Task 변경 시
- [ ] Task 파일 버전 업데이트
- [ ] 의존성 Task 영향 분석
- [ ] DAG 재생성 및 검증
- [ ] 스프린트 계획 조정
- [ ] 변경 로그 기록

