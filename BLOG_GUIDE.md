# 사라요가 블로그 가이드

## 1. 파일 구조

```
sarayoga-site/
├── index.html          ← 메인 페이지
├── admin.html          ← 관리자 대시보드 (비밀번호: sara2026)
├── blog/
│   ├── index.html      ← 블로그 목록 페이지
│   ├── posts.json      ← 글 데이터 (단일 소스)
│   └── [slug].html     ← 개별 포스트 페이지
└── images/blog/pool/   ← 이미지 풀
```

---

## 2. posts.json 구조

```json
{
  "slug": "서대전-플라잉요가-초보가이드",
  "title": "서대전 플라잉요가 초보 가이드 — 겁 많아도 괜찮아요",
  "category": ["수업소개", "요가입문"],
  "date": "2026.04.08",
  "summary": "한 줄 요약 (블로그 목록 카드에 표시)",
  "tags": ["대전플라잉요가", "서대전요가", "플라잉요가초보", "사라요가"],
  "thumbnail": "../images/blog/pool/flying-해먹동작.jpg",
  "pinned": true
}
```

### category (카테고리)

| 값 | 용도 |
|---|---|
| `수업소개` | 프로그램별 가이드 (플라잉, 빈야사, 도구테라피 등) |
| `요가입문` | 초보자 입문 콘텐츠 |
| `중급수련` | 심화·교정 수련 (얼라인먼트 등) |
| `안내` | 체험수업·요금·공지 |
| `기타` | 그 외 |

- 최대 2개 배열로 지정: `["수업소개", "요가입문"]`
- 단일 카테고리도 배열로: `["안내"]`

### pinned

`true`이면 블로그 목록 최상단 고정 + "고정" 배지 표시.

---

## 3. 블로그 포스트 HTML 구조

### 네비게이션 (고정 투명 → 스크롤 시 불투명)

```html
<nav class="nav" id="nav">
  <div class="nav-inner">
    <a class="nav-brand" href="../">SARA YOGA</a>
    <div class="nav-links">
      <a class="nav-link" href="../#programs">수업</a>
      <a class="nav-link" href="../#schedule">시간표</a>
      <a class="nav-link active" href="../blog/">블로그</a>
      <a class="nav-link nav-cta" href="../#contact">문의</a>
    </div>
  </div>
</nav>
```

### 포스트 히어로

```html
<section class="post-hero">
  <div class="post-hero-bg" style="background-image:url('../images/blog/pool/[이미지].jpg')"></div>
  <div class="post-hero-overlay"></div>
  <div class="post-hero-content">
    <div class="post-hero-meta">
      <span class="post-hero-cat">수업소개</span>
      <span class="post-hero-cat">요가입문</span>
    </div>
    <h1 class="post-hero-title">[제목]</h1>
    <div class="post-hero-date">[날짜]</div>
  </div>
</section>
```

### 관련 글 섹션 (자동 생성)

```html
<section class="blog-related">
  <h3>관련 글 더 보기</h3>
  <div class="related-grid">
    <!-- 4개 카드 -->
  </div>
  <a href="../blog/" class="related-all-link">블로그 전체 보기 →</a>
</section>
```

### 푸터

```html
<footer class="site-footer">
  ...
  <a href="../admin.html" style="...">sarayoga_gogossing</a>
  <div class="ft-copy">© 2023–2026 Sara Yoga Studio</div>
</footer>
```

---

## 4. 새 글 추가 절차

1. **posts.json에 항목 추가** (최신 날짜 기준 정렬 불필요 — JS가 date 기준 정렬)
2. **blog/[slug].html 파일 생성** — 기존 포스트 복사 후 수정
3. **update_all.py 실행** — 관련 글 재생성 + 카테고리 배지 업데이트
   ```bash
   cd /c/vs/sarayoga-site
   python3 update_all.py
   ```
4. **git push**

---

## 5. 이미지 풀 (`images/blog/pool/`)

| 파일 | 용도 |
|---|---|
| `flying-해먹동작.jpg` | 플라잉요가 |
| `flying-하이플라잉콜라주.jpg` | 플라잉요가 |
| `flying-하이플라잉수업.jpg` | 플라잉요가 |
| `flying-소그룹수업.jpg` | 플라잉/소그룹 |
| `insideflow-팔동작앉기.jpg` | 인사이드플로우 |
| `insideflow-선데이클래스.png` | 인사이드플로우 |
| `insideflow-명상시작.jpg` | 인사이드플로우 |
| `vinyasa-전사자세.jpg` | 빈야사 |
| `vinyasa-밸런스동작.jpg` | 빈야사 |
| `therapy-도구클로즈업.jpg` | 도구테라피/블랙롤 |
| `therapy-요가링스트레칭.jpg` | 도구테라피 |
| `group-소그룹수업.jpg` | 소그룹/일반 |
| `group-명상앉기.jpg` | 명상/안내 |
| `group-이완자세.jpg` | 이완/서포트 |
| `group-사바아사나교정.jpg` | 교정 |
| `hatha-브릿지자세.jpg` | 하타플로우 |
| `hatha-서서팔올리기.jpg` | 하타플로우 |
| `instructor-핸즈온교정.jpg` | 얼라인먼트/교정 |
| `instructor-수업지도.jpg` | 수업 일반 |
| `studio-전경.jpg` | 스튜디오 (사람X, 히어로용) |
| `studio-전경2.jpg` | 스튜디오 (사람X, 히어로용) |
| `studio-인테리어.jpg` | 스튜디오 (사람X, 히어로용) |
| `studio-꽃.jpg` | 스튜디오 (사람X, 히어로용) |

포스트 thumbnail 경로: `../images/blog/pool/[파일명]` (blog/ 기준 상대경로)

---

## 6. 주요 CSS 변수

```css
:root {
  --bg: #FAF6F1;
  --brown: #3D3228;
  --gold: #8B7355;
  --beige: #EDE6DC;
  --gray: #6B5D4F;
}
```

---

## 7. 블로그 목록 페이지 동작

- **카드 섹션**: 최신 9개 (CARD_LIMIT), pinned 글 최상단 고정
- **리스트 섹션**: 카드 이후 나머지 글, 5개씩 페이지네이션
- **카테고리 필터**: `전체 / 수업소개 / 요가입문 / 중급수련 / 안내 / 기타`
  - 다중 카테고리 글은 각 카테고리 필터에서 모두 표시됨
- **정렬**: pinned → date 내림차순
