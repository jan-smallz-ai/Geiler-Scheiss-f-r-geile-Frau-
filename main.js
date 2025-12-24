/* main.js - Logik: Tip 3x -> Crash -> Snowwipe 100% -> Finale */

const el = (id) => document.getElementById(id);

const sceneHost = el("sceneHost");
const bubbleText = el("bubbleText");
const taskTitle = el("taskTitle");
const taskSub = el("taskSub");
const counter = el("counter");
const ctaTap = el("ctaTap");

const snowOverlay = el("snowOverlay");
const snowCanvas = el("snowCanvas");
const progressFill = el("progressFill");
const progressText = el("progressText");

const finalOverlay = el("finalOverlay");
const revealBtn = el("revealBtn");
const restartBtn = el("restartBtn");
const codeBox = el("codeBox");
const codeValue = el("codeValue");

const STATE = {
  SLED: "sled",
  CRASH: "crash",
  SNOW: "snow",
  DANCE: "dance",
  FINALE: "finale"
};

let state = STATE.SLED;
let taps = 0;

// >>> HIER DEINEN ECHTEN CODE EINTRAGEN <<<
const STEAM_CODE = "XXXX-XXXX-XXXX";

function setScene(svgHtml){
  sceneHost.innerHTML = svgHtml;
}

function setBubble(text){
  bubbleText.textContent = text;
}

function setTask(title, sub){
  taskTitle.textContent = title;
  taskSub.textContent = sub;
}

function setCounter(){
  counter.textContent = `${taps} / 3`;
}

function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }

function init(){
  codeValue.textContent = STEAM_CODE;

  // Start-Szene (hochwertig, erkennbar)
  setScene(window.ART.sceneSledSVG({wobble:true}));
  setBubble("Hilfe! Meine Kühe sind außer Kontrolle!");
  setTask("Tippe 3× auf die Kühe oder den Schlitten", "…um sie zu beruhigen, bevor alles im Schnee endet.");
  setCounter();

  // Tap anywhere on scene
  sceneHost.addEventListener("pointerdown", onTap, {passive:true});
  ctaTap.addEventListener("click", onTap);

  revealBtn.addEventListener("click", onRevealGift);
  restartBtn.addEventListener("click", () => location.reload());

  codeBox.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(STEAM_CODE);
      codeBox.style.borderColor = "rgba(124,255,178,.6)";
      setTimeout(()=>codeBox.style.borderColor="rgba(255,255,255,.2)", 600);
    }catch(e){
      // Fallback: markierbar ist er trotzdem.
    }
  });
}

function onTap(){
  if(state !== STATE.SLED) return;
  taps++;
  setCounter();

  // kleine Reaktion: kurz wackeln/“Ruck”
  sceneHost.animate(
    [{transform:"translateX(0)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0)"}],
    {duration:260, easing:"ease-out"}
  );

  if(taps >= 3){
    goCrash();
  }
}

function goCrash(){
  state = STATE.CRASH;
  setBubble("Uuups… 😵‍💫");
  setTask("Oh oh…", "Das ging schnell. Festhalten!");

  // Mini-“Crash”: kurz “Zoom” + Fade, dann Schnee
  const a = sceneHost.animate(
    [
      {transform:"translateY(0) scale(1)", filter:"blur(0px)"},
      {transform:"translateY(8px) scale(1.02)", filter:"blur(0px)"},
      {transform:"translateY(24px) scale(1.08)", filter:"blur(2px)", opacity:0.9},
      {transform:"translateY(60px) scale(1.18)", filter:"blur(4px)", opacity:0.0}
    ],
    {duration:850, easing:"cubic-bezier(.2,.8,.2,1)"}
  );

  a.onfinish = () => {
    sceneHost.style.opacity = "1";
    sceneHost.style.filter = "none";
    sceneHost.style.transform = "none";
    goSnow();
  };
}

let scratch = null;

function goSnow(){
  state = STATE.SNOW;

  // Untergrund (weiß) sichtbar, darüber SnowCanvas deckt alles zu
  setScene(window.ART.sceneSnowBlankSVG());
  setBubble("Puh… ich bin im Schnee gelandet! 😅");
  setTask("Wisch den Schnee komplett weg", "Erst bei 100% geht’s weiter. Versprochen.");
  taps = 3;
  setCounter();

  snowOverlay.classList.remove("hidden");
  snowOverlay.setAttribute("aria-hidden", "false");

  setupSnowCanvas();
}

