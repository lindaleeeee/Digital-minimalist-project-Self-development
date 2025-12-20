# Task 004: 알람 코어 로직 및 스케줄러 (Alarm Core)

> **관련 EPIC:** EPIC-3 (ALARM_CORE)
> **출처:** 6. Task추출결과.md

## 🎯 목표
Android 시스템 알람(AlarmManager)을 연동하여 정확한 시간에 알람이 울리도록 구현합니다.

## ✅ 세부 할 일 (Sub-Tasks)

- [ ] **TASK-ALARM-DB-01 (Alarm Entity)**
    - `Alarm` Room Entity 설계
    - 필드: `id`, `time`, `isEnabled`, `daysOfWeek`, `label`

- [ ] **TASK-ALARM-MGR-01 (Alarm Scheduler)**
    - `AlarmManager` 연동 로직 구현
    - Android 12+ Exact Alarm 권한 처리 로직 추가
    - Boot Receiver 구현 (재부팅 시 알람 재등록)

- [ ] **TASK-ALARM-NOTI-01 (Notification Channel)**
    - High Priority Notification Channel 생성
    - FullScreenIntent 권한 설정 및 매니페스트 등록

- [ ] **TASK-ALARM-UC-01 (Alarm UseCases)**
    - 알람 생성/삭제/토글(On/Off) 로직 구현
    - 스케줄러와 DB 간의 동기화 처리













