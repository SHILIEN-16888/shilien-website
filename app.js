window.SHILIEN = {
  phone_display: "04-2337-2669",
  phone_raw: "0423372669",
  email: "admin@shilien.com",
  line_url: "https://line.me/R/ti/p/@029kpqds",
  map_url: "https://www.google.com/maps/search/?api=1&query=台中市烏日區三榮路一段350號",
  apps_script_url: "https://script.google.com/macros/s/AKfycbyF8U9t1FcEIgtUl9GrrYBKQbsEMOW_1vaclkAT9OkdPqBF4TTsyYumtRWziEErBrODug/exec"
};

(() => {
  "use strict";

  const config = window.SHILIEN;

  function ensureV8Styles() {
    if (document.querySelector('link[data-shilien-v8]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "style-v8.css?v=8";
    link.dataset.shilienV8 = "true";
    document.head.appendChild(link);
  }

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  function bindSiteData() {
    qsa("[data-phone]").forEach((el) => {
      el.textContent = config.phone_display;
      el.href = `tel:${config.phone_raw}`;
    });
    qsa("[data-email]").forEach((el) => {
      el.textContent = config.email;
      el.href = `mailto:${config.email}`;
    });
    qsa("[data-line]").forEach((el) => {
      el.href = config.line_url;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    });
    qsa("[data-map]").forEach((el) => {
      el.href = config.map_url;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    });
    qsa("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  function enhanceNavigation() {
    const menu = qs(".menu");
    const nav = qs(".navlinks");
    if (menu && nav) {
      menu.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        menu.setAttribute("aria-expanded", String(isOpen));
      });
    }

    qsa('.navlinks a[href="booking.html"]').forEach((el) => {
      el.classList.add("nav-action", "nav-booking");
    });
    qsa('.navlinks a[href="partner.html#form"], .navlinks a[href="partner.html"][data-partner-cta]').forEach((el) => {
      el.classList.add("nav-action", "nav-partner");
    });
  }

  function startAnimations() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        }),
        { threshold: 0.12 }
      );
      qsa(".reveal").forEach((el) => observer.observe(el));

      qsa("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count || 0);
        const countObserver = new IntersectionObserver((entries) => {
          const entry = entries[0];
          if (!entry?.isIntersecting) return;
          const start = performance.now();
          const duration = 1200;
          const frame = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = String(Math.floor(target * progress));
            if (progress < 1) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
          countObserver.disconnect();
        }, { threshold: 0.5 });
        countObserver.observe(el);
      });
    } else {
      qsa(".reveal").forEach((el) => el.classList.add("show"));
    }
  }

  function value(formData, key, fallback = "無") {
    const result = String(formData.get(key) || "").trim();
    return result || fallback;
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    const date = new Date(`${dateString}T00:00:00`);
    const [year, month, day] = dateString.split("-");
    return `${year}/${month}/${day}（${weekdays[date.getDay()]}）`;
  }

  function todayString() {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function setStatus(element, message = "", type = "") {
    if (!element) return;
    element.textContent = message;
    element.className = `form-status${type ? ` ${type}` : ""}`;
    element.hidden = !message;
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const firstButton = qs("button", modal);
    firstButton?.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function bookingPayload(form) {
    const data = new FormData(form);
    return {
      contact_name: value(data, "name", ""),
      phone: value(data, "phone", ""),
      customer_email: value(data, "customer_email"),
      service: value(data, "service", ""),
      vehicle_type: value(data, "vehicle_type", ""),
      date: value(data, "date", ""),
      date_display: formatDate(value(data, "date", "")),
      time: value(data, "time", ""),
      pickup: value(data, "pickup", ""),
      destination: value(data, "destination", ""),
      wheelchair: value(data, "wheelchair"),
      return_trip: value(data, "return_trip", "待確認"),
      message: value(data, "message"),
      submitted_at: new Date().toLocaleString("zh-TW", { hour12: false }),
      source: "SHILIEN 官方網站 V8",
      status: "待客服確認"
    };
  }

  function bookingConfirmationText(payload) {
    return [
      "🚐 SHILIEN 接送預約資料確認",
      `👤 聯絡人：${payload.contact_name}`,
      `📞 電話：${payload.phone}`,
      `📧 Email：${payload.customer_email}`,
      `🧾 服務項目：${payload.service}`,
      `🚐 車型：${payload.vehicle_type}`,
      `📅 日期：${payload.date_display}`,
      `🕕 時間：${payload.time}`,
      `📍 上車：${payload.pickup}`,
      `🏥 目的地：${payload.destination}`,
      `♿ 輪椅：${payload.wheelchair}`,
      `🔄 回程：${payload.return_trip}`,
      `📝 備註：${payload.message}`,
      "",
      "⚠️ 送出資料不代表預約成立。",
      "客服確認車輛、服務內容及費用後，才會正式成立預約。"
    ].join("\n");
  }

  function bookingSuccessText(payload) {
    return [
      "🚐 SHILIEN 接送預約通知",
      `👤 聯絡人：${payload.contact_name}`,
      `📞 電話：${payload.phone}`,
      `📧 Email：${payload.customer_email}`,
      `🧾 服務項目：${payload.service}`,
      `🚐 車型：${payload.vehicle_type}`,
      `📅 日期：${payload.date_display}`,
      `🕕 時間：${payload.time}`,
      `📍 上車：${payload.pickup}`,
      `🏥 目的地：${payload.destination}`,
      `♿ 輪椅：${payload.wheelchair}`,
      `🔄 回程：${payload.return_trip}`,
      `📝 備註：${payload.message}`,
      "",
      "✅ 預約資料已送出，客服確認後才算正式成立。",
      "⬆️ 車輛正式派出後，客服將提供定位或行程資訊。",
      "🚗 車輛出發及抵達通知，將依正式派車系統上線進度提供。",
      "⚠️ 請於預約時間前至上車地點等候；逾時或取消費用依客服確認之正式規則為準。",
      "📍 尖峰時段請依客服或定位資訊至車輛停靠處搭乘，以免影響行程。",
      "🔒 為保障您的權益，如司機私下邀請加入個人通訊軟體或私下接案，請向客服反映。",
      "",
      "感謝您選擇 SHILIEN 仕聯管理顧問股份有限公司",
      "安全｜準時｜尊榮｜有溫度"
    ].join("\n");
  }

  function bookingFingerprint(payload) {
    return [payload.phone, payload.date, payload.time, payload.pickup, payload.destination].join("|");
  }

  function initBookingForm() {
    const form = qs("#bookingForm");
    if (!form) return;

    const dateInput = qs('input[name="date"]', form);
    if (dateInput) dateInput.min = todayString();

    const confirmModal = qs("#bookingConfirmModal");
    const successModal = qs("#bookingSuccessModal");
    const confirmText = qs("#bookingConfirmText");
    const successText = qs("#bookingSuccessText");
    const finalSubmit = qs("#finalSubmitBooking");
    const copyButton = qs("#copyBookingText");
    const formStatus = qs("#bookingFormStatus");
    let pendingPayload = null;

    qsa("[data-modal-close]").forEach((button) => {
      button.addEventListener("click", () => closeModal(button.closest(".modal")));
    });
    [confirmModal, successModal].forEach((modal) => {
      modal?.addEventListener("click", (event) => {
        if (event.target === modal) closeModal(modal);
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal(confirmModal);
        closeModal(successModal);
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      setStatus(formStatus);

      if (!form.reportValidity()) return;
      const consent = qs('input[name="consent"]', form);
      if (!consent?.checked) {
        setStatus(formStatus, "請先勾選個人資料使用同意。", "error");
        consent?.focus();
        return;
      }

      pendingPayload = bookingPayload(form);
      if (!confirmModal || !successModal || !confirmText || !successText || !finalSubmit) {
        setStatus(formStatus, "預約確認元件載入失敗，請重新整理頁面後再試。", "error");
        return;
      }

      confirmText.textContent = bookingConfirmationText(pendingPayload);
      openModal(confirmModal);
    });

    finalSubmit?.addEventListener("click", async () => {
      if (!pendingPayload) return;
      if (!config.apps_script_url || config.apps_script_url.includes("PASTE_YOUR")) {
        setStatus(formStatus, "尚未設定 Google Apps Script 網址，請聯絡網站管理員。", "error");
        closeModal(confirmModal);
        return;
      }

      const fingerprint = bookingFingerprint(pendingPayload);
      const previous = sessionStorage.getItem("shilien-last-booking");
      if (previous === fingerprint) {
        setStatus(formStatus, "此筆資料已送出，請勿重複送出；如需修改請聯絡客服。", "warning");
        closeModal(confirmModal);
        return;
      }

      finalSubmit.disabled = true;
      finalSubmit.textContent = "資料傳送中…";

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        await fetch(config.apps_script_url, {
          method: "POST",
          mode: "no-cors",
          cache: "no-store",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(pendingPayload),
          signal: controller.signal
        });

        sessionStorage.setItem("shilien-last-booking", fingerprint);
        closeModal(confirmModal);
        successText.textContent = bookingSuccessText(pendingPayload);
        openModal(successModal);
        setStatus(formStatus, "預約資料已送出，請留意客服電話或 Email。", "success");
        form.reset();
        if (dateInput) dateInput.min = todayString();
      } catch (error) {
        console.error("Booking submit failed:", error);
        const message = error?.name === "AbortError"
          ? "傳送逾時，請先確認 Gmail／試算表是否已收到，再決定是否重送。"
          : "目前無法送出，請改用 LINE 或電話聯絡客服。";
        setStatus(formStatus, message, "error");
        closeModal(confirmModal);
      } finally {
        clearTimeout(timeout);
        finalSubmit.disabled = false;
        finalSubmit.textContent = "確認送出";
        pendingPayload = null;
      }
    });

    copyButton?.addEventListener("click", async () => {
      const text = successText?.textContent || "";
      if (!text) return;
      try {
        await copyText(text);
        copyButton.textContent = "已複製";
        setTimeout(() => { copyButton.textContent = "複製預約內容"; }, 1600);
      } catch (error) {
        console.error(error);
        alert("複製失敗，請長按內容後手動複製。");
      }
    });
  }

  function initPartnerForm() {
    const form = qs("#partnerForm");
    if (!form) return;
    const status = qs("#partnerFormStatus");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus(status);
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const text = [
        "【SHILIEN 企業合作洽詢】",
        `機構名稱：${value(data, "org")}`,
        `聯絡人：${value(data, "name")}`,
        `職稱：${value(data, "title")}`,
        `電話：${value(data, "phone")}`,
        `Email：${value(data, "email")}`,
        `合作類型：${value(data, "type")}`,
        `預估每月接送量：${value(data, "volume")}`,
        `希望開始時間：${value(data, "start")}`,
        `需求說明：${value(data, "message")}`
      ].join("\n");

      try {
        await copyText(text);
        setStatus(status, "合作資料已整理並複製，可直接貼到 LINE 傳送。", "success");
      } catch (error) {
        console.error(error);
        setStatus(status, "無法自動複製，請改用 Email 或 LINE 聯絡。", "error");
      }
    });
  }

  ensureV8Styles();
  bindSiteData();
  enhanceNavigation();
  startAnimations();
  initBookingForm();
  initPartnerForm();
})();
