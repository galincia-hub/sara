# 사라요가 블로그 자동화 가이드 (Claude Code용)

이 문서는 VS Code에서 Claude Code가 블로그 글을 생성할 때 참조하는 워크플로우 규칙입니다.

---

## 프로젝트 구조

```
sarayoga.kr/
├── index.html                    ← 메인 랜딩페이지
├── sitemap.xml                   ← 구글 크롤링용 (글 추가 시 업데이트)
├── robots.txt                    ← 크롤링 허용 설정
├── _config/
│   ├── 사라요가_시스템프롬프트_v3_최종.md    ← 글 품질 규칙 (말투, DB, AI회피)
│   ├── 사라요가_SEO검수_모바일최적화_v3_최종.md  ← SEO/AEO 규칙
│   ├── 콘텐츠_전략_v2.md                  ← 키워드 전략
│   └── 검색키워드_DB.csv                  ← 유입 데이터
├── _template/
│   └── blog-post.html            ← 블로그 글 HTML 템플릿
├── images/
│   ├── blog/
│   │   └── pool/                 ← 이미지 풀 (카테고리별 사진)
│   └── images.json               ← 이미지 메타데이터 + 태그
├── blog/
│   ├── index.html                ← 블로그 목록 페이지 (posts.json 자동 렌더링)
│   ├── posts.json                ← 전체 글 목록 데이터
│   ├── 대전중구-도구테라피-완전가이드.html
│   └── ...
```

---

## 글 생성 워크플로우

사용자가 주제를 주면 아래 순서대로 실행합니다.

### Step 1: 콘텐츠 작성 규칙 로드

아래 파일을 반드시 읽고 적용합니다:
- `_config/사라요가_시스템프롬프트_v3_최종.md` → 페르소나, 원장 표현 DB, AI 금지 패턴, 프레임
- `_config/사라요가_SEO검수_모바일최적화_v3_최종.md` → 22개 자동 규칙, FAQ 규칙
- `_config/콘텐츠_전략_v2.md` → 키워드 Tier, 콘텐츠 비율

### Step 2: 글 작성

시스템프롬프트의 모든 규칙을 적용하며 글을 작성합니다:
- 첫 문단: 검색 질문에 직접 답변 (GEO)
- 소제목: 50% 이상 질문형
- 원장 표현 DB: 서로 다른 카테고리에서 3개 이상
- AI 금지 패턴: 0개
- AEO 엔티티 속성: 2개 이상 일관된 표현
- FAQ: 3개 (글 하단, Q&A 구조, 첫 문장 답변 완결)
- 비교형 글이면: 표 포함 + 표 전 한 줄 요약
- 참여 유도 질문: 1개 이상 (글 중간)
- 마무리 CTA: 체험수업 안내
- 분량: 2,000자 이상

### Step 3: 이미지 자동 삽입

**절대로 📷 플레이스홀더 텍스트를 남기지 마세요.** 반드시 실제 `<img>` 태그로 삽입합니다.

1. `images/images.json`을 읽는다
2. 글의 주제/키워드와 이미지 태그를 매칭한다
3. 매칭 우선순위:
   - 1순위: 글 주제와 정확히 일치 (예: 플라잉요가 글 → `flying-` 이미지)
   - 2순위: 섹션 내용과 일치 (예: 교정 이야기 → `instructor-` 또는 `group-교정`)
   - 3순위: 범용 이미지 (예: `studio-`, `member-`, `group-`)
4. 같은 글 안에서 같은 이미지 중복 사용 금지
5. 글 1개당 이미지 4~6개 삽입
6. alt 텍스트에 키워드 포함 (예: `alt="대전 서대전 도구테라피 블랙롤 수업"`)

**이미지 삽입 형식:**
```html
<img src="/images/blog/pool/therapy-블랙롤.jpg" alt="대전 서대전 도구테라피 블랙롤 근막이완" style="width:100%;border-radius:14px">
```

**이미지 삽입 위치:**
- 첫 소제목 바로 위 (히어로 이미지 역할)
- 각 소제목 사이 (2~3개 소제목마다 1장)
- 글 마무리 직전 (CTA 바로 위)

**images.json에 이미지가 부족할 경우:**
- 태그가 가장 유사한 이미지로 대체
- `studio-전경.jpg`, `member-단체.jpg` 같은 범용 이미지 활용
- 그래도 부족하면 이미지 수를 줄이되, 최소 3장은 삽입

### Step 4: HTML 파일 생성

1. `_template/blog-post.html`을 복사한다
2. 아래 플레이스홀더를 교체한다:

