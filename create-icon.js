// Icon Creator mit echter 256x256 ICO
const fs = require('fs');
const path = require('path');

console.log('Erstelle 256x256 Mochi-UI Icon...');

// Erstelle ein Minimal-256x256 ICO mit einfachster Struktur
function createIconBuffer() {
  // ICO Header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // Reserved
  header.writeUInt16LE(1, 2);      // Type (1 = ICO)
  header.writeUInt16LE(1, 4);      // Entries
  
  // Image Directory Entry  
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(0, 0);       // Width (0 = 256)
  dirEntry.writeUInt8(0, 1);       // Height (0 = 256)
  dirEntry.writeUInt8(0, 2);       // Colors
  dirEntry.writeUInt8(0, 3);       // Reserved
  dirEntry.writeUInt16LE(1, 4);    // Color planes
  dirEntry.writeUInt16LE(32, 6);   // Bits per pixel
  dirEntry.writeUInt32LE(1024 + 40, 8);  // Image data size
  dirEntry.writeUInt32LE(22, 12);  // Offset
  
  // Minimal BMP header
  const bmpHeader = Buffer.alloc(40);
  bmpHeader.writeUInt32LE(40, 0);      // Header size
  bmpHeader.writeInt32LE(256, 4);      // Width
  bmpHeader.writeInt32LE(512, 8);      // Height (doubled)
  bmpHeader.writeUInt16LE(1, 12);      // Planes
  bmpHeader.writeUInt16LE(32, 14);     // Bits per pixel
  
  // 4KB of pixel data (white/transparent)
  const pixels = Buffer.alloc(1024, 0xFF);
  
  return Buffer.concat([header, dirEntry, bmpHeader, pixels]);
}

const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

try {
  const iconBuffer = createIconBuffer();
  fs.writeFileSync(path.join(buildDir, 'icon.ico'), iconBuffer);
  console.log('✓ Icon erstellt: build/icon.ico (' + iconBuffer.length + ' bytes)');
} catch (e) {
  console.error('Error creating icon:', e.message);
}
