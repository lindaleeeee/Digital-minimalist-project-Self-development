# 코드 문서화 가이드 (Code Documentation Guide)

본 프로젝트는 코드의 가독성, 유지보수성, 그리고 AI 어시스턴트와의 협업 효율을 높이기 위해 아래와 같은 문서화 표준을 따릅니다.

## 1. 컴포넌트 주석 표준 (JSDoc)

모든 React 컴포넌트는 상단에 JSDoc 스타일의 주석을 포함해야 합니다.

### 필수 태그
*   `@component`: 컴포넌트의 이름
*   `@description`: 컴포넌트의 역할과 책임에 대한 간략한 설명
*   `@props`: 전달받는 Props에 대한 설명
*   `@features`: (Optional) 주요 기능 목록
*   `@user_flow`: (Optional) 사용자의 인터랙션 흐름

### 예시
```typescript
/**
 * @component AlarmSetter
 * @description 매일 알람을 생성하고 삭제하는 관리 컴포넌트입니다.
 * 사용자가 시간을 입력하고 라벨을 지정하여 알람을 추가할 수 있습니다.
 *
 * @props
 * - alarms: 현재 설정된 알람 객체 배열
 * - onAddAlarm: 새 알람을 추가하는 콜백 함수
 * - onDeleteAlarm: ID로 알람을 삭제하는 콜백 함수
 *
 * @user_flow
 * 1. 사용자가 시간과 라벨(선택)을 입력합니다.
 * 2. 'Add' 버튼을 클릭합니다.
 * 3. 새로운 알람이 리스트에 추가되고 스케줄링됩니다.
 */
export function AlarmSetter({ alarms, onAddAlarm, onDeleteAlarm }: AlarmSetterProps) {
  // ...
}
```

## 2. 함수 및 훅 주석 표준

비즈니스 로직을 담은 함수나 커스텀 훅에도 명확한 주석이 필요합니다.

### 필수 항목
*   함수의 목적 및 동작 설명
*   매개변수(`@param`) 설명
*   반환값(`@returns`) 설명

### 예시
```typescript
/**
 * 알람 객체를 받아 브라우저 알림을 예약합니다.
 * 중복된 알람이 있을 경우 토스트 메시지를 표시하고 중단합니다.
 *
 * @param {Alarm} alarm - 예약할 알람 객체
 * @param {boolean} showToast - 성공/실패 시 토스트 메시지 표시 여부
 * @returns {void}
 */
const addAlarm = useCallback((alarm: Alarm, showToast = true) => {
  // ...
}, [toast]);
```

## 3. 파일 헤더 주석 (선택 사항)

복잡한 파일이나 핵심 로직(`page.tsx` 등)의 상단에는 파일 전체의 역할을 설명하는 주석을 추가합니다.

```typescript
/**
 * @file page.tsx
 * @description Focus Habit Launcher의 메인 대시보드 페이지입니다.
 *
 * @responsibilities
 * 1. 전체 상태 관리 (습관, 알람, 로그)
 * 2. LocalStorage 데이터 동기화
 * 3. 알람 스케줄링 및 브라우저 알림 트리거
 */
```

## 4. 문서화의 이점
1.  **신규 개발자 온보딩**: 코드의 의도를 빠르게 파악할 수 있습니다.
2.  **AI 협업 최적화**: LLM이 코드의 컨텍스트를 더 정확하게 이해하여 더 나은 제안을 할 수 있습니다.
3.  **유지보수성 향상**: 복잡한 로직의 흐름을 주석을 통해 쉽게 추적할 수 있습니다.

