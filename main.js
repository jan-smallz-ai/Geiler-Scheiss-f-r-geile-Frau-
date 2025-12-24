(() => {
  const goal = 3;
  let taps = 0;
  let unlocked = false;

  const counter = document.getElementById("counter");
  const reveal = document.getElementById("reveal");
  const copyBtn = document.getElementById("copyBtn");
  const copyMsg = document.getElementById("copyMsg");
  const codeBox = document.getElementById("codeBox");

  const santa = document.getElementById("imgSanta");
  const cow = document.getElementById("imgCow");

  function setCounter() {
    counter.textContent = `${taps} / ${goal}`;
  }

  function unlock() {
    unlocked = true;
    reveal.classList.remove("hidden");
  }

  function tap() {
    if (unlocked) return;
    taps = Math.min(goal, taps + 1);
    setCounter();
    if (taps >= goal) unlock();
  }

  // Tap auf Kuh oder Schlitten
  santa.addEventListener("click", tap);
  cow.addEventListener("click", tap);

  // Copy
  copyBtn.addEventListener("click", async () => {
    const text = codeBox.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      copyMsg.textContent = "✅ Kopiert!";
    } catch {
      copyMsg.textContent = "❗Kopieren ging nicht – markier den Code manuell.";
    }
    setTimeout(() => (copyMsg.textContent = ""), 1500);
  });

  setCounter();
})();
