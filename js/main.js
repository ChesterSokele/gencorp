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

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  }

  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  var CONTACT_EMAIL = "info@gencorp.cc";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();

      var subject = "Website enquiry from " + name;
      var body = message + "\n\n— " + name + " (" + email + ")";
      var mailtoUrl =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      statusEl.textContent = "Opening your email app to send this to " + CONTACT_EMAIL + "...";
      statusEl.className = "form-status success";
      window.location.href = mailtoUrl;
      form.reset();
      setTimeout(closeModal, 2200);
    });
  }
})();
