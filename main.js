(() => {
  const countEl = document.getElementById("count");
  const modal = document.getElementById("modal");
  const btnClose = document.getElementById("btnClose");

  const santa = document.getElementById("imgSanta");
  const cow = document.getElementById("imgCow");

  let count = 0;
  let locked = false;

  function bump(el){
    el.classList.remove("wobble");
    // reflow trick
    void el.offsetWidth;
    el.classList.add("wobble");
  }

  function addTap(el){
    if (locked) return;
    count++;
    countEl.textContent = String(count);
    bump(el);

    if (count >= 3){
      locked = true;
      setTimeout(() => {
        modal.hidden = false;
      }, 220);
    }
  }

  santa.addEventListener("click", () => addTap(santa));
  cow.addEventListener("click", () => addTap(cow));

  btnClose.addEventListener("click", () => {
    modal.hidden = true;
  });

  // Falls Bilder nicht laden (Dateiname falsch), siehst du es sofort in der Konsole – aber visuell setzen wir auch:
  [santa, cow].forEach(img => {
    img.addEventListener("error", () => {
      img.style.outline = "3px solid red";
      img.alt = "Bild lädt nicht: " + img.getAttribute("src");
    });
  });
})();
