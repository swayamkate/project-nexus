const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const port = process.env.PORT || '10000';
process.env.PORT = port;
process.env.HOSTNAME = '0.0.0.0';

const path1 = path.join(__dirname, '.next', 'standalone', 'admin-app', 'server.js');
const path2 = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(path1)) {
  console.log(`[Start] Launching standalone server from: ${path1} on port ${port}`);
  require(path1);
} else if (fs.existsSync(path2)) {
  console.log(`[Start] Launching standalone server from: ${path2} on port ${port}`);
  require(path2);
} else {
  console.log(`[Start] Launching standard Next.js production server on port ${port}`);
  const child = spawn('npx', ['next', 'start', '-p', port, '-H', '0.0.0.0'], { 
    stdio: 'inherit',
    shell: true,
    env: process.env 
  });
  child.on('exit', (code) => process.exit(code || 0));
}
