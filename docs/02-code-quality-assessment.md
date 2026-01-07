# Code Quality Assessment

## 1. Summary
The project demonstrates a solid prototype structure using Next.js 14 App Router and TypeScript. It effectively integrates Shadcn UI for a modern aesthetic and Firebase Genkit for AI features. However, as a prototype, it relies heavily on client-side logic (`page.tsx`) and `localStorage`, which limits scalability and maintainability for a production release.

## 2. Quantitative Metrics (Estimated)
*   **Type Safety**: High. TypeScript is used consistently with defined interfaces (`Habit`, `HabitLog`, `Alarm`).
*   **Component Modularity**: Medium-High. UI components are well-separated, but business logic is coupled in the main page.
*   **Testability**: Low. Logic embedded in `page.tsx` is hard to unit test. Extracting logic to hooks/utils is required.

## 3. Detailed Review

### ✅ Strengths
1.  **Modern Stack**: Utilization of Next.js 14 Server Actions and App Router.
2.  **UI/UX**: Consistent design system using Shadcn UI and Tailwind CSS.
3.  **Type Definitions**: Clear contracts defined in `lib/types.ts`.
4.  **AI Integration**: Clean abstraction of AI logic in `ai/flows/` and `ai/genkit.ts`.

### ⚠️ Areas for Improvement

#### Architecture & Pattern
*   **"God Component" Pattern**: `page.tsx` handles initialization, storage syncing, alarm scheduling, and rendering. This violates the Single Responsibility Principle.
*   **Prop Drilling**: `habits` and setters are passed down multiple levels. Context API would clean this up.

#### Reliability & Performance
*   **LocalStorage Dependency**: Data is bound to the specific browser instance. No cloud sync (yet).
*   **Effect Chains**: Multiple `useEffect` hooks monitoring state changes for storage can lead to race conditions or unnecessary writes.

#### Error Handling
*   **Silent Failures**: `console.error` is used, but user-facing error recovery is minimal (except for Toasts).
*   **Network Resilience**: AI calls (`logHabitAction`) do not seem to have retry logic or offline queueing.

## 4. Recommendations for Production
1.  **Refactor Logic**: Move storage and alarm logic to `hooks/useHabitData.ts` and `hooks/useAlarmSystem.ts`.
2.  **Introduce Backend DB**: Replace `localStorage` with Firebase Firestore or Supabase/PostgreSQL.
3.  **Enhance AI Resilience**: Implement fallback if AI service fails (save log without keywords, retry later).
4.  **Testing**: Add unit tests for `logHabitAction` and custom hooks.

---

# 컴포넌트 구조 분석

