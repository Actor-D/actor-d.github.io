/* ==========================================================================
   motion.js — 可选的动效增强层（平滑滚动 + 数字滚动）
   
   这是一个**完全独立**的文件，不影响站内其它脚本。想还原时有两种方式：
     1) 把下面 CONFIG 里的 smoothScroll / countUp 改成 false
     2) 删除本文件，并移除各页 <script src="motion.js" defer></script>
   
   设计原则（刻意保守，避免"拖沓"与可访问性问题）：
     · prefers-reduced-motion: reduce 时全部关闭，不做任何劫持
     · 只在精确指针设备（鼠标/触控板）启用平滑滚动，触摸设备保留原生惯性
     · 不劫持键盘、滚动条、Ctrl+F、锚点；锚点跳转仍带缓动但更短
     · 指针位于"可内部滚动"的容器上时不劫持（表格横向滚动等）
   ========================================================================== */

(() => {
  "use strict";

  const CONFIG = {
    smoothScroll: true,
    countUp: true,
    // 平滑滚动：lerp 越大越跟手、越小越"飘"。0.12 约等于 0.6–0.8s 收敛
    lerp: 0.12,
    wheelMultiplier: 1,
    anchorDuration: 620,
    // 数字滚动
    countDuration: 900,
    countSelector: [
      ".project-facts strong",
      ".preview-stats strong",
      ".paper-stats strong",
      ".finding-value",
      ".mini-caption strong",
    ].join(","),
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const root = document.documentElement;

  /* ------------------------------------------------------------------ *
   * 一、平滑滚动
   * ------------------------------------------------------------------ */

  function initSmoothScroll() {
    const maxScroll = () =>
      Math.max(0, root.scrollHeight - window.innerHeight);

    let target = window.scrollY;
    let current = window.scrollY;
    let rafId = null;
    let animating = false;
    // 记录"是否由本脚本引起"的滚动，避免与用户滚动互相打架
    let selfScroll = false;

    // 关闭 CSS 的原生 smooth，否则每次 scrollTo 都会被浏览器再缓动一次
    root.style.scrollBehavior = "auto";

    /** 指针下方的元素是否处在"还能继续滚"的内部容器里 */
    function insideScrollable(node, deltaY) {
      let el = node instanceof Element ? node : null;
      while (el && el !== root) {
        const cs = getComputedStyle(el);
        const oy = cs.overflowY;
        if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) {
          const atTop = el.scrollTop <= 0;
          const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
          if (deltaY < 0 && !atTop) return true;
          if (deltaY > 0 && !atBottom) return true;
        }
        el = el.parentElement;
      }
      return false;
    }

    function tick() {
      const diff = target - current;
      if (Math.abs(diff) < 0.4) {
        current = target;
        selfScroll = true;
        window.scrollTo(0, current);
        selfScroll = false;
        animating = false;
        rafId = null;
        return;
      }
      current += diff * CONFIG.lerp;
      selfScroll = true;
      window.scrollTo(0, current);
      selfScroll = false;
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    function onWheel(event) {
      // Ctrl/⌘ + 滚轮 = 浏览器缩放，交给原生
      if (event.ctrlKey || event.metaKey) return;
      // 横向为主的滚动（触控板左右滑）交给原生，否则会被吞掉
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      // 内部可滚动容器（横向表格等）优先，交给原生
      if (insideScrollable(event.target, event.deltaY)) return;

      const limit = maxScroll();
      const next = target + event.deltaY * CONFIG.wheelMultiplier;
      // 已到边界且继续向外滚 → 不拦截，保留浏览器橡皮筋/父子容器行为
      if ((current <= 0 && next < 0) || (current >= limit && next > limit)) return;

      event.preventDefault();
      target = Math.min(Math.max(next, 0), limit);
      animating = true;
      start();
    }

    /** 外部滚动（键盘、拖滚动条、锚点）时同步目标值 */
    function onScroll() {
      if (selfScroll || animating) return;
      target = current = window.scrollY;
    }

    /** 锚点跳转：保持缓动，但比原生更短、更可控 */
    function onDocumentClick(event) {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;

      event.preventDefault();
      const top = Math.min(
        Math.max(window.scrollY + el.getBoundingClientRect().top - 88, 0),
        maxScroll(),
      );
      animateTo(top, CONFIG.anchorDuration);
      history.pushState(null, "", href);
    }

    /** 定时长缓动（用于锚点），与 lerp 循环互斥 */
    function animateTo(to, duration) {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      const from = window.scrollY;
      const startTime = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);

      const step = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        current = target = from + (to - from) * ease(p);
        selfScroll = true;
        window.scrollTo(0, current);
        selfScroll = false;
        if (p < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          rafId = null;
          animating = false;
        }
      };
      animating = true;
      rafId = requestAnimationFrame(step);
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      target = current = window.scrollY;
    });
    document.addEventListener("click", onDocumentClick);

    function teardown() {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onDocumentClick);
      if (rafId !== null) cancelAnimationFrame(rafId);
      root.style.scrollBehavior = "";
    }

    // 用户在系统里开启"减少动态效果"时即时关闭
    reduceMotion.addEventListener("change", (e) => {
      if (e.matches) teardown();
    });
  }

  /* ------------------------------------------------------------------ *
   * 二、数字滚动
   * ------------------------------------------------------------------ */

  const NUM_RE = /^(\D*?)([+-]?)(\d[\d,]*)(\.\d+)?(\D*)$/;

  function initCountUp() {
    const nodes = [...document.querySelectorAll(CONFIG.countSelector)].filter((el) => {
      // 只处理"整段就是数字"的元素，避免误伤 JWT / Vue 3 / FULL STACK 这类文本
      if (el.children.length) return false;
      if (el.dataset.counted !== undefined) return false;
      const m = NUM_RE.exec(el.textContent.trim());
      if (!m) return false;
      el.dataset.counted = "pending";
      return true;
    });
    if (!nodes.length) return;

    const reduce = reduceMotion.matches;

    const run = (el) => {
      const original = el.textContent.trim();
      const m = NUM_RE.exec(original);
      if (!m) return;
      const [, prefix, sign, intRaw, decRaw = "", suffix] = m;
      const intDigits = intRaw.replace(/,/g, "");
      const target = parseFloat(`${intDigits}${decRaw}`);
      const decimals = decRaw ? decRaw.length - 1 : 0;
      const padTo = intDigits.length; // 保留 "07" 这类前导零
      const grouped = intRaw.includes(",");
      const duration = CONFIG.countDuration;
      const startTime = performance.now();

      const render = (value) => {
        let intPart = Math.floor(value).toString();
        if (padTo > 1) intPart = intPart.padStart(padTo, "0");
        if (grouped) intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const decPart = decimals ? `.${value.toFixed(decimals).split(".")[1]}` : "";
        el.textContent = `${prefix}${sign}${intPart}${decPart}${suffix}`;
      };

      if (reduce) {
        el.textContent = original;
        el.dataset.counted = "done";
        return;
      }

      const step = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        render(target * eased);
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = original; // 收尾必须还原原文，杜绝精度误差
          el.dataset.counted = "done";
        }
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );
    nodes.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------ *
   * 启动
   * ------------------------------------------------------------------ */

  const boot = () => {
    if (CONFIG.countUp) initCountUp();
    if (CONFIG.smoothScroll && !reduceMotion.matches && finePointer.matches) {
      initSmoothScroll();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
