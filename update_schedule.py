#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Replace weekly schedule with monthly grid schedule in index.html"""

import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ═══ 1. Replace schedule CSS (between "Schedule + Pricing" and "Reviews" comments) ═══
old_css = """/* ── Schedule + Pricing ── */
.schedule-pricing{padding:0 0 80px}
.sp-grid{display:block}
.day-tabs{display:flex;gap:6px;margin-bottom:20px}
.day-tab{flex:1;padding:13px 0;border-radius:14px;border:none;cursor:pointer;font-size:14px;font-family:inherit;transition:all .35s cubic-bezier(.22,1,.36,1);background:rgba(61,50,40,.04);color:var(--gold)}
.day-tab.active{background:var(--brown);color:#FAF6F1;transform:scale(1.06);box-shadow:0 4px 16px rgba(61,50,40,.15);font-weight:500}
.schedule-card{background:#fff;border-radius:20px;padding:8px 20px 20px;border:1px solid var(--border)}
.class-row{display:flex;align-items:center;gap:16px;padding:18px 0;border-bottom:1px solid rgba(212,197,176,.12);animation:slideIn .35s ease both}
.class-row:last-of-type{border-bottom:none}
.class-time{width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--gold);font-weight:500}
.class-name{font-size:15.5px;color:var(--brown)}
.class-dot{margin-left:auto;width:8px;height:8px;border-radius:4px;opacity:.5}
.pricing-section{margin-top:60px}"""

new_css = """/* ── Schedule + Pricing ── */
.schedule-pricing{padding:0 0 80px}
.sp-grid{display:block}
.pricing-section{margin-top:60px}

/* Monthly Calendar */
.cal-wrap{background:#fff;border-radius:20px;padding:24px 20px 20px;border:1px solid var(--border);overflow:hidden}
.cal-nav{display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:24px}
.cal-nav-btn{background:none;border:1px solid var(--border);width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:16px;transition:all .3s}
.cal-nav-btn:hover{background:var(--brown);color:#FAF6F1;border-color:var(--brown)}
.cal-month{font-size:18px;font-weight:500;color:var(--brown);min-width:140px;text-align:center}
.cal-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.cal-table{width:100%;min-width:640px;border-collapse:separate;border-spacing:0}
.cal-table th{font-size:12px;letter-spacing:3px;color:var(--lgray);padding:10px 4px;text-align:center;font-weight:400;border-bottom:1px solid rgba(212,197,176,.15)}
.cal-table td{vertical-align:top;padding:6px 3px;border-bottom:1px solid rgba(212,197,176,.08);min-width:88px}
.cal-time{font-size:12px;font-weight:500;color:var(--gold);padding:10px 8px;vertical-align:top;white-space:nowrap;min-width:80px;border-right:1px solid rgba(212,197,176,.12)}
.cal-chip{display:inline-block;padding:6px 10px;border-radius:10px;font-size:12.5px;font-weight:500;line-height:1.35;width:100%;text-align:center;transition:transform .2s}
.cal-chip:hover{transform:scale(1.04)}
.cal-chip .cal-teacher{display:block;font-size:10px;font-weight:400;margin-top:2px;opacity:.7}
.cal-private{text-align:center;padding:14px 8px;font-size:12px;color:var(--gray);line-height:1.5}
.cal-private strong{display:block;font-size:13px;color:var(--brown);font-weight:500;margin-bottom:2px}
.cal-empty{background:rgba(212,197,176,.04);border-radius:8px;min-height:36px}
.cal-footer{margin-top:20px;padding:16px 0 0;border-top:1px solid rgba(212,197,176,.12)}
.cal-legend{display:flex;flex-wrap:wrap;gap:8px 14px;margin-bottom:14px;justify-content:center}
.cal-legend-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--gray)}
.cal-legend-dot{width:10px;height:10px;border-radius:4px;flex-shrink:0}
.cal-notice{font-size:11.5px;color:var(--lgray);text-align:center;line-height:1.7}
.cal-notice span{display:inline-block;margin:0 4px}"""

