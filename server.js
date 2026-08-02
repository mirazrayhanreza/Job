/**
 * Hostinger / Node.js standard entry point wrapper
 * Redirects execution to compiled dist/server.cjs
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const compiledServerPath = path.join(__dirname, 'dist', 'server.cjs');

if (!fs.existsSync(compiledServerPath)) {
  console.log('Compiling server and bundle before startup...');
  execSync('npm run build', { stdio: 'inherit' });
}

require(compiledServerPath);
