// Mini-Debug: Wenn ein Bild nicht lädt, siehst du es sofort in der Konsole + Alert
const imgs = [
  { id: "santa", name: "Santa" },
  { id: "cow", name: "Kuh" },
  { id: "tree", name: "Baum" },
];

imgs.forEach(({ id, name }) => {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener("error", () => {
    console.error(`[FEHLER] ${name} lädt nicht. src=`, el.getAttribute("src"));
    // Auf Handy ist Konsole nervig → einmal klar anzeigen:
    alert(`Bild lädt nicht: ${name}\nPfad:\n${el.getAttribute("src")}`);
  });
});

// Kleiner Klick-Test (kommt später als 3×-Mechanik)
document.addEventListener("click", (e) => {
  const t = e.target;
  if (t && (t.id === "cow" || t.id === "santa")) {
    t.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }],
      { duration: 220, iterations: 1 }
    );
  }
});
