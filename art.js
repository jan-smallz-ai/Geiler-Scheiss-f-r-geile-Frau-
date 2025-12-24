/* art.js - Hochwertige SVG-Szenen (keine Logik) */

function svgWrap(inner) {
  return `
  <svg viewBox="0 0 900 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000" flood-opacity="0.35"/>
      </filter>
      <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge>
          <feMergeNode in="b"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <linearGradient id="sledRed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ff3d3d"/>
        <stop offset="1" stop-color="#b20022"/>
      </linearGradient>
      <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f3f6ff"/>
        <stop offset="1" stop-color="#7c8aa8"/>
      </linearGradient>
      <radialGradient id="moon" cx="30%" cy="30%" r="60%">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="1" stop-color="#b9d6ff" stop-opacity="0.05"/>
      </radialGradient>

      <linearGradient id="cowWhite" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="1" stop-color="#dfe7f6"/>
      </linearGradient>

      <linearGradient id="treeGreen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#49ffb2"/>
        <stop offset="1" stop-color="#0b7b4f"/>
      </linearGradient>
    </defs>

    ${inner}
  </svg>`;
}

function sceneSledSVG({ wobble = true } = {}) {
  const wob = wobble ? 'style="transform-origin: 520px 285px; animation: sledWobble 1.2s ease-in-out infinite;"' : '';
  return svgWrap(`
    <style>
      @keyframes snowFall { from {transform: translateY(-30px)} to {transform: translateY(520px)} }
      @keyframes sledWobble { 0%{transform: rotate(-1.6deg) translateY(0)} 50%{transform: rotate(1.6deg) translateY(2px)} 100%{transform: rotate(-1.6deg) translateY(0)} }
      @keyframes cowStep { 0%{transform: translateY(0)} 50%{transform: translateY(6px)} 100%{transform: translateY(0)} }
      @keyframes reinTwitch { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-30} }
      .flake{opacity:.8; animation: snowFall 3.2s linear infinite}
      .flake:nth-child(2){animation-duration:4.6s; opacity:.55}
      .flake:nth-child(3){animation-duration:3.8s; opacity:.6}
      .cow{filter:url(#softShadow)}
      .cow .leg{transform-origin: center; animation: cowStep .8s ease-in-out infinite}
      .cow:nth-of-type(2) .leg{animation-delay:.12s}
      .cow:nth-of-type(3) .leg{animation-delay:.24s}
      .rein{stroke-dasharray: 6 10; animation: reinTwitch .8s linear infinite; opacity:.9}
    </style>

    <!-- background -->
    <rect x="0" y="0" width="900" height="500" fill="transparent"/>
    <circle cx="140" cy="90" r="70" fill="url(#moon)" opacity="0.65"/>
    <path d="M0,350 C180,300 260,410 420,360 C520,330 650,410 900,350 L900,520 L0,520 Z" fill="#081425" opacity="0.7"/>
    <path d="M0,395 C210,360 300,465 455,420 C560,390 720,470 900,420 L900,520 L0,520 Z" fill="#0a1730" opacity="0.75"/>

    <!-- snowflakes -->
    <g>
      <circle class="flake" cx="120" cy="10" r="2.2" fill="#fff"/>
      <circle class="flake" cx="260" cy="-40" r="1.8" fill="#fff"/>
      <circle class="flake" cx="520" cy="-10" r="2.1" fill="#fff"/>
      <circle class="flake" cx="760" cy="-60" r="1.9" fill="#fff"/>
      <circle class="flake" cx="820" cy="-20" r="2.3" fill="#fff"/>
    </g>

    <!-- reins -->
    <path class="rein" d="M610 275 C520 220, 380 220, 250 265" fill="none" stroke="#e6d2aa" stroke-width="4" stroke-linecap="round"/>
    <path class="rein" d="M610 290 C520 250, 380 250, 250 295" fill="none" stroke="#e6d2aa" stroke-width="4" stroke-linecap="round"/>

    <!-- cows (detaillierter, erkennbar!) -->
    <g transform="translate(130, 250) scale(1.02)">
      ${cowSVG(0)}
      <g transform="translate(140, 10)">${cowSVG(1)}</g>
      <g transform="translate(280, 0)">${cowSVG(2)}</g>
    </g>

    <!-- sleigh + santa -->
    <g ${wob} transform="translate(430, 210)">
      <g filter="url(#softShadow)">
        <!-- runners -->
        <path d="M40 190 C130 215, 230 212, 320 190" fill="none" stroke="url(#metal)" stroke-width="12" stroke-linecap="round"/>
        <path d="M60 178 C150 198, 220 198, 300 178" fill="none" stroke="url(#metal)" stroke-width="6" stroke-linecap="round" opacity="0.9"/>

        <!-- body -->
        <path d="M60 85 C80 45, 140 30, 230 35 C290 38, 320 58, 338 92
                 C360 135, 340 165, 300 176 C220 198, 120 195, 70 165
                 C48 152, 40 125, 60 85 Z"
              fill="url(#sledRed)"/>
        <path d="M78 78 C100 52, 155 40, 225 45 C285 50, 310 66, 326 92
                 C300 74, 260 68, 220 68 C160 68, 112 72, 78 78 Z"
              fill="#ffffff22"/>

        <!-- gifts sack -->
        <path d="M250 35 C286 22, 320 48, 330 86 C338 116, 320 136, 285 140
                 C252 144, 222 126, 215 95 C206 57, 228 44, 250 35 Z"
              fill="#6b3a1e"/>
        <path d="M235 66 C250 52, 290 52, 312 70" fill="none" stroke="#d6b37a" stroke-width="6" stroke-linecap="round"/>

        <!-- Santa (erkennbar!) -->
        ${santaSVG()}
      </g>
    </g>
  `);
}

