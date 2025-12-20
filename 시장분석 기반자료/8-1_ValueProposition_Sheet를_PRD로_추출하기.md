# Value Proposition Sheet 를 PRD 로 추출하기

## 🔎 Value Proposition Sheet(VPS) 정의

| 항목 | 작성 힌트 |
| --- | --- |
| 페르소나·CJM 기반 Pain/Needs | 고객 여정에서 **측정 가능한 실패 지표** 동반 |
| JTBD(Goal/Job) | JTBD 선언문 형태(“When… I want to… so I can…”) |
| Desired Outcome | **정량 지표**(시간↓, 오류↓, 승인률↑ 등)로 표현 |
| Value Proposition | Pain→Outcome 사이 **핵심 메커니즘**을 한 문장 |
| Competitor/Substitute | 현사용 툴·프로세스·내부 Excel 포함 |
| Differential Value | **대안 대비 10배 가치** 근거(속도·정확·비용 등) |
| Proof(근거/검증 데이터) | 로그, 인터뷰 발췌, 벤치마크, 시장 통계, 실험 결과 |

---

## 🧩 VPS → PRD 섹션 매핑

| VPS 항목 | PRD 섹션 | 변환 규칙 |
| --- | --- | --- |
| Pain/Needs | 1. 개요·문제 정의, 2. 목표, 7. 범위·제외 | Pain을 **실패 KPI**와 함께 재서술 |
| JTBD(Goal/Job) | 3. 사용자 스토리·수용 기준(AC) | JTBD → Story & **GWT(주어진-언제-그러면)** |
| Desired Outcome | 1. 목표·성공지표, 8. 실험·롤아웃 | Outcome을 **북극성/보조 KPI**로 수치화 |
| Value Proposition | 4. 기능 요구, 6. 인터페이스 개요 | 제안 핵심을 **기능·흐름·API**로 풀기 |
| Competitor/Substitute | 5. 비기능·제약, 7. 리스크 | 대안 대비 **성능/보안/비용** 기준선 설정 |
| Differential Value | 4·5·8 전반 | 차별 포인트를 **임계치·SLO**로 명문화 |
| Proof | 9. 부록(근거 링크), 8. 실험 | 근거/실험 설계·측정 도구 연결(로그·대시보드) |

---

## 🧪 PRD 템플릿 (`Value Proposition Sheet` 대응을 위한 구조!)

```markdown
# [프로덕트 이름 또는 PRD 제목] v0.1
- Owner 팀:
- 최종 업데이트: YYYY-MM-DD

## 1. 개요·목표
- 문제 정의(Pain지표 포함):
- 목표(Desired Outcome 수치화):
- 성공 지표(북극성/보조 KPI):

## 2. 사용자와 페르소나
- 핵심 페르소나 요약 및 여정 Pain·Needs 링크

## 3. 사용자 스토리와 수용 기준(AC, Acceptance Criteria)
- Story: As a <persona>, I want <goal>, so that <outcome>.
- AC: Given / When / Then (수치 포함) × 최소 3개

## 4. 기능 요구사항(Functional)
- MSCW 우선순위와 근거(대안 대비 가치)

## 5. 비기능 요구사항(NFR, Non-Functional Requirement)
- 성능: p95 응답 ≤ ___ ms
- 신뢰성: 월 가용성 ≥ ___%, 오류율 ≤ ___%
- 보안/비용: ___
- 모니터링 항목: 로그·대시보드·알림 기준

## 6. 데이터·인터페이스 개요
- 핵심 엔터티, 주요 필드
- 외부/내부 API 개요(입출력·제약)

## 7. 범위(In/Out), 리스크·가정·의존성
- In/Out 명시
- 리스크(최소 3개), 가정·의존성 -> **중요 설계 의사결정 기록(ADR, Architecture Decision Record)**과 연결

## 8. 실험·롤아웃·측정
- 베타 채널, 실험 가설/측정/성공 기준
- 경쟁 대안 대비 벤치마크 계획

## 9. 근거(Proof)
- 인터뷰/로그/벤치마크/리서치 링크
```

---

## 🤖 AI 프롬프트 세트 (VPS → PRD)

### A. One-shot 변환 (VPS → PRD Draft v0)

> *반드시 여러분의 VPS 를 읽으신 뒤에 아래 프롬프트 샘플을 비즈니스 주제에 맞추어 보강하세요!*
> 

