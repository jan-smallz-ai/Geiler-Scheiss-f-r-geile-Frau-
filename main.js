(() => {
  // ====== Settings ======
  const REQUIRED_TAPS = 3;

  // ====== Helpers ======
  const $ = (sel) => document.querySelector(sel);

  function setText(el, text) {
    if (!el) return;
    el.textContent = text;
  }

  function addClass(el, cls) {
    if (!el) return;
    el.classList.add(cls);
  }

  function removeClass(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
  }

  // ====== Expect these IDs in index.html ======
  // scene: wrapper of the scene
  // cowImg, santaImg: tappable images
  // stepTitle, stepText: instructions
  // progressDots: small progress indicator
  // revealArea: container that becomes visible at the end
  // codeBox: where Steam code will go later
  const cowImg = $("#cowImg");
  const santaImg = $("#santaImg");
  const stepTitle = $("#stepTitle");
  const stepText = $("#stepText");
  const progressDots = $("#progressDots");
  const revealArea = $("#revealArea");
  const codeBox = $("#codeBox");

  // If elements are missing, fail silently (so page doesn't crash)
  if (!cowImg || !santaImg) return;

  // ====== State machine ======
  // Step 1: calm cows (tap 3x on cow OR sleigh)
  // Step 2: "snow wipe" placeholder (we'll implement next)
  // Step 3: final reveal
  let step = 1;
  let taps = 0;
  let locked = false;

  function renderProgress() {
    if (!progressDots) return;
    const dots = progressDots.querySelectorAll(".dot");
    dots.forEach((d, i) => {
      if (i < step) d.classList.add("on");
      else d.classList.remove("on");
    });
  }

  function setStep(newStep) {
    step = newStep;
    renderProgress();

    if (step === 1) {
      setText(stepTitle, "Weihnachtsmann");
      setText(stepText, `Tippe ${REQUIRED_TAPS}× auf die Kuh oder den Schlitten, um sie zu beruhigen.`);
      taps = 0;
      removeClass(cowImg, "calm");
      removeClass(santaImg, "calm");
      removeClass(cowImg, "shake");
      removeClass(santaImg, "shake");
      if (revealArea) revealArea.style.display = "none";
    }

    if (step === 2) {
      setText(stepTitle, "Level 2");
      setText(stepText, "Wische gleich den Schnee weg, um den Gutschein freizulegen…");
      // For now we auto-advance after a short moment.
      // Next message: we implement the real snow-wipe minigame.
      setTimeout(() => setStep(3), 800);
    }

    if (step === 3) {
      setText(stepTitle, "Geschafft!");
      setText(stepText, "Du hast das Chaos gebändigt. Hier ist dein Geschenk 🎁");
      if (revealArea) revealArea.style.display = "block";

      // Placeholder code text — we replace this later with the real Steam code.
      setText(codeBox, "STEAM-CODE: XXXX-XXXX-XXXX");
    }
  }

  function bump(el) {
    // quick feedback animation by toggling a class
    addClass(el, "bump");
    setTimeout(() => removeClass(el, "bump"), 180);
  }

  function calmFeedback() {
    addClass(cowImg, "calm");
    addClass(santaImg, "calm");
    removeClass(cowImg, "shake");
    removeClass(santaImg, "shake");
  }

  function angryFeedback() {
    addClass(cowImg, "shake");
    addClass(santaImg, "shake");
    setTimeout(() => {
      removeClass(cowImg, "shake");
      removeClass(santaImg, "shake");
    }, 300);
  }

  function handleTap(targetEl) {
    if (locked) return;

    if (step !== 1) return;

    bump(targetEl);

    taps += 1;
    angryFeedback();

    // Optional: show tap counter in instruction text
    const left = Math.max(0, REQUIRED_TAPS - taps);
    if (left > 0) {
      setText(stepText, `Noch ${left}× tippen… (Kuh oder Schlitten)`);
    }

    if (taps >= REQUIRED_TAPS) {
      locked = true;
      calmFeedback();
      setText(stepText, "Okay… sie werden ruhiger 😌");

      setTimeout(() => {
        locked = false;
        setStep(2);
      }, 700);
    }
  }

  // ====== Events ======
  cowImg.addEventListener("click", () => handleTap(cowImg));
  santaImg.addEventListener("click", () => handleTap(santaImg));

  // Mobile: faster response (touch)
  cowImg.addEventListener("touchstart", (e) => { e.preventDefault(); handleTap(cowImg); }, { passive: false });
  santaImg.addEventListener("touchstart", (e) => { e.preventDefault(); handleTap(santaImg); }, { passive: false });

  // init
  setStep(1);
})();
