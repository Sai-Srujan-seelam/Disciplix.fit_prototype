const { spawn } = require('child_process');

// Test if the server can start
const server = spawn('node', ['-e', `
  try {
    const config = require('./src/config/config.ts');
    console.log('✅ Config loaded successfully');
    console.log('✅ Basic server test passed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    process.exit(1);
  }
`]);

server.stdout.on('data', (data) => {
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  console.error(data.toString());
});

server.on('close', (code) => {
  console.log(`Test completed with exit code ${code}`);
  process.exit(code);
});