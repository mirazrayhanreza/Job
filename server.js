/**
 * Hostinger / Node.js standard entry point wrapper
 * Redirects execution to compiled dist/server.cjs
 */
const fs = require('fs');
const path = require('path');

const compiledServerPath = path.join(__dirname, 'dist', 'server.cjs');

if (!fs.existsSync(compiledServerPath)) {
  console.error('Error: dist/server.cjs not found. Make sure "npm run build" ran during deployment.');
  try {
    const { execSync } = require('child_process');
    console.log('Attempting emergency build...');
    execSync('npm run build', { stdio: 'inherit' });
  } catch (e) {
    console.error('Emergency build failed:', e);
  }
}

require(compiledServerPath);