function cowSVG(i){
  // eine klare Kuh-Silhouette (Kopf, Körper, Beine, Flecken, Horn, Nase)
  const spots = [
    `<path d="M78 40 C55 35, 48 60, 62 72 C82 88, 106 70, 98 52 C94 44, 88 41, 78 40 Z" fill="#0d0f14" opacity="0.92"/>`,
    `<path d="M96 84 C78 80, 70 98, 82 112 C96 128, 126 120, 126 102 C126 92, 112 86, 96 84 Z" fill="#0d0f14" opacity="0.9"/>`,
    `<path d="M58 86 C42 82, 34 96, 42 110 C52 126, 76 120, 76 104 C76 96, 68 90, 58 86 Z" fill="#0d0f14" opacity="0.9"/>`
  ];
  const spot = spots[i % spots.length];
  return `
    <g class="cow">
      <g transform="translate(0,0)">
        <!-- body -->
        <ellipse cx="95" cy="80" rx="78" ry="52" fill="url(#cowWhite)"/>
        ${spot}
        <ellipse cx="155" cy="70" rx="34" ry="26" fill="url(#cowWhite)"/>
        <!-- head -->
        <g transform="translate(185,58)">
          <ellipse cx="22" cy="22" rx="22" ry="18" fill="url(#cowWhite)"/>
          <ellipse cx="18" cy="26" rx="18" ry="12" fill="#ffb7c5" opacity="0.85"/>
          <circle cx="14" cy="20" r="2.6" fill="#0c1320"/>
          <circle cx="28" cy="20" r="2.6" fill="#0c1320"/>
          <path d="M10 12 L2 6" stroke="#dfe7f6" stroke-width="4" stroke-linecap="round"/>
          <path d="M34 12 L42 6" stroke="#dfe7f6" stroke-width="4" stroke-linecap="round"/>
          <path d="M12 28 C18 32, 26 32, 32 28" fill="none" stroke="#a84a5c" stroke-width="2.5" stroke-linecap="round"/>
        </g>

        <!-- legs -->
        <g class="leg">
          <rect x="55" y="115" width="14" height="34" rx="6" fill="#1b2432"/>
          <rect x="90" y="122" width="14" height="30" rx="6" fill="#1b2432"/>
          <rect x="120" y="118" width="14" height="34" rx="6" fill="#1b2432"/>
          <rect x="150" y="110" width="14" height="40" rx="6" fill="#1b2432"/>
          <rect x="52" y="144" width="20" height="10" rx="5" fill="#0d0f14"/>
          <rect x="87" y="148" width="20" height="10" rx="5" fill="#0d0f14"/>
          <rect x="117" y="148" width="20" height="10" rx="5" fill="#0d0f14"/>
          <rect x="147" y="148" width="20" height="10" rx="5" fill="#0d0f14"/>
        </g>

        <!-- tail -->
        <path d="M30 82 C8 90, 14 118, 30 120" fill="none" stroke="#dfe7f6" stroke-width="6" stroke-linecap="round"/>
        <circle cx="32" cy="120" r="7" fill="#0d0f14"/>
      </g>
    </g>
  `;
}

function santaSVG(){
  return `
    <g transform="translate(215, 70)">
      <!-- arm -->
      <path d="M52 74 C78 70, 98 84, 104 104" fill="none" stroke="#e9c7a9" stroke-width="12" stroke-linecap="round"/>
      <circle cx="106" cy="110" r="10" fill="#ffffff"/>
      <circle cx="106" cy="110" r="6" fill="#e9c7a9"/>

      <!-- body -->
      <path d="M25 55 C36 28, 76 24, 92 50 C110 80, 102 118, 78 132
               C56 145, 28 130, 22 104 C18 86, 18 70, 25 55 Z"
            fill="#e0192d"/>
      <path d="M30 64 C45 58, 66 58, 84 64" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
      <rect x="40" y="96" width="46" height="18" rx="8" fill="#0c1320"/>
      <rect x="56" y="98" width="14" height="14" rx="4" fill="#f4c74f"/>

      <!-- head -->
      <g transform="translate(46, 16)">
        <circle cx="23" cy="26" r="22" fill="#e9c7a9"/>
        <path d="M8 30 C14 44, 34 44, 40 30" fill="#ffffff"/>
        <circle cx="16" cy="22" r="2.5" fill="#0c1320"/>
        <circle cx="30" cy="22" r="2.5" fill="#0c1320"/>
        <path d="M16 32 C22 36, 26 36, 30 32" fill="none" stroke="#b15b4b" stroke-width="2.5" stroke-linecap="round"/>

        <!-- hat -->
        <path d="M6 20 C10 6, 22 0, 36 6 C46 10, 48 20, 46 32
                 C36 26, 16 26, 6 32 C4 28, 4 24, 6 20 Z"
              fill="#e0192d"/>
        <path d="M4 30 C14 22, 38 22, 48 30" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
        <circle cx="48" cy="32" r="8" fill="#ffffff"/>
      </g>
    </g>
  `;
}

