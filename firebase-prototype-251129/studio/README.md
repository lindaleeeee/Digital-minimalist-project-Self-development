# Growth Tracker (Focus Habit)

습관 추적 및 자기 개발을 위한 디지털 미니멀리스트 웹 애플리케이션

## 📋 프로젝트 개요

Growth Tracker는 사용자가 일상 습관을 추적하고, 시간을 관리하며, 자기 개발 목표를 달성할 수 있도록 돕는 웹 애플리케이션입니다.

## ✨ 핵심 기능

- **알람 설정**: 특정 시간에 활동 알림을 트리거하는 알람 설정
- **노트 입력**: 알람이 울릴 때 수행한 활동에 대한 간단한 노트 입력
- **키워드 추출**: AI를 사용하여 사용자의 노트에서 키워드(영어, 독서, 운동 등) 자동 추출
- **시간 추적**: 활동 시간 자동 추적 (알람 트리거부터 노트 입력까지)
- **데이터 내보내기**: 추출된 키워드와 시간 데이터를 엑셀/CSV로 내보내기

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI Library**: React 18
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: React Hooks
- **Form**: React Hook Form + Zod

### Backend Integration
- **API Client**: Custom fetch wrapper
- **Backend**: Spring Boot (별도 저장소)
- **AI**: Google Genkit

### Development
- **Language**: TypeScript
- **Package Manager**: npm
- **Linting**: ESLint

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 랜딩 페이지
│   ├── dashboard/         # 대시보드 페이지
│   └── layout.tsx         # 루트 레이아웃
├── components/            # React 컴포넌트
│   ├── ui/               # Radix UI 기반 공통 컴포넌트
│   ├── alarm-setter.tsx  # 알람 설정 컴포넌트
│   ├── habit-manager.tsx # 습관 관리 컴포넌트
│   ├── habit-log-list.tsx # 습관 로그 목록
│   ├── history-view.tsx  # 히스토리 뷰
│   └── note-modal.tsx    # 노트 입력 모달
├── lib/                   # 유틸리티 및 라이브러리
│   ├── api/              # API 클라이언트 모듈
│   │   ├── client.ts     # HTTP 클라이언트
│   │   ├── habits.ts     # 습관 API
│   │   ├── logs.ts       # 로그 API
│   │   ├── alarms.ts     # 알람 API
│   │   └── types.ts      # API 타입 정의
│   ├── types.ts          # 공통 타입 정의
│   ├── utils.ts          # 유틸리티 함수
│   └── export.ts         # 데이터 내보내기
├── hooks/                 # Custom React Hooks
└── ai/                    # AI/Genkit 관련
```

## 🚀 시작하기

### 필수 조건
- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/lindaleeeee/studio.git
cd studio

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# 프론트엔드 개발 서버 (포트 9002)
npm run dev
```

### 환경 변수

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_MOCK=false
```

## 🎨 디자인 가이드라인

- **Primary Color**: Deep Indigo (#4B0082) - 집중과 자기 개발을 상징
- **Background Color**: Very Light Gray (#F0F0F0) - 깔끔한 화면 구성
- **Accent Color**: Turquoise (#40E0D0) - 주요 인터랙티브 요소 강조
- **Font**: PT Sans - 가독성과 따뜻함
- **Icons**: 깔끔하고 미니멀한 아이콘
- **Layout**: 빠른 노트 입력을 위한 직관적인 레이아웃
- **Animation**: 사용자 입력과 진행 상황을 인정하는 미묘한 애니메이션

## 📜 스크립트

```bash
npm run dev        # 개발 서버 실행 (포트 9002)
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버 실행
npm run lint       # ESLint 검사
npm run typecheck  # TypeScript 타입 검사
```

## 🔗 관련 저장소

- **Frontend (현재)**: [lindaleeeee/studio](https://github.com/lindaleeeee/studio)
- **Backend**: Spring Boot API 서버 (별도 관리)

## 📄 라이선스

MIT License

## 👥 기여

이슈와 Pull Request를 환영합니다!
