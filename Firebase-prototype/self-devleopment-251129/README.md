# Focus Habit Launcher (Firebase Prototype)

**Digital Wellness & Productivity for the "Willpower-Depleted" (Web Prototype)**

Focus Habit Launcher의 웹 버전 프로토타입입니다. 이 프로젝트는 사용자가 알람을 설정하고, 습관을 관리하며, 활동 기록을 남길 때 AI 기반의 키워드 추출 기능을 제공하여 디지털 미니멀리즘과 생산성을 돕습니다. Next.js와 Firebase Genkit을 활용하여 구축되었습니다.

## 🚀 주요 기능

1.  **알람 기반 습관 런처 (Alarm-Based Habit Launcher)**
    *   브라우저 알림(Notification API)을 활용한 알람 트리거
    *   알람 발생 시 즉시 습관 기록 모달 실행
    *   중복 알람 방지 및 토스트 알림 피드백

2.  **습관 관리 (Habit Management)**
    *   **커스텀 습관 추가/삭제**: 사용자 정의 습관 생성 및 관리
    *   **아이콘 매핑**: 기본 아이콘(FileText) 및 Lucide 아이콘 매핑 지원
    *   **로컬 저장소 동기화**: `localStorage`를 활용한 습관 목록 영구 저장

3.  **활동 기록 및 AI 분석 (Activity Logging & AI Analysis)**
    *   **활동 기록**: 텍스트 메모와 함께 수행한 습관 기록
    *   **AI 키워드 추출**: Firebase Genkit 기반 AI가 메모에서 핵심 키워드 자동 추출
    *   **히스토리 관리**: 과거 활동 로그 조회 및 관리

4.  **Local-First 데이터 아키텍처**
    *   `localStorage`를 활용하여 네트워크 없이도 기본 기능 작동
    *   클라이언트 사이드 상태 관리 (React Hooks) 

## 🛠 기술 스택

*   **Framework**: Next.js 14+ (App Router)
*   **Language**: TypeScript
*   **UI Library**: Shadcn UI + Tailwind CSS
*   **AI Integration**: Firebase Genkit (Google AI SDK)
*   **State Management**: React Hooks (`useState`, `useEffect`)
*   **Local Storage**: Browser `localStorage` API
*   **Notifications**: Browser Notification API
*   **Icons**: Lucide React
*   **Charts**: Recharts / Chart.js (Data Visualization)

## 📦 설치 및 실행

**필수 요구사항**
*   Node.js 18 이상
*   npm 또는 pnpm

```bash
# 레포지토리 클론
git clone https://github.com/your-username/focus-habit-firebase-prototype.git

# 의존성 설치
npm install

# 환경 변수 설정 (.env.local)
# GOOGLE_GENAI_API_KEY 등 필요한 키 설정

# 개발 서버 실행
npm run dev

# 브라우저에서 확인
# http://localhost:3000 접속
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 메인 대시보드 (알람, 습관 관리, 로그)
│   ├── dashboard/          # 습관 분석 대시보드
│   │   └── page.tsx        # 데이터 시각화 및 인사이트 페이지
│   ├── actions.ts          # 서버 액션 (AI 호출 등)
│   └── layout.tsx          # 루트 레이아웃
├── components/             # UI 컴포넌트
│   ├── ui/                 # Shadcn UI 기본 컴포넌트 (Button, Card, Input 등)
│   ├── alarm-setter.tsx    # 알람 설정 컴포넌트
│   ├── habit-manager.tsx   # 습관 추가/삭제 관리자
│   ├── habit-log-list.tsx  # 습관 기록 리스트 뷰어
│   ├── note-modal.tsx      # 습관 기록 및 메모 입력 모달
│   └── analysis/           # 분석 컴포넌트
│       ├── trend-chart.tsx # 습관 성장 추이 그래프
│       └── insight-card.tsx # AI 분석 인사이트 카드
├── lib/                    # 유틸리티 및 타입 정의
│   ├── types.ts            # Habit, Alarm, Log 타입 정의
│   └── utils.ts            # 유틸리티 함수
├── ai/                     # AI 로직 (Firebase Genkit)
│   ├── genkit.ts           # Genkit 설정
│   └── flows/              # AI 플로우 정의 (extract-activity-keywords.ts)
└── hooks/                  # 커스텀 훅 (use-toast 등)
```

## 🎨 디자인 시스템

*   **Color Palette**: Tailwind CSS 기본 팔레트 + 커스텀 테마
    *   **Background**: Clean White / Dark Gray (Dark Mode)
    *   **Primary**: Brand Color (Button, Active States)
    *   **Destructive**: Red (Delete Actions)

