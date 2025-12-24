(() => {
  // --- Elemente
  const snowBg = document.getElementById("snowBg");

  const imgSanta = document.getElementById("imgSanta");
  const imgCow = document.getElementById("imgCow");
  const imgTree = document.getElementById("imgTree");
  const scene = document.getElementById("scene");

  const stepTitle = document.getElementById("stepTitle");
  const stepHint = document.getElementById("stepHint");
  const tapCounter = document.getElementById("tapCounter");

  const dot1 = document.getElementById("dot1");
  const dot2 = document.getElementById("dot2");
  const dot3 = document.getElementById("dot3");

  const revealCard = document.getElementById("revealCard");
  const wipeArea = document.getElementById("wipeArea");
  const wipeCanvas = document.getElementById("wipeCanvas");
  const skipWipeBtn = document.getElementById("skipWipeBtn");

  const codeCard = document.getElementById("codeCard");
  const codeBox = document.getElementById("codeBox");
  const codeValue = document.getElementById("codeValue");
  const copyBtn = document.getElementById("copyBtn");
  const restartBtn = document.getElementById("restartBtn");

  // --- State
  let taps = 0;
  let step = 1; // 1=taps, 2=wipe, 3=code
  const requiredTaps = 3;

  // --- STEP 1: Tap-Logik
  function updateDots() {
    dot1.classList.toggle("on", taps >= 1);
    dot2.classList.toggle("on", taps >= 2);
    dot3.classList.toggle("on", taps >= 3);
    tapCounter.textContent = `${Math.min(taps, requiredTaps)} / ${requiredTaps}`;
  }

  function doTapFeedback(targetEl) {
    targetEl.classList.remove("wiggle");
    targetEl.classList.remove("pop");
    // Reflow for restart animation
    void targetEl.offsetWidth;
    targetEl.classList.add("wiggle");
    setTimeout(() => targetEl.classList.remove("wiggle"), 600);

    scene.classList.remove("pop");
    void scene.offsetWidth;
    scene.classList.add("pop");
    setTimeout(() => scene.classList.remove("pop"), 360);
  }

  function onTap(targetEl) {
    if (step !== 1) return;
    taps += 1;
    doTapFeedback(targetEl);
    updateDots();

    if (taps >= requiredTaps) {
      // Übergang zu Step 2
      step = 2;
      stepTitle.textContent = "Wisch den Schnee weg!";
      stepHint.textContent = "Wische über das Feld, bis alles freigerubbelt ist.";
      setTimeout(() => {
        revealCard.hidden = false;
        initWipe();
        // scroll zu revealCard (mobile friendly)
        revealCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
    }
  }

  imgSanta.addEventListener("click", () => onTap(imgSanta));
  imgCow.addEventListener("click", () => onTap(imgCow));
  // Optional: Tree nicht tappbar fürs Minigame
  imgTree.addEventListener("click", () => {
    if (step === 1) doTapFeedback(imgTree);
  });

  updateDots();

  // --- STEP 2: Wipe / Scratch (Canvas)
  let wipeCtx = null;
  let wipeW = 0, wipeH = 0;
  let isDown = false;
  let lastX = 0, lastY = 0;

  function resizeWipeCanvas() {
    const rect = wipeArea.getBoundingClientRect();
    wipeW = Math.max(1, Math.floor(rect.width));
    wipeH = Math.max(1, Math.floor(rect.height));
    wipeCanvas.width = wipeW * devicePixelRatio;
    wipeCanvas.height = wipeH * devicePixelRatio;
    wipeCanvas.style.width = `${wipeW}px`;
    wipeCanvas.style.height = `${wipeH}px`;
    wipeCtx = wipeCanvas.getContext("2d", { willReadFrequently: true });
    wipeCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function drawSnowCover() {
    // Deckschicht
    const g = wipeCtx.createLinearGradient(0, 0, 0, wipeH);
    g.addColorStop(0, "rgba(245,250,255,0.95)");
    g.addColorStop(1, "rgba(220,238,250,0.92)");
    wipeCtx.globalCompositeOperation = "source-over";
    wipeCtx.fillStyle = g;
    wipeCtx.fillRect(0, 0, wipeW, wipeH);

    // kleine “Schneekristalle”
    wipeCtx.fillStyle = "rgba(255,255,255,0.55)";
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * wipeW;
      const y = Math.random() * wipeH;
      const r = 0.8 + Math.random() * 2.2;
      wipeCtx.beginPath();
      wipeCtx.arc(x, y, r, 0, Math.PI * 2);
      wipeCtx.fill();
    }
  }

  function scratchLine(x0, y0, x1, y1) {
    wipeCtx.globalCompositeOperation = "destination-out";
    wipeCtx.lineCap = "round";
    wipeCtx.lineJoin = "round";
    wipeCtx.strokeStyle = "rgba(0,0,0,1)";
    wipeCtx.lineWidth = Math.max(26, wipeW * 0.06); // responsive brush
    wipeCtx.beginPath();
    wipeCtx.moveTo(x0, y0);
    wipeCtx.lineTo(x1, y1);
    wipeCtx.stroke();

    // extra “puffs”
    wipeCtx.beginPath();
    wipeCtx.arc(x1, y1, wipeCtx.lineWidth * 0.22, 0, Math.PI * 2);
    wipeCtx.fill();
  }

  function getCanvasPos(evt) {
    const rect = wipeCanvas.getBoundingClientRect();
    const touch = evt.touches && evt.touches[0];
    const cx = (touch ? touch.clientX : evt.clientX) - rect.left;
    const cy = (touch ? touch.clientY : evt.clientY) - rect.top;
    return { x: cx, y: cy };
  }

  function erasedPercent() {
    const imgData = wipeCtx.getImageData(0, 0, wipeW, wipeH).data;
    let transparent = 0;
    // alpha channel every 4th byte
    for (let i = 3; i < imgData.length; i += 4) {
      if (imgData[i] === 0) transparent++;
    }
    const total = wipeW * wipeH;
    return transparent / total;
  }

  function finishWipe() {
    if (step !== 2) return;
    step = 3;
    // ausblenden
    revealCard.hidden = true;
    codeCard.hidden = false;
    codeCard.scrollIntoView({ behavior: "smooth", block: "start" });

    stepTitle.textContent = "Geschenk aufdecken 🎁";
    stepHint.textContent = "Tippe auf die Karte, um den Code zu sehen.";
  }

  function initWipe() {
    if (step !== 2) return;
    resizeWipeCanvas();
    drawSnowCover();

    const down = (e) => {
      isDown = true;
      const p = getCanvasPos(e);
      lastX = p.x; lastY = p.y;
      scratchLine(lastX, lastY, lastX, lastY);
      e.preventDefault();
    };
    const move = (e) => {
      if (!isDown) return;
      const p = getCanvasPos(e);
      scratchLine(lastX, lastY, p.x, p.y);
      lastX = p.x; lastY = p.y;

      // check progress (nicht jedes pixel, aber oft genug)
      if (Math.random() < 0.18) {
        const pct = erasedPercent();
        if (pct > 0.45) finishWipe();
      }
      e.preventDefault();
    };
    const up = () => { isDown = false; };

    wipeCanvas.onpointerdown = down;
    wipeCanvas.onpointermove = move;
    wipeCanvas.onpointerup = up;
    wipeCanvas.onpointercancel = up;

    // Mobile fallback
    wipeCanvas.ontouchstart = down;
    wipeCanvas.ontouchmove = move;
    wipeCanvas.ontouchend = up;

    window.addEventListener("resize", () => {
      if (step !== 2) return;
      resizeWipeCanvas();
      drawSnowCover();
    }, { passive: true });

    skipWipeBtn.onclick = finishWipe;
  }

  // --- STEP 3: Code Flip + Copy
  function flipCode() {
    if (step !== 3) return;
    codeBox.classList.toggle("flipped");
  }

  codeBox.addEventListener("click", flipCode);
  codeBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flipCode();
    }
  });

  copyBtn.addEventListener("click", async () => {
    const text = codeValue.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Kopiert ✅";
      setTimeout(() => (copyBtn.textContent = "Code kopieren"), 1200);
    } catch {
      copyBtn.textContent = "Nicht möglich 😅";
      setTimeout(() => (copyBtn.textContent = "Code kopieren"), 1200);
    }
  });

  restartBtn.addEventListener("click", () => {
    // Reset
    taps = 0;
    step = 1;
    revealCard.hidden = true;
    codeCard.hidden = true;
    codeBox.classList.remove("flipped");
    stepTitle.innerHTML = `Tippe 3× auf die Kuh <span class="muted">oder</span> den Schlitten`;
    stepHint.textContent = "…um sie zu beruhigen, bevor alles im Chaos endet.";
    updateDots();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- Snow Background (Canvas)
  const flakes = [];
  function resizeSnow() {
    snowBg.width = Math.floor(innerWidth * devicePixelRatio);
    snowBg.height = Math.floor(innerHeight * devicePixelRatio);
    snowBg.style.width = "100%";
    snowBg.style.height = "100%";
  }
  resizeSnow();
  window.addEventListener("resize", resizeSnow, { passive: true });

  const sctx = snowBg.getContext("2d");
  function seedFlakes() {
    flakes.length = 0;
    const count = Math.round(Math.min(220, Math.max(90, innerWidth / 6)));
    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: 0.6 + Math.random() * 2.4,
        v: 0.5 + Math.random() * 1.6,
        drift: -0.6 + Math.random() * 1.2,
        a: 0.25 + Math.random() * 0.55,
      });
    }
  }
  seedFlakes();
  window.addEventListener("resize", seedFlakes, { passive: true });

  function tickSnow() {
    sctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    sctx.clearRect(0, 0, innerWidth, innerHeight);

    for (const f of flakes) {
      f.y += f.v;
      f.x += f.drift * 0.35;

      if (f.y > innerHeight + 10) {
        f.y = -10;
        f.x = Math.random() * innerWidth;
      }
      if (f.x < -10) f.x = innerWidth + 10;
      if (f.x > innerWidth + 10) f.x = -10;

      sctx.beginPath();
      sctx.globalAlpha = f.a;
      sctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      sctx.fillStyle = "#ffffff";
      sctx.fill();
    }
    sctx.globalAlpha = 1;
    requestAnimationFrame(tickSnow);
  }
  tickSnow();

  // Optional: später hier echten Code rein (wenn du ihn hast)
  // codeValue.textContent = "ABCD1-EFGH2-IJKL3";
})();
