import { useState, useEffect, useRef } from "react";

/* ── data ── */
/* ── IMAGES: 실제 사진으로 교체 시 아래 URL만 변경하세요 ── */
const IMG = {
  hero: "https://picsum.photos/id/1057/1600/900",
  aboutLeft: "https://picsum.photos/id/1021/600/800",
  aboutRight: "https://picsum.photos/id/1074/600/800",
  gallery: [
    "https://picsum.photos/id/1015/1000/560",
    "https://picsum.photos/id/1039/1000/560",
    "https://picsum.photos/id/1029/1000/560",
    "https://picsum.photos/id/1036/1000/560",
    "https://picsum.photos/id/1047/1000/560",
  ],
  programs: {
    flying: "https://picsum.photos/id/1057/800/600",
    insideflow: "https://picsum.photos/id/1074/800/600",
    vinyasa: "https://picsum.photos/id/1015/800/600",
    therapy: "https://picsum.photos/id/1029/800/600",
    hatha: "https://picsum.photos/id/1039/800/600",
    support: "https://picsum.photos/id/1047/800/600",
  },
  blog: [
    "https://picsum.photos/id/1057/500/280",
    "https://picsum.photos/id/1029/500/280",
    "https://picsum.photos/id/1060/500/280",
    "https://picsum.photos/id/1074/500/280",
  ],
  contact: "https://picsum.photos/id/1036/1600/900",
};

/* Fallback: 이미지 로딩 실패 시 위치 라벨을 보여주는 그라디언트 배경 */
function ImgWithFallback({ src, alt, label, className, style }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div style={{ ...style, width:"100%", height:"100%", background:"linear-gradient(135deg, #E8DFD3 0%, #D4C5B0 50%, #C5B8A0 100%)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
        <div style={{ fontSize:28, opacity:.4 }}>📷</div>
        <div style={{ fontSize:11, color:"#8B7355", fontWeight:500, letterSpacing:1, textAlign:"center", padding:"0 12px", opacity:.6 }}>{label || alt}</div>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={style} onError={() => setFailed(true)} />;
}

const PROGRAMS = [
  { id:"flying", name:"플라잉요가", eng:"Flying Yoga", desc:"해먹 위에서 중력을 벗어나는 경험. 코어 강화와 스트레칭을 동시에, 초보자도 안전하게 시작할 수 있어요.", tags:["코어강화","스트레칭","초보환영"], level:"All Level",
    img: IMG.programs.flying },
  { id:"insideflow", name:"인사이드플로우", eng:"Inside Flow", desc:"음악과 호흡, 움직임이 하나로 흐르는 빈야사 기반 플로우. 몸과 마음이 함께 춤추는 시간이에요.", tags:["음악","플로우","감성"], level:"Basic+",
    img: IMG.programs.insideflow },
  { id:"vinyasa", name:"빈야사", eng:"Vinyasa", desc:"호흡과 움직임을 연결하는 역동적인 요가. 체력과 유연성을 함께 키울 수 있어요.", tags:["역동적","체력","유연성"], level:"All Level",
    img: IMG.programs.vinyasa },
  { id:"therapy", name:"도구테라피", eng:"Tool Therapy", desc:"폼롤러, 블랙롤, 근막이완 볼을 활용한 셀프 테라피. 뭉친 근막을 풀고 몸의 밸런스를 찾아줘요.", tags:["근막이완","블랙롤","셀프케어"], level:"All Level",
    img: IMG.programs.therapy },
  { id:"hatha", name:"하타플로우", eng:"Hatha Flow", desc:"기본 자세를 천천히 깊게 수련하는 요가. 호흡에 집중하며 내면의 고요함을 만나요.", tags:["기초","호흡","이완"], level:"Beginner",
    img: IMG.programs.hatha },
  { id:"support", name:"서포트요가", eng:"Support Yoga", desc:"보조 도구를 활용해 깊은 이완을 경험하는 리스토어티브 요가. 지친 몸과 마음을 회복시켜요.", tags:["이완","회복","도구활용"], level:"All Level",
    img: IMG.programs.support },
];

const SCHEDULE = [
  { day:"월", classes:[{time:"10:00",name:"하타플로우",c:"#A8C5A0"},{time:"19:30",name:"플라잉요가",c:"#C5A8B8"}] },
  { day:"화", classes:[{time:"10:00",name:"빈야사",c:"#C5B8A0"},{time:"19:30",name:"인사이드플로우",c:"#A0B8C5"}] },
  { day:"수", classes:[{time:"10:00",name:"도구테라피",c:"#B8A0C5"},{time:"19:30",name:"플라잉요가",c:"#C5A8B8"}] },
  { day:"목", classes:[{time:"10:00",name:"하타플로우",c:"#A8C5A0"},{time:"19:30",name:"빈야사",c:"#C5B8A0"}] },
  { day:"금", classes:[{time:"10:00",name:"서포트요가",c:"#C5C0A0"},{time:"19:30",name:"인사이드플로우",c:"#A0B8C5"}] },
  { day:"토", classes:[{time:"10:00",name:"주말 원데이클래스",c:"#C5A0A0"}] },
];

const PRICING = [
  { name:"체험수업", price:"무료", sub:"첫 방문", hl:false },
  { name:"1회 드롭인", price:"25,000원", sub:"", hl:false },
  { name:"4회", price:"88,000원", sub:"1개월 · 회당 22,000원", hl:false },
  { name:"8회", price:"160,000원", sub:"2개월 · 회당 20,000원", hl:false },
  { name:"무제한", price:"180,000원", sub:"1개월", hl:true },
];

const BLOG_POSTS = [
  { slug:"대전중구-도구테라피-완전가이드", title:"대전 중구 도구테라피 완전 가이드 — 뭉친 어깨, 이렇게 풀어요", cat:"정보", date:"2026.04.01", img: IMG.blog[0] },
  { slug:"서대전-인사이드플로우-입문가이드", title:"서대전 인사이드플로우 입문 가이드 — 음악과 호흡이 만나는 요가", cat:"정보", date:"2026.04.03", img: IMG.blog[1] },
  { slug:"대전중구-블랙롤-근막이완-가이드", title:"대전 중구 블랙롤 근막이완 가이드 — 집에서도 할 수 있는 셀프케어", cat:"정보", date:"2026.04.05", img: IMG.blog[2] },
  { slug:"서대전-플라잉요가-초보가이드", title:"서대전 플라잉요가 초보 가이드 — 겁 많아도 괜찮아요", cat:"정보", date:"2026.04.08", img: IMG.blog[3] },
  { slug:"대전중구-소그룹요가-비교", title:"대전 중구 소그룹 요가 vs 대형 — 뭐가 다를까?", cat:"정보", date:"2026.04.10", img: IMG.blog[0] },
  { slug:"서대전-사라요가-가격-총정리", title:"서대전 사라요가 프로그램별 가격 총정리", cat:"가격", date:"2026.04.12", img: IMG.blog[1] },
];

const GALLERY = IMG.gallery;

const REVIEWS = [
  { name:"김*미", date:"2026.03.29", rating:5, type:"체험 수업", text:"언니가 몸이 많이 망가져서 일어나지 못하고 더이상 병원을 다닐수도 없을때 지푸라기라도 잡는 심정으로 했던 선택이었는데 쌤밧이 터졌어요. 노련한 손길로 수기치료를 해주셔서 몸이 많이 좋아졌어요. 앞으로의 시간이 너무 기대돼요.", tags:["플라잉요가","체험"] },
  { name:"신*숙", date:"2026.03.28", rating:5, type:"정규 수업 (1개월차)", text:"홈핏수업 두달이 되면서 확연히 달라져 가는모습이 보여서 너무 좋습니다. 뱃살도 많이 빠진거 같고 전체적으로 몸의 균형이 잡혀가는 모습이 보여서 만족스럽습니다.", tags:["하타플로우","변화"] },
  { name:"장*훈", date:"2026.03.27", rating:5, type:"정규 수업", text:"사무실 근무로 뭉친 목과 어깨 등 제 몸 상태를 정확히 짚어주시고 근막 이완으로 통증 완화에 도움을 주셨습니다. 설명도 이해하기 쉽게 해주셔서 수업 내내 편하게 배울 수 있었습니다.", tags:["도구테라피","직장인"], reply:"회원님~ 워낙 밝으신분이라 저도 편안하게 수업할수있었습니다~ 일주일에 한번이라도 꼭 만나요 🤗🤗" },
  { name:"김*진", date:"2026.03.27", rating:5, type:"체험 수업", text:"운동 들어가기 전 내 현 몸상태 체크를 잘해주셨고 운동하면서도 계속 체크하면서 봐주고 자세도 잡아주셔서 운동하기 좋았습니다. 불편한부분이나 미숙한부분에 대해 어렵지않으면서도 무조건 진도를 나가기보다 고정해줘서 편한마음으로 수업받을 수 있었습니다.", tags:["빈야사","체험"] },
  { name:"도*형", date:"2026.03.26", rating:5, type:"정규 수업", text:"매번 수업할 때마다 꼼꼼하게 자세 잡아주시고, 그날 컨디션에 맞춰서 강도도 조절해주세요. 소그룹이라 질문하기도 편하고, 확실히 대형 스튜디오랑은 달라요.", tags:["소그룹","맞춤"] },
  { name:"이*영", date:"2026.03.24", rating:5, type:"정규 수업 (3개월차)", text:"요가 처음 시작할 때 몸이 너무 뻣뻣해서 걱정했는데, 원장님이 단계별로 차근차근 알려주셔서 지금은 훨씬 유연해졌어요. 특히 인사이드플로우 시간이 제일 좋아요!", tags:["인사이드플로우","초보"] },
  { name:"박*현", date:"2026.03.22", rating:5, type:"체험 수업", text:"서대전네거리역에서 가까워서 퇴근 후에 다니기 딱 좋아요. 6명이라 선생님이 일일이 다 봐주시는 게 느껴져요. 체험 수업 한 번으로 바로 등록했습니다!", tags:["직장인","접근성"] },
  { name:"최*아", date:"2026.03.20", rating:5, type:"정규 수업 (2개월차)", text:"플라잉요가 처음에 무서웠는데, 원장님이 옆에서 하나하나 잡아주시니까 안심이 됐어요. 이제는 거꾸로 매달리는 것도 재밌어요! 어깨가 많이 편해졌다는 게 체감돼요.", tags:["플라잉요가","어깨"] },
];

const REVIEW_STATS = { total: 47, avg: 5.0, bars: [{ label:"수업 만족도", score:5.0 }, { label:"친절한 지도", score:5.0 }, { label:"시설 청결도", score:4.9 }] };

/* ── hooks ── */
function useInView(th = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: th });
    o.observe(el); return () => o.disconnect();
  }, []);
  return [ref, v];
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => { const h = () => setY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  return y;
}