function setupSnowCanvas(){
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  const rect = snowOverlay.getBoundingClientRect();
  snowCanvas.width = Math.floor(rect.width * dpr);
  snowCanvas.height = Math.floor(rect.height * dpr);

  const ctx = snowCanvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // Schnee “malen”: nicht nur weiß – sondern mit Struktur + Highlights
  ctx.clearRect(0,0,rect.width,rect.height);
  const g = ctx.createLinearGradient(0,0,0,rect.height);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(1, "#e7f2ff");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,rect.width,rect.height);

  // Körnung / Schneekristalle
  for(let i=0;i<1400;i++){
    const x = Math.random()*rect.width;
    const y = Math.random()*rect.height;
    const r = Math.random()*1.4 + 0.2;
    ctx.globalAlpha = Math.random()*0.25 + 0.05;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Wir “radieren” mit destination-out
  scratch = createScratchEngine(snowCanvas, rect.width, rect.height, onScratchProgress);
  scratch.enable();

  onScratchProgress(0);
}

function onScratchProgress(pct){
  // pct: 0..100
  const p = clamp(pct,0,100);
  progressFill.style.width = `${p}%`;
  progressText.textContent = `${Math.round(p)}%`;

  if(p >= 100){
    // wirklich 100%: Weiter
    scratch.disable();
    setTimeout(() => {
      snowOverlay.classList.add("hidden");
      snowOverlay.setAttribute("aria-hidden","true");
      goDance();
    }, 250);
  }
}

function goDance(){
  state = STATE.DANCE;
  setBubble("Oh, danke Michelle! Du hast Weihnachten gerettet! 🎉");
  setTask("🎅 Tanze-Pause", "10 Sekunden Feier-Modus…");

  // Szene: Finale-Optik (Santa tanzt neben dem Baum)
  setScene(window.ART.sceneFinaleSVG());

  // 10 Sekunden “Pause”, danach Geschenk
  setTimeout(() => {
    goFinale();
  }, 10000);
}

function goFinale(){
  state = STATE.FINALE;
  setBubble("Ich hab dir was mitgebracht… 🎁✨");
  setTask("Das Highlight", "Jetzt kommt dein Geschenk.");

  finalOverlay.classList.remove("hidden");
  finalOverlay.setAttribute("aria-hidden","false");
}

function onRevealGift(){
  // “Reveal” Animation: Button schrumpft, Code erscheint “glowy”
  revealBtn.disabled = true;
  revealBtn.animate(
    [{transform:"scale(1)", opacity:1},{transform:"scale(.98)", opacity:1},{transform:"scale(.96)", opacity:0}],
    {duration:420, easing:"ease-in"}
  ).onfinish = () => {
    revealBtn.style.display = "none";
    codeBox.animate(
      [{transform:"translateY(6px)", opacity:0},{transform:"translateY(0)", opacity:1}],
      {duration:520, easing:"cubic-bezier(.2,.8,.2,1)"}
    );
  };
}

/* ---------- Scratch Engine (100% Requirement) ---------- */
function createScratchEngine(canvas, w, h, onProgress){
  const ctx = canvas.getContext("2d", {willReadFrequently:true});
  let down = false;
  let last = null;

  // wir brauchen eine verlässliche Messung:
  // - Alle paar Moves messen wir transparenten Anteil
  let moveCount = 0;

  function posFromEvent(e){
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left);
    const y = (e.clientY - r.top);
    return {x, y};
  }

  function drawStroke(a, b){
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 44;  // ordentlich groß, aber nicht “zu leicht”
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }

  function dab(p){
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 26, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function measure(){
    // Downsampled Messung: sehr robust
    const step = 6; // Qualität/Performance
    const img = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let transparent = 0;
    let total = 0;
    // alpha channel ist jedes 4. Byte
    for(let y=0; y<canvas.height; y+=step){
      for(let x=0; x<canvas.width; x+=step){
        const idx = (y*canvas.width + x)*4 + 3;
        const a = img[idx];
        total++;
        if(a === 0) transparent++;
      }
    }
    const pct = (transparent/total)*100;
    onProgress(pct >= 99.6 ? 100 : pct); // erst wirklich “komplett” wenn es praktisch alles ist
  }

  function onDown(e){
    e.preventDefault();
    down = true;
    last = posFromEvent(e);
    dab(last);
    measure();
  }
  function onMove(e){
    if(!down) return;
    e.preventDefault();
    const p = posFromEvent(e);
    if(last) drawStroke(last, p);
    last = p;

    moveCount++;
    if(moveCount % 6 === 0) measure();
  }
  function onUp(e){
    if(!down) return;
    e.preventDefault();
    down = false;
    last = null;
    measure();
  }

  function enable(){
    canvas.addEventListener("pointerdown", onDown, {passive:false});
    canvas.addEventListener("pointermove", onMove, {passive:false});
    window.addEventListener("pointerup", onUp, {passive:false});
    window.addEventListener("pointercancel", onUp, {passive:false});
  }
  function disable(){
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
  }

  return { enable, disable };
}

init();
