# 컴포넌트 구조 분석

## 목차
1. [컴포넌트 트리 (Mermaid)](#컴포넌트-트리-mermaid)
2. [아키텍처 개요](#아키텍처-개요)
3. [컴포넌트 분류](#컴포넌트-분류)
4. [효율성 평가](#효율성-평가)
5. [개선 가능성](#개선-가능성)

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

    subgraph "UI Components (Shadcn/Presentation)"
    AlarmSetter --> UI_Card[Card]
    AlarmSetter --> UI_Button[Button]
    AlarmSetter --> UI_Input[Input]
    AlarmSetter --> UI_ScrollArea[ScrollArea]
    
    HabitManager --> UI_Input
    HabitManager --> UI_Button
    
    HabitLogList --> UI_Card
    HabitLogList --> UI_Table[Table]
    HabitLogList --> UI_Badge[Badge]
    HabitLogList --> UI_ScrollArea
    
    NoteModal --> UI_Dialog[Dialog]
    NoteModal --> UI_Textarea[Textarea]
    NoteModal --> UI_Button
    NoteModal --> UI_Chart[Chart/Recharts]
    end
    
    subgraph "State & Data Flow"
    Home --> UseToast[useToast Hook]
    Home -.-> LocalStorage[(LocalStorage)]
    NoteModal --> ServerAction[logHabitAction (AI)]
    end
```

## 아키텍처 개요

### 1. 레이어 구조
프로젝트는 Next.js App Router를 기반으로 명확한 역할 분담을 따르고 있습니다:

```text
📦 src/
├─ 📄 app/                 # 페이지 레이어 (라우트 및 컨트롤러)
│  ├─ layout.tsx           # 전역 레이아웃 (폰트, 메타데이터)
│  ├─ page.tsx             # 메인 페이지 (상태 관리 및 데이터 통합 "God Component")
│  └─ actions.ts           # 서버 액션 (AI API 통신)
│
├─ 🎨 components/          # 컴포넌트 레이어
│  ├─ ui/                  # Shadcn UI (재사용 가능한 기본 UI)
│  ├─ alarm-setter.tsx     # 알람 설정 기능
│  ├─ habit-manager.tsx    # 습관 관리 기능
│  ├─ habit-log-list.tsx   # 기록 목록 표시
│  ├─ note-modal.tsx       # 기록 입력 및 AI 분석 모달
│  └─ header.tsx           # 상단 헤더
│
├─ 🔧 hooks/               # 커스텀 훅 레이어
│  └─ use-toast.ts         # 토스트 알림 상태 관리
│
├─ 📐 lib/                 # 유틸리티 레이어
│  ├─ types.ts             # 데이터 타입 정의 (Habit, Alarm, Log)
│  └─ utils.ts             # 스타일 유틸리티 (cn)
│
└─ 🤖 ai/                  # AI 로직 레이어
   ├─ genkit.ts            # Genkit 설정
   └─ flows/               # AI 처리 흐름 (키워드 추출)
```

### 2. 데이터 흐름
**User Input** → **Component** → **Home (State)** → **LocalStorage (Persist)**
                                       ↓
                                **Server Action (AI)**

*   **State Management**: `page.tsx`가 `habitLogs`, `habits`, `alarms` 상태를 중앙 관리합니다.
*   **Data Persistence**: `useEffect` 훅이 상태 변경을 감지하여 `localStorage`에 데이터를 동기화합니다.
*   **Async Operation**: `NoteModal`에서 기록 저장 시 `logHabitAction`을 호출하여 서버 측 AI 분석을 수행합니다.

## 컴포넌트 분류

### A. Presentation Components (UI 컴포넌트)
특징: 재사용 가능, 상태 없음(Stateless), Props 기반 렌더링

| 컴포넌트 | 역할 | 재사용성 |
| :--- | :--- | :--- |
| **Button** | 버튼 UI | ⭐⭐⭐⭐⭐ |
| **Card** | 카드 레이아웃 | ⭐⭐⭐⭐⭐ |
| **Input** | 텍스트 입력 | ⭐⭐⭐⭐⭐ |
| **Table** | 데이터 테이블 | ⭐⭐⭐⭐⭐ |
| **Badge** | 뱃지 표시 | ⭐⭐⭐⭐⭐ |
| **ScrollArea** | 스크롤 영역 | ⭐⭐⭐⭐ |

**장점:**
✅ **높은 재사용성**: Shadcn UI 기반으로 프로젝트 전반에서 사용 가능.
✅ **일관된 디자인**: Tailwind CSS 클래스로 통일된 스타일 적용.
✅ **타입 안정성**: TypeScript Props 정의로 오류 방지.

### B. Feature Components (비즈니스 로직 포함)
특징: 도메인 로직 포함, UI 컴포넌트 조합, 상위 컴포넌트로부터 상태 주입

| 컴포넌트 | 역할 | 복잡도 |
| :--- | :--- | :--- |
| **AlarmSetter** | 알람 추가/삭제 및 목록 표시 | ⭐⭐⭐ |
| **HabitManager** | 습관 생성/삭제 로직 | ⭐⭐⭐ |
| **HabitLogList** | 습관 기록 데이터 포맷팅 및 표시 | ⭐⭐ |
| **NoteModal** | 입력 폼 관리 및 차트 시각화 | ⭐⭐⭐⭐ |

### C. Layout & Controller Components
| 컴포넌트 | 역할 |
| :--- | :--- |
| **Home (page.tsx)** | 전체 앱의 상태 관리자, 스토리지 동기화, 알람 스케줄링 |
| **Layout** | 앱의 공통 골격 정의 |

## 효율성 평가

### ✅ 장점
1.  **명확한 관심사 분리 (SoC)**: UI(Shadcn)와 비즈니스 로직(Feature Components)이 명확히 구분됨.
2.  **타입 안전성**: `Habit`, `Alarm`, `HabitLog` 인터페이스를 통해 데이터 흐름이 명확하게 정의됨.
3.  **빠른 개발 속도**: Next.js App Router와 Server Actions를 활용하여 API 구축 없이 기능을 구현함.

### ⚠️ 개선 필요 영역
1.  **성능 최적화 부족**: `React.memo`나 `useCallback`이 리스트 컴포넌트(`HabitLogList`)에 적용되지 않아 불필요한 리렌더링 발생 가능.
2.  **Prop Drilling**: `Home`에서 하위 컴포넌트로 상태와 Setter 함수가 여러 단계 전달됨.
3.  **테스트 코드 부재**: 주요 비즈니스 로직에 대한 단위 테스트가 없음.
4.  **에러 처리 미흡**: AI 분석 실패 등의 상황에 대한 사용자 피드백 메커니즘이 `Toast` 외에는 제한적임.

## 개선 가능성

### 🎯 즉시 적용 가능한 개선사항

#### 1. 성능 최적화 (React.memo)
**Before:**
```typescript
export function HabitLogList({ logs, habits }: { ... }) { ... }
```
**After:**
```typescript
export const HabitLogList = React.memo(({ logs, habits }: HabitLogListProps) => { ... });
```
**예상 효과**: 로그 데이터가 많아질 때 입력 지연 방지 및 렌더링 성능 향상.

#### 2. Custom Hook 도입 (Logic Extraction)
현재 `page.tsx`에 있는 로직을 분리하여 모듈화합니다.

*   `useAlarmSystem`: 알람 추가, 삭제, 스케줄링 로직
*   `useHabitData`: 습관 데이터 CRUD 및 LocalStorage 동기화

#### 3. 컴포넌트 주석 및 문서화
주요 비즈니스 로직이 포함된 컴포넌트에 JSDoc 스타일의 주석을 추가하여 유지보수성을 높입니다.

### 🚀 중기 개선 사항

#### 1. 상태 관리 최적화
Zustand 또는 React Context API를 도입하여 Prop Drilling을 제거하고 상태 접근을 효율화합니다.

#### 2. 데이터베이스 연동
LocalStorage의 한계를 극복하기 위해 Firebase Firestore 또는 Supabase와 연동하여 데이터를 영구 저장합니다.

#### 3. 에러 바운더리 (Error Boundary)
런타임 에러 발생 시 앱 전체가 중단되지 않도록 Error Boundary를 적용합니다.

## 결론
현재 프로젝트는 **MVP 단계**에서 빠르고 효율적인 구조를 가지고 있으나, 기능이 확장됨에 따라 **컴포넌트 분리**와 **최적화**가 필요합니다. 특히 `page.tsx`의 복잡도를 낮추는 것이 최우선 과제입니다.
