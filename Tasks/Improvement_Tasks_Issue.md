# 🛠️ [개선 작업] 코드 구조 및 품질 향상 태스크 (Focus Habit Launcher)

`docs/01-component-structure-analysis.md`와 `docs/02-code-quality-assessment.md`의 분석 결과를 바탕으로, 현재 프로토타입의 품질, 성능 및 유지보수성을 향상시키기 위한 태스크들을 GitHub Issue 형식으로 제안합니다.

---

## 🚀 Issue 1: 로직 분리 및 성능 최적화 (Priority: High)
**목표**: "God Component"(`page.tsx`)의 복잡도를 낮추고 렌더링 성능을 개선합니다.

### 배경 (Context)
현재 `page.tsx`는 UI 렌더링뿐만 아니라 데이터 저장(`localStorage`), 알람 스케줄링, 상태 관리를 모두 담당하고 있어 유지보수가 어렵습니다. 또한 `HabitLogList` 등 리스트 컴포넌트의 불필요한 리렌더링이 발생할 수 있습니다.

### 할 일 (Tasks)
- [ ] **Custom Hook으로 비즈니스 로직 분리 (Refactoring)**
    - [ ] `useAlarmSystem` Hook 생성: 알람 추가/삭제, `setTimeout` 스케줄링 로직 이동
    - [ ] `useHabitData` Hook 생성: 습관 및 로그 데이터 CRUD, `localStorage` 동기화 로직 이동
- [ ] **렌더링 성능 최적화**
    - [ ] `HabitLogList` 컴포넌트에 `React.memo` 적용
    - [ ] `addAlarm`, `handleLogHabit` 핸들러에 `useCallback` 적용하여 불필요한 재생성 방지
- [ ] **에러 핸들링 강화**
    - [ ] AI 분석 실패 시(`logHabitAction`) 사용자에게 "재시도" 버튼 제공 UI 추가
    - [ ] `try-catch` 블록 내 에러 발생 시 명확한 `toast` 피드백 추가

---

## 🏗️ Issue 2: 상태 관리 구조 개선 및 컴포넌트 분리 (Priority: Medium)
**목표**: Prop Drilling을 제거하고 컴포넌트의 단일 책임 원칙(SRP)을 강화합니다.

### 배경 (Context)
`Home` 컴포넌트에서 `HabitManager` 등 하위 컴포넌트로 `habits`, `setHabits` 등의 상태와 변경 함수가 여러 단계 전달(Prop Drilling)되고 있어 구조 변경 시 유연성이 떨어집니다. `NoteModal`은 차트 렌더링 로직까지 포함하여 너무 비대해졌습니다.

### 할 일 (Tasks)
- [ ] **전역 상태 관리 도입**
    - [ ] Zustand 또는 Context API 설정
    - [ ] `habits`, `alarms`, `habitLogs` 상태를 Store로 이동하고 `Home`의 Props 전달 코드 제거
- [ ] **컴포넌트 분리**
    - [ ] `NoteModal` 내부의 차트 로직을 `HabitStatsChart.tsx`로 분리
    - [ ] `page.tsx`의 레이아웃 구조를 `DashboardLayout.tsx`로 분리하여 가독성 향상
- [ ] **안정성 확보**
    - [ ] `ErrorBoundary` 컴포넌트 구현 및 메인 레이아웃 감싸기 (런타임 에러 방어)

---

## 🌐 Issue 3: 데이터베이스 마이그레이션 및 확장성 확보 (Priority: Medium)
**목표**: 로컬 스토리지의 한계를 극복하고 실제 서비스 가능한 수준의 데이터 영속성을 확보합니다.

### 배경 (Context)
현재 데이터가 브라우저의 `localStorage`에만 저장되어 기기 간 동기화가 불가능하며 데이터 유실 위험이 있습니다. 또한 테스트 코드가 부재하여 리팩토링 시 사이드 이펙트를 감지하기 어렵습니다.

### 할 일 (Tasks)
- [ ] **DB 마이그레이션**
    - [ ] Firebase Firestore 또는 Supabase 프로젝트 설정
    - [ ] `useHabitData` Hook 내부 로직을 `localStorage`에서 DB API 호출로 변경
- [ ] **테스트 코드 작성**
    - [ ] `logHabitAction` (AI 키워드 추출)에 대한 Unit Test 작성
    - [ ] `AlarmSetter` 등 핵심 UI 컴포넌트 동작 테스트 (Jest/React Testing Library)
- [ ] **접근성(A11y) 점검**
    - [ ] 모든 대화형 요소(`Button`, `Input`)에 `aria-label` 속성 검토 및 추가
    - [ ] 키보드 내비게이션(Tab 키)으로 모든 기능을 사용할 수 있는지 점검
