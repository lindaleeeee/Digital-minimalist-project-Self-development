# Task 005: 런처 플로우 및 데이터 연동 (Launcher Flow)

> **관련 EPIC:** EPIC-4 (LAUNCHER_FLOW)
> **출처:** 6. Task추출결과.md

## 🎯 목표
알람이 울렸을 때 잠금 화면 위로 런처 UI를 띄우고, 실제 데이터(DB)와 연동하여 기록을 저장합니다.

## ✅ 세부 할 일 (Sub-Tasks)

- [ ] **TASK-LAUNCHER-SVC (Receiver & Activity)**
    - 알람 수신 시 `showWhenLocked`, `turnScreenOn` 플래그를 적용한 Activity 실행 로직
    - Foreground Service 구현 (필요 시)

- [ ] **TASK-LOG-DB-01 (Log Entity)**
    - `LogEntry` Entity 설계 (습관 수행 기록)
    - 필드: `id`, `habitId`, `timestamp`, `note`, `duration`

- [ ] **TASK-LAUNCHER-UI-03 (Log Input Screen - Real)**
    - PoC 단계의 UI를 실제 DB와 연결
    - 기록 저장 시 `LogEntry` 테이블에 Insert 수행

- [ ] **TASK-LAUNCHER-UI-04 (Quote Card)**
    - NO 선택 시 로컬 명언 데이터(JSON)에서 랜덤 명언 표시 기능 구현













