/**
 * API Server - Fornece dados para o Dashboard
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Estado global (seria melhor usar banco de dados real)
let systemStatus = {
  totalVideos: 0,
  pendingVideos: 0,
  scheduledVideos: 0,
  publishedVideos: 0,
  supabaseConnected: false,
  nextToPublish: [],
  queue: [],
  logs: []
};

// Carregar dados dos arquivos
function loadStatus() {
  const outputFolder = path.join(__dirname, '..', '_output');
  
  // Contar vídeos na fila
  const queueFolder = path.join(outputFolder, 'queue');
  if (fs.existsSync(queueFolder)) {
    const files = fs.readdirSync(queueFolder).filter(f => f.endsWith('.json'));
    systemStatus.pendingVideos = files.length;
    systemStatus.totalVideos = files.length;
    
    // Ler detalhes da fila
    systemStatus.queue = files.slice(0, 10).map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(queueFolder, f), 'utf8'));
      return { id: data.id, filename: data.filename, category: data.category, priority: data.priority };
    });
  }
  
  // Ler programação
  const scheduleFile = path.join(outputFolder, 'schedule.json');
  if (fs.existsSync(scheduleFile)) {
    const schedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf8'));
    systemStatus.scheduledVideos = schedule.schedule?.length || 0;
    systemStatus.nextToPublish = (schedule.schedule || []).slice(0, 5);
  }
  
  // Contar processados
  const processedFile = path.join(outputFolder, 'processed-files.json');
  if (fs.existsSync(processedFile)) {
    const processed = JSON.parse(fs.readFileSync(processedFile, 'utf8'));
    systemStatus.publishedVideos = processed.hashes?.length || 0;
  }
}

function addLog(message) {
  const time = new Date().toLocaleTimeString('pt-BR');
  systemStatus.logs.unshift({ time, message });
  if (systemStatus.logs.length > 50) systemStatus.logs.pop();
}

// Criar servidor HTTP
const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const url = req.url;
  
  // API Status
  if (url === '/api/status') {
    loadStatus();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(systemStatus));
    return;
  }
  
  // API Log
  if (url === '/api/log' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { message } = JSON.parse(body);
        addLog(message);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }
  
  // Dashboard HTML
  if (url === '/' || url === '/dashboard') {
    const dashboardPath = path.join(__dirname, 'dashboard', 'index.html');
    fs.readFile(dashboardPath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Dashboard não encontrado');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }
  
  // 404
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`\n🌐 Dashboard disponível em: http://localhost:${PORT}`);
  console.log(`📊 API Status em: http://localhost:${PORT}/api/status\n`);
});

module.exports = { server, addLog };