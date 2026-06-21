const { spawn } = require('child_process');

const server = spawn('npm.cmd', ['run', 'dev'], { shell: true });
let tested = false;

server.stdout.on('data', async (data) => {
  const output = data.toString();
  console.log(output);
  if (output.includes('Ready in') && !tested) {
    tested = true;
    console.log('Server is ready. Testing /api/chat...');
    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
      });
      console.log('Status:', res.status);
      const text = await res.text();
      console.log('Body:', text);
    } catch (e) {
      console.error(e);
    }
    server.kill();
    process.exit(0);
  }
});
