# Task 011: 비기능 요구사항 및 보안 점검

> **관련 EPIC:** Non-Functional
> **출처:** 6. Task추출결과.md

## 🎯 목표
앱의 성능(콜드 스타트), 보안(권한 관리), 데이터 격리 등 비기능적 품질 요소를 점검하고 개선합니다.

## ✅ 세부 할 일 (Sub-Tasks)

- [ ] **TASK-NF-PERF-01 (Cold Start Optimize)**
    - 앱 시작 속도 프로파일링 (Baseline Profiles 적용 고려)
    - 런처 액티비티 초기화 지연 최소화

- [ ] **TASK-NF-SEC-01 (Permission Review)**
    - `AndroidManifest.xml` 내 불필요한 권한 제거 확인
    - 민감한 권한(SYSTEM_ALERT_WINDOW) 사용에 대한 사용자 안내 문구 점검

- [ ] **TASK-NF-PRIV-01 (Data Isolation)**
    - Room Database의 `exportSchema` 설정 점검
    - ProGuard/R8 난독화 규칙 적용 확인













