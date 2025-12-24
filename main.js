const scene = document.getElementById('scene');
const santa = document.querySelector('.sprite.santa');
const cow   = document.querySelector('.sprite.cow');

let taps = 0;

function tap() {
  taps++;
  // Mini-Feedback, damit du siehst: es reagiert wirklich
  scene.animate([{transform:'scale(1)'},{transform:'scale(1.01)'},{transform:'scale(1)'}], {duration:220});
  if (taps >= 3) {
    taps = 0;
    alert('Okay okay… beruhigt! 😄');
  }
}

santa.addEventListener('click', tap);
cow.addEventListener('click', tap);
