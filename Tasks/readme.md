# 📋 코드 품질 개선 작업 이슈 목록

이 문서는 `docs/01-component-structure-analysis.md`와 `docs/02-code-quality-assessment.md`의 분석 결과를 바탕으로 작성된 개선 작업 목록입니다.

각 이슈는 GitHub Issue 형식으로 작성되었으며, 우선순위와 라벨 정보가 포함되어 있습니다.

---

## 🔥 Priority 1: 즉시 적용 가능한 개선사항

### [#001] Custom Hook으로 비즈니스 로직 분리

**라벨**: `priority-1`, `type:refactoring`, `epic:code-quality`

**배경 (Context)**
현재 `app/page.tsx`가 UI 렌더링, 데이터 저장(`localStorage`), 알람 스케줄링, 상태 관리를 모두 담당하는 "God Component" 패턴으로 인해 유지보수성이 떨어집니다. Single Responsibility Principle을 위반하고 있어 코드 가독성과 테스트 가능성이 낮습니다.

**목표 (Goal)**
- `page.tsx`의 코드 라인 수를 40% 이상 감소
- 비즈니스 로직을 재사용 가능한 Custom Hook으로 분리
- 각 Hook의 단일 책임 명확화

**할 일 (Tasks)**
- [ ] `hooks/useAlarmSystem.ts` 생성
  - [ ] 알람 상태 관리 (`useState<Alarm[]>`)
  - [ ] 알람 추가 로직 (`addAlarm`)
  - [ ] 알람 삭제 로직 (`deleteAlarm`)
  - [ ] 알람 스케줄링 로직 (`setTimeout` 관리)
  - [ ] `localStorage` 동기화 (`useEffect`)
- [ ] `hooks/useHabitData.ts` 생성
  - [ ] 습관 상태 관리 (`useState<Habit[]>`)
  - [ ] 습관 로그 상태 관리 (`useState<HabitLog[]>`)
  - [ ] 습관 CRUD 로직 (생성, 삭제, 업데이트)
  - [ ] 로그 추가 로직 (`addLog`)
  - [ ] `localStorage` 동기화 로직 (`useEffect`)
- [ ] `app/page.tsx` 리팩토링
  - [ ] Custom Hook으로 로직 이동
  - [ ] Props 전달 구조 단순화
  - [ ] 불필요한 `useEffect` 제거

**예상 효과**
- 코드 가독성 향상
- 단위 테스트 작성 용이성 증가
- 컴포넌트 재사용성 향상

**참고 문서**
- `docs/01-component-structure-analysis.md` - 개선 가능성 섹션
- `docs/02-code-quality-assessment.md` - Recommendations for Production 섹션

---

### [#002] React.memo 및 useCallback을 활용한 성능 최적화

**라벨**: `priority-1`, `type:refactoring`, `epic:performance`

**배경 (Context)**
`HabitLogList`와 같은 리스트 컴포넌트가 부모 컴포넌트(`page.tsx`)의 상태 변경 시 불필요하게 리렌더링됩니다. 또한 핸들러 함수들이 매 렌더링마다 재생성되어 하위 컴포넌트에 전달될 때 불필요한 리렌더링을 유발할 수 있습니다.

**목표 (Goal)**
- 리스트 컴포넌트의 불필요한 리렌더링 방지
- 핸들러 함수의 메모이제이션으로 성능 향상
- 로그 데이터가 많아질 때 입력 지연 방지

**할 일 (Tasks)**
- [ ] `components/habit-log-list.tsx` 최적화
  - [ ] `React.memo` 적용
  - [ ] Props 타입 정의 (`HabitLogListProps`)
  - [ ] 비교 함수(`areEqual`) 구현 (선택사항)
- [ ] `components/alarm-setter.tsx` 최적화
  - [ ] `React.memo` 적용
  - [ ] 핸들러 함수 `useCallback`으로 메모이제이션
- [ ] `components/habit-manager.tsx` 최적화
  - [ ] `React.memo` 적용
  - [ ] 핸들러 함수 `useCallback`으로 메모이제이션
- [ ] `app/page.tsx` 핸들러 최적화
  - [ ] `handleLogHabit` 함수에 `useCallback` 적용
  - [ ] `addAlarm`, `deleteAlarm` 함수에 `useCallback` 적용

**예상 효과**
- 부모 컴포넌트 상태 변경 시 리스트 컴포넌트 불필요한 리렌더링 방지
- 입력 지연 감소 (특히 로그 데이터가 많을 때)
- 렌더링 성능 향상

