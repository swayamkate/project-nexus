const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const port = process.env.PORT || '3000';
process.env.PORT = port;
process.env.HOSTNAME = '0.0.0.0';

const outPath = path.join(__dirname, 'out');
const standalonePath = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(outPath)) {
  console.log(`[Start] Serving static export from: ${outPath} with cleanUrls on port ${port}`);
  const child = spawn('npx', ['serve', '-s', 'out', '--clean-urls', '-c', 'serve.json', '-l', port], {
    stdio: 'inherit',
    shell: true,
    env: process.env
  });
  child.on('exit', (code) => process.exit(code || 0));
} else if (fs.existsSync(standalonePath)) {
  console.log(`[Start] Launching standalone server from: ${standalonePath} on port ${port}`);
  require(standalonePath);
} else {
  console.log(`[Start] Launching standard Next.js production server on port ${port}`);
  const child = spawn('npx', ['next', 'start', '-p', port, '-H', '0.0.0.0'], { 
    stdio: 'inherit',
    shell: true,
    env: process.env 
  });
  child.on('exit', (code) => process.exit(code || 0));
}