html = html.replace(old_css, new_css)

# ═══ 2. Replace desktop responsive CSS for schedule ═══
old_responsive = """  .schedule-pricing{padding:0 0 120px}
  .sp-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;max-width:1200px;margin:0 auto;padding:0 48px}
  .sp-grid .wrap{display:contents}
  .pricing-section{margin-top:0}"""

new_responsive = """  .schedule-pricing{padding:0 0 120px}
  .sp-grid{display:block;max-width:1200px;margin:0 auto;padding:0 48px}
  .pricing-section{margin-top:48px;max-width:600px}
  .cal-table td{min-width:100px}
  .cal-chip{font-size:13px;padding:8px 10px}"""

html = html.replace(old_responsive, new_responsive)

# ═══ 3. Replace schedule HTML section ═══
old_html = """      <div id="schedule">
        <div class="reveal"><div class="serif label">SCHEDULE</div><h3 style="font-size:27px;font-weight:500;line-height:1.55;margin-bottom:28px">주간 시간표</h3></div>
        <div class="reveal" style="transition-delay:.08s"><div class="day-tabs" id="day-tabs"></div></div>
        <div class="reveal" style="transition-delay:.12s"><div class="schedule-card" id="schedule-classes"></div></div>
      </div>"""

new_html = """      <div id="schedule">
        <div class="reveal"><div class="serif label">SCHEDULE</div><h3 style="font-size:27px;font-weight:500;line-height:1.55;margin-bottom:28px">월간 시간표</h3></div>
        <div class="reveal" style="transition-delay:.1s">
          <div class="cal-wrap">
            <div class="cal-nav">
              <button class="cal-nav-btn" onclick="changeMonth(-1)" aria-label="이전 달">&#8249;</button>
              <div class="cal-month" id="cal-month-label"></div>
              <button class="cal-nav-btn" onclick="changeMonth(1)" aria-label="다음 달">&#8250;</button>
            </div>
            <div class="cal-scroll">
              <table class="cal-table" id="cal-table"></table>
            </div>
            <div class="cal-footer">
              <div class="cal-legend" id="cal-legend"></div>
              <div class="cal-notice">
                예약 및 취소는 수업 <strong>2시간 전</strong>까지 가능합니다<br>
                개인/듀엣 레슨 문의 <strong>010-9773-4256</strong><span>·</span>주말 원데이클래스는 별도 공지
              </div>
            </div>
          </div>
        </div>
      </div>"""

html = html.replace(old_html, new_html)

# ═══ 4. Replace JS SCHEDULE data and functions ═══
old_schedule_data = """var SCHEDULE=[
{day:"월",classes:[{time:"10:00",name:"하타플로우",c:"#A8C5A0"},{time:"19:30",name:"플라잉요가",c:"#C5A8B8"}]},
{day:"화",classes:[{time:"10:00",name:"빈야사",c:"#C5B8A0"},{time:"19:30",name:"인사이드플로우",c:"#A0B8C5"}]},
{day:"수",classes:[{time:"10:00",name:"도구테라피",c:"#B8A0C5"},{time:"19:30",name:"플라잉요가",c:"#C5A8B8"}]},
{day:"목",classes:[{time:"10:00",name:"하타플로우",c:"#A8C5A0"},{time:"19:30",name:"빈야사",c:"#C5B8A0"}]},
{day:"금",classes:[{time:"10:00",name:"서포트요가",c:"#C5C0A0"},{time:"19:30",name:"인사이드플로우",c:"#A0B8C5"}]},
{day:"토",classes:[{time:"10:00",name:"주말 원데이클래스",c:"#C5A0A0"}]}
];"""

