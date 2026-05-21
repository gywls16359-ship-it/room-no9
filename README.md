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
- `./public/image/` 안의 이미지

그래도 예약·모달이 안 되면 **`npm run dev`** 를 사용하세요.

## 배포

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
| Reservation | 1300px grid | 예약 폼 + 완료 모달 (데모) |

## 디자인

- Primary: `#0C0C0D`, `#161A22`
- Secondary: `#F2C278`, `#C7C9CD`
- Accent: `#8A3E48`, `#F7F7F5`
- Serif: Cormorant Garamond / Sans: Inter
