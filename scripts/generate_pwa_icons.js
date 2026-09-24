const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// 1. Vector SVG icon with modern automotive styling
function createSvg(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.2 : size * 0.12;
  const contentSize = size - padding * 2;
  const rx = isMaskable ? 0 : size * 0.22;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e0f2fe" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${size * 0.02}" stdDeviation="${size * 0.02}" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${rx}" fill="url(#bg)" />
  <rect width="${size}" height="${size}" rx="${rx}" fill="url(#glow)" />

  <!-- Subtle grid/tech circles in background -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${contentSize * 0.48}" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="${size * 0.008}" stroke-dasharray="6,6" />

  <!-- Inner automotive emblem: gear + wrench -->
  <g transform="translate(${size / 2}, ${size / 2}) scale(${contentSize / 100}) translate(-50, -50)" filter="url(#shadow)">
    <!-- Central Gear / Brake rotor -->
    <circle cx="50" cy="50" r="32" fill="none" stroke="url(#accent)" stroke-width="7" stroke-dasharray="14 5" />
    <circle cx="50" cy="50" r="22" fill="#0f172a" fill-opacity="0.4" stroke="url(#accent)" stroke-width="3" />

    <!-- Crossed precision Wrench -->
    <path d="M62 26 C64 22 69 20 74 22 L67 29 L71 33 L78 26 C80 31 78 36 74 38 L38 74 C36 76 33 76 31 74 L26 69 C24 67 24 64 26 62 Z" fill="url(#accent)" />
    <!-- Sparkle accent -->
    <polygon points="50,38 52,43 57,45 52,47 50,52 48,47 43,45 48,43" fill="#38bdf8" />
  </g>
</svg>`;
}

async function generate() {
  console.log('🎨 Generating PWA Icons...');

  const sizes = [
    { name: 'icon-192x192.png', size: 192, maskable: false },
    { name: 'icon-512x512.png', size: 512, maskable: false },
    { name: 'icon-maskable-192x192.png', size: 192, maskable: true },
    { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
    { name: 'apple-touch-icon.png', size: 180, maskable: false },
  ];

  for (const { name, size, maskable } of sizes) {
    const svg = createSvg(size, maskable);
    const dest = path.join(publicDir, name);
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(dest);
    console.log(`  ✅ Generated ${name} (${size}x${size})`);
  }

  // Favicon SVG
  const faviconSvg = createSvg(64, false);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);
  console.log('  ✅ Generated favicon.svg');

  // Favicon ICO (32x32 PNG as ico)
  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('  ✅ Generated favicon.ico');

  console.log('🎉 All PWA icons generated successfully!');
}

generate().catch(console.error);
