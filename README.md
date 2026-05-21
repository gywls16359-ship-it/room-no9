# Personal Speakeasy — Landing Page

뉴욕 스피크이지 무드의 맞춤 칵테일 바 랜딩 페이지입니다. PRD/TRD 기준으로 Vite + Vanilla HTML/CSS/JS로 구성했습니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 을 엽니다.

## Supabase 예약 연동

1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 `supabase/migrations/001_reservations.sql` 을 실행합니다. (이미 예전 스키마를 썼다면 `002_reservations_add_contact_memo.sql` 도 실행)
3. 테이블 `reservations` 컬럼: `name`, `contact`, `date`, `time`, `people`, `memo`, `order_category`, `order_items`, `created_at`
4. 프로젝트 루트에 `.env` 파일을 만들고 `.env.example` 내용을 참고해 값을 채웁니다.

5. 개발 서버를 재시작한 뒤 예약 폼을 테스트합니다.

## 배포 (Vercel)

프로젝트 **Settings → Environment Variables**에 아래를 추가합니다.

| 이름 | 값 |
|------|-----|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon 키 |

저장 후 **Redeploy** 하면 빌드 시 `src/config.js`가 환경 변수를 읽습니다.

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
| Reservation | 1300px grid | Supabase insert 예약 |

## 디자인

- Primary: `#0C0C0D`, `#161A22`
- Secondary: `#F2C278`, `#C7C9CD`
- Accent: `#8A3E48`, `#F7F7F5`
- Serif: Cormorant Garamond / Sans: Inter