new_schedule_data = """// ── Class color chips ──
var CLASS_COLORS={
  "플라잉":{bg:"#FFF0E8",fg:"#D85A30"},
  "인사이드플로우":{bg:"#E8F0FF",fg:"#2563A8"},
  "빈야사":{bg:"#FFF8E1",fg:"#B87A17"},
  "이지빈야사":{bg:"#FFF8E1",fg:"#B87A17"},
  "빈야사플로우":{bg:"#FFF8E1",fg:"#B87A17"},
  "테라피빈야사":{bg:"#FFF8E1",fg:"#B87A17"},
  "도구테라피":{bg:"#F0E8FF",fg:"#7C4DFF"},
  "하타":{bg:"#E8F5E9",fg:"#2D6B4F"},
  "서포트요가":{bg:"#FBE8F0",fg:"#D4537E"},
  "테마요가":{bg:"#F5F0E8",fg:"#8B7355"},
  "얼라인먼트플로우":{bg:"#E0F2F1",fg:"#00897B"},
  "로우플라잉":{bg:"#FFF0E8",fg:"#D85A30"}
};

var WEEKLY={
  "10:00~11:00":{
    "월":{name:"이지빈야사"},
    "화":{name:"플라잉"},
    "수":{name:"빈야사/테마요가"},
    "목":{name:"인사이드플로우"},
    "금":{name:"도구테라피"},
    "토":{name:"도구테라피"}
  },
  "18:40~19:40":{
    "월":{name:"이지빈야사"},
    "화":{name:"빈야사플로우",teacher:"다혜T"},
    "수":{name:"플라잉",teacher:"지혜T"},
    "목":{name:"테마요가"},
    "금":{name:"도구테라피"}
  },
  "20:00~21:00":{
    "월":{name:"플라잉"},
    "화":{name:"테라피빈야사",teacher:"다혜T"},
    "수":{name:"서포트요가",teacher:"지혜T"},
    "목":{name:"인사이드플로우"},
    "금":{name:"도구테라피"}
  },
  "21:10~22:10":{
    "월":{name:"얼라인먼트플로우"},
    "화":{name:"로우플라잉",teacher:"다혜T"},
    "수":{name:"빈야사"},
    "목":{name:"테라피빈야사"}
  }
};

var calYear=new Date().getFullYear();
var calMonth=new Date().getMonth();"""

html = html.replace(old_schedule_data, new_schedule_data)

# ═══ 5. Replace old schedule JS functions ═══
old_schedule_fn = """// ── SCHEDULE ──
function renderSchedule(){
  var tabs=document.getElementById('day-tabs');
  SCHEDULE.forEach(function(s,i){
    tabs.innerHTML+='<button class="day-tab'+(i===activeDay?' active':'')+'" onclick="setDay('+i+')">'+s.day+'</button>';
  });
  updateSchedule();
}
function setDay(i){
  activeDay=i;
  document.querySelectorAll('.day-tab').forEach(function(b,j){b.classList.toggle('active',j===i);});
  updateSchedule();
}
function updateSchedule(){
  var el=document.getElementById('schedule-classes');
  var classes=SCHEDULE[activeDay].classes;
  el.innerHTML=classes.map(function(cl,i){
    return '<div class="class-row" style="animation-delay:'+i*.08+'s;border-bottom:'+(i<classes.length-1?'1px solid rgba(212,197,176,.12)':'none')+'"><div class="class-time" style="background:'+cl.c+'22">'+cl.time+'</div><div class="class-name">'+cl.name+'</div><div class="class-dot" style="background:'+cl.c+'"></div></div>';
  }).join('')+'<div style="margin-top:12px;font-size:11px;color:#C8BBAA;font-weight:300;text-align:center">시간표는 변동될 수 있어요</div>';
}"""