*   **Components**:
    *   **Card**: 정보 그룹화를 위한 컨테이너 (알람 설정, 습관 관리 등)
    *   **Toast**: 사용자 액션에 대한 즉각적인 피드백 (성공, 에러)
    *   **Modal**: 습관 기록 입력을 위한 집중형 UI
    *   **Insight Card**: AI 분석 결과 및 제안 표시 (강점/개선점)
    *   **Trend Chart**: 습관 형성 추이 시각화 그래프

## 📊 데이터 흐름

1.  **초기화 (Init)**: 앱 실행 시 `localStorage`에서 알람, 습관, 로그 데이터 로드
2.  **알람 트리거 (Alarm Trigger)**: `setTimeout`을 통해 설정된 시간에 브라우저 알림 및 토스트 발생
3.  **기록 (Log)**: 사용자가 알람 확인 후 모달에서 메모 작성 및 저장
4.  **AI 처리 (AI Processing)**: 서버 액션(`logHabitAction`)을 통해 메모를 분석하고 키워드 추출
5.  **저장 (Save)**: 추출된 키워드와 함께 로그를 상태 및 `localStorage`에 저장 및 리스트 업데이트

## 🔑 핵심 UX 특징

*   **간편한 알람 설정**: 직관적인 UI로 일일 알람을 손쉽게 추가 및 관리
*   **자동화된 인사이트**: 사용자가 작성한 메모에서 AI가 자동으로 태그/키워드를 생성하여 정리
*   **즉각적인 피드백**: 모든 중요 액션(저장, 삭제, 에러)에 대해 Toast 메시지로 명확한 상태 전달
*   **유연한 습관 관리**: 고정된 목록이 아닌 사용자가 원하는 습관을 자유롭게 정의 가능

## 📈 습관 데이터 분석 대시보드 (기능 예정)

사용자의 습관 형성 데이터를 시각화하여 제공하는 대시보드 페이지입니다. 첨부된 레퍼런스(사업계획서 대시보드)와 유사한 UI로 구현될 예정입니다.

1.  **주요 지표 카드 (Key Metrics Cards)**
    *   **목표 달성률**: 전체 습관 대비 수행 완료율 시각화 (Target Revenue 대체)
    *   **습관 유지율**: 지난 달 대비 습관 유지 비율 (Market Share 대체)
    *   **총 수행 횟수**: 누적된 습관 수행 횟수 (Expected Customers 대체)
    *   **성장 추이**: 주간/월간 습관 수행 증가율 (Growth Rate 대체)

2.  **AI 분석 인사이트 (AI Analysis Insights)**
    *   **강점 (Strengths)**: 사용자의 습관 패턴에서 발견된 긍정적인 요소 분석 (예: "아침 시간대 수행률이 높습니다")
    *   **개선 포인트 (Improvements)**: 습관 형성을 방해하는 요소 식별 (예: "주말에 수행률이 급격히 떨어집니다")
    *   **권장사항 (Recommendations)**: AI가 제안하는 맞춤형 액션 아이템 (예: "주말에는 더 쉬운 목표를 설정해보세요")

3.  **상세 분석 탭 (Detailed Analysis)**
    *   **개요**: 전체적인 습관 현황 요약
    *   **습관 내용**: 개별 습관별 상세 리포트
    *   **시간 관리**: 습관 수행에 투자한 시간 분석
    *   **분석**: 주간/월간 그래프 및 트렌드 시각화

## 📝 주요 흐름

1.  **설정**: 원하는 습관을 등록하고, 수행할 시간에 알람을 맞춥니다.
2.  **알림**: 지정된 시간이 되면 브라우저 알림이 도착합니다.
3.  **실행**: 알림을 클릭하거나 앱을 열어 수행한 습관을 선택합니다.
4.  **기록**: 활동에 대한 간단한 메모를 남깁니다.
5.  **분석**: AI가 메모를 분석해 핵심 키워드를 추출하고 로그에 저장합니다.
6.  **조회**: 대시보드에서 누적된 습관 기록과 키워드를 확인합니다.

## 🚧 향후 개선 사항

*   **Firebase 연동**: Firestore를 이용한 멀티 디바이스 데이터 동기화
*   **통계 대시보드**: 주간/월간 달성률 및 키워드 트렌드 시각화 (Chart.js)
*   **소셜 기능**: 친구들과 습관 달성 현황 공유
*   **PWA 지원**: 모바일 앱처럼 설치하여 사용 가능한 Progressive Web App 구현
