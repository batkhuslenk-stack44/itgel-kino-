const fs = require('fs');
const path = require('path');

const movies = [
  {
    id: 'itgel',
    title: 'ИТГЭЛ',
    sub: 'TRUST • 2016',
    genre: 'ДРАМ • ЭР ЗОРИГ',
    rating: '★ 8.9',
    color1: '#7b1113',
    color2: '#1f080a',
    accent: '#e63946',
    gold: '#f4a261',
    laurel: 'ASIAN WORLD FILM FESTIVAL',
    laurelSub: 'AUDIENCE AWARD WINNER',
    icon: `<path d="M300 380 C260 300 170 320 170 410 C170 490 300 590 300 590 C300 590 430 490 430 410 C430 320 340 300 300 380 Z" fill="none" stroke="#e63946" stroke-width="8" opacity="0.85"/>
           <polyline points="150,450 240,450 270,390 300,500 330,420 360,450 450,450" fill="none" stroke="#f4a261" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`
  },
  {
    id: 'aav',
    title: 'ААВ',
    sub: 'FATHER • 2015',
    genre: 'ГЭР БҮЛ • ДРАМ',
    rating: '★ 9.1',
    color1: '#1d3557',
    color2: '#0b1622',
    accent: '#457b9d',
    gold: '#e9c46a',
    laurel: 'ГЭГЭЭН МУЗА НААДАМ',
    laurelSub: 'ШИЛДЭГ КИНО',
    icon: `<circle cx="300" cy="380" r="50" fill="none" stroke="#e9c46a" stroke-width="6"/>
           <path d="M250 480 Q300 450 350 480 L350 580 L250 580 Z" fill="none" stroke="#457b9d" stroke-width="6"/>
           <circle cx="370" cy="450" r="28" fill="none" stroke="#e9c46a" stroke-width="5"/>
           <path d="M340 510 Q370 490 400 510 L400 580 L340 580 Z" fill="none" stroke="#457b9d" stroke-width="5"/>`
  },
  {
    id: 'urgeeleg',
    title: 'ҮРГЭЭЛЭГ',
    sub: 'URGEELEG • 2014',
    genre: 'ТУЛААНТ • АДАЛ ЯВДАЛ',
    rating: '★ 8.7',
    color1: '#9a031e',
    color2: '#190206',
    accent: '#e76f51',
    gold: '#f4a261',
    laurel: 'ACADEMY AWARDS MONGOLIA',
    laurelSub: 'ШИЛДЭГ ТУЛААНТ КИНО',
    icon: `<circle cx="300" cy="450" r="110" fill="none" stroke="#e76f51" stroke-width="6" stroke-dasharray="15 10"/>
           <line x1="300" y1="310" x2="300" y2="590" stroke="#f4a261" stroke-width="4"/>
           <line x1="160" y1="450" x2="440" y2="450" stroke="#f4a261" stroke-width="4"/>
           <polygon points="300,380 340,450 300,520 260,450" fill="#e76f51" opacity="0.8"/>`
  },
  {
    id: 'sodura',
    title: 'СОДУРА',
    sub: 'SODURA • 2015',
    genre: 'ДРАМ • БАЙГАЛЬ ЭХ',
    rating: '★ 8.8',
    color1: '#134e4a',
    color2: '#041716',
    accent: '#2a9d8f',
    gold: '#e9c46a',
    laurel: 'МОНГОЛЫН КИНО НААДАМ',
    laurelSub: 'ШИЛДЭГ ЗУРАГЛААЧ БА ХӨГЖИМ',
    icon: `<path d="M180 560 L300 350 L420 560 Z" fill="none" stroke="#2a9d8f" stroke-width="7"/>
           <path d="M250 560 L300 460 L350 560 Z" fill="#2a9d8f" opacity="0.3"/>
           <path d="M270 380 Q300 320 330 380" fill="none" stroke="#e9c46a" stroke-width="6"/>
           <circle cx="300" cy="300" r="30" fill="#e9c46a" opacity="0.85"/>`
  },
  {
    id: 'zurhnii-hilen',
    title: 'ЗҮРХНИЙ ХИЛЭН',
    sub: 'WRATH OF THE HEART • 2017',
    genre: 'ТҮҮХЭН • ТУЛААНТ',
    rating: '★ 9.0',
    color1: '#581c87',
    color2: '#130420',
    accent: '#b5179e',
    gold: '#f72585',
    laurel: 'FANTASTIC PRODUCTION',
    laurelSub: 'ОНЫ ШИЛДЭГ КИНО',
    icon: `<line x1="220" y1="340" x2="380" y2="560" stroke="#f72585" stroke-width="8" stroke-linecap="round"/>
           <line x1="380" y1="340" x2="220" y2="560" stroke="#f72585" stroke-width="8" stroke-linecap="round"/>
           <circle cx="300" cy="450" r="60" fill="none" stroke="#e9c46a" stroke-width="6"/>
           <polygon points="300,360 320,440 300,540 280,440" fill="#b5179e"/>`
  },
  {
    id: 'baavgai',
    title: 'БААВГАЙ БОЛОХСОН',
    sub: 'IF ONLY I COULD HIBERNATE • 2023',
    genre: 'ДРАМ • КАННЫН НААДАМ',
    rating: '★ 8.6',
    color1: '#1e3a8a',
    color2: '#080e22',
    accent: '#3a86ff',
    gold: '#00b4d8',
    laurel: 'CANNES FILM FESTIVAL 2023',
    laurelSub: 'UN CERTAIN REGARD SELECTION',
    icon: `<circle cx="300" cy="440" r="100" fill="none" stroke="#00b4d8" stroke-width="6"/>
           <circle cx="230" cy="360" r="35" fill="none" stroke="#3a86ff" stroke-width="6"/>
           <circle cx="370" cy="360" r="35" fill="none" stroke="#3a86ff" stroke-width="6"/>
           <ellipse cx="300" cy="460" rx="40" ry="28" fill="#3a86ff" opacity="0.6"/>
           <circle cx="300" cy="445" r="14" fill="#ffffff"/>`
  },
  {
    id: 'baitag',
    title: 'БАЙТАГ БОГД',
    sub: 'BAITAG BOGD • 2018',
    genre: 'ТҮҮХЭН • БААТАРЛАГ',
    rating: '★ 8.8',
    color1: '#4a044e',
    color2: '#150117',
    accent: '#8338ec',
    gold: '#f4a261',
    laurel: 'ЭХ ОРНЫ ТУСГААР ТОГТНОЛ',
    laurelSub: '10 БААТРЫН ДУРСГАЛД',
    icon: `<polygon points="120,580 300,280 480,580" fill="none" stroke="#8338ec" stroke-width="8"/>
           <polygon points="200,580 300,380 400,580" fill="#8338ec" opacity="0.3"/>
           <line x1="300" y1="280" x2="300" y2="200" stroke="#f4a261" stroke-width="6"/>
           <polygon points="300,200 360,225 300,250" fill="#f4a261"/>`
  },
  {
    id: 'shuuder',
    title: 'ШҮҮДЭР ДУНДУУР',
    sub: 'THROUGH THE DEW • 2016',
    genre: 'ДРАМ • ХАЙР СЭТГЭЛ',
    rating: '★ 8.4',
    color1: '#831843',
    color2: '#1b030d',
    accent: '#f72585',
    gold: '#f472b6',
    laurel: 'МОНГОЛ КИНО УРЛАГ',
    laurelSub: 'ШИЛДЭГ РОМАНТИК ДРАМ',
    icon: `<path d="M300 320 C240 400 220 480 300 560 C380 480 360 400 300 320 Z" fill="none" stroke="#f72585" stroke-width="8"/>
           <ellipse cx="280" cy="430" rx="15" ry="25" fill="#f472b6" opacity="0.6"/>
           <circle cx="300" cy="490" r="16" fill="#ffffff" opacity="0.8"/>`
  },
  {
    id: 'buru',
    title: 'БУРУУ ӨРӨГ',
    sub: 'WRONG MOVE • 2020',
    genre: 'ТРИЛЛЕР • ГЭМТ ХЭРЭГ',
    rating: '★ 8.5',
    color1: '#0f172a',
    color2: '#020617',
    accent: '#4cc9f0',
    gold: '#06d6a0',
    laurel: 'BLACK BOX STUDIO',
    laurelSub: 'ОНЫ ШИЛДЭГ ТРИЛЛЕР',
    icon: `<rect x="220" y="370" width="160" height="160" fill="none" stroke="#4cc9f0" stroke-width="7" rx="10"/>
           <line x1="300" y1="370" x2="300" y2="530" stroke="#06d6a0" stroke-width="4"/>
           <line x1="220" y1="450" x2="380" y2="450" stroke="#06d6a0" stroke-width="4"/>
           <circle cx="260" cy="410" r="18" fill="#4cc9f0"/>
           <polygon points="340,465 355,495 325,495" fill="#06d6a0"/>`
  },
  {
    id: 'hollywood',
    title: 'ХОЛЛИВУДАД ХҮРЭХ ЗАМ',
    sub: 'ROAD TO HOLLYWOOD • 2021',
    genre: 'ИНЭЭДЭМ • АДАЛ ЯВДАЛ',
    rating: '★ 8.2',
    color1: '#78350f',
    color2: '#1c0c02',
    accent: '#ffb703',
    gold: '#fb8500',
    laurel: 'MAX COMEDY PRODUCTION',
    laurelSub: 'ҮЗЭГЧДИЙГ БАЙЛДАН ДАГУУЛСАН КИНО',
    icon: `<rect x="200" y="380" width="200" height="150" fill="none" stroke="#ffb703" stroke-width="8" rx="12"/>
           <polygon points="275,415 345,455 275,495" fill="#fb8500"/>
           <circle cx="230" cy="340" r="24" fill="none" stroke="#ffb703" stroke-width="6"/>
           <circle cx="370" cy="340" r="24" fill="none" stroke="#ffb703" stroke-width="6"/>`
  },
  {
    id: 'mongol',
    title: 'МОНГОЛ',
    sub: 'CHINGGIS KHAAN • 2007',
    genre: 'ТҮҮХЭН • ЭПИК',
    rating: '★ 8.5',
    color1: '#713f12',
    color2: '#1a0e03',
    accent: '#d4a373',
    gold: '#faedcd',
    laurel: '80TH ACADEMY AWARDS',
    laurelSub: 'OSCAR NOMINEE - BEST FOREIGN FILM',
    icon: `<circle cx="300" cy="420" r="100" fill="none" stroke="#d4a373" stroke-width="8"/>
           <path d="M230 460 Q300 360 370 460" fill="none" stroke="#faedcd" stroke-width="7"/>
           <line x1="300" y1="280" x2="300" y2="480" stroke="#d4a373" stroke-width="6"/>
           <circle cx="300" cy="270" r="14" fill="#faedcd"/>`
  },
  {
    id: 'galzuu',
    title: 'ГАЛЗУУ ЗУГААЛГА',
    sub: 'CRAZY TRIP • 2019',
    genre: 'ИНЭЭДЭМ • ЗАЛУУС',
    rating: '★ 8.1',
    color1: '#064e3b',
    color2: '#021812',
    accent: '#06d6a0',
    gold: '#118ab2',
    laurel: 'EMOTION FILMS',
    laurelSub: 'ОНЫ ШИЛДЭГ ИНЭЭДМИЙН КИНО',
    icon: `<rect x="200" y="390" width="200" height="130" fill="none" stroke="#06d6a0" stroke-width="7" rx="20"/>
           <line x1="200" y1="450" x2="400" y2="450" stroke="#118ab2" stroke-width="5"/>
           <circle cx="250" cy="530" r="25" fill="#06d6a0"/>
           <circle cx="350" cy="530" r="25" fill="#06d6a0"/>
           <line x1="220" y1="360" x2="380" y2="360" stroke="#06d6a0" stroke-width="6" stroke-linecap="round"/>`
  }
];

