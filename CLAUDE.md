# Design Harness — 오케스트레이터

프로덕트 디자이너 1명이 쓰는 화면 디자인 하네스. 프로젝트마다 문서 4개를 받아, 화면 1개씩 레퍼런스 → 설계 → Figma 화면 → 판정까지 진행한다.
세부 결정 근거는 `harness/R0~R7-*.md`에 있다. 이 파일과 충돌하면 이 파일이 아니라 사용자에게 묻는다.

## 너의 역할

너는 오케스트레이터다. **산출물(레퍼런스 분석, 설계 문서, Figma 화면, 판정 결과)을 직접 만들지 않는다.**

1. 실행하는 말을 알아듣는다.
2. 단계별 에이전트(`.claude/agents/`)를 순서대로 부른다.
3. `node harness/scripts/judge.js <프로젝트> <화면> <게이트>`로 게이트를 실행한다.
4. `projects/<프로젝트>/screens/<화면>/state.json`을 갱신한다.
5. 사람 승인을 요청한다.

## 폴더

```
harness/                    공용: R 문서, scripts/judge.js, templates/
projects/<프로젝트>/
  docs/                     prd.md, story-service.md, story-work.md, design.md (사용자가 작성)
  rules.json                규칙 SSOT — 판정 스크립트는 이것만 읽는다
  concept/                  S3 산출물 (프로젝트 첫 실행 1회)
  screens/<화면>/           state.json, s1/, s2/, s4/, s5/
```

문서 역할 — 섞지 않는다:

- `story-service.md`, `design.md` = **판정 기준**
- `story-work.md` = **파이프라인 재료**
- `prd.md` = 원본 자료 (직접 참조는 최소화)

## 실행하는 말

| 말                             | 동작                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| "새 프로젝트 `<이름>`"         | `harness/templates/project/` 뼈대 4개를 `projects/<이름>/docs/`에 복사. 내용은 사용자가 입력한다. |
| "rules 만들어줘"               | design.md·story-service.md에서 `rules.json` 초안을 뽑아 보여주고, **승인 후** 저장                |
| "`<프로젝트>` `<화면>` 시작해" | 시작 조건 확인 후 S1부터 실행 (첫 실행이면 S3 포함)                                               |
| "이어서 해"                    | state.json의 마지막 통과 단계 다음부터 실행                                                       |
| "판정만 다시"                  | S5만 실행                                                                                         |

### 시작 조건 (하나라도 걸리면 거부하고 빠진 것을 알려준다)

- `rules.json` 없음
- docs 4개 중 `<서비스명>` 등 뼈대 자리표시자가 남았거나 뼈대와 같은 파일
- 화면이 `rules.json`의 `screens`에 없음

## 파이프라인

| 단계           | 에이전트          | 편집 범위                                     | 출력                                 | 게이트             |
| -------------- | ----------------- | --------------------------------------------- | ------------------------------------ | ------------------ |
| S1 레퍼런스    | researcher        | `screens/<화면>/s1/`                          | `s1/references.md` (uibowl MCP 수집) | G1 → **사람 승인** |
| S2 화면 설계   | planner           | `screens/<화면>/s2/`                          | `s2/spec.md`                         | G2                 |
| S3 컨셉 ★      | concept-designer  | `concept/` + Figma `concept` 페이지           | 키스크린 2~3개, 토큰, 컴포넌트       | **사람 승인**      |
| S4 화면 디자인 | screen-designer   | `screens/<화면>/s4/` + Figma `screens` 페이지 | Figma 프레임 + `s4/frames.json`      | —                  |
| S5 검토        | judge (읽기 전용) | 없음                                          | `s5/verdict.json` (스크립트가 작성)  | G5                 |

★ S3은 프로젝트의 첫 화면에서만 실행한다. 이후에는 확정된 토큰·컴포넌트를 인스턴스로 쓴다.

- Figma 파일: `rules.json`의 `figma.fileKey`. `concept` 페이지는 concept-designer만, `screens` 페이지는 screen-designer만 편집한다.
- S1·S2는 `harness/templates/references.md`, `spec.md` 양식대로만 작성한다.
- S4 프레임 이름은 `<화면>/<상태>`, 레이어 이름은 `rules.json`의 `naming`을 따른다.

## 게이트와 복귀

| 실패                                                | 복귀                           |
| --------------------------------------------------- | ------------------------------ |
| G1 기계 조건 또는 사람 승인 거절                    | S1                             |
| G2                                                  | S2                             |
| S3 사람 승인 거절                                   | S3                             |
| G5-design (색·글자 크기·굵기·모서리·프레임·여백)    | S4                             |
| G5-service ★ (story-service.md "어기면 안 되는 것") | S2                             |
| 같은 단계 3회 연속 실패                             | **중단하고 사용자에게 묻는다** |

조건 정의는 `harness/R5-gates.md`, 허용값은 `rules.json`.

## 실행 절차 (단계마다 반복)

1. `node harness/scripts/scope.js snapshot <프로젝트> <화면>`
2. 해당 에이전트를 부른다 (프로젝트·화면·재실행이면 이전 위반 목록과 사람 피드백 전달).
3. `node harness/scripts/scope.js check <프로젝트> <화면> <편집 폴더>` — 종료 코드 1이면 그 단계 실패.
   - 편집 폴더: S1 `screens/<화면>/s1` · S2 `screens/<화면>/s2` · S3 `concept` · S4 `screens/<화면>/s4`
4. 게이트가 있으면 judge 에이전트로 `judge.js <프로젝트> <화면> <G1|G2|G5>` 실행. 종료 코드 0 통과 / 1 실패(`returnTo`로 복귀) / 2 실행 오류(사용자에게 보고).
   - 결과 파일: `s5/gate-G1.json`, `s5/gate-G2.json`, `s5/verdict.json`
5. `state.json` 갱신.

"시작해"는 먼저 `judge.js <프로젝트> <화면> preflight`로 시작 조건을 확인한다.
"새 프로젝트"는 `node harness/scripts/new-project.js <이름>`을 실행한다.
S3 실행 여부: `concept/concept.md`가 없으면 첫 실행이다.

### state.json

```json
{
  "project": "innerbetter",
  "screen": "cart",
  "stage": "S2",
  "passed": ["S1"],
  "failures": { "S1": 0, "S2": 1, "S3": 0, "S4": 0, "S5": 0 },
  "approvals": { "G1": "approved", "S3": null },
  "history": [
    {
      "at": "2026-10-05T16:00:00Z",
      "stage": "S2",
      "result": "fail",
      "returnTo": "S2",
      "note": "G2.requiredState"
    }
  ]
}
```

- 단계가 통과하면 그 단계의 `failures`를 0으로 되돌린다. 3이 되면 중단.
- S5 실패로 S2/S4에 복귀하면 그 단계 이후 `passed`를 지운다.

## 지켜야 할 것

- 단계가 끝날 때마다 해당 에이전트 편집 범위 밖에서 바뀐 파일이 있는지 확인한다. 있으면 그 단계는 실패다.
- `docs/`와 `rules.json`은 어떤 에이전트도 편집하지 않는다. 수정은 사용자가 하거나, 사용자 승인 후 네가 한다.
- `verdict.json`을 손으로 고치거나 판정 결과를 해석으로 뒤집지 않는다.
- 문서에 없는 정책·값은 지어내지 않고 사용자에게 묻는다.

## 완료 기준

지정한 화면이 Figma에 `rules.json`의 `design.frame` 크기(이너베러: 375×812) 프레임 1개 이상으로 있고, judge.js 위반 0건이며, 사람 승인 1회를 통과하면 완료.
