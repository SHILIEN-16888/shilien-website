
window.SHILIEN = {
  phone_display: "04-2337-2669",
  phone_raw: "0423372669",
  email: "admin@shilien.com",
  line_url: "https://line.me/R/ti/p/@029kpqds",
  map_url: "https://www.google.com/maps/search/?api=1&query=台中市烏日區三榮路一段350號",
  booking_api_url: "https://script.google.com/macros/s/AKfycbyF8U9t1FcEIgtUl9GrrYBKQbsEMOW_1vaclkAT9OkdPqBF4TTsyYumtRWziEErBrODug/exec",
  content_api_url: "https://script.google.com/macros/s/AKfycbyF8U9t1FcEIgtUl9GrrYBKQbsEMOW_1vaclkAT9OkdPqBF4TTsyYumtRWziEErBrODug/exec"
};

(() => {
  "use strict";
  const c = window.SHILIEN;
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => [...r.querySelectorAll(s)];

  function bindBase() {
    qsa("[data-phone]").forEach(el => { el.textContent=c.phone_display; el.href=`tel:${c.phone_raw}`; });
    qsa("[data-email]").forEach(el => { el.textContent=c.email; el.href=`mailto:${c.email}`; });
    qsa("[data-line]").forEach(el => { el.href=c.line_url; el.target="_blank"; el.rel="noopener noreferrer"; });
    qsa("[data-map]").forEach(el => { el.href=c.map_url; el.target="_blank"; el.rel="noopener noreferrer"; });
    qsa("[data-year]").forEach(el => el.textContent=new Date().getFullYear());
    const menu=qs(".menu"), nav=qs(".navlinks");
    if(menu&&nav) menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));});
  }

  function animate() {
    if(!("IntersectionObserver" in window)) return qsa(".reveal").forEach(el=>el.classList.add("show"));
    const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("show")),{threshold:.12});
    qsa(".reveal").forEach(el=>io.observe(el));
    qsa("[data-count]").forEach(el=>{
      const target=Number(el.dataset.count||0);
      const co=new IntersectionObserver(es=>{if(!es[0]?.isIntersecting)return;const s=performance.now(),d=1200;const f=n=>{const p=Math.min((n-s)/d,1);el.textContent=Math.floor(target*p);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f);co.disconnect();},{threshold:.5});
      co.observe(el);
    });
  }

  window.SHILIEN_CONTENT_CALLBACK = function(payload) {
    if(!payload || !payload.ok || !payload.content) return;
    const content=payload.content;
    qsa("[data-content]").forEach(el=>{
      const key=el.dataset.content;
      if(content[key]!==undefined && content[key]!==null) el.textContent=String(content[key]);
    });
    if(content.phone_display) { c.phone_display=content.phone_display; c.phone_raw=String(content.phone_display).replace(/\D/g,""); }
    if(content.email) c.email=content.email;
    if(content.line_url) c.line_url=content.line_url;
    bindBase();
    const announcement=qs("#siteAnnouncement");
    if(announcement && content.announcement) { announcement.textContent=content.announcement; announcement.classList.add("show"); }
    renderCollection("servicesGrid", content.services, service => `<article class="card"><span class="num">${escapeHtml(service.no||"")}</span><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.description)}</p><a href="services.html">了解更多 →</a></article>`);
    renderCollection("newsGrid", content.news, item => `<article class="news-card"><small>${escapeHtml(item.date||"公告")}</small><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary||"")}</p></article>`);
    renderCollection("faqList", content.faq, item => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`);
  };

  function renderCollection(id, items, renderer) {
    const el=document.getElementById(id);
    if(!el || !Array.isArray(items) || !items.length) return;
    el.innerHTML=items.filter(x=>x && x.enabled!==false).map(renderer).join("");
  }

  function loadContent() {
    if(!c.content_api_url) return;
    const script=document.createElement("script");
    script.src=`${c.content_api_url}?action=content&callback=SHILIEN_CONTENT_CALLBACK&t=${Date.now()}`;
    script.async=true;
    script.onerror=()=>console.warn("網站內容 API 暫時無法讀取，使用靜態備援內容。");
    document.head.appendChild(script);
  }

  const escapeHtml = v => String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
  const clean = (fd,k,f="無") => (String(fd.get(k)||"").trim()||f);
  const formatDate = s => {
    if(!s)return ""; const days=["日","一","二","三","四","五","六"], d=new Date(`${s}T00:00:00`), [y,m,day]=s.split("-");
    return `${y}/${m}/${day}（${days[d.getDay()]}）`;
  };
  const requestId = () => (crypto.randomUUID ? crypto.randomUUID() : `SLWEB-${Date.now()}-${Math.random().toString(16).slice(2)}`);

  function openModal(m) { if(!m)return;m.classList.add("open");m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"; }
  function closeModal(m) { if(!m)return;m.classList.remove("open");m.setAttribute("aria-hidden","true");document.body.style.overflow=""; }

  function initBooking() {
    const form=qs("#bookingForm"), confirm=qs("#bookingConfirmModal"), success=qs("#bookingSuccessModal");
    if(!form||!confirm||!success) return;
    const confirmText=qs("#bookingConfirmText"), successText=qs("#bookingSuccessText"), finalBtn=qs("#finalSubmitBooking"), status=qs("#bookingStatus");
    let pending=null, lastSubmitted=0;
    const startedAt=Date.now();
    qsa("[data-modal-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.closest(".modal"))));
    [confirm,success].forEach(m=>m.addEventListener("click",e=>e.target===m&&closeModal(m)));
    const dateInput=form.elements.date; if(dateInput) dateInput.min=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);

    form.addEventListener("submit",e=>{
      e.preventDefault();
      if(!form.reportValidity()) return;
      const fd=new FormData(form);
      pending={
        request_id:requestId(), form_started_at:startedAt, website:clean(fd,"website",""),
        contact_name:clean(fd,"name",""), phone:clean(fd,"phone",""), customer_email:clean(fd,"customer_email",""),
        service:clean(fd,"service",""), vehicle_type:clean(fd,"vehicle_type",""), date:clean(fd,"date",""),
        date_display:formatDate(clean(fd,"date","")), time:clean(fd,"time",""), pickup:clean(fd,"pickup",""),
        destination:clean(fd,"destination",""), wheelchair:clean(fd,"wheelchair"), return_trip:clean(fd,"return_trip","待確認"),
        message:clean(fd,"message"), source:"SHILIEN 官方網站 V9", status:"待客服確認"
      };
      if(pending.website) return;
      confirmText.textContent=[
        "🚐 SHILIEN 接送預約資料確認",`👤 聯絡人：${pending.contact_name}`,`📞 電話：${pending.phone}`,
        `📧 Email：${pending.customer_email||"無"}`,`🧾 服務項目：${pending.service}`,`🚐 車型：${pending.vehicle_type}`,
        `📅 日期：${pending.date_display}`,`🕕 時間：${pending.time}`,`📍 上車：${pending.pickup}`,
        `🏥 目的地：${pending.destination}`,`♿ 輪椅：${pending.wheelchair}`,`🔄 回程：${pending.return_trip}`,
        `📝 備註：${pending.message}`,"","⚠️ 送出不代表預約成立，須由客服確認。"
      ].join("\n");
      openModal(confirm);
    });

    finalBtn.addEventListener("click",async()=>{
      if(!pending || Date.now()-lastSubmitted<5000) return;
      finalBtn.disabled=true; finalBtn.textContent="傳送中…";
      if(status) {status.hidden=false;status.textContent="正在安全傳送預約資料…";status.className="form-status";}
      try {
        await fetch(c.booking_api_url,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(pending)});
        lastSubmitted=Date.now(); closeModal(confirm);
        successText.textContent=[
          "🚐 SHILIEN 接送預約通知",`👤 聯絡人：${pending.contact_name}`,`📞 電話：${pending.phone}`,
          `🚐 車型：${pending.vehicle_type}`,`📅 日期：${pending.date_display}`,`🕕 時間：${pending.time}`,
          `📍 上車：${pending.pickup}`,`🏥 目的地：${pending.destination}`,`♿ 輪椅：${pending.wheelchair}`,
          `🔄 回程：${pending.return_trip}`,`📝 備註：${pending.message}`,"",
          "✅ 資料已送出，客服確認後才正式成立。","車輛正式派出後，客服將提供行程或定位資訊。",
          "感謝您選擇 SHILIEN 仕聯管理顧問股份有限公司","安全｜準時｜尊榮｜有溫度"
        ].join("\n");
        openModal(success); form.reset(); pending=null;
        if(status) {status.textContent="預約資料已送出。";status.className="form-status success";}
      } catch(err) {
        console.error(err);
        if(status) {status.textContent="傳送失敗，請改用 LINE 或電話聯絡客服。";status.className="form-status error";}
        alert("目前無法送出，請透過 LINE 或電話聯絡客服。");
      } finally { finalBtn.disabled=false;finalBtn.textContent="確認送出"; }
    });
  }


  function initPartner() {
    const form=qs("#partnerForm");
    if(!form) return;
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if(!form.reportValidity()) return;
      const fd=new FormData(form);
      const text=[
        "【SHILIEN 企業合作洽詢】",
        `機構名稱：${clean(fd,"org","")}`,`聯絡人：${clean(fd,"name","")}`,`職稱：${clean(fd,"title")}`,
        `電話：${clean(fd,"phone","")}`,`Email：${clean(fd,"email","")}`,`合作類型：${clean(fd,"type","")}`,
        `需求說明：${clean(fd,"message","")}`
      ].join("\n");
      try {
        if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
        alert("合作資料已整理並複製。請貼到 LINE，或寄至 admin@shilien.com。V9.1 將接入企業合作案件後台。");
      } catch(err) {
        location.href=`mailto:${c.email}?subject=${encodeURIComponent("SHILIEN 企業合作洽詢")}&body=${encodeURIComponent(text)}`;
      }
    });
  }

  document.addEventListener("DOMContentLoaded",()=>{bindBase();animate();loadContent();initBooking();initPartner();});
})();
