(function () {
  var root = document.documentElement;
  var storageKey = "secboard-theme";
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function systemTheme() {
    return media.matches ? "dark" : "light";
  }

  function currentMode() {
    return localStorage.getItem(storageKey) || "auto";
  }

  function apply(mode) {
    var resolved = mode === "auto" ? systemTheme() : mode;
    root.setAttribute("data-theme", resolved);
    root.setAttribute("data-theme-mode", mode);
    document.querySelectorAll('input[name="theme"]').forEach(function (input) {
      input.checked = input.value === mode;
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", resolved === "dark" ? "#070b14" : "#ffffff");
  }

  apply(currentMode());

  document.querySelectorAll('input[name="theme"]').forEach(function (input) {
    input.addEventListener("change", function () {
      if (!input.checked) return;
      localStorage.setItem(storageKey, input.value);
      apply(input.value);
    });
  });

  media.addEventListener("change", function () {
    if (currentMode() === "auto") apply("auto");
  });

  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var tabs = document.querySelectorAll(".shot-tabs button");
  var figure = document.getElementById("showcase-figure");
  var image = document.getElementById("showcase-image");
  var caption = document.getElementById("showcase-caption");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (other) {
        other.setAttribute("aria-selected", other === tab ? "true" : "false");
      });
      image.src = tab.getAttribute("data-src");
      image.alt = tab.getAttribute("data-alt");
      caption.textContent = tab.getAttribute("data-caption");
    });
  });

  var dialog = document.getElementById("lightbox");
  var dialogImage = document.getElementById("lightbox-image");
  if (figure && dialog) {
    figure.addEventListener("click", function () {
      dialogImage.src = image.src;
      dialogImage.alt = image.alt;
      dialog.showModal();
    });
    dialog.querySelector("[data-close]").addEventListener("click", function () {
      dialog.close();
    });
  }
})();
