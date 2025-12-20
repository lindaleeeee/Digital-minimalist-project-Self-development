# Task 002: 프론트엔드 PoC UI 구현 및 성능 최적화

> **관련 EPIC:** EPIC-1 (FRONTEND_POC) + 성능 최적화
> **출처:** 6. Task추출결과.md & Improvement_Tasks_Issue.md (1단계)

## 🎯 목표
핵심 사용자 흐름(Launcher Flow)에 대한 UI 프로토타입을 구현하고, 빈번한 렌더링에 대한 성능 최적화를 적용합니다.

## ✅ 세부 할 일 (Sub-Tasks)

- [ ] **TASK-POC-001 (Launcher Yes/No UI)**
    - 알람 울림 시 표시될 YES/NO 런처 화면 컴포저블 구현 (Mock Data 사용)
    - `React.memo` (Compose `Stable` 마킹) 적용하여 불필요한 리렌더링 방지

- [ ] **TASK-POC-002 (Habit Selection UI)**
    - "무엇을 했나요?" 습관 리스트 화면 구현
    - 완료/미완료 상태에 따른 시각적 구분 (Gray-out)

- [ ] **TASK-POC-003 (Log Input UI)**
    - 텍스트 필드(`OutlinedTextField`) 및 저장 버튼 레이아웃 구현
    - 입력 필드에 `useDebounce` (Compose `LaunchedEffect` debouncing) 패턴 적용 고려

- [ ] **성능 최적화 (Hooks & Memoization)**
    - 자주 사용되는 UI 컴포넌트(`Button`, `Input`) 최적화
    - 이벤트 핸들러에 대한 메모이제이션 (`remember` / `derivedStateOf` 활용)













