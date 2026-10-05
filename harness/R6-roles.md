# R6. 역할

## 에이전트와 편집 범위

각 에이전트는 자기 편집 폴더만 쓰고, 나머지는 읽기만 한다.

| 에이전트 | 단계 | 편집 범위 |
|---|---|---|
| researcher | S1 | `screens/<화면>/s1/` |
| planner | S2 | `screens/<화면>/s2/` |
| concept-designer | S3 ★ | `concept/` + Figma `concept` 페이지 |
| screen-designer | S4 | `screens/<화면>/s4/` + Figma `screens` 페이지 |
| judge | S5 | 편집 없음 (읽기 전용) |
| 오케스트레이터 (CLAUDE.md) | 전체 | `screens/<화면>/state.json`, 새 프로젝트 뼈대 |

- `docs/`와 `rules.json`은 어떤 에이전트도 편집하지 않는다. 수정은 본인이 하거나 본인 승인 후 오케스트레이터가 한다.

## 판정자 (읽기 전용)

- 판정은 Node.js 스크립트 `harness/scripts/judge.js`가 한다.
- judge 에이전트는 읽기 도구와 스크립트 실행만 쓴다.
- `s5/verdict.json`은 스크립트가 쓴다. 판정자는 결과를 고칠 수 없다.

## Figma 편집 범위

| 페이지 | 내용 | 편집 |
|---|---|---|
| `concept` | 키스크린, 토큰(변수), 컴포넌트 원본 | concept-designer만 |
| `screens` | 화면별 프레임 (`<화면>/<상태>`) | screen-designer만, 컴포넌트는 인스턴스로만 사용 |

## 실행하는 말

| 이렇게 말하면 | 하는 일 |
|---|---|
| "새 프로젝트 `<이름>`" | `projects/<이름>/` 폴더와 문서 4개(prd, story-service, story-work, design)를 `harness/templates/project/`의 뼈대(제목·표 틀)를 복사해서 만든다. 내용은 본인이 직접 입력한다. |
| "`<프로젝트>` `<화면>` 시작해" | 그 화면을 S1부터 실행 (프로젝트 첫 실행이면 S3 포함) |
| "이어서 해" | state.json을 보고 멈춘 단계부터 다시 실행 |
| "판정만 다시" | S5만 다시 실행 |
