# 🛠️ [개선 작업] 코드 구조 및 품질 향상 태스크

`Code assessment/0-1.component_structure_analysis_reference.md`와 `Code assessment/1-1.Code_quality_reference.md`의 분석 결과를 바탕으로, 코드베이스 품질, 성능 및 유지보수성을 향상시키기 위한 태스크들을 제안합니다.

---

## 🔥 1단계: 즉각적인 최적화 (성능 및 Hooks)
**목표**: 성능 병목 현상 해결 및 반복 로직 제거  
**예상 소요 시간**: 1주

- [ ] **빈번하게 렌더링되는 컴포넌트에 `React.memo` 적용**
    - [ ] `QuestionForm`
    - [ ] `Input`
    - [ ] `Button`
    - **목표**: 부모 상태가 업데이트될 때 불필요한 리렌더링 방지.
    
- [ ] **`useCallback` & `useMemo` 구현**
    - [ ] `QuestionForm` 내의 이벤트 핸들러(예: `handleChange`) 감싸기.
    - [ ] `FinancialSimulation` 내의 비용이 높은 계산(예: 진행률, 손익분기점 계산) 메모이제이션.
    
- [ ] **로직을 커스텀 Hook으로 리팩토링**
    - [ ] 비동기 작업의 로딩/에러 상태 처리를 위한 `useAsyncAction` 생성.
    - [ ] 중앙 집중식 Zod 스키마 검증을 위한 `useFormValidation` 생성.
    - [ ] 텍스트 입력 자동 저장을 위한 `useDebounce` 생성.

- [ ] **매직 넘버(Magic Numbers) 제거**
    - [ ] `FINANCIAL_STEP = 4`, `AI_DELAY = 3000`과 같은 상수를 `constants.ts` 파일로 추출.

---

## ⭐ 2단계: 구조적 리팩토링 (아키텍처)
**목표**: 컴포넌트 분리 및 에러 처리 강화  
**예상 소요 시간**: 2주

- [ ] **대형 컴포넌트 분리**
    - [ ] **`FinancialSimulation` 리팩토링**:
        - `FinancialInputForm.tsx`로 분리
        - `MetricsSummary.tsx`로 분리
        - `BEPChart.tsx`로 분리
    - [ ] **`PMFSurvey` 리팩토링**:
        - `SurveyQuestionCard.tsx`로 분리
        - `PMFResultChart.tsx`로 분리

- [ ] **Error Boundary 구현**
    - [ ] 전역 `ErrorBoundary` 컴포넌트 생성.
    - [ ] 메인 `Router` 또는 핵심 섹션을 `<ErrorBoundary>`로 감싸기.

- [ ] **Zustand 상태 선택자(Selector) 최적화**
    - [ ] 필요한 슬라이스만 선택하도록 스토어 사용 방식 리팩토링 (예: `const steps = useWizardStore(state => state.steps)`).

---

## 📊 3단계: 안정성 및 확장성 (테스트 & 로딩)
**목표**: 프로덕션 배포 준비  
**예상 소요 시간**: 1개월

- [ ] **단위 테스트(Unit Tests) 구현**
    - [ ] Jest & React Testing Library 설정.
    - [ ] 핵심 UI 컴포넌트(`Button`, `Input`)에 대한 테스트 작성.
    - [ ] 유틸리티 함수(재무 계산 등)에 대한 테스트 작성.

- [ ] **코드 스플리팅 (Lazy Loading)**
    - [ ] 라우트 기반 분할을 위해 `React.lazy` 및 `Suspense` 구현.
    - [ ] 무거운 라이브러리(예: `Recharts`, `ReactMarkdown`) 지연 로딩 적용.

- [ ] **접근성(A11y) 개선**
    - [ ] 텍스트가 없는 버튼에 `aria-label` 추가.
    - [ ] Wizard 단계에서 키보드 내비게이션 동작 확인 및 보완.