| 플레이스홀더 | 교체 내용 |
|---|---|
| `{{TITLE}}` | 글 제목 |
| `{{META_DESC}}` | 메타 설명 (150자 이내) |
| `{{KEYWORDS}}` | 키워드 (쉼표 구분) |
| `{{SLUG}}` | 파일명 (URL 경로) |
| `{{CATEGORY}}` | 글 유형 (정보/가이드, 가격/안내, 수업 후기 등) |
| `{{DATE}}` | 발행일 (YYYY.MM.DD) |
| `{{ISO_DATE}}` | ISO 날짜 (YYYY-MM-DD) |
| `{{BREADCRUMB}}` | 브레드크럼 표시 텍스트 |
| `{{SUMMARY}}` | 요약문 (2~3줄) |
| `{{HERO_IMG_SRC}}` | 히어로 이미지 경로 |
| `{{HERO_IMG_ALT}}` | 히어로 이미지 alt 텍스트 |
| `{{CONTENT}}` | 본문 HTML |
| `{{FAQ_HTML}}` | FAQ 섹션 HTML |
| `{{TAGS_HTML}}` | 해시태그 HTML |
| `{{RELATED_HTML}}` | 관련 글 HTML |
| `{{SCHEMA_JSON}}` | Schema.org JSON-LD |

3. 파일을 `blog/{{SLUG}}.html`로 저장한다

### Step 5: posts.json 업데이트

`blog/posts.json`에 새 글 정보를 **배열 맨 앞**에 추가합니다:

```json
{
  "slug": "대전중구-빈야사-초보가이드",
  "title": "대전 중구 빈야사 초보 가이드 — 호흡부터 시작해요",
  "category": "정보/가이드",
  "date": "2026.04.15",
  "summary": "요약문...",
  "tags": ["대전빈야사", "대전중구요가", "빈야사초보", "사라요가"],
  "thumbnail": "/images/blog/pool/vinyasa-시퀀스.jpg"
}
```

블로그 목록 페이지(blog/index.html)는 posts.json을 자동으로 읽어서 렌더링하므로, **이 파일만 추가하면 목록이 자동 업데이트됩니다.**

### Step 6: sitemap.xml 업데이트

`sitemap.xml`에 새 URL을 추가합니다:

```xml
<url>
  <loc>https://sarayoga.kr/blog/대전중구-빈야사-초보가이드.html</loc>
  <lastmod>2026-04-15</lastmod>
  <priority>0.8</priority>
</url>
```

### Step 7: Git 커밋 & 푸시

```bash
git add blog/{{SLUG}}.html blog/posts.json sitemap.xml
git commit -m "블로그: {{TITLE}}"
git push origin main
```

---

## Schema.org 구조화 데이터 규칙

모든 블로그 글에 아래 3가지 스키마를 포함합니다:

### Article
```json
{
  "@type": "Article",
  "headline": "글 제목",
  "description": "메타 설명",
  "author": {
    "@type": "Person",
    "name": "Sara 원장",
    "jobTitle": "요가 강사",
    "worksFor": { "@type": "LocalBusiness", "name": "사라요가", "@id": "https://sarayoga.kr/#business" }
  },
  "publisher": { "@type": "Organization", "name": "사라요가", "url": "https://sarayoga.kr" },
  "datePublished": "ISO 날짜",
  "dateModified": "ISO 날짜",
  "mainEntityOfPage": "글 URL",
  "articleSection": "카테고리",
  "keywords": ["키워드 배열"]
}
```

### FAQPage
FAQ 3개를 구조화합니다. 글 본문의 FAQ와 정확히 동일한 내용이어야 합니다.

### BreadcrumbList
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "사라요가", "item": "https://sarayoga.kr" },
    { "@type": "ListItem", "position": 2, "name": "블로그", "item": "https://sarayoga.kr/blog" },
    { "@type": "ListItem", "position": 3, "name": "글 제목 (짧게)" }
  ]
}
```

---

## AEO 엔티티 속성 (일관된 표현)

글에서 아래 표현을 일관되게 사용합니다:

| 속성 | 표현 |
|---|---|
| 위치 | "대전 중구 오류동, 서대전네거리역 4번출구에서 도보 2분" |
| 규모 | "6명 정원 소그룹, 원장 직강 100%" |
| 대상 | "초보자도 안전하게 시작할 수 있는 단계별 커리큘럼" |
| 전문성 | "대전에서 도구테라피와 인사이드플로우를 전문으로 하는" |
| 해결 | "어깨·허리 통증 완화, 라운드숄더 교정" |
| 가치 | "한 분 한 분 자세를 직접 잡아드리는 1:1 교정" |

---

## 주의사항

- 글 제목에 "서대전" 또는 "대전 중구"를 번갈아 사용 (연속 같은 지역명 3회 금지)
- 이전 글과 같은 스토리텔링 프레임 연속 사용 금지
- posts.json의 기존 글과 중복 주제 금지
- 이미지 pool에 없는 파일명을 절대 사용하지 마세요 — images.json에 있는 것만 사용
