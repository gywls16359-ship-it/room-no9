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
4. `src/config.example.js`를 복사해 `src/config.js`를 만들고 Supabase URL·anon 키를 넣습니다. (이미 연결된 프로젝트 값이 들어가 있으면 생략 가능)

5. 개발 서버를 재시작한 뒤 예약 폼을 테스트합니다.

> `src/config.js`는 `.gitignore`에 포함되어 있습니다. GitHub 등에 키가 올라가지 않도록 주의하세요.

## 배포

Vercel 또는 Netlify에 연결하고, 동일한 환경 변수를 설정합니다.

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