new_schedule_fn = r"""// ── SCHEDULE (Monthly Grid) ──
function getColorForClass(name){
  var key=Object.keys(CLASS_COLORS).find(function(k){return name.indexOf(k)!==-1;});
  return key?CLASS_COLORS[key]:{bg:"#F5F0E8",fg:"#8B7355"};
}

function changeMonth(delta){
  calMonth+=delta;
  if(calMonth>11){calMonth=0;calYear++;}
  if(calMonth<0){calMonth=11;calYear--;}
  renderSchedule();
}

function renderSchedule(){
  var DAYS=["월","화","수","목","금","토"];
  var TIMES=Object.keys(WEEKLY);
  var label=document.getElementById('cal-month-label');
  var monthNames=["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  label.textContent=calYear+"년 "+monthNames[calMonth];

  var thead='<thead><tr><th style="min-width:80px"></th>';
  DAYS.forEach(function(d){thead+='<th>'+d+'</th>';});
  thead+='</tr></thead>';

  var tbody='<tbody>';

  // Morning row
  var t0=TIMES[0];
  tbody+='<tr><td class="cal-time">'+t0+'</td>';
  DAYS.forEach(function(d){
    var cls=WEEKLY[t0][d];
    if(cls){
      var c=getColorForClass(cls.name);
      tbody+='<td><div class="cal-chip" style="background:'+c.bg+';color:'+c.fg+'">'+cls.name+(cls.teacher?'<span class="cal-teacher">'+cls.teacher+'</span>':'')+'</div></td>';
    }else{
      tbody+='<td><div class="cal-empty"></div></td>';
    }
  });
  tbody+='</tr>';

  // Private lesson row
  tbody+='<tr><td class="cal-time">11:00~18:00</td><td colspan="6" class="cal-private"><strong>프라이빗 개인레슨 / 듀엣레슨</strong>010-9773-4256</td></tr>';

  // Evening rows
  for(var ti=1;ti<TIMES.length;ti++){
    var t=TIMES[ti];
    tbody+='<tr><td class="cal-time">'+t+'</td>';
    DAYS.forEach(function(d){
      var cls=WEEKLY[t]?WEEKLY[t][d]:null;
      if(d==="토"){
        if(ti===1) tbody+='<td rowspan="3" style="vertical-align:middle;text-align:center;padding:12px 6px;font-size:11.5px;color:var(--lgray);line-height:1.6;background:rgba(212,197,176,.04);border-radius:10px">주말<br>원데이클래스<br><span style="font-size:10px">별도 공지</span></td>';
        return;
      }
      if(cls){
        var c=getColorForClass(cls.name);
        tbody+='<td><div class="cal-chip" style="background:'+c.bg+';color:'+c.fg+'">'+cls.name+(cls.teacher?'<span class="cal-teacher">'+cls.teacher+'</span>':'')+'</div></td>';
      }else{
        tbody+='<td><div class="cal-empty"></div></td>';
      }
    });
    tbody+='</tr>';
  }
  tbody+='</tbody>';

  document.getElementById('cal-table').innerHTML=thead+tbody;

  // Legend
  var legendItems=[
    {name:"플라잉",bg:"#FFF0E8",fg:"#D85A30"},
    {name:"인사이드플로우",bg:"#E8F0FF",fg:"#2563A8"},
    {name:"빈야사계열",bg:"#FFF8E1",fg:"#B87A17"},
    {name:"도구테라피",bg:"#F0E8FF",fg:"#7C4DFF"},
    {name:"서포트요가",bg:"#FBE8F0",fg:"#D4537E"},
    {name:"테마요가",bg:"#F5F0E8",fg:"#8B7355"},
    {name:"얼라인먼트",bg:"#E0F2F1",fg:"#00897B"}
  ];
  var leg=document.getElementById('cal-legend');
  leg.innerHTML=legendItems.map(function(l){
    return '<div class="cal-legend-item"><div class="cal-legend-dot" style="background:'+l.fg+'"></div>'+l.name+'</div>';
  }).join('');
}"""

html = html.replace(old_schedule_fn, new_schedule_fn)

# ═══ 6. Remove old activeDay state variable ═══
html = html.replace(
    "var activeDay=(function(){var d=new Date().getDay();return d===0?5:d-1;})();",
    ""
)

# Write back with UTF-8 (no BOM)
with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(html)

print("Done! Schedule section replaced successfully.")
