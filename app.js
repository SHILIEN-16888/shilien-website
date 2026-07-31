
window.SHILIEN={"phone_display": "04-2337-2669", "phone_raw": "0423372669", "email": "admin@shilien.com", "line_url": "https://line.me/R/ti/p/@029kpqds", "map_url": "https://www.google.com/maps/search/?api=1&query=台中市烏日區三榮路一段350號", "address": "台中市烏日區三榮路一段350號", "hours": "08:00–18:00"};
const c=window.SHILIEN;
document.querySelectorAll("[data-phone]").forEach(e=>{e.textContent=c.phone_display;e.href="tel:"+c.phone_raw});
document.querySelectorAll("[data-email]").forEach(e=>{e.textContent=c.email;e.href="mailto:"+c.email});
document.querySelectorAll("[data-line]").forEach(e=>{e.href=c.line_url;e.target="_blank";e.rel="noopener"});
document.querySelectorAll("[data-map]").forEach(e=>{e.href=c.map_url;e.target="_blank";e.rel="noopener"});
document.querySelectorAll("[data-year]").forEach(e=>e.textContent=new Date().getFullYear());
const menu=document.querySelector(".menu"),nav=document.querySelector(".navlinks");if(menu)menu.onclick=()=>nav.classList.toggle("open");
const io=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting)x.target.classList.add("show")}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
document.querySelectorAll("[data-count]").forEach(el=>{
 const target=Number(el.dataset.count),obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;const t0=performance.now(),dur=1200;
  const step=t=>{const p=Math.min((t-t0)/dur,1);el.textContent=Math.floor(target*p);if(p<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);obs.disconnect();
 }),{threshold:.5});obs.observe(el);
});
function copyForm(form,title,fields){
 const d=new FormData(form),text=[title,...fields.map(([l,k])=>l+"："+(d.get(k)||"無"))].join("\n");
 navigator.clipboard.writeText(text).then(()=>alert("資料已整理並複製，可直接貼到 LINE 傳送。"));
}
const pf=document.querySelector("#partnerForm");if(pf)pf.addEventListener("submit",e=>{e.preventDefault();copyForm(pf,"【SHILIEN 企業合作洽詢】",[["機構名稱","org"],["聯絡人","name"],["職稱","title"],["電話","phone"],["Email","email"],["合作類型","type"],["預估每月接送量","volume"],["希望開始時間","start"],["需求說明","message"]])});
const bf=document.querySelector("#bookingForm");if(bf)bf.addEventListener("submit",e=>{e.preventDefault();copyForm(bf,"【SHILIEN 接送預約】",[["聯絡人","name"],["電話","phone"],["服務","service"],["日期","date"],["時間","time"],["上車","pickup"],["目的地","destination"],["輪椅","wheelchair"],["回程","return_trip"],["備註","message"]])});