function generatePoster(m) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bg-${m.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${m.color1}" />
      <stop offset="50%" stop-color="${m.color2}" />
      <stop offset="100%" stop-color="#050508" />
    </linearGradient>
    <radialGradient id="glow-${m.id}" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="${m.accent}" stop-opacity="0.35" />
      <stop offset="60%" stop-color="${m.accent}" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="overlay-${m.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000" stop-opacity="0.2" />
      <stop offset="55%" stop-color="#000" stop-opacity="0.1" />
      <stop offset="85%" stop-color="#000" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#050508" stop-opacity="1" />
    </linearGradient>
    <filter id="shadow-${m.id}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.9"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="600" height="900" fill="url(#bg-${m.id})"/>
  <rect width="600" height="900" fill="url(#glow-${m.id})"/>

  <!-- Geometric Grid & Accents -->
  <g opacity="0.12" stroke="${m.accent}" stroke-width="1">
    <circle cx="300" cy="450" r="260" fill="none"/>
    <circle cx="300" cy="450" r="320" fill="none" stroke-dasharray="8 12"/>
    <line x1="300" y1="50" x2="300" y2="850"/>
    <line x1="50" y1="450" x2="550" y2="450"/>
  </g>

  <!-- Central Emblem / Movie Icon -->
  <g filter="url(#shadow-${m.id})">
    ${m.icon}
  </g>

  <!-- Gradient Overlay -->
  <rect width="600" height="900" fill="url(#overlay-${m.id})"/>

  <!-- Top Badges -->
  <g transform="translate(40, 50)">
    <rect width="90" height="28" rx="6" fill="${m.accent}" opacity="0.9"/>
    <text x="45" y="19" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="12" fill="#fff" text-anchor="middle" letter-spacing="1">4K UHD</text>
  </g>
  <g transform="translate(470, 50)">
    <rect width="90" height="28" rx="6" fill="#18181f" stroke="#333" stroke-width="1"/>
    <text x="45" y="19" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="13" fill="${m.gold}" text-anchor="middle">${m.rating}</text>
  </g>

  <!-- Laurel & Festival Award (Middle-bottom) -->
  <g transform="translate(300, 630)" text-anchor="middle">
    <!-- Wreath Left -->
    <path d="M-90,0 C-110,-20 -105,-45 -85,-55 C-95,-35 -80,-15 -60,0" fill="${m.gold}" opacity="0.75"/>
    <path d="M-75,10 C-100,5 -105,-15 -85,-30 C-90,-10 -75,5 -50,10" fill="${m.gold}" opacity="0.6"/>
    <!-- Wreath Right -->
    <path d="M90,0 C110,-20 105,-45 85,-55 C95,-35 80,-15 60,0" fill="${m.gold}" opacity="0.75"/>
    <path d="M75,10 C100,5 105,-15 85,-30 C90,-10 75,5 50,10" fill="${m.gold}" opacity="0.6"/>
    <!-- Laurel Texts -->
    <text y="-32" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${m.gold}" letter-spacing="3">${m.laurel}</text>
    <text y="-16" font-family="'Segoe UI', sans-serif" font-weight="500" font-size="9" fill="#e2e8f0" letter-spacing="2">${m.laurelSub}</text>
  </g>

  <!-- Bottom Titles & Details -->
  <g transform="translate(300, 725)" text-anchor="middle">
    <text y="0" font-family="'Segoe UI', 'Montserrat', Arial, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="3" filter="url(#shadow-${m.id})">${m.title}</text>
    <text y="32" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="14" fill="${m.gold}" letter-spacing="4">${m.sub}</text>
    <text y="58" font-family="'Segoe UI', sans-serif" font-weight="500" font-size="12" fill="#94a3b8" letter-spacing="3">${m.genre}</text>

    <!-- Bottom credits line -->
    <line x1="-180" y1="80" x2="180" y2="80" stroke="#334155" stroke-width="1"/>
    <text y="102" font-family="'Segoe UI', sans-serif" font-size="10" fill="#64748b" letter-spacing="2">ITGEL KINO • CINEMATIC EXPERIENCE</text>
  </g>
</svg>`;
}

function generateBackdrop(m) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="bbg-${m.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${m.color1}" />
      <stop offset="40%" stop-color="${m.color2}" />
      <stop offset="100%" stop-color="#07070b" />
    </linearGradient>
    <radialGradient id="bglow-${m.id}" cx="70%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${m.accent}" stop-opacity="0.45" />
      <stop offset="60%" stop-color="${m.accent}" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="vignette" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#07070b" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#07070b" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#07070b" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient id="vignette-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#07070b" stop-opacity="0" />
      <stop offset="70%" stop-color="#07070b" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#07070b" stop-opacity="1" />
    </linearGradient>
  </defs>

  <rect width="1920" height="1080" fill="url(#bbg-${m.id})"/>
  <rect width="1920" height="1080" fill="url(#bglow-${m.id})"/>

  <!-- Right side hero graphical motif -->
  <g transform="translate(1300, 520) scale(1.6)" opacity="0.85">
    ${m.icon}
  </g>

  <!-- Ambient rays & light -->
  <g opacity="0.15" stroke="${m.accent}">
    <circle cx="1300" cy="520" r="420" fill="none" stroke-width="2"/>
    <circle cx="1300" cy="520" r="580" fill="none" stroke-width="1" stroke-dasharray="20 20"/>
  </g>

  <!-- Vignette overlays for text readability -->
  <rect width="1920" height="1080" fill="url(#vignette)"/>
  <rect width="1920" height="1080" fill="url(#vignette-bottom)"/>
</svg>`;
}

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

movies.forEach(m => {
  const posterPath = path.join(assetsDir, `poster-${m.id}.svg`);
  const backdropPath = path.join(assetsDir, `backdrop-${m.id}.svg`);
  
  fs.writeFileSync(posterPath, generatePoster(m), 'utf8');
  fs.writeFileSync(backdropPath, generateBackdrop(m), 'utf8');
  console.log(`Generated: poster-${m.id}.svg and backdrop-${m.id}.svg`);
});

// Also create logo.svg
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
  <defs>
    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e63946" />
      <stop offset="100%" stop-color="#f4a261" />
    </linearGradient>
  </defs>
  <!-- Play Icon Badge -->
  <rect x="5" y="15" width="50" height="50" rx="14" fill="url(#logo-grad)"/>
  <polygon points="25,28 42,40 25,52" fill="#ffffff"/>
  <!-- Text -->
  <text x="68" y="46" font-family="'Montserrat', 'Segoe UI', sans-serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="2">ITGEL<tspan fill="#e63946">.</tspan></text>
  <text x="178" y="46" font-family="'Montserrat', 'Segoe UI', sans-serif" font-weight="300" font-size="22" fill="#94a3b8" letter-spacing="4">KINO</text>
  <text x="69" y="62" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="9" fill="#f4a261" letter-spacing="3.5">МОНГОЛ КИНОНЫ ЕРТӨНЦ</text>
</svg>`;
fs.writeFileSync(path.join(assetsDir, 'logo.svg'), logoSvg, 'utf8');
console.log('Generated: logo.svg');