**참고 문서**
- `docs/01-component-structure-analysis.md` - 성능 최적화 섹션

---

### [#003] 에러 핸들링 강화 및 사용자 피드백 개선

**라벨**: `priority-1`, `type:feature`, `epic:reliability`

**배경 (Context)**
현재 AI 분석 실패(`logHabitAction`) 시 사용자에게 명확한 피드백이 부족하며, 네트워크 오류나 서비스 장애 시 재시도 메커니즘이 없습니다. `console.error`만 사용하여 사용자 경험이 저하됩니다.

**목표 (Goal)**
- 모든 에러 상황에 대한 사용자 친화적 피드백 제공
- AI 호출 실패 시 재시도 메커니즘 구현
- 네트워크 오류에 대한 복원력 강화

**할 일 (Tasks)**
- [ ] `app/actions.ts` 에러 핸들링 강화
  - [ ] `logHabitAction`에 `try-catch` 블록 추가
  - [ ] 에러 타입별 분기 처리 (네트워크 오류, AI 서비스 오류 등)
  - [ ] 실패한 요청을 로컬 큐에 저장하는 로직 추가 (선택사항)
- [ ] `components/note-modal.tsx` UI 개선
  - [ ] AI 분석 실패 시 "재시도" 버튼 표시
  - [ ] 로딩 상태 표시 개선
  - [ ] 에러 메시지를 `useToast`로 표시
- [ ] 에러 핸들링 유틸리티 생성
  - [ ] `lib/error-handler.ts` 생성
  - [ ] 에러 타입 정의 및 사용자 친화적 메시지 매핑
  - [ ] 재시도 로직 유틸리티 함수

**예상 효과**
- 사용자 경험 향상 (명확한 에러 피드백)
- 네트워크 불안정 상황에서의 복원력 향상
- 디버깅 용이성 증가

**참고 문서**
- `docs/02-code-quality-assessment.md` - Error Handling 섹션

---

### [#004] 컴포넌트 주석 및 JSDoc 문서화

**라벨**: `priority-1`, `type:refactoring`, `epic:maintainability`

**배경 (Context)**
주요 비즈니스 로직이 포함된 컴포넌트와 Hook에 대한 문서화가 부족하여 새로운 개발자가 코드를 이해하기 어렵습니다. 특히 Custom Hook과 복잡한 로직을 가진 컴포넌트에 대한 설명이 필요합니다.

**목표 (Goal)**
- 모든 주요 컴포넌트와 Hook에 JSDoc 주석 추가
- Props와 반환값에 대한 타입 문서화
- 복잡한 로직에 대한 설명 추가

**할 일 (Tasks)**
- [ ] `components/` 디렉토리 컴포넌트 문서화
  - [ ] `alarm-setter.tsx` - JSDoc 주석 추가
  - [ ] `habit-manager.tsx` - JSDoc 주석 추가
  - [ ] `habit-log-list.tsx` - JSDoc 주석 추가
  - [ ] `note-modal.tsx` - JSDoc 주석 추가
- [ ] `hooks/` 디렉토리 Hook 문서화
  - [ ] `use-toast.ts` - JSDoc 주석 추가
  - [ ] `useAlarmSystem.ts` (생성 후) - JSDoc 주석 추가
  - [ ] `useHabitData.ts` (생성 후) - JSDoc 주석 추가
- [ ] `app/actions.ts` 문서화
  - [ ] `logHabitAction` 함수에 JSDoc 주석 추가
  - [ ] 파라미터 및 반환값 설명

**예상 효과**
- 코드 가독성 향상
- 유지보수성 향상
- 새로운 개발자의 온보딩 시간 단축

**참고 문서**
- `docs/01-component-structure-analysis.md` - 컴포넌트 주석 및 문서화 섹션

---

## ⭐ Priority 2: 중기 개선 사항

### [#005] Zustand를 활용한 전역 상태 관리 도입

**라벨**: `priority-2`, `type:refactoring`, `epic:architecture`

**배경 (Context)**
현재 `page.tsx`에서 하위 컴포넌트로 `habits`, `setHabits`, `alarms`, `setAlarms` 등의 상태와 Setter 함수가 여러 단계 전달되는 Prop Drilling 문제가 있습니다. 이는 구조 변경 시 유연성을 떨어뜨리고 코드 복잡도를 증가시킵니다.