## 목차
1.  [컴포넌트 트리 (Mermaid)](#컴포넌트-트리-mermaid)
2.  [아키텍처 개요](#아키텍처-개요)
3.  [컴포넌트 분류](#컴포넌트-분류)
4.  [효율성 평가](#효율성-평가)
5.  [개선 가능성](#개선-가능성)

## 컴포넌트 트리 (Mermaid)

```mermaid
graph TD
    Root[RootLayout (layout.tsx)] --> Home[Home (page.tsx)]
    
    subgraph "Feature Components"
    Home --> Header[Header]
    Home --> AlarmSetter[AlarmSetter]
    Home --> HabitManager[HabitManager]
    Home --> HabitLogList[HabitLogList]
    Home --> NoteModal[NoteModal]
    end

    subgraph "UI Components (Shadcn)"
    AlarmSetter --> UI_Card[Card]
    AlarmSetter --> UI_Button[Button]
    AlarmSetter --> UI_Input[Input]
    HabitManager --> UI_Card
    HabitManager --> UI_Button
    HabitManager --> UI_Input
    HabitLogList --> UI_Card
    HabitLogList --> UI_Badge[Badge]
    HabitLogList --> UI_ScrollArea[ScrollArea]
    NoteModal --> UI_Dialog[Dialog]
    NoteModal --> UI_Textarea[Textarea]
    NoteModal --> UI_Button
    end
    
    subgraph "State & Logic"
    Home --> UseToast[useToast Hook]
    Home --> ServerActions[Server Actions (logHabitAction)]
    Home -.-> LocalStorage[(LocalStorage)]
    end
```

## 아키텍처 개요

### 1. 레이어 구조
프로젝트는 Next.js App Router를 기반으로 명확한 역할 분담을 따르고 있습니다:

```text
📦 src/
├─ 📄 app/                 # 페이지 & 라우팅 레이어
│  ├─ layout.tsx           # 전역 레이아웃
│  ├─ page.tsx             # 메인 컨트롤러 ("God Component")
│  └─ actions.ts           # 서버 액션 (AI 통신)
│
├─ 🎨 components/          # 컴포넌트 레이어
│  ├─ ui/                  # Shadcn UI (Presentation)
│  ├─ alarm-setter.tsx     # 알람 관리 (Feature)
│  ├─ habit-manager.tsx    # 습관 관리 (Feature)
│  ├─ habit-log-list.tsx   # 로그 표시 (Feature)
│  └─ note-modal.tsx       # 기록 입력 모달 (Feature)
│
├─ 🔧 hooks/               # 커스텀 훅 레이어
│  └─ use-toast.ts         # 토스트 알림 상태 관리
│
├─ 📐 lib/                 # 유틸리티 & 타입 레이어
│  ├─ types.ts             # 데이터 모델 정의
│  └─ utils.ts             # Tailwind 유틸리티
│
└─ 🤖 ai/                  # AI 로직 레이어
   ├─ genkit.ts            # Genkit 설정
   └─ flows/               # AI 처리 흐름 정의
```

### 2. 데이터 흐름
**User Input** → **UI Component** → **Feature Component** → **Home (State)** → **LocalStorage**
                                                         ↓
                                                  **Server Action (AI)**

*   **State Owner**: `page.tsx` (`habitLogs`, `habits`, `alarms`)
*   **Props Flow**: 상위 `page.tsx`에서 하위 Feature Component로 상태와 핸들러 전달 (Prop Drilling 발생)
*   **Persistence**: `useEffect`를 통해 상태 변경 시 `localStorage`에 자동 동기화

## 컴포넌트 분류

### A. Presentation Components (UI 컴포넌트)
특징: 상태 없음, Props 기반 렌더링, 높은 재사용성 (Shadcn UI)

| 컴포넌트 | 역할 | 재사용성 |
| :--- | :--- | :--- |
| **Button** | 클릭 액션 트리거 | ⭐⭐⭐⭐⭐ |
| **Card** | 컨텐츠 컨테이너 | ⭐⭐⭐⭐⭐ |
| **Input** | 텍스트 입력 | ⭐⭐⭐⭐⭐ |
| **Dialog** | 모달 오버레이 | ⭐⭐⭐⭐⭐ |
| **Badge** | 상태/태그 표시 | ⭐⭐⭐⭐⭐ |
| **ScrollArea** | 스크롤 영역 제어 | ⭐⭐⭐⭐ |

**장점:**
✅ 일관된 디자인 시스템 (Tailwind CSS)
✅ 높은 접근성 (Radix UI 기반)
✅ `cn()` 유틸리티를 통한 유연한 스타일링

### B. Feature Components (기능 컴포넌트)
특징: 도메인 로직 일부 포함, UI 컴포넌트 조합

| 컴포넌트 | 역할 | 복잡도 |
| :--- | :--- | :--- |
| **AlarmSetter** | 알람 시간 설정 및 목록 관리 | ⭐⭐⭐ |
| **HabitManager** | 습관 CRUD 관리 | ⭐⭐⭐ |
| **HabitLogList** | 습관 기록 히스토리 표시 | ⭐⭐ |
| **NoteModal** | 습관 수행 기록 및 AI 연동 트리거 | ⭐⭐⭐ |
| **Header** | 앱 타이틀 및 네비게이션 | ⭐ |

### C. Controller Component (페이지)
| 컴포넌트 | 역할 |
| :--- | :--- |
| **Home (page.tsx)** | 전체 상태 관리, 스토리지 동기화, 알람 스케줄링, 데이터 통합 |

## 효율성 평가

### ✅ 장점
1.  **명확한 UI 분리**: Shadcn UI를 사용하여 디자인과 로직이 깔끔하게 분리됨.
2.  **타입 안전성**: `Habit`, `HabitLog` 등 인터페이스가 명확하여 데이터 흐름 추적이 용이함.
3.  **서버 액션 활용**: API 라우트 없이 `actions.ts`를 통해 AI 로직을 직관적으로 호출.

### ⚠️ 개선 필요 영역
1.  **과도한 책임 집중 (SoC 위반)**: `page.tsx`가 UI 렌더링뿐만 아니라 데이터 저장, 알람 타이머 관리, 비즈니스 로직을 모두 담당함.
2.  **Prop Drilling**: `habits`와 `setHabits`가 `Home` -> `HabitManager` 등으로 깊게 전달됨.
3.  **렌더링 최적화 미비**: `habitLogs` 배열이 커질 경우 전체 리렌더링 발생 가능성 (Memoization 없음).
4.  **확장성 제한**: LocalStorage는 브라우저 간 동기화가 불가능하며 데이터 유실 위험이 있음.

## 개선 가능성

### 🎯 즉시 적용 가능한 개선사항

#### 1. Custom Hook으로 로직 분리 (Refactoring)
**Before (`page.tsx`):**
```typescript
const [alarms, setAlarms] = useState<Alarm[]>([]);
// ... useEffect for storage
// ... addAlarm logic
// ... deleteAlarm logic
```

**After (`hooks/useAlarmSystem.ts`):**
```typescript
export const useAlarmSystem = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  // 로직 캡슐화
  return { alarms, addAlarm, deleteAlarm };
};
```
**예상 효과**: `page.tsx` 코드 라인 수 40% 감소, 가독성 향상.

#### 2. 렌더링 성능 최적화
**적용**: `HabitLogList`와 같은 리스트 컴포넌트에 `React.memo` 적용.
```typescript
export const HabitLogList = React.memo(({ logs }: HabitLogListProps) => {
  // ...
});
```
**예상 효과**: 부모 컴포넌트 상태 변경 시 불필요한 리스트 리렌더링 방지.

#### 3. 에러 핸들링 강화
**제안**: `try-catch` 블록 내에서 사용자에게 명확한 피드백을 주는 `useToast` 활용 패턴 통일.
**추가**: AI 호출 실패 시 "재시도" 버튼을 제공하는 UI 개선.

### 🚀 중기 개선 사항

#### 1. 상태 관리 라이브러리 도입 (Zustand/Context)
Prop Drilling을 제거하고 전역 상태 관리를 도입.
```typescript
// stores/useHabitStore.ts
const useHabitStore = create((set) => ({
  habits: [],
  addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
}));
```

#### 2. 데이터베이스 연동
LocalStorage를 **Supabase** 또는 **Firebase Firestore**로 대체하여 멀티 디바이스 동기화 지원.

### 📊 개선 우선순위 매트릭스

| 개선사항 | 영향도 | 난이도 | 우선순위 |
| :--- | :--- | :--- | :--- |
| **Custom Hook 분리** | 높음 | 낮음 | 🔥 1순위 |
| **React.memo 적용** | 중간 | 낮음 | ⭐ 2순위 |
| **데이터베이스 연동** | 매우 높음 | 높음 | ⭐⭐ 3순위 |
| **테스트 코드 작성** | 높음 | 높음 | ⭐⭐ 3순위 |

## 결론
현재 구조는 **MVP(Minimum Viable Product)**로서 기능 구현에 충실하며 UI 완성도가 높습니다. 하지만 **프로덕션 레벨**로 확장하기 위해서는 `page.tsx`의 비대해진 로직을 **Custom Hooks**로 분리하고, **상태 관리 도구**를 도입하는 리팩토링이 필수적입니다.
