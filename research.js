/* research.js — Fair-DQN thesis section interactions:
   1) water-droplet canvas, 2) animated counters, 3) floating coupon chips,
   4) click ripples, 5) figure lightbox. */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Water-droplet canvas ---------- */
  const canvas = document.getElementById("droplet-canvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let droplets = [];
    let ripples = [];
    let lastSpawn = 0;
    let running = true;
    const MAX_DROPLETS = 16;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const palette = [
      [41, 151, 255],
      [41, 151, 255],
      [0, 113, 227],
      [100, 210, 255],
      [176, 196, 222],
    ];

    function spawnDroplet() {
      if (droplets.length >= MAX_DROPLETS) return;
      const color = palette[(Math.random() * palette.length) | 0];
      droplets.push({
        x: Math.random() * width,
        y: -14,
        r: 1.1 + Math.random() * 1.6,
        vy: 0.35 + Math.random() * 0.55,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.004 + Math.random() * 0.01,
        wobbleAmp: 0.25 + Math.random() * 0.5,
        color,
        alpha: 0.3 + Math.random() * 0.28,
        trail: [],
      });
    }

    function updateDroplet(d) {
      d.trail.push({ x: d.x, y: d.y });
      if (d.trail.length > 7) d.trail.shift();
      d.vy += 0.045;
      d.wobble += d.wobbleSpeed;
      d.x += Math.sin(d.wobble) * d.wobbleAmp;
      d.y += d.vy;
      // Droplets gather water as they slide down the glass.
      if (d.r < 3.4 && d.y > height * 0.2) d.r += 0.012;
    }

    function mergeDroplets() {
      for (let i = 0; i < droplets.length; i += 1) {
        for (let j = i + 1; j < droplets.length; j += 1) {
          const a = droplets[i];
          const b = droplets[j];
          if (a.dead || b.dead) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (Math.abs(dx) < (a.r + b.r) * 0.9 && dy > 0 && dy < 26) {
            a.r = Math.min(5.5, Math.sqrt(a.r * a.r + b.r * b.r));
            a.vy = Math.max(a.vy, b.vy);
            a.x = (a.x + b.x) / 2;
            b.dead = true;
          }
        }
      }
    }

    function drawDroplet(d) {
      const t = d.trail.length;
      for (let i = 0; i < t; i += 1) {
        const p = d.trail[i];
        const f = (i + 1) / (t + 2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, d.r * f * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.color[0]},${d.color[1]},${d.color[2]},${d.alpha * f * 0.5})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, d.r * 0.82, d.r * 1.25, 0, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(
        d.x - d.r * 0.35, d.y - d.r * 0.4, d.r * 0.15,
        d.x, d.y, d.r * 1.4,
      );
      g.addColorStop(0, `rgba(255,255,255,${d.alpha * 0.75})`);
      g.addColorStop(0.35, `rgba(${d.color[0]},${d.color[1]},${d.color[2]},${d.alpha * 0.8})`);
      g.addColorStop(1, `rgba(${d.color[0]},${d.color[1]},${d.color[2]},${d.alpha * 0.28})`);
      ctx.fillStyle = g;
      ctx.fill();
    }

    function frame(now) {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      if (now - lastSpawn > 620) {
        spawnDroplet();
        lastSpawn = now;
      }
      for (const d of droplets) updateDroplet(d);
      mergeDroplets();
      for (const d of droplets) {
        if (d.dead) continue;
        if (d.y > height + 26) {
          d.dead = true;
          if (Math.random() < 0.55) ripples.push({ x: d.x, y: height - 6, r: d.r * 1.6, alpha: 0.5 });
          continue;
        }
        drawDroplet(d);
      }
      droplets = droplets.filter((d) => !d.dead);
      for (const r of ripples) {
        r.r += 0.8;
        r.alpha *= 0.94;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.r * 1.7, r.r * 0.55, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(41,151,255,${r.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ripples = ripples.filter((r) => r.alpha > 0.02 && r.r < 90);
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) {
        lastSpawn = performance.now();
        requestAnimationFrame(frame);
      }
    });
  }

  /* ---------- 2. Animated counters ---------- */
  const counters = [...document.querySelectorAll(".counter")];
  if (counters.length) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const prefix = el.dataset.prefix || "";
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = prefix + (target * easeOut(p)).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  /* ---------- 3. Floating coupon chips in the research section ---------- */
  const research = document.querySelector(".research");
  if (research && !prefersReducedMotion) {
    const glyphs = ["¥5", "¥10", "¥25", "¥40", "¥200", "Q(s,a)", "λ", "E[R]"];
    const layer = document.createElement("div");
    layer.className = "coupon-layer";
    layer.setAttribute("aria-hidden", "true");
    research.appendChild(layer);
    let chipCount = 0;
    const MAX_CHIPS = 12;
    const spawnChip = () => {
      if (chipCount >= MAX_CHIPS || document.hidden) return;
      const chip = document.createElement("span");
      chip.className = "coupon-chip";
      chip.textContent = glyphs[(Math.random() * glyphs.length) | 0];
      chip.style.setProperty("--x", `${4 + Math.random() * 92}%`);
      chip.style.setProperty("--sway", `${-70 + Math.random() * 140}px`);
      chip.style.setProperty("--d", `${9 + Math.random() * 9}s`);
      chip.style.setProperty("--delay", `${Math.random() * 6}s`);
      chipCount += 1;
      chip.addEventListener("animationend", () => {
        chip.remove();
        chipCount -= 1;
      });
      layer.appendChild(chip);
    };
    for (let i = 0; i < 5; i += 1) spawnChip();
    window.setInterval(spawnChip, 1500);
  }

  /* ---------- 4. Click ripples ---------- */
  document.querySelectorAll(".ripple-host").forEach((host) => {
    host.addEventListener("click", (event) => {
      if (prefersReducedMotion) return;
      const rect = host.getBoundingClientRect();
      const ring = document.createElement("span");
      ring.className = "ripple-ring";
      const size = Math.max(rect.width, rect.height) * 0.72;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.left = `${event.clientX - rect.left - size / 2}px`;
      ring.style.top = `${event.clientY - rect.top - size / 2}px`;
      host.appendChild(ring);
      ring.addEventListener("animationend", () => ring.remove());
    });
  });

  /* ---------- 5. Figure lightbox ---------- */
  const lightbox = document.getElementById("figure-lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  const lightboxCaption = lightbox ? lightbox.querySelector("figcaption") : null;
  if (lightbox && lightboxImg && lightboxCaption) {
    const close = () => {
      lightbox.hidden = true;
      lightboxImg.removeAttribute("src");
      document.body.style.overflow = "";
    };

    document.querySelectorAll("[data-figure]").forEach((fig) => {
      const open = () => {
        const img = fig.querySelector("img");
        const caption = fig.querySelector("figcaption");
        if (!img) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = caption ? caption.textContent : "";
        lightboxCaption.textContent = caption ? caption.textContent : "";
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
        lightbox.querySelector(".lightbox-close").focus();
      };
      fig.addEventListener("click", open);
      fig.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    });

    lightbox.querySelector(".lightbox-close").addEventListener("click", close);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) close();
    });
  }

  /* ---------- 6. Abstract expand / collapse ---------- */
  const ABSTRACT_LABELS = {
    zh: { expand: "展开全文", collapse: "收起" },
    en: { expand: "Read more", collapse: "Collapse" },
  };
  const currentLang = () => (document.documentElement.lang.startsWith("zh") ? "zh" : "en");
  const syncAbstractToggles = () => {
    document.querySelectorAll(".abstract-toggle").forEach((btn) => {
      const card = btn.closest(".abstract-card");
      if (!card) return;
      btn.textContent = card.classList.contains("is-expanded")
        ? ABSTRACT_LABELS[currentLang()].collapse
        : ABSTRACT_LABELS[currentLang()].expand;
    });
  };
  document.querySelectorAll(".abstract-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".abstract-card");
      if (!card) return;
      const expanded = card.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", String(expanded));
      btn.textContent = expanded
        ? ABSTRACT_LABELS[currentLang()].collapse
        : ABSTRACT_LABELS[currentLang()].expand;
    });
  });
  document.addEventListener("actor-language-changed", syncAbstractToggles);
})();
