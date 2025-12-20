# Component Architecture Analysis

## 1. Component Hierarchy Chart

```mermaid
graph TD
    Root[Layout] --> Page[Home (page.tsx)]
    Page --> Header
    Page --> AlarmSetter[AlarmSetter]
    Page --> HabitManager[HabitManager]
    Page --> LogList[HabitLogList]
    Page --> Modal[NoteModal]
    
    Modal --> AI[AI Action (Server)]
    
    subgraph "UI Components (Shadcn)"
        AlarmSetter --> Card
        AlarmSetter --> Button
        AlarmSetter --> Input
        HabitManager --> Card
        HabitManager --> Button
        HabitManager --> Input
        LogList --> ScrollArea
    end
```

## 2. Current Structure Analysis

### Core Components
*   **`page.tsx` (Home)**: Acts as the **God Object** for state management. It holds `habits`, `alarms`, `habitLogs` states and handles `localStorage` synchronization (CRUD).
*   **`AlarmSetter`**: Pure presentation component for adding/deleting alarms.
*   **`HabitManager`**: Manages the list of available habit definitions.
*   **`NoteModal`**: The primary input interface. Handles user input and triggers the server action for AI processing.
*   **`HabitLogList`**: Displays the history of user activities.

### Data Flow
*   **Unidirectional Data Flow**: State is lifted up to `page.tsx` and passed down via props.
*   **Persistence**: `useEffect` hooks in `page.tsx` sync state with `localStorage`.
*   **AI Integration**: `NoteModal` calls `logHabitAction` (Server Action) which invokes Firebase Genkit.

## 3. Improvement Opportunities (Refactoring Plan)

### A. State Management Separation
*   **Current Issue**: `page.tsx` is bloated with business logic and storage side-effects.
*   **Proposal**: Introduce a Client-side State Manager (Zustand or React Context).
    *   `useHabitStore`: Manage habits and logs.
    *   `useAlarmStore`: Manage alarms and notification triggers.
*   **Benefit**: Decouples UI from Logic, makes testing easier.

### B. Custom Hooks for Logic
*   **Current Issue**: `useEffect` for `localStorage` and `Notification` logic is mixed in the view.
*   **Proposal**:
    *   `useLocalStorage<T>(key, initialValue)` hook.
    *   `useAlarmScheduler(alarms)` hook for managing `setTimeout`.
*   **Benefit**: Reusability and cleaner component code.

### C. Error Handling Strategy
*   **Current Issue**: Basic `try/catch` with `console.error`.
*   **Proposal**: Implement Global Error Boundary and specific UI feedback for AI service failures (e.g., "AI analysis unavailable, saved locally only").

### D. Component Granularity
*   **Current Issue**: `HabitLogList` renders all items.
*   **Proposal**: Implement virtualization (e.g., `react-window`) if logs grow large. Pagination for history.

