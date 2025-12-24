// main.js – Basis-Skript
// Ziel: sicher laden + Klicks erkennen

document.addEventListener("DOMContentLoaded", () => {
  const santa = document.querySelector(".sprite.santa");
  const cow   = document.querySelector(".sprite.cow");

  let taps = 0;

  function registerTap(targetName) {
    taps++;
    console.log(`Tap ${taps} auf ${targetName}`);

    // kleines visuelles Feedback
    document.body.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.01)" }, { transform: "scale(1)" }],
      { duration: 200 }
    );

    if (taps >= 3) {
      taps = 0;
      alert("Okay okay… beruhigt 😄");
    }
  }

  if (santa) {
    santa.addEventListener("click", () => registerTap("Santa"));
  }

  if (cow) {
    cow.addEventListener("click", () => registerTap("Kuh"));
  }

  console.log("main.js geladen ✅");
});
