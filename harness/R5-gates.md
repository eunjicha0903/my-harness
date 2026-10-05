# R5. 게이트

허용값과 이름 규칙은 `projects/<프로젝트>/rules.json`이 SSOT다. 이 문서는 조건의 구조만 정의한다.

## 기계 게이트

| 게이트 | 시점 | 통과 조건 | 실패 시 |
|---|---|---|---|
| G1 | S1 후 | 레퍼런스 `references.minCount`개 이상, 서로 다른 서비스 `references.minDistinctServices`개 이상 | S1 |
| G1 | S1 후 | 반영 항목마다 유저스토리 번호 1개 이상 + 레퍼런스 ID 1개 이상 | S1 |
| G2 | S2 후 | `screens.<화면>.stories`의 번호가 설계 문서에 모두 나옴 | S2 |
| G2 | S2 후 | 화면 상태 목록 1개 이상, `requiredStates`가 있으면 모두 포함 | S2 |
| G5-design | S5 | 아래 디자인 위반 0건 | S4 |
| G5-service ★ | S5 | 아래 서비스 규칙 위반 0건 | S2 |

### G5-design (s4-frames.json 판정)

| 조건 | 위반 |
|---|---|
| 색 | `design.colors` 허용 HEX 외 |
| 글자 크기 | `design.fontSizes` 외 |
| 굵기·폰트 | `design.fontWeights` 외, 또는 `design.fontFamily`가 아닌 폰트 |
| 모서리 | `design.radii` 외 (0 = 모서리 없음) |
| 프레임 | 최상위 프레임이 `design.frame` 크기가 아님 |
| 여백 | x < `sideMargin` 또는 x + 너비 > 375 − `sideMargin` (`marginExemptLayers` 제외) |

### G5-service ★ (story-service.md "어기면 안 되는 것")

이름 규칙: 프레임 `<화면>/<상태>`, 레이어 `btn-order` / `btn-cancel` / `txt-shortfall` / `txt-cancel-deadline`

| 규칙 | 실패 조건 |
|---|---|
| 1. 최소 주문 금액 미달 시 주문 불가 | `cart/min-unmet` 프레임 없음 / 그 안의 `btn-order`가 disabled 아님 / `txt-shortfall` 0개 |
| 2. 배송 준비중 + 배달 1시간 전까지만 취소 | `order-detail/shipping`·`order-detail/delivered`에 disabled 아닌 `btn-cancel` 존재 / `order-detail/preparing`에 `txt-cancel-deadline` 0개 |

## 사람 승인

| 지점 | 빈도 | 거절 시 |
|---|---|---|
| G1 직후 — 반영 항목이 화면 목적·클라이언트 니즈에 맞는지 (작업 흐름 2번의 멈칫) | 매 실행 | S1 |
| S3 후 — 컨셉 시안 확정 | 프로젝트 첫 실행만 | S3 |

## 반복 실패

같은 단계에서 3회 연속 실패하면 중단하고 본인에게 질문한다 (`retry.maxConsecutiveFailures`).
