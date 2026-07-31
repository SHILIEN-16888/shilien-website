
window.SHILIEN={"company_zh": "仕聯", "company_en": "SHILIEN", "phone_display": "04-2337-2669", "phone_raw": "0423372669", "email": "admin@shilien.com", "line_url": "https://line.me/R/ti/p/@029kpqds", "address": "台中市烏日區三榮路一段350號", "hours": "08:00–18:00"};
const c=window.SHILIEN;
document.querySelectorAll("[data-phone]").forEach(e=>{e.textContent=c.phone_display;e.href="tel:"+c.phone_raw});
document.querySelectorAll("[data-email]").forEach(e=>{e.textContent=c.email;e.href="mailto:"+c.email});
document.querySelectorAll("[data-line]").forEach(e=>{e.href=c.line_url;e.target="_blank";e.rel="noopener"});
document.querySelectorAll("[data-year]").forEach(e=>e.textContent=new Date().getFullYear());
const m=document.querySelector(".menu"),n=document.querySelector(".navlinks");if(m)m.onclick=()=>n.classList.toggle("open");
