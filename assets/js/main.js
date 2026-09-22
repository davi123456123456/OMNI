/* =========================================================
   OMNI Digital Studio — interazioni
   ========================================================= */
(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- anno corrente ---------- */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- loader ---------- */
  var loader = $("#loader");
  var start = function () {
    document.body.classList.add("ready");
    if (loader) loader.classList.add("done");
    setTimeout(function () { if (loader) loader.style.display = "none"; }, 1400);
  };
  if (reduced) { start(); }
  else {
    window.addEventListener("load", function () { setTimeout(start, 1500); });
    setTimeout(start, 3200); // rete lenta: non bloccare mai la pagina
  }

  /* ---------- split words ---------- */
  $$('[data-anim="words"]').forEach(function (el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement("span");
            s.className = "w"; s.textContent = part;
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) { walk(n); }
      });
    };
    walk(el);
    $$(".w", el).forEach(function (w, i) {
      w.style.transitionDelay = (i * 55) + "ms";
    });
  });

  /* ---------- reveal ---------- */
  $$("[data-anim]").forEach(function (el) {
    var d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--d", d + "ms");
  });
  var io = null;
  var mostra = function (el) {
    /* a scheda nascosta le transizioni CSS non avanzano: in quel caso
       si salta l'animazione e si va diretti allo stato finale */
    if (document.hidden) el.classList.add("no-anim");
    el.classList.add("in");
    if (io) io.unobserve(el);
  };
  /* rete di sicurezza: se l'IntersectionObserver non scatta (scheda in
     secondo piano, anteprima in iframe, prerender) il testo resterebbe
     invisibile. Questa passata mostra tutto ciò che è già a schermo. */
  var daMostrare = $$("[data-anim]");
  var passata = function () {
    if (!daMostrare.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    daMostrare = daMostrare.filter(function (el) {
      if (el.classList.contains("in")) return false;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.96 && r.bottom > -40) { mostra(el); return false; }
      return true;
    });
  };
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) mostra(e.target); });
    }, { threshold: 0, rootMargin: "0px 0px -4% 0px" });
    $$("[data-anim]").forEach(function (el) { io.observe(el); });
  }
  passata();
  window.addEventListener("load", passata);
  setTimeout(passata, 600);
  setTimeout(passata, 1800);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) passata(); });
  window.addEventListener("scroll", passata, { passive: true });
  window.addEventListener("resize", passata);

  /* ---------- contatori ---------- */
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var pre = el.getAttribute("data-prefix") || "";
    var suf = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = pre + target.toFixed(dec) + suf; return; }
    var t0 = performance.now(), dur = 1600;
    var tick = function (now) {
      var p = clamp((now - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + (target * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        animateCount(e.target); cio.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    $$("[data-count]").forEach(function (el) { cio.observe(el); });
  } else {
    $$("[data-count]").forEach(animateCount);
  }

  /* ---------- header: stuck + auto-hide ---------- */
  var header = $("#header"), lastY = 0;
  var onHeader = function () {
    var sy = window.pageYOffset;
    header.classList.toggle("stuck", sy > 30);
    if (!menuOpen) header.classList.toggle("hide", sy > 480 && sy > lastY);
    lastY = sy;
  };

  /* ---------- menu mobile ---------- */
  var burger = $("#burger"), menu = $("#menu"), menuOpen = false;
  var toggleMenu = function (force) {
    menuOpen = typeof force === "boolean" ? force : !menuOpen;
    menu.classList.toggle("open", menuOpen);
    burger.classList.toggle("on", menuOpen);
    burger.setAttribute("aria-expanded", String(menuOpen));
    burger.setAttribute("aria-label", menuOpen ? "Chiudi il menu" : "Apri il menu");
    menu.setAttribute("aria-hidden", String(!menuOpen));
    document.body.classList.toggle("is-locked", menuOpen);
    if (menuOpen) header.classList.remove("hide");
  };
  if (burger) burger.addEventListener("click", function () { toggleMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menuOpen) toggleMenu(false); });

  /* ---------- scroll fluido sugli anchor ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      if (menuOpen) toggleMenu(false);
      var top = t.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
    });
  });

  /* ---------- bottoni magnetici ---------- */
  if (!isTouch && !reduced) {
    $$("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + dx * 0.22 + "px," + dy * 0.3 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- tilt card ---------- */
  if (!isTouch && !reduced) {
    $$("[data-tilt]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(900px) rotateX(" + (-py * 5) + "deg) rotateY(" + (px * 5) + "deg) translateY(-6px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- hero: aurora su canvas ---------- */
  var canvas = $("#heroCanvas");
  if (canvas && !reduced) {
    var ctx = canvas.getContext("2d");
    var blobs = [
      { x: .22, y: .30, r: .46, c: [255, 106, 0], sx: .00013, sy: .00021, p: 0 },
      { x: .78, y: .22, r: .38, c: [255, 158, 27], sx: -.00017, sy: .00011, p: 2 },
      { x: .62, y: .72, r: .42, c: [255, 80, 0], sx: .00011, sy: -.00015, p: 4 },
      { x: .12, y: .78, r: .30, c: [11, 11, 12], sx: .00009, sy: -.00009, p: 1 }
    ];
    var W = 0, H = 0, DPR = 0.34; // render a bassa risoluzione: sfumato e leggerissimo
    var size = function () {
      W = canvas.width = Math.max(1, Math.round(canvas.offsetWidth * DPR));
      H = canvas.height = Math.max(1, Math.round(canvas.offsetHeight * DPR));
    };
    size();
    window.addEventListener("resize", size);
    var mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
    if (!isTouch) window.addEventListener("mousemove", function (e) {
      tmx = e.clientX / window.innerWidth; tmy = e.clientY / window.innerHeight;
    }, { passive: true });

    var visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { rootMargin: "120px" }).observe(canvas);
    }
    var draw = function (t) {
      requestAnimationFrame(draw);
      if (!visible) return;
      mx = lerp(mx, tmx, .04); my = lerp(my, tmy, .04);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#F4F3EF"; ctx.fillRect(0, 0, W, H);
      blobs.forEach(function (b, i) {
        var ox = Math.sin(t * b.sx + b.p) * .13 + (mx - .5) * (i % 2 ? .06 : -.06);
        var oy = Math.cos(t * b.sy + b.p) * .12 + (my - .5) * (i % 2 ? -.05 : .05);
        var x = (b.x + ox) * W, yy = (b.y + oy) * H, r = b.r * Math.max(W, H);
        var g = ctx.createRadialGradient(x, yy, 0, x, yy, r);
        var a = i === 3 ? .10 : .30;
        g.addColorStop(0, "rgba(" + b.c[0] + "," + b.c[1] + "," + b.c[2] + "," + a + ")");
        g.addColorStop(1, "rgba(" + b.c[0] + "," + b.c[1] + "," + b.c[2] + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, yy, r, 0, Math.PI * 2); ctx.fill();
      });
    };
    requestAnimationFrame(draw);
    canvas.style.filter = "blur(26px)";
    canvas.style.transform = "scale(1.08)";
  }

  /* ---------- metodo: scroll orizzontale ---------- */
  var method = $(".method"), track = $("#methodTrack"), mbar = $("#methodBar");
  var sizeMethod = function () {
    if (!method || !track || reduced) return;
    if (window.innerWidth < 720) { method.style.height = ""; return; }
    var travel = Math.max(0, track.scrollWidth - window.innerWidth + 40);
    method.style.height = (window.innerHeight + travel * 1.15) + "px";
  };
  sizeMethod();
  window.addEventListener("resize", sizeMethod);
  window.addEventListener("load", sizeMethod);
  var methodScroll = function () {
    if (!method || !track || reduced) return;
    var r = method.getBoundingClientRect();
    var total = method.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    var p = clamp(-r.top / total, 0, 1);
    var max = track.scrollWidth - window.innerWidth + 40;
    track.style.transform = "translate3d(" + (-max * p) + "px,0,0)";
    if (mbar) mbar.style.width = (p * 100) + "%";
  };

  /* ---------- telefono 3D su scroll ---------- */
  var phone = $("#phone");
  var phoneScroll = function () {
    if (!phone || reduced) return;
    var r = phone.getBoundingClientRect();
    var p = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height), 0, 1);
    var rot = lerp(24, -20, p);
    var tilt = lerp(-6, 7, p);
    phone.style.transform = "rotateY(" + rot + "deg) rotateX(" + tilt + "deg) translateY(" + ((.5 - p) * 40) + "px)";
  };

  /* ---------- wordmark footer: parallasse ---------- */
  var omni = $("#footOmni"), foot = $("#foot");
  var footScroll = function () {
    if (!omni || !foot || reduced) return;
    var r = foot.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    var p = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height), 0, 1);
    omni.style.transform = "translateY(" + ((1 - p) * 60) + "px) scale(" + (1 + p * .03) + ")";
  };

  /* ---------- barra di avanzamento + bar mobile ---------- */
  var sb = $("#scrollbar"), mobileBar = $("#mbar");
  var progressScroll = function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? window.pageYOffset / h : 0;
    if (sb) sb.style.width = (p * 100) + "%";
    if (mobileBar) mobileBar.classList.toggle("on", window.pageYOffset > 520 && p < .97);
  };

  /* ---------- un solo listener di scroll ---------- */
  var ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onHeader(); methodScroll(); phoneScroll(); footScroll(); progressScroll(); passata();
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- FAQ: una aperta per volta ---------- */
  $$(".qa").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      $$(".qa").forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
})();