function sceneSnowBlankSVG(){
  // wird unter dem SnowCanvas sichtbar, sobald man wischt
  return svgWrap(`
    <rect x="0" y="0" width="900" height="500" fill="#f6fbff"/>
    <circle cx="780" cy="90" r="110" fill="#e8f4ff"/>
    <path d="M0,360 C180,330 260,450 420,400 C520,370 650,470 900,420 L900,520 L0,520 Z" fill="#e9f6ff"/>
    <g transform="translate(80, 250)">
      <text x="0" y="0" font-size="30" font-weight="900" fill="#0c2340" opacity=".85">Wisch alles frei…</text>
    </g>
  `);
}

function sceneFinaleSVG(){
  // Santa neben glitzerndem Baum + Sterne/Funkeln
  return svgWrap(`
    <style>
      @keyframes sparkle { 0%{opacity:.15; transform: scale(.6)} 40%{opacity:1; transform: scale(1)} 100%{opacity:.2; transform: scale(.7)} }
      @keyframes treeGlow { 0%{opacity:.55} 50%{opacity:1} 100%{opacity:.6} }
      @keyframes santaDance { 0%{transform: translateY(0) rotate(-1deg)} 25%{transform: translateY(-6px) rotate(2deg)} 50%{transform: translateY(0) rotate(-2deg)} 75%{transform: translateY(-6px) rotate(1deg)} 100%{transform: translateY(0) rotate(-1deg)} }
      .sp{animation:sparkle 1.2s ease-in-out infinite}
      .sp:nth-child(2){animation-delay:.2s}
      .sp:nth-child(3){animation-delay:.45s}
      .sp:nth-child(4){animation-delay:.7s}
      .treeGlow{animation:treeGlow 1.4s ease-in-out infinite}
      .dance{transform-origin: 210px 360px; animation:santaDance .55s ease-in-out infinite}
    </style>

    <rect x="0" y="0" width="900" height="500" fill="transparent"/>
    <path d="M0,380 C200,340 280,470 455,420 C565,390 720,480 900,430 L900,520 L0,520 Z" fill="#071523" opacity="0.8"/>

    <!-- Tree -->
    <g transform="translate(520, 70)" filter="url(#softShadow)">
      <path d="M130 20 L200 120 L160 120 L230 220 L190 220 L265 340 L0 340 L70 220 L30 220 L105 120 L65 120 Z"
            fill="url(#treeGreen)"/>
      <rect x="110" y="340" width="50" height="60" rx="10" fill="#6b3a1e"/>
      <g class="treeGlow" filter="url(#glow)">
        <circle cx="145" cy="70" r="8" fill="#ffd36b"/>
        <circle cx="90" cy="140" r="7" fill="#8ee8ff"/>
        <circle cx="200" cy="150" r="7" fill="#ff88b6"/>
        <circle cx="130" cy="210" r="7" fill="#ffd36b"/>
        <circle cx="70" cy="250" r="7" fill="#8ee8ff"/>
        <circle cx="210" cy="260" r="7" fill="#ff88b6"/>
        <circle cx="135" cy="300" r="7" fill="#ffd36b"/>
      </g>
      <path d="M145 5 L154 26 L178 26 L158 40 L166 62 L145 48 L124 62 L132 40 L112 26 L136 26 Z"
            fill="#ffd36b" filter="url(#glow)"/>
    </g>

    <!-- Sparkles -->
    <g transform="translate(0,0)">
      ${sparkle(210,90)}${sparkle(320,140)}${sparkle(430,80)}${sparkle(740,120)}
    </g>

    <!-- Santa dancing -->
    <g class="dance" transform="translate(170, 235)">
      ${santaSVG()}
    </g>
  `);

  function sparkle(x,y){
    return `
      <g class="sp" transform="translate(${x},${y})">
        <path d="M0 18 L8 22 L18 18 L22 8 L18 0 L8 -4 L0 0 L-4 8 Z" fill="#ffffff" opacity=".9"/>
        <circle cx="9" cy="9" r="3" fill="#8ee8ff" opacity=".9"/>
      </g>`;
  }
}

window.ART = {
  sceneSledSVG,
  sceneSnowBlankSVG,
  sceneFinaleSVG
};