**목표 (Goal)**
- Prop Drilling 제거
- 전역 상태 관리로 컴포넌트 간 결합도 감소
- 상태 접근 및 업데이트 로직 중앙화

**할 일 (Tasks)**
- [ ] Zustand 설치 및 설정
  - [ ] `npm install zustand` 실행
  - [ ] `stores/` 디렉토리 생성
- [ ] `stores/useHabitStore.ts` 생성
  - [ ] `habits` 상태 정의
  - [ ] `habitLogs` 상태 정의
  - [ ] CRUD 액션 정의 (`addHabit`, `deleteHabit`, `addLog` 등)
  - [ ] `localStorage` 동기화 미들웨어 추가
- [ ] `stores/useAlarmStore.ts` 생성
  - [ ] `alarms` 상태 정의
  - [ ] 알람 액션 정의 (`addAlarm`, `deleteAlarm`)
  - [ ] 알람 스케줄링 로직 통합
- [ ] 컴포넌트 마이그레이션
  - [ ] `app/page.tsx`에서 Store 사용으로 변경
  - [ ] `components/habit-manager.tsx`에서 Store 직접 사용
  - [ ] `components/alarm-setter.tsx`에서 Store 직접 사용
  - [ ] Props 전달 코드 제거

**예상 효과**
- Prop Drilling 제거로 코드 간결성 향상
- 상태 관리 로직 중앙화로 유지보수성 향상
- 컴포넌트 재사용성 향상

**참고 문서**
- `docs/01-component-structure-analysis.md` - 상태 관리 최적화 섹션
- `docs/02-code-quality-assessment.md` - 상태 관리 라이브러리 도입 섹션
- `.cursor/rules/308-zustand-state-management-rules.mdc` - Zustand 패턴 가이드

---

### [#006] Error Boundary 컴포넌트 구현

**라벨**: `priority-2`, `type:feature`, `epic:reliability`

**배경 (Context)**
런타임 에러 발생 시 React 앱 전체가 중단되어 사용자 경험이 크게 저하됩니다. 특히 AI 분석이나 데이터 처리 중 예상치 못한 에러가 발생할 경우 앱이 완전히 멈출 수 있습니다.

**목표 (Goal)**
- 런타임 에러 발생 시 앱 전체 중단 방지
- 에러 발생 영역만 격리하여 나머지 기능 정상 동작 보장
- 사용자에게 친화적인 에러 UI 제공

**할 일 (Tasks)**
- [ ] `components/error-boundary.tsx` 생성
  - [ ] `componentDidCatch` 또는 `getDerivedStateFromError` 구현
  - [ ] 에러 상태 관리
  - [ ] 에러 UI 렌더링 (Fallback UI)
  - [ ] 에러 리포팅 로직 (선택사항)
- [ ] `app/layout.tsx`에 Error Boundary 적용
  - [ ] 전체 앱을 Error Boundary로 감싸기
  - [ ] 특정 영역별 Error Boundary 적용 (선택사항)
- [ ] 에러 복구 메커니즘
  - [ ] "다시 시도" 버튼 제공
  - [ ] 에러 로그 저장 (선택사항)

**예상 효과**
- 앱 안정성 향상
- 사용자 경험 개선
- 프로덕션 환경에서의 에러 추적 용이

**참고 문서**
- `docs/01-component-structure-analysis.md` - 에러 바운더리 섹션

---

### [#007] NoteModal 컴포넌트 분리 및 차트 로직 추출

**라벨**: `priority-2`, `type:refactoring`, `epic:code-quality`

**배경 (Context)**
`components/note-modal.tsx`가 입력 폼 관리, AI 분석 트리거, 차트 렌더링까지 모든 로직을 포함하여 복잡도가 높습니다. Single Responsibility Principle을 위반하고 있어 유지보수가 어렵습니다.

**목표 (Goal)**
- `NoteModal`의 복잡도 감소
- 차트 로직을 독립적인 컴포넌트로 분리
- 각 컴포넌트의 단일 책임 명확화

**할 일 (Tasks)**
- [ ] `components/habit-stats-chart.tsx` 생성
  - [ ] Recharts를 사용한 차트 렌더링 로직 이동
  - [ ] Props 인터페이스 정의 (`HabitStatsChartProps`)
  - [ ] 데이터 포맷팅 로직 포함
- [ ] `components/note-modal.tsx` 리팩토링
  - [ ] 차트 렌더링 부분을 `HabitStatsChart` 컴포넌트로 교체
  - [ ] 입력 폼 관리 로직에 집중
  - [ ] AI 분석 트리거 로직 유지
