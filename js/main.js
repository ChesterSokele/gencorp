(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "gencorp-theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    var label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-label", label);
    });
  }

  function currentTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  applyTheme(currentTheme());

  var themeBtn = document.getElementById("theme-toggle");
  var themeBtnMobile = document.getElementById("theme-toggle-mobile");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  if (themeBtnMobile) themeBtnMobile.addEventListener("click", toggleTheme);

  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  var modal = document.getElementById("contact-modal");
  var openButtons = document.querySelectorAll("[data-open-contact]");
  var closeButton = document.getElementById("contact-modal-close");

  function openModal() {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    var firstField = modal.querySelector("input[name=name]");
    if (firstField) firstField.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  openButtons.forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });
  if (closeButton) closeButton.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) closeModal();
  });

  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");

  function encode(data) {
    return Object.keys(data)
      .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
      })
      .join("&");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector("button[type=submit]");
      var formData = new FormData(form);
      var payload = {};
      formData.forEach(function (value, key) {
        payload[key] = value;
      });

      submitBtn.disabled = true;
      statusEl.textContent = "Sending...";
      statusEl.className = "form-status";

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(payload),
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Network response was not ok");
          statusEl.textContent = "Thanks! Your message has been sent.";
          statusEl.className = "form-status success";
          form.reset();
          setTimeout(closeModal, 1800);
        })
        .catch(function () {
          statusEl.textContent = "Something went wrong. Please email info@gencorp.cc directly.";
          statusEl.className = "form-status error";
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
