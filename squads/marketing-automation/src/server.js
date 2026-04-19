/**
 * API Server - Fornece dados para o Dashboard
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const PORT = 3000;

// Configuração do Supabase
let supabaseClient = null;
try {
  const configPath = path.join(__dirname, '..', '..', 'config', 'config.yaml');
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const urlMatch = configContent.match(/SUPABASE_URL:\s*(.+)/);
    const keyMatch = configContent.match(/SUPABASE_SERVICE_KEY:\s*(.+)/);
    if (urlMatch && keyMatch) {
      supabaseClient = createClient(urlMatch[1].trim(), keyMatch[1].trim());
      console.log('✅ Supabase configurado no server');
    }
  }
} catch (e) {
  console.log('Supabase não configurado no server');
}

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
  
  // API Post Info - Último post e próximo post
  if (url === '/api/post-info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const outputFolder = path.join(__dirname, '..', '_output');
    const result = { lastPost: null, nextPost: null, lastPostFromSupabase: null, nextPostFromSupabase: null };
    
    // Buscar último post publicado (arquivo local)
    const processedFile = path.join(outputFolder, 'processed-files.json');
    if (fs.existsSync(processedFile)) {
      const processed = JSON.parse(fs.readFileSync(processedFile, 'utf8'));
      if (processed.hashes && processed.hashes.length > 0) {
        const lastHash = processed.hashes.filter(h => h)[processed.hashes.length - 1];
        if (lastHash) {
          result.lastPost = { hash: lastHash, publishedAt: processed.lastUpdated };
        }
      }
    }
    
    // Buscar próximo post agendado (arquivo local)
    const scheduleFile = path.join(outputFolder, 'schedule.json');
    if (fs.existsSync(scheduleFile)) {
      const schedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf8'));
      if (schedule.schedule && schedule.schedule.length > 0) {
        const saoPauloNow = new Date(Date.now() - (3 * 60 * 60 * 1000));
        const upcoming = schedule.schedule.filter(s => new Date(s.scheduledAt) > saoPauloNow);
        if (upcoming.length > 0) {
          result.nextPost = upcoming[0];
        }
      }
    }
    
    // Buscar do Supabase se disponível
    if (supabaseClient) {
      const SYSTEM_USER_ID = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';
      const saoPauloNow = new Date(Date.now() - (3 * 60 * 60 * 1000)).toISOString();
      
      // Último post publicado
      supabaseClient
        .from('publication_targets')
        .select('*, publications(title)')
        .eq('status', 'publicado')
        .eq('platform', 'youtube')
        .order('published_at', { ascending: false })
        .limit(1)
        .then(({ data: lastPub }) => {
          if (lastPub && lastPub.length > 0) {
            result.lastPostFromSupabase = {
              title: lastPub[0].publications?.title,
              publishedAt: lastPub[0].published_at,
              platform: lastPub[0].platform,
              url: lastPub[0].platform_post_url
            };
          }
        })
        .then(() => {
          // Próximo post agendado
          return supabaseClient
            .from('publications')
            .select('*, publication_targets(*)')
            .eq('user_id', SYSTEM_USER_ID)
            .eq('overall_status', 'pendente')
            .gte('scheduled_for', saoPauloNow)
            .order('scheduled_for', { ascending: true })
            .limit(1);
        })
        .then(({ data: nextPub }) => {
          if (nextPub && nextPub.length > 0) {
            result.nextPostFromSupabase = {
              title: nextPub[0].title,
              scheduledFor: nextPub[0].scheduled_for,
              platforms: nextPub[0].publication_targets?.map(t => t.platform)
            };
          }
        })
        .then(() => {
          res.end(JSON.stringify(result));
        })
        .catch(() => {
          res.end(JSON.stringify(result));
        });
      return;
    }
    
    res.end(JSON.stringify(result));
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
    const dashboardPath = path.join(__dirname, '..', 'dashboard', 'index.html');
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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌐 Dashboard disponível em: http://localhost:${PORT}`);
  console.log(`📊 API Status em: http://localhost:${PORT}/api/status\n`);
});

module.exports = { server, addLog };