- [ ] `components/habit-form.tsx` 생성 (선택사항)
  - [ ] 입력 폼 로직을 별도 컴포넌트로 분리
  - [ ] 재사용성 향상

**예상 효과**
- 컴포넌트 복잡도 감소
- 차트 컴포넌트 재사용성 향상
- 테스트 용이성 증가

**참고 문서**
- `docs/02-code-quality-assessment.md` - 컴포넌트 분리 섹션

---

## 🌐 Priority 3: 장기 개선 사항

### [#008] Firebase Firestore 또는 Supabase 데이터베이스 연동

**라벨**: `priority-3`, `type:feature`, `epic:scalability`

**배경 (Context)**
현재 데이터가 브라우저의 `localStorage`에만 저장되어 기기 간 동기화가 불가능하며, 데이터 유실 위험이 있습니다. 또한 사용자 인증 및 멀티 디바이스 지원이 불가능합니다.

**목표 (Goal)**
- 클라우드 데이터베이스로 마이그레이션
- 멀티 디바이스 동기화 지원
- 사용자 인증 시스템 구축 (선택사항)

**할 일 (Tasks)**
- [ ] 데이터베이스 선택 및 설정
  - [ ] Firebase Firestore 또는 Supabase 프로젝트 생성
  - [ ] 환경 변수 설정 (`.env.local`)
  - [ ] SDK 설치 및 초기화
- [ ] 데이터 모델 설계
  - [ ] Firestore/Supabase 스키마 정의
  - [ ] `Habit`, `HabitLog`, `Alarm` 타입 매핑
- [ ] API 레이어 생성
  - [ ] `lib/api/habits.ts` - 습관 데이터 CRUD
  - [ ] `lib/api/logs.ts` - 로그 데이터 CRUD
  - [ ] `lib/api/alarms.ts` - 알람 데이터 CRUD
- [ ] `useHabitData` Hook 마이그레이션
  - [ ] `localStorage` 로직을 API 호출로 변경
  - [ ] 실시간 동기화 (Firestore `onSnapshot` 또는 Supabase Realtime)
- [ ] 오프라인 지원 (선택사항)
  - [ ] 오프라인 큐 구현
  - [ ] 네트워크 복구 시 자동 동기화

**예상 효과**
- 멀티 디바이스 지원
- 데이터 영구 저장 및 백업
- 사용자 인증 및 개인화 기능 확장 가능

**참고 문서**
- `docs/01-component-structure-analysis.md` - 데이터베이스 연동 섹션
- `docs/02-code-quality-assessment.md` - 데이터베이스 연동 섹션

---

### [#009] 단위 테스트 및 통합 테스트 작성

**라벨**: `priority-3`, `type:refactoring`, `epic:reliability`

**배경 (Context)**
현재 프로젝트에 테스트 코드가 부재하여 리팩토링 시 사이드 이펙트를 감지하기 어렵습니다. 특히 AI 분석 로직(`logHabitAction`)과 핵심 비즈니스 로직에 대한 테스트가 필요합니다.

**목표 (Goal)**
- 핵심 비즈니스 로직에 대한 단위 테스트 커버리지 70% 이상
- UI 컴포넌트 동작 테스트
- CI/CD 파이프라인에 테스트 자동화 통합

**할 일 (Tasks)**
- [ ] 테스트 환경 설정
  - [ ] Jest 및 React Testing Library 설치
  - [ ] 테스트 설정 파일 구성 (`jest.config.js`)
  - [ ] 테스트 유틸리티 함수 생성
- [ ] 서버 액션 테스트
  - [ ] `app/actions.ts` - `logHabitAction` 단위 테스트
  - [ ] AI API 모킹
  - [ ] 에러 케이스 테스트
- [ ] Custom Hook 테스트
  - [ ] `hooks/useAlarmSystem.ts` 테스트
  - [ ] `hooks/useHabitData.ts` 테스트
  - [ ] `localStorage` 모킹
- [ ] 컴포넌트 테스트
  - [ ] `components/alarm-setter.tsx` 동작 테스트
  - [ ] `components/habit-manager.tsx` 동작 테스트
  - [ ] 사용자 인터랙션 시뮬레이션
- [ ] 통합 테스트 (선택사항)
  - [ ] E2E 테스트 설정 (Playwright 또는 Cypress)
  - [ ] 주요 사용자 플로우 테스트

