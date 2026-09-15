---
version: alpha
name: Hanjang
description: >
  한장은 수능·내신 기출을 태블릿에서 한 장씩 푸는 앱이다.
  종이 시험지를 펼친 듯한 지(紙) 표면, 먹 잉크 타이포, 스탬프 레드 한 점.
  FO는 태블릿 시험지, BO는 같은 토큰의 발행 웹이다.
colors:
  paper: "#F3EBDD"
  card: "#FBF6EC"
  choice: "#F7F1E6"
  overlay: "#E7DCC8"
  ink: "#1A1612"
  muted: "#7A7166"
  rule: "#C9BBA3"
  hairline: "#E4D8C4"
  stamp: "#C4563A"
  stamp-pressed: "#A3442E"
  navy: "#1E3A5F"
  choice-on: "#1E3A5F"
  choice-on-text: "#F3EBDD"
  on-paper: "#1A1612"
  success: "#3D6B4F"
  error: "#C4563A"
typography:
  display:
    fontFamily: Noto Serif KR
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.25
  heading:
    fontFamily: IBM Plex Sans KR
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.30
  title:
    fontFamily: IBM Plex Sans KR
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: IBM Plex Sans KR
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-bold:
    fontFamily: IBM Plex Sans KR
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.55
  caption:
    fontFamily: IBM Plex Sans KR
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  year:
    fontFamily: IBM Plex Sans KR
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.30
    letterSpacing: 0.4px
  timer:
    fontFamily: IBM Plex Sans KR
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -0.5px
  passage:
    fontFamily: Noto Serif KR
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.70
  button:
    fontFamily: IBM Plex Sans KR
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.20
rounded:
  stamp: 4px
  cover: 8px
  choice: 10px
  card: 18px
  full: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  section: 40px
components:
  button-grade:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.choice-on-text}"
    typography: "{typography.button}"
    rounded: "{rounded.choice}"
    padding: "14px 20px"
  button-grade-disabled:
    backgroundColor: "{colors.overlay}"
    textColor: "{colors.muted}"
  button-submit:
    backgroundColor: "{colors.overlay}"
    textColor: "{colors.muted}"
    typography: "{typography.button}"
    rounded: "{rounded.choice}"
    padding: "16px 20px"
  button-choice:
    backgroundColor: "{colors.choice}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.choice}"
    padding: "12px 14px"
    border: "1px solid {colors.hairline}"
  button-choice-on:
    backgroundColor: "{colors.choice-on}"
    textColor: "{colors.choice-on-text}"
  list-row:
    backgroundColor: "{colors.paper}"
    border: "0 0 1px {colors.hairline} solid"
    padding: "{spacing.md} {spacing.lg}"
  timer:
    textColor: "{colors.stamp}"
    typography: "{typography.timer}"
  year-label:
    textColor: "{colors.stamp}"
    typography: "{typography.year}"
  badge-number:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.choice-on-text}"
    rounded: "{rounded.stamp}"
    padding: "2px 8px"
  settings-disc:
    backgroundColor: "{colors.overlay}"
    rounded: "{rounded.full}"
    width: 40px
    height: 40px
---

## Overview

한장은 종이 시험지를 태블릿에 펼친 제품이다. 캔버스는 누런 모조지 `{colors.paper}`다. 글자는 먹 `{colors.ink}`다. 신호색은 스탬프 레드 `{colors.stamp}` 하나다. 선택된 선지만 남색 `{colors.navy}`로 뒤집는다.

FO 목록은 카드 그림자가 아니라 가로 규칙선으로 회차를 나눈다. FO 시험지는 왼쪽 지문(세리프), 오른쪽 선지(산세리프). BO는 같은 토큰으로 표와 폼을 짠다.

Inter, 보라 네온, 순흑 `#000000`, 이모지, 3열 동일 카드 그리드는 쓰지 않는다.

## Colors

- **Paper** (`{colors.paper}`): FO·BO 바탕
- **Card** (`{colors.card}`): 표지 옆 면, BO 패널
- **Choice** (`{colors.choice}`): 선지 기본 면
- **Ink** (`{colors.ink}`): 제목·본문
- **Muted** (`{colors.muted}`): 부제, 비활성
- **Rule / Hairline**: 목록·문항 구분선
- **Stamp** (`{colors.stamp}`): 연도, 타이머, 오답. 유일한 강조
- **Navy** (`{colors.navy}`): 고른 선지, 문항 번호 뱃지, 채점 버튼
- **Success** (`{colors.success}`): 정답 표시만

## Typography

