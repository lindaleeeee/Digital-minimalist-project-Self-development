# Task 008: 데이터 내보내기 및 공유 (Export)

> **관련 EPIC:** EPIC-6 (EXPORT_LOG)
> **출처:** 6. Task추출결과.md

## 🎯 목표
사용자의 습관 기록 데이터를 CSV 파일로 추출하여 외부로 공유할 수 있는 기능을 구현합니다.

## ✅ 세부 할 일 (Sub-Tasks)

- [ ] **TASK-EXPORT-LOGIC (CSV Generator)**
    - DB의 `LogEntry` 데이터를 조회하여 CSV 포맷 문자열로 변환하는 유틸리티 구현
    - 날짜 포맷팅 및 특수문자 처리

- [ ] **TASK-EXPORT-FILE (File I/O)**
    - 앱 내부 저장소(Cache Dir)에 임시 파일 생성 및 쓰기 로직

- [ ] **TASK-EXPORT-SHARE (Share Intent)**
    - `FileProvider` 설정 및 Android Manifest 등록
    - Android Share Sheet(Intent.ACTION_SEND) 호출하여 파일 공유 기능 구현













