# R4. 산출물

## 폴더 구조

```
design harness/
├─ CLAUDE.md                  ← 오케스트레이터 (R7)
├─ harness/                   ← 공용: R 문서, 판정 스크립트, 에이전트 정의
└─ projects/
   └─ <프로젝트>/
      ├─ docs/                ← prd.md, story-service.md, story-work.md, design.md
      ├─ rules.json           ← 규칙 SSOT
      ├─ concept/             ← S3 산출물 (첫 실행 1회)
      └─ screens/
         └─ <화면>/           ← 화면 1개 = 폴더 1개
            ├─ state.json
            ├─ s1/
            ├─ s2/
            ├─ s4/
            └─ s5/
```

## 단계별 파일

단계마다 하위 폴더 1개. 각 에이전트는 자기 폴더만 편집한다 (R6).

| 단계 | 파일 | 내용 |
|---|---|---|
| S1 | `screens/<화면>/s1/references.md` | 레퍼런스 목록, 분석, 반영 항목 |
| S2 | `screens/<화면>/s2/spec.md` | 화면 설계 문서 |
| S3 ★ | `concept/concept.md` | 키스크린 Figma 노드 ID, 토큰·컴포넌트 목록 |
| S4 | `screens/<화면>/s4/frames.json` | Figma 프레임 ID와 노드 속성 덤프 |
| S5 | `screens/<화면>/s5/verdict.json` | 위반 목록, 통과/실패 (판정 스크립트가 작성) |

- 판정 스크립트는 Figma를 직접 읽지 않는다. S4 에이전트가 노드 속성(색·글자 크기·굵기·모서리·크기·레이어 이름·상태)을 `s4/frames.json`으로 덤프하고, 스크립트는 이 파일을 판정한다.

## 규칙 SSOT

- 프로젝트마다 `rules.json` 1개. 판정 스크립트는 이 파일만 읽는다.
- design.md 또는 story-service.md를 고치면 rules.json도 함께 고친다. rules.json 수정은 본인 승인 후에만 한다.
- 이너베러 기준 디자인 규칙:

| 항목 | 허용값 |
|---|---|
| 색 HEX | 22개 (Base 1, Violet 10, Green 10, Error 1) |
| 글자 크기 | 12 / 14 / 16 / 18 / 24 |
| 굵기 | 400 / 500 / 600 (Inter) |
| 모서리 | 0 / 6 / 8 / 12 / 14 |
| 프레임 | 375×812, 좌우 여백 20 |

## 이어서 하기

- 화면 폴더마다 `state.json`을 둔다. 오케스트레이터만 편집한다.
  - 현재 단계
  - 단계별 실패 횟수 (3회 연속 실패 시 중단 — R3)
- 다시 실행하면 마지막으로 통과한 단계 다음부터 이어서 한다.
