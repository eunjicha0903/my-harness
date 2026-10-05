# Concept — innerbetter (S3)

- 실행: 2026-10-05, 첫 화면 `cart` (spec: `screens/cart/s2/spec.md`)
- Figma 파일: `wsd2HEsLTV74mUSucqjHVF` — https://www.figma.com/design/wsd2HEsLTV74mUSucqjHVF/?node-id=18-2
- 근거 문서: `docs/design.md`, `rules.json` (`design`, `naming`). 이 두 문서에 없는 값은 아래 [확인 필요]에 적었다.

## Figma 페이지 / 영역

| 이름 | 노드 ID | 내용 |
|---|---|---|
| `concept` (페이지) | `18:2` | S3 전용 페이지 (기존 `Page 1`(0:1)은 건드리지 않음) |
| `concept/components` | `19:2` | 컴포넌트 보드 (x 0, y 0) |
| `concept/tokens` | `20:135` | 색·글자·모서리 견본 보드 (x 0, y 1400) |

## 키스크린 (375×812 = rules.json `design.frame`)

| 이름 | 노드 ID | 기준 | btn-order 인스턴스 |
|---|---|---|---|
| `key/cart/min-unmet` | `20:7` | spec.md 상태 min-unmet | `20:69` → bottom-button `type=default, state=disabled` |
| `key/cart/min-met` | `20:71` | spec.md 상태 min-met | `20:133` → bottom-button `type=min-order-reached, state=enabled` |

