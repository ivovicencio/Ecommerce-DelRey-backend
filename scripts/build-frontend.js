const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..', '..', 'Ecommerce-DelRey');
const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(frontendDir, 'dist', 'ecommerce', 'browser');

console.log('📦 Build del frontend...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

console.log('📂 Copiando archivos al backend...');
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true });
}
fs.cpSync(distDir, publicDir, { recursive: true });

console.log('✅ Frontend build listo en backend/public/');
