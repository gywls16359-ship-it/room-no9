# Personal Speakeasy — Landing Page

뉴욕 스피크이지 무드의 맞춤 칵테일 바 랜딩 페이지입니다. PRD/TRD 기준으로 Vite + Vanilla HTML/CSS/JS로 구성했습니다.

## 실행 (필수)

이 프로젝트는 **Vite** 로 실행해야 합니다. `index.html`을 Live Server로 직접 열면 동작하지 않습니다.

```bash
npm install
npm run dev
```

브라우저가 자동으로 `http://localhost:5173` 을 엽니다.  
포트가 다르면 터미널에 표시된 주소를 사용하세요.

### Live Server를 쓰고 싶다면

프로젝트 **루트 폴더**에서 `index.html`을 연 뒤, 아래가 모두 로드되는지 확인하세요.

- `./src/styles/main.css`
- `./public/reservation.js`
- `/image/` 안의 이미지

그래도 예약·모달이 안 되면 **`npm run dev`** 를 사용하세요.

## Supabase 예약 연동

1. [Supabase](https://supabase.com) 프로젝트를 생성합니다.
2. **SQL Editor**에서 `supabase/migrations/001_reservations.sql` 전체를 실행합니다.
3. 프로젝트 루트에 `.env` 파일을 만들고 `.env.example`을 참고해 값을 채웁니다.

| 변수 | 설명 |
|------|------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase **anon** 공개 키 |

4. `npm run dev`로 서버를 **재시작**한 뒤 예약 폼을 테스트합니다.

저장 컬럼: `name`, `contact`, `date`, `time`, `people`, `memo`, `order_categories`(배열), `order_items`(배열)

## 배포 (Vercel · 프로젝트 landingpage)

1. Vercel 프로젝트 **Root Directory**가 이 폴더(`랜딩페이지`)를 가리키는지 확인합니다. (저장소 루트가 이 프로젝트면 비워 두면 됩니다.)
2. **Settings → Environment Variables** (Production)에 추가 후 Redeploy:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. 환경 변수가 없어도 `public/reservation.js` 기본값으로 동작합니다. (나중에 Supabase 프로젝트를 바꾸면 `.env`와 `reservation.js`의 기본값을 함께 수정하세요.)

```bash
npm run build
```

`dist` 폴더가 정적 배포 산출물입니다.

## 페이지 구조

| 섹션 | 레이아웃 | 설명 |
|------|----------|------|
| Hero | Full-width | 메인/서브 카피 |
| Mood | Full-width | 스피크이지 무드 문구 |
| Service Flow | Full-width 3-cut | 키워드 → 제조 → 완성 |
| Info | 1300px grid | 핵심 가치 제안 |
| Reservation | 1300px grid | Supabase 예약 저장 |

## 디자인

- Primary: `#0C0C0D`, `#161A22`
- Secondary: `#F2C278`, `#C7C9CD`
- Accent: `#8A3E48`, `#F7F7F5`
- Serif: Cormorant Garamond / Sans: Inter