구조 (두 프레임 공통, 위→아래): `bg` / `status-bar`(46) / `top-bar`(60) / `content`(x 20, 폭 335: `cart-item`×2 → `divider` → `summary`) / `bottom-area`(하단 고정, 높이 139).
- min-unmet `bottom-area`: `txt-shortfall` "{부족 금액}원 더 담아야 주문할 수 있어요" + 기준값 `{최소 주문 금액}원` + `progress`(60% 채움, 예시 비율) + 총 결제 금액 + `btn-order`(disabled)
- min-met `bottom-area`: `txt-min-met` "최소 주문 금액을 채웠어요" + `progress`(100%) + 총 결제 금액 + `btn-order`(enabled, "{최종 결제 금액}원 주문하기")
- 이미지 자리: `img` 사각형, `violet/light` (#F3F3F4), radius 8.
- 레이어 이름: rules.json `naming.layers`의 `btn-order`, `txt-shortfall` 사용. `bg`, `status-bar`, `top-bar`, `bottom-area`는 `marginExemptLayers`. 그 외 노드는 x 20~355 안에 있다.
- 금액은 모두 `{ }` 자리표시자 (spec.md와 동일).

## 변수 (Variables) — 4개 컬렉션, 39개 변수

모든 컬렉션은 모드 1개(`value`). 모든 변수에 scope와 WEB code syntax(`var(--…)`)를 지정.

### `color` (VariableCollectionId:18:3) — 22개, scope: FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR

| 변수 | 값 | ID |
|---|---|---|
| violet/light | #F3F3F4 | VariableID:18:4 |
| violet/light-hover | #EDEDEE | VariableID:18:5 |
| violet/light-active | #DADADB | VariableID:18:6 |
| violet/normal | #89878C | VariableID:18:7 |
| violet/normal-hover | #7B7A7E | VariableID:18:8 |
| violet/normal-active | #6E6C70 | VariableID:18:9 |
| violet/dark | #676569 | VariableID:18:10 |
| violet/dark-hover | #525154 | VariableID:18:11 |
| violet/dark-active | #3E3D3F | VariableID:18:12 |
| violet/darker | #302F31 | VariableID:18:13 |
| green/50 | #FDFDF0 | VariableID:18:14 |
| green/100 | #F8F9C1 | VariableID:18:15 |
| green/200 | #F5F6BB | VariableID:18:16 |
| green/300 | #F0F29C | VariableID:18:17 |
| green/400 | #EDF089 | VariableID:18:18 |
| green/500 | #E9EC6B | VariableID:18:19 |
| green/600 | #D4D761 | VariableID:18:20 |
| green/700 | #A5A84C | VariableID:18:21 |
| green/800 | #80823B | VariableID:18:22 |
| green/900 | #62632D | VariableID:18:23 |
| base/white | #FFFFFF | VariableID:18:24 |
| error/error | #FF0000 | VariableID:18:25 |

### `radius` (VariableCollectionId:18:26) — 5개, scope: CORNER_RADIUS

radius/0 (18:27), radius/6 (18:28), radius/8 (18:29), radius/12 (18:30), radius/14 (18:31)

### `typography` (VariableCollectionId:18:32) — 9개

- font-size/12, 14, 16, 18, 24 (VariableID:18:33~18:37), scope FONT_SIZE
- font-weight/400, 500, 600 (VariableID:18:38~18:40), scope FONT_WEIGHT
- font-family/base = "Inter" (VariableID:18:41), scope FONT_FAMILY — 값만 기록, 텍스트에 바인딩하지 않음 (아래 [확인 필요] 1)

### `layout` (VariableCollectionId:18:42) — 3개

frame/width = 375 (18:43), frame/height = 812 (18:44), spacing/side-margin = 20 (18:45, scope GAP)

## 텍스트 스타일 — 15개

역할 5개(design.md 3. Typography) × 굵기 3개(400/500/600). 이름 `<역할>/<크기>-<굵기>`. 줄 높이는 Auto, 자간 0%.
글꼴은 **Inter** (rules.json `fontFamily`): 400 → Regular, 500 → Medium, 600 → Semi Bold. concept 페이지의 TEXT 노드 131개는 모두 이 스타일에 연결되어 있다.

large-title/24-{400,500,600}, section-title/18-{400,500,600}, label/16-{400,500,600}, body/14-{400,500,600}, caption/12-{400,500,600}

## 컴포넌트 — 7개 (단일 4 + 세트 3, 변형 16)

모든 채움·모서리는 위 변수에 바인딩.

| 컴포넌트 | 노드 ID | 변형 / 속성 | 근거 (design.md 5) |
|---|---|---|---|
| `quantity-stepper` | `19:5` | TEXT `quantity` | 원형 −/+ 버튼 쌍, radius 6. 박스 `violet/dark-active`, 버튼 `violet/dark-hover`, 글자 `base/white` |
| `list-item-dark` | `19:13` | TEXT `label`, 내부 quantity-stepper 인스턴스 | 라벨 + 스테퍼, radius 6, 배경 `violet/darker` |
| `banner` | `19:23` | TEXT `text` | 그린 컬러 블록 + 상태 문구, radius 8, `green/500` |
| `toast` (세트) | `19:31` | `type=primary` `19:27` / `type=secondary` `19:29`, TEXT `text` | primary/secondary, radius 8 |
| `bottom-button` (세트) | `19:54` | `type` × `state` 10개 (아래) | 하단 버튼 변형, radius 8 |
| `modal` (세트) | `19:87` | `subtitles=1, buttons=1` `19:57` / `subtitles=1, buttons=2` `19:63` / `subtitles=2, buttons=1` `19:71` / `subtitles=2, buttons=2` `19:78` | 부제 1~2 × 버튼 1~2, radius 12 |
| `product-card` | `19:90` | TEXT `name`, `price` | 162×162 이미지(radius 8) + 우하단 원형 추가 버튼 + 상품명 2줄 + 가격 |

### bottom-button 변형

`state` = `enabled` (bg `green/500`, 글자 `violet/darker`) / `disabled` (bg `violet/light-active`, 글자 `violet/normal`). 서비스 규칙 R1: `cart/min-unmet`의 `btn-order` 인스턴스는 `state=disabled`.

| type | enabled | disabled | 기본 라벨 |
|---|---|---|---|
| default | 19:34 | 19:36 | 주문하기 |
| min-order-reached | 19:38 | 19:40 | {최종 결제 금액}원 주문하기 |
| payment-reached | 19:42 | 19:44 | {결제 금액}원 결제하기 |
| payment-not-reached | 19:46 | 19:48 | 결제하기 |
| checkout | 19:50 | 19:52 | 결제하기 |

design.md의 "active / disabled"는 `state`로, 나머지 4개(minimum order reached / payment amount reached / payment not reached / checkout)는 `type`으로 옮겼다. 라벨은 인스턴스에서 텍스트를 덮어써서 바꾼다.

## [확인 필요]

1. **폰트**: 2026-10-05 사용자 결정에 따라 Pretendard 대신 **Inter**를 쓴다 (design.md·rules.json 갱신됨). 처음 만들 때 임시로 쓴 42dot Sans는 텍스트 스타일 15개, TEXT 노드 131개, 변수 `font-family/base`에서 모두 Inter로 바꿨다. 검증 결과 Inter가 아닌 스타일·텍스트는 0건이다. 남은 주의점이 하나 있다. Inter에는 한글 글리프가 없어서 화면의 한글은 Figma/OS 대체 글꼴로 보인다. 판정 기준인 fontName은 Inter다.
2. **역할별 굵기**: design.md는 크기별 역할과 허용 굵기(400/500/600)만 정하고, 역할마다 어떤 굵기를 쓰는지는 정하지 않았다. 그래서 15개 조합을 모두 만들었다. 키스크린에서 쓴 조합(제목 18-600, 버튼 16-600, 본문 14-400/500/600, 캡션 12-400)은 임시로 고른 것이다.
3. **줄 높이·자간**: 문서에 없다. Auto로 두었다.
4. **컴포넌트 치수**: 문서에 없는 크기는 임시로 정했다. 하단 버튼 335×52, 스테퍼 원형 버튼 28×28, list-item-dark 335 폭, toast 335×44, modal 폭 315·패딩 24·버튼 높이 48, 장바구니 상품 이미지 72×72, 진행 막대 높이 6. 안쪽 여백·간격(4/8/10/12/16/20/24)도 정해진 값이 없다.
5. **원형 버튼 표현**: design.md는 스테퍼와 상품 카드 추가 버튼을 "원형"으로 정했지만, 허용 radius(0/6/8/12/14)에는 원형 값이 없다. 28×28 + radius 14로 원을 만들었다. radius 14는 원래 "큰 섹션" 용도라서 의미가 맞지 않는다. 별도 규칙이 필요한지 결정해야 한다.
6. **컴포넌트 색 배정**: design.md는 팔레트만 주고 컴포넌트별 색은 일부만 정했다. 아래는 임시로 정했다.
   - 스테퍼 박스 `violet/dark-active`, 버튼 `violet/dark-hover`
   - list-item-dark `violet/darker`
   - toast secondary `violet/darker` + 흰 글자
   - 하단 버튼 disabled `violet/light-active` + `violet/normal`
   - 모달 보조 버튼 `violet/light`
   - 상품 카드 추가 버튼 흰 배경
   - 진행 막대 트랙 `violet/light-active`, 채움 `green/500`
7. **bottom-button type 변형의 시각 차이**: "minimum order reached / payment amount reached / payment not reached / checkout"이 버튼만 다른지, 하단 영역 전체(문구·막대 포함, 높이 92~146)가 다른지 문서에 없다. 지금은 라벨만 다르다. 라벨 문구 중 "결제하기" 계열은 임시로 정했다.
8. **취소 버튼(btn-cancel)**: rules.json R2(order-detail)가 `btn-cancel`의 `state`를 검사하지만, design.md 5. Components에 취소 버튼이 없어서 만들지 않았다. bottom-button을 쓸지, 새 컴포넌트를 둘지 결정해야 한다.
9. **아이콘**: 뒤로가기는 벡터 선, 삭제는 "×", 스테퍼는 "−/+" 글자로 표현했다. 아이콘 세트는 문서에 없다.
10. **하단 영역 높이·홈 인디케이터 여백**: design.md는 92~146px 범위만 준다. 키스크린 bottom-area는 139px이고, 아래쪽 안전 영역은 따로 두지 않았다.
11. **진행 막대 채움 비율**: min-unmet의 60%는 예시값이다. 최소 주문 금액 값과 비교 기준은 spec.md [확인 필요] 1·2에서 이어진다.
12. **그림자**: design.md에 "확인 불가"로 되어 있어서 그림자 스타일은 만들지 않았다.
