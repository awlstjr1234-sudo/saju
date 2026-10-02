# CLAUDE.md

이 파일은 VS Code의 Claude Code 확장이 이 저장소에서 작업할 때 참고하는 컨텍스트입니다.

## 프로젝트 개요

생년월일로 사주팔자를 풀이하고, 오늘의 운세와 타로점을 볼 수 있는 오락용 웹앱입니다.
로그인, 결과 저장, 공유 링크 같은 기능은 없습니다 — 입력 → 즉시 계산 → 화면 표시가 전부입니다.

- Next.js 15 (App Router, TypeScript)
- 배포: Vercel + GitHub 연동(main 브랜치 push 시 자동 배포)
- 데이터베이스 없음 (서버에 저장하는 것이 아무것도 없음)

자세한 설정/배포 절차는 `README.md` 참고.

## 아키텍처 원칙 (바꿀 때 지켜야 할 것)

- **계산 로직은 순수 함수로, `src/lib/*.ts`에 둡니다.** `saju.ts`(사주), `dailyFortune.ts`(오늘의 운세),
  `tarot.ts`(타로), `random.ts`(시드 난수)로 나뉘어 있고, 전부 브라우저에서 실행됩니다.
  UI 컴포넌트(`src/components/*Panel.tsx`)는 이 함수들을 호출해 상태에 담고 렌더링만 합니다.
- **서버/DB 연동을 다시 추가하지 마세요.** 이전에 Supabase로 "결과 공유 링크" 기능을 넣었다가
  사용자 요청으로 제거했습니다. 저장/공유/로그인 관련 기능은 사용자가 명시적으로 다시 요청하기 전까지
  추가하지 않습니다.

## 콘텐츠(텍스트) 위치

디자인/레이아웃을 건드리지 않고 문구만 수정하거나 늘리고 싶을 때 볼 위치:

- 일간(日干) 성격 해설: `src/lib/saju.ts`의 `DAYMASTER_TEXT`
- 오행 균형 해설: `src/lib/saju.ts`의 `EL_TRAIT`, `elementalInsight()`
- 오늘의 운세 문구: `src/lib/dailyFortune.ts`의 `MSG`, `RELATION_INFO`
- 타로 카드 뜻풀이: `src/lib/tarot.ts`의 `MAJOR`(메이저 22장), `MINOR_RANKS`(마이너 순위별 공통 해설)

## 자주 쓰는 명령

```bash
npm run dev     # 로컬 개발 서버
npm run build   # 프로덕션 빌드 (타입 체크 포함)
npm run lint    # ESLint
```

## 레거시

`legacy-static/`에 있던 원래의 단일 HTML(index.html) 버전은 참고용으로만 남겨둔 것이고, 더 이상
유지보수 대상이 아닙니다. 새 기능은 `src/` 아래 Next.js 코드에 추가하세요.
