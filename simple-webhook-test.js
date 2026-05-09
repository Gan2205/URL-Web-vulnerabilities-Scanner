const http = require('http');

const server = http.createServer((req, res) => {
  console.log('📡 Received request:', req.method, req.url);
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    console.log('📡 Request body:', body);
    console.log('📡 Headers:', req.headers);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Webhook received' }));
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🧪 Simple webhook test server running on port ${PORT}`);
  console.log(`📡 Test URL: http://localhost:${PORT}/test`);
});
