# Task 003: 습관 관리 데이터 및 로직 구현 (Habit Management)

> **관련 EPIC:** EPIC-2 (HABIT_MGMT)
> **출처:** 6. Task추출결과.md

## 🎯 목표
사용자가 습관을 생성, 수정, 삭제할 수 있는 데이터 레이어와 비즈니스 로직을 구현합니다.

## ✅ 세부 할 일 (Sub-Tasks)

- [ ] **TASK-HABIT-DB-01 (Habit Entity)**
    - `Habit` Room Entity 상세 설계 및 구현
    - 필드: `id`, `name`, `icon`, `color`, `activeDays`, `isArchived`

- [ ] **TASK-HABIT-REPO-01 (Habit Repository)**
    - `HabitDao` 작성 (CRUD 쿼리)
    - Repository 패턴을 통한 데이터 접근 계층 추상화
    - 요일별 활성 습관 필터링 로직 구현

- [ ] **TASK-HABIT-UC-01 (Habit UseCases)**
    - 습관 생성/수정/삭제 비즈니스 로직 구현
    - 입력값 유효성 검사 (이름 필수, 색상 선택 등)

- [ ] **TASK-HABIT-TEST-01 (Habit Logic Test)**
    - 습관 생성 및 요일 필터링 로직에 대한 단위 테스트(JUnit) 작성