**예상 효과**
- 리팩토링 안정성 향상
- 버그 조기 발견
- 코드 품질 향상

**참고 문서**
- `docs/02-code-quality-assessment.md` - Testing 섹션

---

### [#010] 접근성(A11y) 개선 및 키보드 내비게이션 지원

**라벨**: `priority-3`, `type:feature`, `epic:accessibility`

**배경 (Context)**
현재 프로젝트의 접근성 검토가 부족하여 스크린 리더 사용자나 키보드만 사용하는 사용자가 앱을 사용하기 어려울 수 있습니다. WCAG 2.1 가이드라인 준수가 필요합니다.

**목표 (Goal)**
- WCAG 2.1 AA 수준 준수
- 키보드만으로 모든 기능 사용 가능
- 스크린 리더 호환성 확보

**할 일 (Tasks)**
- [ ] 대화형 요소 접근성 개선
  - [ ] 모든 `Button` 컴포넌트에 `aria-label` 추가
  - [ ] 모든 `Input` 컴포넌트에 `aria-label` 및 `aria-describedby` 추가
  - [ ] `Dialog` 컴포넌트에 `aria-labelledby` 및 `aria-describedby` 추가
- [ ] 키보드 내비게이션 지원
  - [ ] Tab 키로 모든 대화형 요소 접근 가능 확인
  - [ ] Enter/Space 키로 버튼 동작 확인
  - [ ] Escape 키로 모달 닫기 확인
- [ ] 색상 대비 검토
  - [ ] 텍스트와 배경 색상 대비 비율 확인 (WCAG AA: 4.5:1)
  - [ ] 색상만으로 정보를 전달하지 않도록 개선
- [ ] 스크린 리더 테스트
  - [ ] VoiceOver (macOS) 또는 NVDA (Windows)로 테스트
  - [ ] 의미 있는 라벨 및 설명 추가

**예상 효과**
- 접근성 향상으로 더 많은 사용자 지원
- 법적 준수 (접근성 관련 법규)
- 사용자 경험 전반적 향상

**참고 문서**
- `docs/02-code-quality-assessment.md` - 접근성 점검 섹션

---

## 📊 개선 작업 우선순위 매트릭스

| 이슈 번호 | 개선사항 | 영향도 | 난이도 | 우선순위 | 예상 소요 시간 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [#001] | Custom Hook 분리 | 높음 | 낮음 | 🔥 1순위 | 4-6시간 |
| [#002] | React.memo 적용 | 중간 | 낮음 | ⭐ 2순위 | 2-3시간 |
| [#003] | 에러 핸들링 강화 | 높음 | 중간 | ⭐ 2순위 | 3-4시간 |
| [#004] | 컴포넌트 문서화 | 중간 | 낮음 | ⭐ 2순위 | 2-3시간 |
| [#005] | Zustand 도입 | 높음 | 중간 | ⭐⭐ 3순위 | 6-8시간 |
| [#006] | Error Boundary | 중간 | 중간 | ⭐⭐ 3순위 | 3-4시간 |
| [#007] | 컴포넌트 분리 | 중간 | 낮음 | ⭐⭐ 3순위 | 2-3시간 |
| [#008] | DB 연동 | 매우 높음 | 높음 | ⭐⭐⭐ 4순위 | 12-16시간 |
| [#009] | 테스트 코드 | 높음 | 높음 | ⭐⭐⭐ 4순위 | 16-20시간 |
| [#010] | 접근성 개선 | 중간 | 중간 | ⭐⭐⭐ 4순위 | 4-6시간 |

---

## 📝 이슈 생성 가이드

각 이슈를 GitHub에 생성할 때는 다음 명령어를 사용하세요:

```bash
# 예시: [#001] 이슈 생성
gh issue create \
  --title "[#001] Custom Hook으로 비즈니스 로직 분리" \
  --body-file "Tasks/Priority_1/001_Custom_Hook_Refactoring.md" \
  --label "priority-1,type:refactoring,epic:code-quality"
```

각 이슈의 상세 내용은 `Priority_N/` 디렉토리에 별도 마크다운 파일로 작성하는 것을 권장합니다.

---

## 🔗 관련 문서

- [컴포넌트 구조 분석](../docs/01-component-structure-analysis.md)
- [코드 품질 평가](../docs/02-code-quality-assessment.md)
- [GitHub Issue 발행 가이드](.cursor/rules/203-duplicate-rule-github-issue-by-cmd.mdc)






