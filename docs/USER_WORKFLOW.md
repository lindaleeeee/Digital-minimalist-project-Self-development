# User Workflow Scenarios

## 1. Onboarding & Setup Flow
**Goal**: User sets up their initial habits and notification preferences.

1.  **Landing**: User accesses the web application.
2.  **Habit Definition**:
    *   User sees a default list of habits (Meditation, Reading, etc.).
    *   User clicks "Add Habit" in `HabitManager`.
    *   User enters a custom habit name (e.g., "Deep Work").
    *   System saves habit to `localStorage`.
3.  **Alarm Configuration**:
    *   User sets a specific time (e.g., "09:00") in `AlarmSetter`.
    *   User grants browser notification permissions if prompted.
    *   System schedules a local timer.

## 2. Notification & Action Trigger Flow
**Goal**: User is prompted to perform a habit and logs it.

1.  **Trigger**:
    *   At the scheduled time (e.g., 09:00), browser sends a Notification.
    *   Toast message appears: "It's time! Time to log your habit."
2.  **Engagement**:
    *   User clicks the notification or opens the app.
    *   User sees the `NoteModal` active or clicks an alarm to activate it.
3.  **Logging**:
    *   User selects the performed habit (if not pre-linked).
    *   User types a reflection note (e.g., "Read 10 pages of Atomic Habits").
    *   User submits the log.

## 3. AI Processing & Analysis Flow
**Goal**: System processes the user input to generate insights.

1.  **Submission**: User submits the log in `NoteModal`.
2.  **AI Extraction (Server Action)**:
    *   `logHabitAction` is called with the note text.
    *   Firebase Genkit (Gemini) analyzes the text.
    *   Keywords are extracted (e.g., ["Reading", "Self-development", "10 pages"]).
3.  **Persistence**:
    *   System saves the log with timestamp and AI-generated keywords to `localStorage`.
4.  **Feedback**:
    *   User sees "Habit Logged!" toast.
    *   Dashboard updates the `HabitLogList` with the new entry.

## 4. Review & Management Flow
**Goal**: User reviews progress and manages configuration.

1.  **Dashboard View**:
    *   User scrolls through `HabitLogList` to see past activities.
    *   User sees the AI-generated keywords attached to each log.
2.  **Management**:
    *   User deletes an obsolete alarm.
    *   User removes a habit they no longer pursue.
    *   `localStorage` updates immediately to reflect changes.

