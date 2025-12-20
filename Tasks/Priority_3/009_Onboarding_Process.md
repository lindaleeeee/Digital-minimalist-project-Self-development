# Task 009: 온보딩 및 초기 설정 (Onboarding)

> **관련 EPIC:** EPIC-7 (ONBOARDING)
> **출처:** 6. Task추출결과.md

## 🎯 목표
앱 최초 실행 시 사용자에게 필요한 권한을 요청하고, 기본 습관 데이터를 설정하는 온보딩 프로세스를 구현합니다.

## ✅ 세부 할 일 (Sub-Tasks)

- [ ] **TASK-ONBOARD-DATA (Default Seeding)**
    - Room Database `onCreate` 콜백을 이용한 기본 습관(명상, 독서 등) 프리셋 데이터 삽입

- [ ] **TASK-ONBOARD-UI (Wizard Screen)**
    - 권한 요청 화면 구현 (알림 권한, 다른 앱 위에 그리기 권한)
    - `Pager` 등을 활용한 가이드 화면 구현

- [ ] **TASK-ONBOARD-PREF (Onboarding State)**
    - DataStore Preferences를 사용하여 '온보딩 완료 여부' 플래그 저장 및 관리













