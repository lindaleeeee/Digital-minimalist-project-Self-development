# Focus Habit Launcher

**Digital Wellness & Productivity for the "Willpower-Depleted"**

Focus Habit Launcher는 의지력이 고갈된 현대인(지식 노동자, 수험생 등)을 위해 설계된 **디지털 미니멀리즘 자기계발 런처**입니다. 사용자가 알람을 끌 때 "오늘 했나요?"라는 질문을 던져, 스마트폰 중독을 방지하고 즉시 목표 행동을 실행하도록 돕습니다.

## 🚀 주요 기능

1.  **강제적 개입 런처 (Forced Intervention Launcher)**
    *   알람 해제 시 시스템 UI를 덮는 전체 화면 오버레이 실행
    *   다른 앱 진입 차단으로 디지털 주의 분산 방지

2.  **습관 실천 관리 (Habit Execution Management)**
    *   **Step 1**: 알람 트리거 및 런처 실행
    *   **Step 2**: 직관적인 YES / NO 선택 (인지 부하 최소화)
    *   **Step 3**: 습관 수행 기록 (텍스트/음성 메모)
    *   **Step 4**: 즉각적인 성취 피드백

3.  **Local-First 데이터 저장**
    *   네트워크 연결 없이 모든 데이터 로컬 저장 (Room DB)
    *   개인 정보 보호 및 빠른 응답 속도 보장

4.  **시각적 동기 부여 (Visual Motivation)**
    *   완료한 습관 Gray-out 처리로 성취감 시각화
    *   실시간 그래프 애니메이션으로 달성률 확인

5.  **다크 모드 디자인 (Dark Mode Design)**
    *   눈의 피로를 최소화하는 Dark Theme 기본 적용
    *   집중력을 높이는 미니멀 UI

6.  **통계 및 리포트**
    *   일간/주간 습관 달성 추이 분석
    *   카테고리별(건강, 학습, 명상 등) 활동 분석

## 🛠 기술 스택

*   **Framework**: Jetpack Compose (Material3)
*   **Language**: Kotlin (100%)
*   **Architecture**: MVVM + Clean Architecture
*   **Database**: Room (SQLite)
*   **Concurrency**: Coroutines + Flow
*   **OS Integration**: AlarmManager, BroadcastReceiver, System Alert Window
*   **Charts**: Vico / Canvas API

## 📦 설치 및 실행

**필수 요구사항**
*   Android Studio Ladybug 이상
*   JDK 17
*   Android SDK 34

```bash
# 레포지토리 클론
git clone https://github.com/your-username/focus-habit-launcher.git

# Android Studio에서 프로젝트 열기
# (File > Open > focus-habit-launcher 폴더 선택)

# Gradle Sync 및 빌드
# (자동으로 수행되거나 'Sync Project with Gradle Files' 클릭)

# 에뮬레이터 또는 기기에서 실행
# (Run 버튼 클릭, API 34+ 권장)
```

## 📁 프로젝트 구조

```
app/src/main/java/com/example/focushabit/
├── ui/                     # UI 계층 (Compose)
│   ├── screens/            # 화면 단위 컴포넌트
│   │   ├── LauncherScreen.kt       # 런처 메인 화면
│   │   ├── HabitSelectionScreen.kt # 습관 선택 화면
│   │   ├── LogInputScreen.kt       # 기록 입력 화면
│   │   └── QuoteScreen.kt          # 동기부여 명언 화면
│   └── theme/              # 테마 및 스타일 (Color, Type)
├── model/                  # 데이터 모델 (Habit, Log)
└── MainActivity.kt         # 앱 진입점 및 네비게이션 설정
```

## 🎨 디자인 시스템

*   **Color Palette**:
    *   **Primary**: Focus Purple (`#6C63FF`) - 창의성과 집중
    *   **Background**: Dark Gray (`#1E1E1E`) - 몰입 유도
    *   **Habit Colors**:
        *   🧘 Meditation: Purple
        *   📚 Reading: Pink
        *   💊 Health: Green
        *   🤸 Exercise: Amber
    *   **Status**:
        *   Completed: Gray + Strike-through
        *   Active: Vibrant Original Colors

*   **Typography**:
    *   Font Family: System Default (San Francisco / Roboto)
    *   Hierarchy: Title(H1) - Body - Caption 구조

*   **Components**:
    *   **Habit Card**: 터치 영역을 넓게 확보한 카드형 UI
    *   **Full Screen Overlay**: 시스템 UI를 가리는 몰입형 런처

## 📊 데이터 흐름

1.  **트리거 (Trigger)**: `AlarmManager`가 지정된 시각에 알람 이벤트 발생
2.  **런처 실행 (Launcher)**: `BroadcastReceiver`가 감지하여 `LauncherActivity` 오버레이 실행
3.  **사용자 입력 (Input)**: YES/NO 선택 및 메모/음성 데이터 입력
4.  **로컬 저장 (Storage)**: 입력 데이터 `Room Database`에 영구 저장 (Auto-save)
5.  **시각화 (Visualization)**: 저장된 데이터를 기반으로 실시간 그래프 렌더링

## 🔑 핵심 UX 특징

*   **강제적 개입 (Intervention)**: 의지력 개입을 최소화하는 강제 실행 런처로 '소비'에서 '생산' 모드 전환
*   **인지 부하 최소화**: 복잡한 메뉴 대신 **YES / NO** 두 가지 선택지만 제시
*   **즉각적 보상**: 기록 직후 그래프 애니메이션 및 완료 항목 Gray-out 처리로 성취감 고취
*   **중단 없는 흐름 (Seamless Flow)**: 알람 → 기록 → 종료까지 로딩 없는 매끄러운 경험 제공

## 📝 주요 흐름

1.  **시작**: 사용자 습관(예: 명상, 독서) 및 알람 시간 설정
2.  **기상/알림**: 지정된 시간에 알람이 울리며 스마트폰 화면 전체가 런처로 전환
3.  **선택**: 수행 여부(YES/NO) 결정
    *   **YES**: 습관 목록 진입 및 수행한 활동 선택
    *   **NO**: 동기 부여 명언 확인 후 종료
4.  **기록**: 선택한 습관에 대한 간단한 메모 또는 음성 기록 남기기
5.  **완료**: 결과 그래프 반영, 런처 종료 및 일반 스마트폰 화면 복귀

## 📚 프로젝트 문서 (Documentation)

프로젝트에 대한 상세 분석 및 문서는 `docs/` 디렉토리에서 확인할 수 있습니다.

*   [**UX 시나리오 (User Workflow)**](docs/USER_WORKFLOW.md): 사용자 경험 흐름 및 핵심 시나리오
*   [**컴포넌트 구조 (Architecture)**](docs/COMPONENT_ARCHITECTURE.md): 시스템 아키텍처 다이어그램 및 분석
*   [**코드 품질 평가 (Code Quality)**](docs/CODE_QUALITY_ASSESSMENT.md): 코드베이스 현황 및 개선 제안

## 🚧 향후 개선 사항

*   **소셜 기능**: 친구와 습관 공유 및 그룹 챌린지
*   **클라우드 동기화**: Firebase/Supabase 연동을 통한 기기 간 데이터 백업
*   **AI 맞춤형 코칭**: 사용자 패턴 분석을 통한 습관 추천 및 인사이트 제공
*   **웨어러블 연동**: 워치 앱 지원으로 더 간편한 기록
*   **게이미피케이션**: 배지, 레벨 시스템 도입으로 지속적인 동기 부여