| Token | 크기 | 두께 | 용도 |
| --- | --- | --- | --- |
| display | 28 | 700 Noto Serif KR | 목록 헤드 "풀 시험지를 고르세요" |
| passage | 18 | 700 Noto Serif KR | 지문 |
| heading | 22 | 600 IBM Plex Sans KR | 시험 제목 |
| timer | 36 | 600 IBM Plex Sans KR | 남은 시간 |
| body | 16 | 400 IBM Plex Sans KR | 선지, BO 본문 |
| year | 13 | 600 IBM Plex Sans KR | 연도. `{colors.stamp}` |
| button | 15 | 600 IBM Plex Sans KR | 채점·제출 |

숫자(타이머, 문항 번호)는 IBM Plex. 지문만 세리프.

## Layout

- 간격 기본 단위 4px. `{spacing.*}`만 쓴다
- FO 목록: 한 열, 행 높이 표지 72px, 좌 표지 우 제목
- FO 시험지: 태블릿 가로. 지문 pane / 문항 pane. 문항 폭은 `pane-contract.json`
- BO: max-width 1120px, 표 + 폼. 마케팅 히어로 없음
- 터치 타깃 최소 44px

## Elevation & Depth

기본은 평평하다. 그림자로 위계를 만들지 않는다. 위계는 규칙선과 잉크 농도다.

| Level | 처리 | 사용 |
| --- | --- | --- |
| 0 | 그림자 없음, hairline | 목록 행, 선지, BO 표 |
| 1 | 없음 | 호버 카드 금지 |
| overlay | `{colors.overlay}` 원 | 설정 버튼만 |

## Shapes

- 표지 `{rounded.cover}` 8px
- 선지·버튼 `{rounded.choice}` 10px
- 목록 행은 radius 0
- 설정은 원 `{rounded.full}`
- 번호 뱃지 `{rounded.stamp}` 4px

## Components

**목록 행 `list-row`** — 아래 1px hairline. 그림자 없음. 연도는 stamp, 제목은 ink, 부제는 muted.

**선지 `button-choice` / `button-choice-on`** — 기본은 연한 지 면. 선택 시 남색 면 + 연한 글자. 왼쪽 가는 잉크 바.

**채점 `button-grade`** — 남색. 비활성은 overlay.

**제출 `button-submit`** — 기본 muted. 활성일 때만 navy.

**타이머 `timer`** — stamp 색, 36px. 화면에서 가장 큰 산세리프 숫자.

**문항 번호 `badge-number`** — 작은 남색 사각.

**설정 `settings-disc`** — overlay 원, 아이콘 ink.

BO 버튼·인풋은 같은 토큰. 테이블은 hairline. 발행 토글의 on은 navy.

## Do's and Don'ts

### Do

- 종이지 면 `{colors.paper}`를 FO·BO 공통 캔버스로 쓴다
- 강조는 `{colors.stamp}` 한 곳(연도 또는 타이머)
- 목록은 규칙선, 시험지는 2 pane
- 지문은 Noto Serif KR, UI는 IBM Plex Sans KR
- `packages/tokens`가 이 파일의 hex를 유일한 값으로 가진다

### Don't

- Inter, 순흑, 보라 네온, 그라데이션 글자
- 카드 드롭섀도, 글래스, 뉴모피즘
- 목록에서 시험으로 자동 이동하는 UI
- FlatList (FO 목록은 LegendList)
- `style={{}}` (FO는 Unistyles, BO는 토큰 CSS 변수)
- 이모지, "Elevate/Seamless" 카피

## Responsive Behavior

| 구간 | 폭 | FO | BO |
| --- | --- | --- | --- |
| Phone | < 768 | 목록 한 열. 시험지는 세로 스택(지문 위, 선지 아래) | 한 열 폼 |
| Tablet | ≥ 768 | 시험지 가로 2 pane | 표 + 사이드 없음 |
| Desktop | ≥ 1024 | FO 그대로 태블릿 | BO 본문 1120px |

## Agent Prompt Guide

UI를 만들 때 이 파일을 먼저 읽는다. 색은 `{colors.*}`, 타입은 `{typography.*}`만 쓴다.

한장 FO: 종이 시험지. 한장 BO: 같은 지 위에 발행 표.

```
한장 목록 화면을 DESIGN.md 토큰으로 구현해.
종이 배경, 규칙선 행, 연도는 stamp, 타이머 없는 목록.
```

```
한장 시험지 화면. 왼쪽 지문 세리프, 오른쪽 선지, 타이머는 stamp.
pane 폭은 계약 파일. 그림자는 넣지 마.
```