```markdown
당신은 시니어 제품 아키텍트입니다.  
목표: 아래의 Value Proposition Sheet(VPS)를 기반으로 PRD(제품 요구사항 문서)를 작성하세요.  
PRD는 아래 규칙과 구조를 반드시 따르세요.  

---

📘 규칙 (Rules)

1. **Pain/Needs**  
   - 각 Pain과 Needs를 *실패 KPI*와 함께 수치화하세요.  
   - 예: “가입 전환율 30% 미달”, “리텐션 3일 이하 40% 이상”.

2. **JTBD (Jobs-To-Be-Done)**  
   - 각 Job을 *사용자 스토리(Given–When–Then)* 형태로 변환하세요.  
   - 각 스토리에는 최소 3개의 **Acceptance Criteria (AC)** 를 작성하고, 각 AC에 *측정 가능한 임계치*를 포함해야 합니다.  
   - 예: AC1 – 응답 시간 ≤ 1초, 실패율 < 0.5% 등.

3. **Desired Outcome (목표 결과)**  
   - 이를 **북극성 KPI**와 **보조 KPI**로 재구성하세요.  
   - 각 KPI는 기준선·목표값·측정 주기를 명시합니다.

4. **Differential Value (차별 가치)**  
   - 기존 대안 대비 성능/정확도/비용 중 2가지 이상을 수치로 비교하세요.  
   - 예: “기존 서비스 대비 데이터 처리 속도 1.5배 ↑, 비용 20% ↓”.

5. **Proof (검증)**  
   - 각 주장에는 *실험 설계(Design)*와 *측정 도구(Metrics)*를 연결하세요.  
   - 예: “A/B 테스트 (n=500) – KPI: 평균 처리시간(ms), 만족도(5점 척도)”.

---

🎯 출력 (Output)
- 결과물은 **PRD Markdown** 형식으로만 작성합니다.  
- 다음 템플릿에 따라 작성하세요.
```
# [프로덕트 이름 또는 PRD 제목] v0.1
- Owner 팀:
- 최종 업데이트: YYYY-MM-DD

## 1. 개요·목표
- 문제 정의(Pain지표 포함):
- 목표(Desired Outcome 수치화):
- 성공 지표(북극성/보조 KPI):

## 2. 사용자와 페르소나
- 핵심 페르소나 요약 및 여정 Pain·Needs 링크

## 3. 사용자 스토리와 수용 기준(AC, Acceptance Criteria)
- Story: As a <persona>, I want <goal>, so that <outcome>.
- AC: Given / When / Then (수치 포함) × 최소 3개

## 4. 기능 요구사항(Functional)
- MSCW 우선순위와 근거(대안 대비 가치)

## 5. 비기능 요구사항(NFR, Non-Functional Requirement)
- 성능: p95 응답 ≤ ___ ms
- 신뢰성: 월 가용성 ≥ ___%, 오류율 ≤ ___%
- 보안/비용: ___
- 모니터링 항목: 로그·대시보드·알림 기준

## 6. 데이터·인터페이스 개요
- 핵심 엔터티, 주요 필드
- 외부/내부 API 개요(입출력·제약)

## 7. 범위(In/Out), 리스크·가정·의존성
- In/Out 명시
- 리스크(최소 3개), 가정·의존성(ADR 링크)

## 8. 실험·롤아웃·측정
- 베타 채널, 실험 가설/측정/성공 기준
- 경쟁 대안 대비 벤치마크 계획

## 9. 근거(Proof)
- 인터뷰/로그/벤치마크/리서치 링크
```
```

### B. AI 활용 PRD 품질 보강 작업 프롬프트 예시(PRD 리뷰·리라이트)

```markdown
역할(Role): PRD 품질 리뷰어

작업(Task):  
PRD에서 *측정 가능성(measurability)*과 *검증 가능성(testability)*이 부족한 부분을 찾아 수정하세요.  
수정 시에는 구체적인 수치·임계치·측정 경로를 추가하고, 불명확한 문장은 명확한 테스트 단위로 바꾸세요.  

---

✅ 품질 점검 체크리스트

1. **Outcome–KPI 연계**
   - KPI가 수치화되어 있는가?  
   - 기준선·목표·측정 경로가 명시되어 있는가?

2. **Acceptance Criteria(Given-When-Then) 적절성**
   - AC(Acceptance Criteria)가 Given–When–Then 구조인가?  
   - 실패 케이스(예: 예외 처리, 잘못된 입력 등)가 포함되어 있는가?

3. **비기능 요구사항 (NFR)**
   - 성능/보안/가용성 등 임계치가 수치로 정의되어 있는가?  
   - 모니터링 및 알림 기준이 있는가?

4. **Differential Value**
   - 대안 대비 성능/정확/비용 비교가 수치로 제시되어 있는가?

5. **Proof**
   - 검증 항목이 실험 또는 벤치마크와 직접 연결되어 있는가?

---

📄 출력(Output):
- **수정된 섹션만** Markdown 형식으로 다시 작성하세요.  
- 원문 중 수정이 필요한 부분만 리라이트합니다.
```

<aside>
📖

### 문서 보강작업 시 Cursor 활용 꿀팁!

[Cursor Composer1 (Inline Auto Model) 과 Sonet 4 비교](https://www.notion.so/Cursor-Composer1-Inline-Auto-Model-Sonet-4-2aad03212bd480b3ae9ee0c3fed74b88?pvs=21) 

</aside>

<aside>
✅

### PRD 품질 검토 기준 및 패스 조건

| 항목 | 기준 | 패스 조건 |
| --- | --- | --- |
| ***목표·지표*** | ***북극성·보조 KPI 수치화*** | ***기준선·목표·측정 창구 명시*** |
| 스토리·AC (Acceptance Criteria) | Given When Then, SLO 포함 | 실패 케이스 포함 2개 이상 |
| 기능 요구 | MSCW·근거·의존성 | Could 이상 1스프린트 내 구현 가능성 |
| 비기능 | 성능·보안·가용성·비용 | 임계치와 모니터링 항목 명시 |
| 리스크·가정 | ADR, 가정 검증 계획 | 주요 리스크 3개 이상 및 대응책 |
| 범위 | In/Out 명확 | PM 의사결정 충돌 없음 |
</aside>