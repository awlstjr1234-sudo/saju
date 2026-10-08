# 사주 · 타로 · 오늘의 운세 (Next.js)

생년월일로 사주팔자를 풀이하고, 오늘의 운세와 타로점(직접 선택하는 오늘의 카드 / 3장 스프레드)을 볼 수 있는 웹앱입니다.
로그인도, 결과 저장/공유 기능도 없습니다 — 입력하면 그 자리에서 계산해서 보여주는 것으로 끝입니다.

- **프론트엔드**: Next.js 15 (App Router, TypeScript)
- **배포**: Vercel + GitHub 연동

기존에 있던 순수 HTML/JS 버전은 `legacy-static/`에 참고용으로 남겨뒀습니다(실제 서비스에는 사용하지 않음).


## 폴더 구조

```
src/
  app/
    page.tsx           # 메인 화면 (탭: 사주풀이 / 오늘의 운세 / 타로)
    layout.tsx         # 공통 레이아웃 + 폰트
    globals.css        # 전체 스타일
  components/          # 화면 조각들 (입력 폼, 결과 뷰, 타로 카드)
    TarotArtwork.tsx   # 라이더-웨이트 타로 카드 이미지 표시
  lib/
    saju.ts             # 사주팔자 계산 + 일간/오행 해설 텍스트
    dailyFortune.ts     # 띠 + 오늘 일진 합충형 기반 오늘의 운세
    tarot.ts            # 78장 타로 덱 + 카드 해설
    random.ts           # 시드 기반 난수와 카드 섞기
public/tarot/           # 라이더-웨이트 타로 78장 이미지
```

사주/오늘의 운세/타로 계산 로직은 전부 순수 함수(`lib/*.ts`)라서 별도 서버나 DB 없이 브라우저에서
바로 실행됩니다.
태어난 시간은 `1914`처럼 숫자 네 자리만 입력해도 `19:14`로 자동 표시되고, 타로는 펼쳐진 카드 중 직접 선택합니다.
타로 이미지는 퍼블릭 도메인 라이더-웨이트-스미스 덱을 사용하며, 자세한 출처는
[`public/tarot/CREDITS.md`](./public/tarot/CREDITS.md)에 있습니다.


## 1. 로컬 개발

```bash
npm install
npm run dev
```

`http://localhost:3000` 접속하면 바로 사용할 수 있습니다. 별도 환경변수 설정이 필요 없습니다.


## 2. Vercel + GitHub로 배포

1. 이 프로젝트를 GitHub 저장소에 push 합니다.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com)에서 **Add New → Project**로 방금 만든 GitHub 저장소를 가져옵니다.
   Framework Preset은 Next.js가 자동으로 잡히고, 환경변수 설정 없이 바로 Deploy할 수 있습니다.
3. 이후 `main` 브랜치에 push할 때마다 Vercel이 자동으로 다시 빌드/배포합니다(GitHub 연동 기본 동작).


## 3. VS Code + Claude Code로 이어서 개발하기

- VS Code에서 이 폴더(`Saju`)를 열고 Claude Code 확장을 사용하면 됩니다.
- 프로젝트 맥락은 `CLAUDE.md`에 정리해뒀습니다 (구조, 규칙, 자주 건드릴 파일 위치).
- 텍스트 콘텐츠(일간 해설, 타로 카드 뜻풀이, 운세 문구 등)는 전부 `src/lib/*.ts` 안의 데이터 객체라서,
  디자인/레이아웃 코드를 건드리지 않고도 내용만 늘리거나 수정하기 쉽습니다.


## 알려진 제한 사항

- 만세력 계산은 근사 구현으로, 절기 기준일이 연도별로 최대 하루 정도 오차가 있을 수 있고 음력 생일·자시
  경계 등은 단순화되어 있습니다.
- `npm audit` 결과 Next.js가 내부적으로 번들링하는 `postcss`에 대한 낮은 실사용 위험도의 취약점 알림이
  하나 남아 있습니다(빌드 도구 자체의 이슈로, 이 프로젝트에는 악용 경로가 없습니다). Next.js가 이후
  버전에서 postcss를 올리면 함께 해결됩니다.
