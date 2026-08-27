const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const port = process.env.PORT || '3000';
process.env.PORT = port;
process.env.HOSTNAME = '0.0.0.0';

const path1 = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(path1)) {
  console.log(`[Start] Launching standalone server from: ${path1} on port ${port}`);
  require(path1);
} else {
  console.log(`[Start] Launching standard Next.js production server on port ${port}`);
  const child = spawn('npx', ['next', 'start', '-p', port, '-H', '0.0.0.0'], { 
    stdio: 'inherit',
    shell: true,
    env: process.env 
  });
  child.on('exit', (code) => process.exit(code || 0));
}
