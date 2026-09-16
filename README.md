# 한장-fe

시험지 한 장을 골라 시간 안에 푸는 서비스, 한장의 프론트엔드 모노레포.
pnpm workspace로 수험생 앱(FO)과 운영 웹(BO)을 함께 관리한다.

## 구조

```text
apps/hanjang-fo       Expo 57 / React Native — 수험생 모바일 앱
apps/hanjang-bo       Vite 8 / React — 운영 백오피스 웹
packages/api          @hanjang/api — 공유 REST 클라이언트 (effect, ky)
packages/tokens       @hanjang/tokens — 디자인 토큰
```

| 앱 | 역할 | 주요 화면 |
| --- | --- | --- |
| `hanjang-fo` | 시험·퀴즈·복습·북마크 | 홈, 시험, 퀴즈 플레이, 결과, 복습, 자료실, 마이 |
| `hanjang-bo` | 문제지·퀴즈·관리자 운영 | 로그인, 시험 목록/생성/상세, 퀴즈 관리, admin 초대 |

백엔드는 별도 저장소 [`hanjang-be`](https://github.com/hanjang-dot/hanjang-be) (NestJS + Drizzle + Postgres). FO는 `http://localhost:5500`의 REST를 호출한다.

## 스택

| 영역 | FO | BO |
| --- | --- | --- |
| UI | React 19, React Native 0.86, Expo 57 | React 19, Vite 8 |
| 라우팅 | Expo Router | TanStack Router |
| 데이터 | TanStack Query, ky | TanStack Query, ky |
| 상태 | zustand | zustand |
| 스타일 | react-native-unistyles | CSS + `@hanjang/tokens` |
| 번들러 | Metro | Vite |

공통: TypeScript `^5.6`, Effect, `@hanjang/api`를 통한 계약 공유.

## 시작하기

요구사항: Node.js 24, pnpm, iOS는 Xcode / Android는 Android Studio.

```bash
pnpm install
pnpm --filter hanjang-fo start      # Expo dev server
pnpm --filter hanjang-fo ios        # iOS dev build
pnpm --filter hanjang-fo android    # Android dev build
pnpm --filter hanjang-bo dev        # Vite dev server
```

> [!NOTE]
> 카카오 로그인 등 네이티브 설정이 필요한 기능은 Expo Go가 아닌 development build에서 동작한다.

## A/B 실험

FO에 자체 실험 인프라(`features/experiments`)가 있다.

- `useExperiment(key)` — 디바이스 해시 기반 A/B 배정, zustand persist로 고정
- `trackExperimentEvent(key, 'exposure' | 'conversion')` — `POST /experiments/events`로 전송, 오프라인은 무시
- 진행 중 실험: `quizResultCta`, `homeStartCta`, `reviewPrompt`, `examTimer`

## 검증

```bash
pnpm --filter hanjang-fo typecheck   # tsc --noEmit
pnpm --filter hanjang-fo test        # node --test scripts/*.test.ts
pnpm --filter hanjang-bo typecheck
pnpm --filter hanjang-bo build
pnpm lint
pnpm --filter hanjang-bo test:e2e    # Maestro web flows (BO_URL 필요)
```