function useMediaQuery(query) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setM(mq.matches);
    const h = (e) => setM(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [query]);
  return m;
}

/* ── components ── */
function Reveal({ children, delay = 0, dir = "up", style: s = {} }) {
  const [ref, vis] = useInView();
  const t = { up:"translateY(48px)", down:"translateY(-48px)", left:"translateX(48px)", right:"translateX(-48px)", scale:"scale(0.92)", none:"none" };
  return (
    <div ref={ref} style={{ ...s, opacity: vis?1:0, transform: vis?"translate(0) scale(1)":(t[dir]||t.up),
      transition:`opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>{children}</div>
  );
}

function Counter({ end, suffix="", dur=2000 }) {
  const [c, setC] = useState(0);
  const [ref, vis] = useInView();
  useEffect(() => {
    if (!vis) return; let v=0; const step=end/(dur/16);
    const id=setInterval(()=>{ v+=step; if(v>=end){setC(end);clearInterval(id);}else setC(Math.floor(v)); },16);
    return ()=>clearInterval(id);
  }, [vis,end,dur]);
  return <span ref={ref}>{c}{suffix}</span>;
}

/* ── MAIN ── */

/* Schema.org 구조화 데이터 — 메인 페이지 (LocalBusiness + Course + AggregateRating) */
const SCHEMA_MAIN = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://sarayoga.kr/#business",
      "name": "사라요가 Sara Yoga Studio",
      "description": "대전 서대전 소수정예 6명 정원, 원장 직강 100% 요가 스튜디오. 플라잉요가, 인사이드플로우, 도구테라피, 빈야사, 하타플로우, 서포트요가.",
      "url": "https://sarayoga.kr",
      "telephone": "+82-10-9773-4256",
      "address": { "@type": "PostalAddress", "streetAddress": "계룡로 874번길 18, 3층", "addressLocality": "대전광역시 중구 오류동", "addressRegion": "대전광역시", "postalCode": "34943", "addressCountry": "KR" },
      "geo": { "@type": "GeoCoordinates", "latitude": 36.3225, "longitude": 127.4025 },
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "10:00", "closes": "21:00" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "12:00" }
      ],
      "image": "https://sarayoga.kr/images/studio.jpg",
      "priceRange": "₩88,000 ~ ₩180,000",
      "currenciesAccepted": "KRW",
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "47", "bestRating": "5" },
      "sameAs": ["https://www.instagram.com/sara_yoga_studio", "https://blog.naver.com/sarayoga-"],
      "hasOfferCatalog": {
        "@type": "OfferCatalog", "name": "사라요가 프로그램",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "플라잉요가", "description": "해먹을 활용한 에어리얼 요가. 코어 강화와 스트레칭을 동시에. 초보자 가능." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "인사이드플로우", "description": "음악과 호흡이 만나는 빈야사 기반 플로우 요가. 원장 정식 교육 수료." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "도구테라피", "description": "폼롤러, 블랙롤, 근막이완 볼을 활용한 셀프 테라피. 어깨 허리 통증 완화." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "빈야사", "description": "호흡과 움직임을 연결하는 역동적인 요가." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "하타플로우", "description": "기본 자세를 천천히 깊게 수련하는 요가." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "서포트요가", "description": "보조 도구를 활용한 리스토어티브 요가." } }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "사라요가는 초보자도 다닐 수 있나요?", "acceptedAnswer": { "@type": "Answer", "text": "네, 사라요가는 초보자도 안전하게 시작할 수 있는 단계별 커리큘럼을 운영합니다. 6명 정원 소그룹으로 원장이 한 분 한 분 자세를 직접 잡아드리는 1:1 교정을 합니다." } },
        { "@type": "Question", "name": "서대전네거리역에서 얼마나 걸리나요?", "acceptedAnswer": { "@type": "Answer", "text": "서대전네거리역 4번출구에서 도보 2분 거리입니다. 대전 중구 오류동 계룡로 874번길 18, 3층에 위치해 있습니다." } },
        { "@type": "Question", "name": "체험수업은 어떻게 신청하나요?", "acceptedAnswer": { "@type": "Answer", "text": "첫 방문 시 무료 체험수업이 가능합니다. 전화(010-9773-4256) 또는 인스타그램 DM(@sara_yoga_studio)으로 신청해주세요." } },
        { "@type": "Question", "name": "대전에서 인사이드플로우를 배울 수 있는 곳이 있나요?", "acceptedAnswer": { "@type": "Answer", "text": "사라요가는 대전에서 인사이드플로우를 전문으로 하는 요가 스튜디오입니다. 원장이 인사이드플로우 정식 교육과 인사이드 얼라인먼트 전문 과정을 수료했습니다." } },
        { "@type": "Question", "name": "도구테라피가 뭔가요?", "acceptedAnswer": { "@type": "Answer", "text": "도구테라피는 폼롤러, 블랙롤, 근막이완 볼 등을 활용하여 뭉친 근막을 풀어주는 셀프 테라피입니다. 사무직 직장인의 어깨 통증, 허리 통증 완화에 효과적입니다." } }
      ]
    }
  ]
};

export default function SaraYogaResponsive() {
  const scrollY = useScrollY();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isWide = useMediaQuery("(min-width: 1080px)");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(() => { const d=new Date().getDay(); return d===0?5:d-1; });
  const [expandedProg, setExpandedProg] = useState(null);

  /* Schema.org JSON-LD 주입 */
  useEffect(() => {
    const existing = document.getElementById("schema-main");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "schema-main";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(SCHEMA_MAIN);
      document.head.appendChild(script);
    }
    return () => { const el = document.getElementById("schema-main"); if (el) el.remove(); };
  }, []);
  const [hoveredProg, setHoveredProg] = useState(null);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };
  const NAV = [["소개","about"],["프로그램","programs"],["시간표","schedule"],["가격","pricing"],["후기","reviews"],["블로그","blog"],["문의","contact"]];
  const [reviewPage, setReviewPage] = useState(0);
  const REVIEWS_PER_PAGE = isDesktop ? 4 : 2;

  const wrap = isWide ? { maxWidth:1200, margin:"0 auto", padding:"0 48px" } : isDesktop ? { maxWidth:900, margin:"0 auto", padding:"0 36px" } : { padding:"0 24px" };

  return (
    <div style={{ fontFamily:"'Noto Sans KR', sans-serif", background:"#FAF6F1", color:"#3D3228", minHeight:"100vh", overflowX:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:6px;height:0}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(139,115,85,.2);border-radius:3px}
        @keyframes heroZoom{from{transform:scale(1.15)}to{transform:scale(1)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .card-h{transition:all .45s cubic-bezier(.25,.46,.45,.94)}
        .card-h:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(61,50,40,.1)}
        .card-h:active{transform:scale(.975)}
        .cta-btn{transition:all .35s ease;position:relative;overflow:hidden;cursor:pointer}
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(139,115,85,.28)}
        .cta-btn:active{transform:scale(.97)}
        .img-cv{width:100%;height:100%;object-fit:cover;transition:transform 1s cubic-bezier(.25,.46,.45,.94)}
        .img-cv:hover{transform:scale(1.06)}
        .h-scroll{overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;display:flex}
        .h-scroll>*{scroll-snap-align:start}
        .tag{transition:all .3s ease;cursor:default}
        .tag:hover{background:rgba(139,115,85,.14)}
        .menu-item{animation:fadeUp .45s cubic-bezier(.22,1,.36,1) both}
        .nav-link{position:relative;padding:4px 0;font-size:13px;color:#6B5D4F;text-decoration:none;letter-spacing:1.5px;font-weight:400;transition:color .3s}
        .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:#8B7355;transition:width .3s}
        .nav-link:hover{color:#3D3228}
        .nav-link:hover::after{width:100%}
        .prog-grid-card{position:relative;border-radius:20px;overflow:hidden;cursor:pointer;height:320px}
        .prog-grid-card .overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(61,50,40,.7) 100%);transition:background .5s ease}
        .prog-grid-card:hover .overlay{background:linear-gradient(180deg,transparent 20%,rgba(61,50,40,.85) 100%)}
        .prog-grid-card .detail{position:absolute;bottom:0;left:0;right:0;padding:24px;transform:translateY(40px);opacity:0;transition:all .45s cubic-bezier(.22,1,.36,1)}
        .prog-grid-card:hover .detail{transform:translateY(0);opacity:1}
        .prog-grid-card img{transition:transform 1.2s cubic-bezier(.25,.46,.45,.94)}
        .prog-grid-card:hover img{transform:scale(1.08)}
        .blog-card{transition:all .4s ease}
        .blog-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(61,50,40,.08)}
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        background: scrollY>80?"rgba(250,246,241,.92)":"transparent",
        backdropFilter: scrollY>80?"blur(28px)":"none",
        borderBottom: scrollY>80?"1px solid rgba(212,197,176,.12)":"none",
        transition:"all .5s ease",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding: isDesktop?"16px 48px":"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{
            cursor:"pointer", fontFamily:"'Cormorant Garamond', serif", fontSize: isDesktop?22:20,
            fontWeight:600, color: scrollY>80?"#8B7355":"#fff", letterSpacing:2,
            transition:"color .5s", textShadow: scrollY>80?"none":"0 1px 12px rgba(0,0,0,.2)",
          }}>Sara Yoga</div>

          {/* Desktop nav links */}
          {isDesktop ? (
            <div style={{ display:"flex", gap:32, alignItems:"center" }}>
              {NAV.map(([label,id])=>(
                <a key={id} className="nav-link" href={`#${id}`} onClick={(e)=>{e.preventDefault();scrollTo(id);}}
                  style={{ color: scrollY>80?"#6B5D4F":"rgba(255,255,255,.8)", textShadow: scrollY>80?"none":"0 1px 8px rgba(0,0,0,.1)" }}>
                  {label}
                </a>
              ))}
              <button className="cta-btn" onClick={()=>scrollTo("contact")} style={{
                background: scrollY>80?"#3D3228":"rgba(255,255,255,.15)",
                color:"#FAF6F1", border: scrollY>80?"none":"1px solid rgba(255,255,255,.25)",
                padding:"10px 24px", borderRadius:24, fontSize:13, letterSpacing:1.5, backdropFilter:"blur(8px)",
              }}>체험 신청</button>
            </div>
          ) : (
            <button onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"none", border:"none", cursor:"pointer", padding:8, zIndex:101 }}>
              {[0,1,2].map(i=>(
                <div key={i} style={{
                  width: menuOpen?22:(i===2?14:22), height:2,
                  background:(scrollY>80||menuOpen)?"#3D3228":"#fff",
                  marginBottom:i<2?5:0, transition:"all .3s",
                  transform:menuOpen?(i===0?"rotate(45deg) translate(2.5px,2.5px)":i===2?"rotate(-45deg) translate(4px,-4px)":"none"):"none",
                  opacity:menuOpen&&i===1?0:1,
                }} />
              ))}
            </button>
          )}
        </div>
      </nav>

      {/* ═══ MOBILE MENU ═══ */}
      {menuOpen && !isDesktop && (
        <div style={{
          position:"fixed", inset:0, zIndex:99,
          background:"rgba(250,246,241,.97)", backdropFilter:"blur(40px)",
          display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:28,
        }}>
          {NAV.map(([label,id],i)=>(
            <button key={id} className="menu-item" onClick={()=>scrollTo(id)} style={{
              animationDelay:`${i*.06}s`, background:"none", border:"none", cursor:"pointer",
              fontSize:22, fontWeight:300, color:"#3D3228", letterSpacing:5,
            }}>{label}</button>
          ))}
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section style={{ height:"100svh", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, #E8DFD3 0%, #D4C5B0 40%, #C5B8A0 100%)", backgroundImage:`url(${IMG.hero})`, backgroundSize:"cover", backgroundPosition:"center 30%", animation:"heroZoom 15s ease-out forwards" }} />
        <div style={{ position:"absolute", inset:0, background: isDesktop
          ? "linear-gradient(90deg, rgba(250,246,241,.95) 0%, rgba(250,246,241,.7) 45%, transparent 70%)"
          : "linear-gradient(180deg, rgba(61,50,40,.05) 0%, rgba(61,50,40,.3) 40%, rgba(250,246,241,.65) 78%, rgba(250,246,241,1) 100%)"
        }} />

        <div style={{
          position:"relative", zIndex:2, height:"100%", display:"flex", flexDirection:"column",
          justifyContent: isDesktop?"center":"flex-end",
          maxWidth:1200, margin:"0 auto",
          padding: isDesktop?"0 80px":"0 28px 56px",
        }}>
          <div style={{ animation:"fadeUp 1s ease .2s both", maxWidth: isDesktop?560:"none" }}>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize: isDesktop?13:12, letterSpacing:7, color: isDesktop?"#B09C80":"rgba(255,255,255,.7)", marginBottom:20 }}>
              SINCE 2023 · 서대전
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize: isWide?72:isDesktop?60:54, fontWeight:300, color: isDesktop?"#3D3228":"#fff", lineHeight:1.02,
              textShadow: isDesktop?"none":"0 2px 40px rgba(0,0,0,.12)" }}>Sara</h1>
            <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize: isWide?72:isDesktop?60:54, fontWeight:300, fontStyle:"italic",
              color: isDesktop?"#8B7355":"rgba(255,255,255,.85)", lineHeight:1.02, marginBottom: isDesktop?32:24,
              textShadow: isDesktop?"none":"0 2px 40px rgba(0,0,0,.12)" }}>Yoga Studio</h1>
          </div>
          <div style={{ animation:"fadeUp 1s ease .6s both", maxWidth: isDesktop?480:"none" }}>
            <p style={{ fontSize: isDesktop?15:13.5, fontWeight:300, lineHeight:1.9, color: isDesktop?"#6B5D4F":"#5C5044" }}>
              원장 직강 · 소수정예 6명 · 1:1 교정<br/>서대전네거리역 4번출구 도보 2분
            </p>
          </div>
          <div style={{ animation:"fadeUp 1s ease .9s both", marginTop:32, display:"flex", gap:12 }}>
            <button className="cta-btn" onClick={()=>scrollTo("contact")} style={{
              background:"#3D3228", color:"#FAF6F1", border:"none",
              padding: isDesktop?"16px 40px":"15px 32px", borderRadius:32, fontSize: isDesktop?15:13.5, fontWeight:400, letterSpacing:1.5,
            }}>체험수업 신청</button>
            <button className="cta-btn" onClick={()=>scrollTo("programs")} style={{
              background:"transparent", color: isDesktop?"#3D3228":"#3D3228", border:"1.5px solid rgba(61,50,40,.25)",
              padding: isDesktop?"16px 32px":"15px 24px", borderRadius:32, fontSize: isDesktop?15:13.5, fontWeight:400, letterSpacing:1.5,
            }}>프로그램 보기</button>
          </div>
        </div>

        <div style={{ position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)", zIndex:2, animation:"float 3s ease-in-out infinite" }}>
          <div style={{ width:22, height:34, borderRadius:11, border:"1.5px solid rgba(139,115,85,.35)", display:"flex", justifyContent:"center", paddingTop:7 }}>
            <div style={{ width:3, height:8, borderRadius:2, background:"rgba(139,115,85,.45)", animation:"pulse 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <div style={{ padding: isDesktop?"40px 0":"30px 0", borderBottom:"1px solid rgba(212,197,176,.2)" }}>
        <div style={{ ...wrap, display:"flex", justifyContent:"center", gap: isDesktop?80:0 }}>
          {[[6,"명","최대 정원"],[100,"%","원장 직강"],[2,"+","년 운영"]].map(([n,suf,label],i)=>(
            <Reveal key={i} delay={i*.08} style={{ textAlign:"center", flex: isDesktop?"none":1 }}>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize: isDesktop?42:34, fontWeight:300, color:"#8B7355" }}>
                <Counter end={n} suffix={suf} dur={n>10?2000:800} />
              </div>
              <div style={{ fontSize: isDesktop?12:11, color:"#B09C80", marginTop:6, letterSpacing:2 }}>{label}</div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ═══ ABOUT ═══ */}
      <section id="about" style={{ padding: isDesktop?"120px 0":"80px 0" }}>
        <div style={{ ...wrap, display: isDesktop?"grid":"block", gridTemplateColumns: isDesktop?"1fr 1fr":"none", gap: isDesktop?64:0, alignItems:"center" }}>
          {/* Left — images */}
          <Reveal delay={0.1}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: isDesktop?14:10, marginBottom: isDesktop?0:28 }}>
              <div style={{ borderRadius: isDesktop?20:16, overflow:"hidden", height: isDesktop?300:200 }}>
                <ImgWithFallback src={IMG.aboutLeft} alt="스튜디오" label="A-1 스튜디오 내부" className="img-cv" style={{width:"100%",height:"100%",objectFit:"cover"}} />
              </div>
              <div style={{ borderRadius: isDesktop?20:16, overflow:"hidden", height: isDesktop?300:200, marginTop: isDesktop?40:0 }}>
                <ImgWithFallback src={IMG.aboutRight} alt="수업" label="A-2 수업 장면" className="img-cv" style={{width:"100%",height:"100%",objectFit:"cover"}} />
              </div>
            </div>
          </Reveal>

          {/* Right — text */}
          <div>
            <Reveal>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:7, color:"#B09C80", marginBottom:14 }}>ABOUT</div>
              <h3 style={{ fontSize: isDesktop?32:27, fontWeight:500, lineHeight:1.55, color:"#3D3228", marginBottom:28 }}>좋은 사람들과<br/>요가를 나누는 공간</h3>
            </Reveal>
            <Reveal delay={0.15}>
              <p style={{ fontSize: isDesktop?15:14.5, fontWeight:300, lineHeight:2.2, color:"#6B5D4F", marginBottom:36 }}>
                큰 스튜디오에서 뒤에 앉으면 선생님 얼굴도 안 보이잖아요.
                저는 모든 분의 자세를 하나하나 봐드리고 싶었어요.
                <br/><br/>
                <span style={{ color:"#8B7355", fontWeight:400 }}>정원 6명, 원장 직강 100%.</span>
                <br/>잘하려고 애쓰지 않아도 괜찮은 곳.
              </p>
            </Reveal>
            <Reveal delay={0.25} dir="scale">
              <div style={{
                background:"linear-gradient(145deg, #3D3228, #564939)",
                borderRadius:22, padding: isDesktop?"32px 30px":"30px 26px", color:"#FAF6F1", position:"relative", overflow:"hidden",
              }}>
                <div style={{ position:"absolute", top:"-30%", right:"-15%", width:180, height:180, borderRadius:"50%", background:"rgba(139,115,85,.1)" }} />
                <div style={{ position:"relative" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:6, color:"rgba(176,156,128,.55)", marginBottom:16 }}>INSTRUCTOR</div>
                  <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                    <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(139,115,85,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🧘‍♀️</div>
                    <div>
                      <div style={{ fontSize:20, fontWeight:500 }}>Sara 원장</div>
                      <div style={{ fontSize:12, color:"rgba(250,246,241,.5)", fontFamily:"'Cormorant Garamond', serif", letterSpacing:2 }}>Founder & Instructor</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12.5, fontWeight:300, lineHeight:2.1, color:"rgba(250,246,241,.65)" }}>
                    인사이드플로우 정식 교육 수료 · 인사이드 얼라인먼트 전문 과정<br/>
                    플라잉요가 · 도구테라피 · 블랙롤 전문 · 빈야사 · 하타 · 서포트요가 지도
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <div style={{ paddingBottom: isDesktop?80:60 }}>
        <Reveal style={{ ...wrap, marginBottom:20 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:6, color:"#B09C80" }}>GALLERY</div>
        </Reveal>
        {isDesktop ? (
          <div style={{ ...wrap }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
              {GALLERY.slice(0,3).map((src,i)=>(
                <Reveal key={i} delay={i*.08}>
                  <div style={{ borderRadius:20, overflow:"hidden", height: i===1?280:240 }}>
                    <ImgWithFallback src={src} alt={`갤러리 ${i+1}`} label={`G-${i+1}`} className="img-cv" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  </div>
                </Reveal>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginTop:16 }}>
              {GALLERY.slice(3,5).map((src,i)=>(
                <Reveal key={i} delay={(i+3)*.08}>
                  <div style={{ borderRadius:20, overflow:"hidden", height:200 }}>
                    <ImgWithFallback src={src} alt={`갤러리 ${i+1}`} label={`G-${i+1}`} className="img-cv" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-scroll" style={{ gap:12, paddingLeft:24, paddingRight:24, paddingBottom:8 }}>
            {GALLERY.map((src,i)=>(
              <div key={i} style={{ flex:"0 0 75%" }}>
                <Reveal delay={i*.04} dir="left">
                  <div style={{ borderRadius:18, overflow:"hidden", height:230 }}>
                    <ImgWithFallback src={src} alt={`갤러리 ${i+1}`} label={`G-${i+1}`} className="img-cv" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ PROGRAMS ═══ */}
      <section id="programs" style={{ padding: isDesktop?"20px 0 120px":"20px 0 80px" }}>
        <div style={wrap}>
          <Reveal>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:7, color:"#B09C80", marginBottom:14 }}>PROGRAMS</div>
            <h3 style={{ fontSize: isDesktop?32:27, fontWeight:500, lineHeight:1.55, color:"#3D3228", marginBottom: isDesktop?40:32 }}>나에게 맞는 수업 찾기</h3>
          </Reveal>

          {isDesktop ? (
            /* Desktop: 3-col hover grid */
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:18 }}>
              {PROGRAMS.map((p,i)=>(
                <Reveal key={p.id} delay={i*.06}>
                  <div className="prog-grid-card card-h"
                    onMouseEnter={()=>setHoveredProg(p.id)} onMouseLeave={()=>setHoveredProg(null)}>
                    <ImgWithFallback src={p.img} alt={p.name} label={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    <div className="overlay" />
                    {/* Always visible */}
                    <div style={{ position:"absolute", bottom:24, left:24, right:24, zIndex:2 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                        <div>
                          <div style={{ fontSize:20, fontWeight:500, color:"#fff", textShadow:"0 1px 8px rgba(0,0,0,.15)" }}>{p.name}</div>
                          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:13, color:"rgba(255,255,255,.6)", letterSpacing:1.5 }}>{p.eng}</div>
                        </div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,.8)", background:"rgba(255,255,255,.12)", backdropFilter:"blur(8px)", padding:"5px 14px", borderRadius:20 }}>{p.level}</div>
                      </div>
                    </div>
                    {/* Hover detail */}
                    <div className="detail" style={{ zIndex:3 }}>
                      <p style={{ fontSize:13, fontWeight:300, lineHeight:1.75, color:"rgba(255,255,255,.8)", marginBottom:10 }}>{p.desc}</p>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {p.tags.map(t=><span key={t} style={{ fontSize:10, color:"rgba(255,255,255,.7)", background:"rgba(255,255,255,.1)", padding:"4px 12px", borderRadius:16 }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            /* Mobile: expandable image cards */
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {PROGRAMS.map((p,i)=>(
                <Reveal key={p.id} delay={i*.05}>
                  <div className="card-h" onClick={()=>setExpandedProg(expandedProg===p.id?null:p.id)}
                    style={{ borderRadius:20, overflow:"hidden", cursor:"pointer", background:"#fff", border:"1px solid rgba(212,197,176,.15)" }}>
                    <div style={{ position:"relative", height:expandedProg===p.id?200:88, transition:"height .6s cubic-bezier(.22,1,.36,1)", overflow:"hidden" }}>
                      <ImgWithFallback src={p.img} alt={p.name} label={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .8s", transform:expandedProg===p.id?"scale(1)":"scale(1.15)" }} />
                      <div style={{ position:"absolute", inset:0, background:expandedProg===p.id?"linear-gradient(180deg,transparent 30%,rgba(61,50,40,.55) 100%)":"linear-gradient(90deg,rgba(61,50,40,.5) 0%,transparent 70%)" }} />
                      <div style={{ position:"absolute", left:20, bottom:expandedProg===p.id?18:0, right:20, top:expandedProg===p.id?"auto":0,
                        display:"flex", alignItems:expandedProg===p.id?"flex-end":"center", justifyContent:"space-between", transition:"all .5s" }}>
                        <div>
                          <div style={{ fontSize:expandedProg===p.id?22:17, fontWeight:500, color:"#fff", transition:"font-size .4s", textShadow:"0 1px 10px rgba(0,0,0,.15)" }}>{p.name}</div>
                          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:12, color:"rgba(255,255,255,.65)", letterSpacing:1.5 }}>{p.eng}</div>
                        </div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,.8)", background:"rgba(255,255,255,.12)", backdropFilter:"blur(8px)", padding:"5px 14px", borderRadius:20 }}>{p.level}</div>
                      </div>
                    </div>
                    <div style={{ maxHeight:expandedProg===p.id?220:0, overflow:"hidden", transition:"max-height .55s cubic-bezier(.22,1,.36,1)" }}>
                      <div style={{ padding:"20px 22px 22px" }}>
                        <p style={{ fontSize:13.5, fontWeight:300, lineHeight:1.85, color:"#6B5D4F", marginBottom:14 }}>{p.desc}</p>
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                          {p.tags.map(t=><span key={t} className="tag" style={{ fontSize:11, color:"#8B7355", background:"rgba(139,115,85,.07)", padding:"5px 14px", borderRadius:20 }}>{t}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ SCHEDULE + PRICING — side by side on desktop ═══ */}
      <section style={{ padding: isDesktop?"0 0 120px":"0 0 80px" }}>
        <div style={{ ...wrap, display: isDesktop?"grid":"block", gridTemplateColumns:"1fr 1fr", gap:48 }}>
          {/* Schedule */}
          <div id="schedule">
            <Reveal>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:7, color:"#B09C80", marginBottom:14 }}>SCHEDULE</div>
              <h3 style={{ fontSize: isDesktop?28:27, fontWeight:500, lineHeight:1.55, color:"#3D3228", marginBottom:28 }}>주간 시간표</h3>
            </Reveal>
            <Reveal delay={0.08}>
              <div style={{ display:"flex", gap:6, marginBottom:20 }}>
                {SCHEDULE.map((s,i)=>(
                  <button key={s.day} onClick={()=>setActiveDay(i)} style={{
                    flex:1, padding:"13px 0", borderRadius:14, border:"none", cursor:"pointer",
                    background:activeDay===i?"#3D3228":"rgba(61,50,40,.04)",
                    color:activeDay===i?"#FAF6F1":"#8B7355",
                    fontSize:14, fontWeight:activeDay===i?500:400,
                    transition:"all .35s cubic-bezier(.22,1,.36,1)",
                    transform:activeDay===i?"scale(1.06)":"scale(1)",
                    boxShadow:activeDay===i?"0 4px 16px rgba(61,50,40,.15)":"none",
                  }}>{s.day}</button>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ background:"#fff", borderRadius:20, padding:"8px 20px 20px", border:"1px solid rgba(212,197,176,.15)" }}>
                {SCHEDULE[activeDay].classes.map((cl,i)=>(
                  <div key={`${activeDay}-${i}`} style={{
                    display:"flex", alignItems:"center", gap:16, padding:"18px 0",
                    borderBottom:i<SCHEDULE[activeDay].classes.length-1?"1px solid rgba(212,197,176,.12)":"none",
                    animation:`slideIn .35s ease ${i*.08}s both`,
                  }}>
                    <div style={{ width:52, height:52, borderRadius:16, background:`${cl.c}22`, display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:"'Cormorant Garamond', serif", fontSize:13, color:"#8B7355", fontWeight:500 }}>{cl.time}</div>
                    <div style={{ fontSize:15.5, fontWeight:400, color:"#3D3228" }}>{cl.name}</div>
                    <div style={{ marginLeft:"auto", width:8, height:8, borderRadius:4, background:cl.c, opacity:.5 }} />
                  </div>
                ))}
                <div style={{ marginTop:12, fontSize:11, color:"#C8BBAA", fontWeight:300, textAlign:"center" }}>시간표는 변동될 수 있어요</div>
              </div>
            </Reveal>
          </div>

          {/* Pricing */}
          <div id="pricing" style={{ marginTop: isDesktop?0:60 }}>
            <Reveal>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:7, color:"#B09C80", marginBottom:14 }}>PRICING</div>
              <h3 style={{ fontSize: isDesktop?28:27, fontWeight:500, lineHeight:1.55, color:"#3D3228", marginBottom:28 }}>수강 안내</h3>
            </Reveal>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {PRICING.map((p,i)=>(
                <Reveal key={i} delay={i*.05}>
                  <div style={{
                    background:p.hl?"linear-gradient(145deg,#3D3228,#564939)":"#fff",
                    borderRadius:18, padding:"22px 24px",
                    border:p.hl?"none":"1px solid rgba(212,197,176,.15)",
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    position:"relative", overflow:"hidden",
                    boxShadow:p.hl?"0 8px 32px rgba(61,50,40,.12)":"none",
                  }}>
                    {p.hl && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#8B7355,#D4C5B0,#8B7355)" }} />}
                    {p.hl && <div style={{ position:"absolute", top:12, right:16, fontSize:10, color:"rgba(212,197,176,.4)", fontFamily:"'Cormorant Garamond', serif", letterSpacing:3 }}>BEST</div>}
                    <div>
                      <div style={{ fontSize:15, fontWeight:p.hl?500:400, color:p.hl?"#FAF6F1":"#3D3228" }}>{p.name}</div>
                      {p.sub && <div style={{ fontSize:11, color:p.hl?"rgba(250,246,241,.45)":"#B09C80", marginTop:3 }}>{p.sub}</div>}
                    </div>
                    <div style={{ fontSize:18, fontWeight:500, color:p.hl?"#D4C5B0":"#8B7355", fontFamily:"'Cormorant Garamond', serif" }}>{p.price}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <button className="cta-btn" onClick={()=>scrollTo("contact")} style={{
                marginTop:24, width:"100%", background:"#8B7355", color:"#FAF6F1", border:"none",
                padding:"17px", borderRadius:32, fontSize:14.5, fontWeight:400, letterSpacing:2,
              }}>체험수업 무료 신청하기</button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section id="reviews" style={{ padding: isDesktop?"80px 0 120px":"60px 0 80px", background:"linear-gradient(180deg, #FAF6F1 0%, #F3EDE5 100%)" }}>
        <div style={wrap}>
          <Reveal>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:7, color:"#B09C80", marginBottom:14 }}>REVIEWS</div>
            <h3 style={{ fontSize: isDesktop?32:27, fontWeight:500, lineHeight:1.55, color:"#3D3228", marginBottom:8 }}>회원님들의 후기</h3>
            <p style={{ fontSize:13.5, fontWeight:300, color:"#9B8D7D", marginBottom: isDesktop?40:28 }}>실제 회원님들이 남겨주신 소중한 이야기</p>
          </Reveal>

          {/* Rating summary */}
          <Reveal delay={0.08}>
            <div style={{
              display: isDesktop?"flex":"flex", gap: isDesktop?40:0,
              background:"#fff", borderRadius:22, padding: isDesktop?"36px 40px":"28px 24px",
              border:"1px solid rgba(212,197,176,.15)", marginBottom: isDesktop?40:28,
              boxShadow:"0 2px 16px rgba(61,50,40,.03)",
              flexDirection: isDesktop?"row":"column", alignItems: isDesktop?"center":"stretch",
            }}>
              {/* Left: big score */}
              <div style={{ textAlign:"center", minWidth: isDesktop?160:"auto", marginBottom: isDesktop?0:24, paddingBottom: isDesktop?0:24, borderBottom: isDesktop?"none":"1px solid rgba(212,197,176,.12)" }}>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize: isDesktop?56:48, fontWeight:300, color:"#3D3228", lineHeight:1 }}>{REVIEW_STATS.avg}</div>
                <div style={{ display:"flex", justifyContent:"center", gap:3, margin:"10px 0 6px" }}>
                  {[1,2,3,4,5].map(s=>(
                    <span key={s} style={{ fontSize: isDesktop?18:16, color:"#D4A853" }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize:12, color:"#B09C80" }}>{REVIEW_STATS.total}개의 후기</div>
              </div>

              {/* Right: category bars */}
              <div style={{ flex:1 }}>
                {REVIEW_STATS.bars.map((bar,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap: isDesktop?16:12, marginBottom: i<REVIEW_STATS.bars.length-1?14:0 }}>
                    <div style={{ fontSize:13, color:"#6B5D4F", minWidth: isDesktop?90:76, fontWeight:400 }}>{bar.label}</div>
                    <div style={{ flex:1, height:8, borderRadius:4, background:"rgba(212,197,176,.2)", overflow:"hidden" }}>
                      <div style={{ width:`${(bar.score/5)*100}%`, height:"100%", borderRadius:4, background:"linear-gradient(90deg, #D4A853, #C49A40)", transition:"width 1.5s cubic-bezier(.22,1,.36,1)" }} />
                    </div>
                    <div style={{ fontSize:13, color:"#8B7355", fontWeight:500, minWidth:28, textAlign:"right" }}>{bar.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Review cards */}
          <div style={{
            display:"grid",
            gridTemplateColumns: isWide?"repeat(2, 1fr)":"1fr",
            gap: isDesktop?16:12,
          }}>
            {REVIEWS.slice(reviewPage * REVIEWS_PER_PAGE, (reviewPage + 1) * REVIEWS_PER_PAGE).map((r,i)=>(
              <Reveal key={`${reviewPage}-${i}`} delay={i*.06}>
                <div style={{
                  background:"#fff", borderRadius:18, padding: isDesktop?"28px 28px":"22px 20px",
                  border:"1px solid rgba(212,197,176,.12)",
                  transition:"all .35s ease",
                  position:"relative", overflow:"hidden",
                }}>
                  {/* Header: name, rating, date */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      {/* Avatar circle */}
                      <div style={{
                        width:40, height:40, borderRadius:"50%",
                        background:"linear-gradient(135deg, #EDE6DC, #D4C5B0)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:14, fontWeight:500, color:"#8B7355",
                      }}>{r.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:500, color:"#3D3228" }}>{r.name}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:2 }}>
                          <div style={{ display:"flex", gap:1 }}>
                            {[1,2,3,4,5].map(s=>(
                              <span key={s} style={{ fontSize:11, color: s<=r.rating?"#D4A853":"#E5E0D8" }}>★</span>
                            ))}
                          </div>
                          <span style={{ fontSize:11, color:"#C8BBAA" }}>·</span>
                          <span style={{ fontSize:11, color:"#C8BBAA" }}>{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize:11, color:"#8B7355", background:"rgba(139,115,85,.06)",
                      padding:"4px 12px", borderRadius:16, fontWeight:400, whiteSpace:"nowrap",
                    }}>{r.type}</div>
                  </div>

                  {/* Review text */}
                  <p style={{ fontSize:13.5, fontWeight:300, lineHeight:1.85, color:"#5C5044", marginBottom: r.reply?14:10 }}>{r.text}</p>

                  {/* Owner reply */}
                  {r.reply && (
                    <div style={{
                      background:"rgba(139,115,85,.04)", borderRadius:12, padding:"14px 16px",
                      borderLeft:"3px solid rgba(139,115,85,.2)", marginBottom:10,
                    }}>
                      <div style={{ fontSize:11, color:"#8B7355", fontWeight:500, marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:13 }}>💛</span> Sara 원장
                      </div>
                      <p style={{ fontSize:12.5, fontWeight:300, lineHeight:1.75, color:"#6B5D4F" }}>{r.reply}</p>
                    </div>
                  )}

                  {/* Tags */}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {r.tags.map(t=>(
                      <span key={t} style={{ fontSize:10.5, color:"#B09C80", background:"rgba(176,156,128,.08)", padding:"3px 10px", borderRadius:12 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Pagination */}
          <Reveal delay={0.3}>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:16, marginTop:28 }}>
              <button onClick={()=>setReviewPage(Math.max(0, reviewPage-1))} disabled={reviewPage===0}
                style={{
                  width:40, height:40, borderRadius:"50%", border:"1px solid rgba(212,197,176,.25)",
                  background: reviewPage===0?"transparent":"#fff", cursor: reviewPage===0?"default":"pointer",
                  opacity: reviewPage===0?.3:1, transition:"all .3s", fontSize:16, color:"#8B7355",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>‹</button>

              <div style={{ display:"flex", gap:8 }}>
                {Array.from({ length: Math.ceil(REVIEWS.length / REVIEWS_PER_PAGE) }).map((_,i)=>(
                  <button key={i} onClick={()=>setReviewPage(i)} style={{
                    width:10, height:10, borderRadius:5, border:"none", cursor:"pointer",
                    background: reviewPage===i?"#8B7355":"rgba(212,197,176,.3)",
                    transition:"all .3s ease",
                    transform: reviewPage===i?"scale(1.2)":"scale(1)",
                  }} />
                ))}
              </div>

              <button onClick={()=>setReviewPage(Math.min(Math.ceil(REVIEWS.length/REVIEWS_PER_PAGE)-1, reviewPage+1))}
                disabled={reviewPage >= Math.ceil(REVIEWS.length/REVIEWS_PER_PAGE)-1}
                style={{
                  width:40, height:40, borderRadius:"50%", border:"1px solid rgba(212,197,176,.25)",
                  background: reviewPage>=Math.ceil(REVIEWS.length/REVIEWS_PER_PAGE)-1?"transparent":"#fff",
                  cursor: reviewPage>=Math.ceil(REVIEWS.length/REVIEWS_PER_PAGE)-1?"default":"pointer",
                  opacity: reviewPage>=Math.ceil(REVIEWS.length/REVIEWS_PER_PAGE)-1?.3:1,
                  transition:"all .3s", fontSize:16, color:"#8B7355",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>›</button>
            </div>
          </Reveal>

          {/* CTA under reviews */}
          <Reveal delay={0.35}>
            <div style={{ textAlign:"center", marginTop:32 }}>
              <p style={{ fontSize:13, color:"#9B8D7D", marginBottom:16, fontWeight:300 }}>직접 경험해보세요</p>
              <button className="cta-btn" onClick={()=>scrollTo("contact")} style={{
                background:"#3D3228", color:"#FAF6F1", border:"none",
                padding:"15px 36px", borderRadius:32, fontSize:14, fontWeight:400, letterSpacing:1.5,
              }}>무료 체험수업 신청</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ BLOG ═══ */}
      <section id="blog" style={{ padding: isDesktop?"0 0 120px":"0 0 80px" }}>
        <div style={wrap}>
          <Reveal>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:7, color:"#B09C80", marginBottom:14 }}>BLOG</div>
            <h3 style={{ fontSize: isDesktop?32:27, fontWeight:500, lineHeight:1.55, color:"#3D3228", marginBottom: isDesktop?36:28 }}>사라요가 이야기</h3>
          </Reveal>
        </div>

        {isDesktop ? (
          <div style={wrap}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20 }}>
              {BLOG_POSTS.map((post,i)=>(
                <Reveal key={i} delay={i*.06}>
                  <a href={`/blog/${post.slug}.html`} style={{ textDecoration:"none" }}>
                    <div className="blog-card" style={{ borderRadius:20, overflow:"hidden", background:"#fff", border:"1px solid rgba(212,197,176,.12)", cursor:"pointer" }}>
                      <div style={{ height:160, overflow:"hidden" }}>
                        <ImgWithFallback src={post.img} alt={post.title} label={post.cat} className="img-cv" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                      </div>
                      <div style={{ padding:"18px 20px 20px" }}>
                        <div style={{ fontSize:10, color:"#8B7355", background:"rgba(139,115,85,.08)", padding:"3px 10px", borderRadius:16, display:"inline-block", marginBottom:10 }}>{post.cat}</div>
                        <div style={{ fontSize:14, fontWeight:400, color:"#3D3228", lineHeight:1.6, marginBottom:10 }}>{post.title}</div>
                        <div style={{ fontSize:11, color:"#C8BBAA" }}>{post.date}</div>
                      </div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-scroll" style={{ gap:14, paddingLeft:24, paddingRight:24, paddingBottom:8 }}>
            {BLOG_POSTS.map((post,i)=>(
              <div key={i} style={{ flex:"0 0 80%" }}>
                <Reveal delay={i*.05} dir="left">
                  <a href={`/blog/${post.slug}.html`} style={{ textDecoration:"none" }}>
                    <div className="card-h" style={{ borderRadius:20, overflow:"hidden", background:"#fff", border:"1px solid rgba(212,197,176,.12)", cursor:"pointer" }}>
                      <div style={{ height:150, overflow:"hidden" }}>
                        <ImgWithFallback src={post.img} alt={post.title} label={post.cat} className="img-cv" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                      </div>
                      <div style={{ padding:"16px 20px 20px" }}>
                        <div style={{ fontSize:10, color:"#fff", background:"rgba(61,50,40,.45)", backdropFilter:"blur(8px)", padding:"4px 12px", borderRadius:20, display:"inline-block", marginBottom:8 }}>{post.cat}</div>
                        <div style={{ fontSize:14, fontWeight:400, color:"#3D3228", lineHeight:1.65, marginBottom:10 }}>{post.title}</div>
                        <div style={{ fontSize:11, color:"#C8BBAA" }}>{post.date}</div>
                      </div>
                    </div>
                  </a>
                </Reveal>
              </div>
            ))}
          </div>
        )}

        <Reveal delay={0.3} style={{ textAlign:"center", marginTop:24, ...wrap }}>
          <a href="/blog" style={{
            fontSize:13, color:"#8B7355", textDecoration:"none", borderBottom:"1px solid rgba(139,115,85,.25)", paddingBottom:3, letterSpacing:1,
          }}>블로그 전체 보기 →</a>
        </Reveal>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" style={{ position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, #5A4B3B 0%, #3D3228 100%)", backgroundImage:`url(${IMG.contact})`, backgroundSize:"cover", backgroundPosition:"center" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, rgba(61,50,40,.72), rgba(61,50,40,.88))", backdropFilter:"blur(2px)" }} />

        <div style={{ position:"relative", zIndex:2, padding: isDesktop?"100px 0 60px":"80px 0 44px", maxWidth:1200, margin:"0 auto" }}>
          <div style={{ ...wrap, display: isDesktop?"grid":"block", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
            {/* Left */}
            <Reveal>
              <div style={{ textAlign: isDesktop?"left":"center", marginBottom: isDesktop?0:36 }}>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:11, letterSpacing:7, color:"rgba(212,197,176,.5)", marginBottom:16 }}>CONTACT</div>
                <h3 style={{ fontSize: isDesktop?40:30, fontWeight:300, color:"#FAF6F1", lineHeight:1.5, fontFamily:"'Cormorant Garamond', serif" }}>
                  사라요가에서<br/>만나요
                </h3>
                <p style={{ fontSize: isDesktop?15:13.5, fontWeight:300, color:"rgba(250,246,241,.55)", lineHeight:1.8, marginTop:14 }}>
                  첫 체험수업은 무료예요. 편하게 연락 주세요.
                </p>
                <div style={{ display:"flex", flexDirection: isDesktop?"row":"column", gap:12, marginTop:28, justifyContent: isDesktop?"flex-start":"center" }}>
                  <a href="tel:010-9773-4256" className="cta-btn" style={{
                    display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                    background:"#8B7355", color:"#FAF6F1", borderRadius:16, padding: isDesktop?"16px 32px":"18px",
                    textDecoration:"none", fontSize:15, fontWeight:400, letterSpacing:1.5,
                  }}>📞 전화 문의</a>
                  <a href="https://www.instagram.com/sara_yoga_studio" target="_blank" rel="noopener noreferrer" style={{
                    display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                    background:"rgba(250,246,241,.08)", backdropFilter:"blur(12px)",
                    color:"#FAF6F1", borderRadius:16, padding: isDesktop?"16px 32px":"18px",
                    textDecoration:"none", fontSize:15, fontWeight:400, border:"1px solid rgba(250,246,241,.12)", letterSpacing:1.5,
                  }}>📷 인스타그램 DM</a>
                </div>
              </div>
            </Reveal>

            {/* Right — info card */}
            <Reveal delay={0.15}>
              <div style={{ background:"rgba(250,246,241,.06)", backdropFilter:"blur(20px)", borderRadius:24, padding: isDesktop?36:26, border:"1px solid rgba(250,246,241,.08)" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, color:"#FAF6F1", letterSpacing:3, marginBottom:18 }}>Sara Yoga Studio</div>
                  <div style={{ fontSize:13.5, fontWeight:300, lineHeight:2.1, color:"rgba(250,246,241,.6)" }}>
                    대전 중구 계룡로 874번길 18, 3층<br/>(오류동, 한양고깃집 건물)
                  </div>
                  <div style={{ marginTop:16, fontSize:14, color:"#D4C5B0", fontWeight:400 }}>서대전네거리역 4번출구 도보 2분</div>
                  <div style={{ marginTop:16, width:"100%", height:1, background:"rgba(250,246,241,.08)" }} />
                  <div style={{ marginTop:16, fontSize:12, color:"rgba(250,246,241,.35)" }}>스케줄에 따라 운영 · 일요일 휴무</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: isDesktop?"44px 48px 44px":"36px 24px 56px", background:"#3D3228" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display: isDesktop?"flex":"block", justifyContent:"space-between", alignItems:"center", textAlign: isDesktop?"left":"center" }}>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, color:"rgba(139,115,85,.6)", letterSpacing:4, marginBottom:6 }}>Sara Yoga Studio</div>
            <div style={{ fontSize:11, fontWeight:300, color:"rgba(176,156,128,.35)", lineHeight:1.8 }}>원장 직강 · 소수정예 6명 · 1:1 교정</div>
          </div>
          <div style={{ marginTop: isDesktop?0:16, display:"flex", justifyContent: isDesktop?"flex-end":"center", gap:24, fontSize:12 }}>
            <a href="/blog" style={{ color:"rgba(176,156,128,.45)", textDecoration:"none" }}>Blog</a>
            <a href="https://www.instagram.com/sara_yoga_studio" target="_blank" rel="noopener noreferrer" style={{ color:"rgba(176,156,128,.45)", textDecoration:"none" }}>Instagram</a>
          </div>
        </div>
        <div style={{ maxWidth:1200, margin:"20px auto 0", textAlign:"center", fontSize:10, color:"rgba(176,156,128,.2)" }}>© 2023–2026 Sara Yoga Studio</div>
      </footer>

      {/* ═══ FLOATING CTA (mobile only) ═══ */}
      {!isDesktop && (
        <div style={{
          position:"fixed", bottom:24, left:"50%",
          transform:`translateX(-50%) translateY(${scrollY>500?0:24}px)`,
          zIndex:50, opacity:scrollY>500?1:0,
          transition:"all .5s cubic-bezier(.22,1,.36,1)",
          pointerEvents:scrollY>500?"auto":"none",
        }}>
          <button className="cta-btn" onClick={()=>scrollTo("contact")} style={{
            background:"#3D3228", color:"#FAF6F1", border:"1px solid rgba(139,115,85,.15)",
            padding:"14px 28px", borderRadius:32, fontSize:13, fontWeight:400,
            letterSpacing:1.5, boxShadow:"0 8px 32px rgba(61,50,40,.35)",
            display:"flex", alignItems:"center", gap:10, backdropFilter:"blur(12px)",
          }}>
            <span style={{ width:6, height:6, borderRadius:3, background:"#8B7355" }} />
            체험수업 신청
          </button>
        </div>
      )}
    </div>
  );
}
