const { spawn } = require('child_process');
const path = require('path');

const electronPath = path.join(__dirname, 'node_modules/electron/dist/Electron.app/Contents/MacOS/Electron');
const appPath = __dirname;

const child = spawn(electronPath, [appPath, '--remote-debugging-port=9222'], {
  stdio: 'inherit',
  env: { ...process.env, VITE_DEV_SERVER_URL: 'http://localhost:5173' }
});

child.on('close', (code) => {
  process.exit(code);
});
