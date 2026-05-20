const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = 3001;
const DATA_DIR = path.join(__dirname, '..', 'publisher-data');
const DATA_FILE = path.join(DATA_DIR, 'queue.json');

let contentFolder = 'D:\\menteestoicaabsoluta';
let publishedFolder = 'D:\\Videos publicados\\menteestoicaabsoluta';

const SCHEDULE_HOURS = [3, 10, 15, 22];
const ALLOWED_EXT = ['.mp4', '.jpg', '.jpeg', '.png'];
const MAX_PER_BATCH = 10;

const JOB_TEMPLATES = [
  'Estoicismo aplicado ao dia a dia - reflexões de Marco Aurélio',
  'O poder do silêncio interior - como calar a mente',
  'A arte de não reagir - domínio emocional absoluto',
  'Memento Mori - a morte como mestra',
  'Disciplina é liberdade - o caminho estoico',
  'Controle interno - o que depende de nós',
  'O vazio moderno e o preenchimento estoico',
  'Amor Fati - ame seu destino incondicionalmente',
  'A ditadura das emoções e a soberania da razão',
  'A fortaleza interior que ninguém pode destruir',
  'Epicteto e a arte de não se importar com o trivial',
  'Sêneca sobre a brevidade da vida - o que realmente importa',
  'Aceitação radical - paz em meio ao caos',
  'Foco no que controla - o resto é ilusão',
  'A beleza da adversidade - forjado no fogo',
  'Silêncio - a ferramenta mais subestimada do estoico',
  'A prática diária da morte - viva cada dia como o último',
  'Auto-disciplina - o único atalho para a liberdade',
  'Paz interior - como encontrá-la em um mundo barulhento',
  'A arte da resiliência - nenhum vento é contra para quem sabe navegar',
  'Desapego estoico - liberte-se do que não controla',
  'A força que vem da aceitação - renda-se para vencer',
  'Domínio da mente - o verdadeiro campo de batalha',
  'A solitude como combustível do sábio',
  'Impermanência - a beleza dolorosa de tudo passar'
];

const HASHTAG_POOL = [
  '#estoicismo', '#resiliencia', '#menteblindada', '#disciplina', '#sabedoria',
  '#foco', '#pazinterior', '#filosofia', '#autoconhecimento', '#meditacao',
  '#mindset', '#superacao', '#forcainterior', '#reflexao', '#vidacomsentido',
  '#controleemocional', '#amorproprio', '#evolucao', '#proposito', '#atencao',
  '#silêncio', '#mementomori', '#amorfati', '#estoico', '#filosofiareal'
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadQueue() {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    const initial = { items: [], history: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { items: [], history: [] };
  }
}

function saveQueue(data) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getNextSchedule() {
  const now = new Date();
  const brtOffset = -3 * 60;
  const local = new Date(now.getTime() + brtOffset * 60000);
  const currentHour = local.getUTCHours();
  const currentMin = local.getUTCMinutes();

  const today = local.toISOString().split('T')[0];

  for (const h of SCHEDULE_HOURS) {
    if (h > currentHour || (h === currentHour && currentMin < 59)) {
      return { date: today, hour: h, minute: 0 };
    }
  }

  const tomorrow = new Date(local);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  return { date: tomorrowStr, hour: SCHEDULE_HOURS[0], minute: 0 };
}

function generateRandomId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

function detectContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === '.mp4') return 'reels';
  return 'carrossel';
}

function getPlatforms(contentType) {
  if (contentType === 'reels') {
    return ['instagram', 'youtube'];
  }
  return ['instagram'];
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getMediaPreview(type) {
  if (type === 'reels') {
    return 'https://img.icons8.com/fluency/48/video.png';
  }
  return 'https://img.icons8.com/fluency/48/image.png';
}

function generateContent(fileName, fileType) {
  const template = pickRandom(JOB_TEMPLATES);
  const words = template.split(' ');
  const shortTitle = words.slice(0, 5).join(' ').replace(/[,.-]/g, '');

  const titles = {
    interno: `${shortTitle} | Reflexão Estoica`,
    instagram: `${shortTitle}`.substring(0, 60)
  };

  const caption = `${template}.\n\nA filosofia estoica nos ensina que a verdadeira liberdade não está no que possuímos, mas no que escolhemos não precisar.\n\n🏛️ Respire. Reflita. Domine-se.\n\nCompartilhe com quem precisa ouvir isso hoje.`;

  const selectedHashtags = [...HASHTAG_POOL].sort(() => Math.random() - 0.5).slice(0, 8);

  const cta = 'Compartilhe essa reflexão com alguém que precisa encontrar paz interior. 🏛️';

  const autoComment = 'Se você está buscando mais clareza, disciplina e paz interior, está no link da Bio.';

  const contentType = detectContentType(fileName);
  const platforms = getPlatforms(contentType);
  const schedule = getNextSchedule();

  return {
    id: generateRandomId(),
    fileName,
    filePath: path.join(contentFolder, fileName),
    fileType,
    contentType,
    preview: getMediaPreview(contentType),
    titles,
    caption,
    hashtags: selectedHashtags,
    cta,
    autoComment,
    platforms,
    status: 'rascunho',
    schedule,
    createdAt: new Date().toISOString(),
    approved: false,
    publishedAt: null,
    autoCommentEnabled: true,
    approvalGate: true
  };
}

// API Routes

// List contents from the content folder
app.get('/api/contents', (req, res) => {
  try {
    if (!fs.existsSync(contentFolder)) {
      return res.json({ files: [], error: `Pasta não encontrada: ${contentFolder}` });
    }
    const allFiles = fs.readdirSync(contentFolder);
    const mediaFiles = allFiles
      .filter(f => ALLOWED_EXT.includes(path.extname(f).toLowerCase()))
      .slice(0, MAX_PER_BATCH)
      .map(f => ({
        name: f,
        path: path.join(contentFolder, f),
        type: path.extname(f).toLowerCase().replace('.', ''),
        contentType: detectContentType(f),
        size: fs.statSync(path.join(contentFolder, f)).size,
        modifiedAt: fs.statSync(path.join(contentFolder, f)).mtime
      }));
    res.json({ files: mediaFiles, folder: contentFolder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Preview a media file (return base64)
app.get('/api/preview', (req, res) => {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).json({ error: 'path required' });

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const ext = path.extname(filePath).toLowerCase();
    const isVideo = ext === '.mp4';
    const data = fs.readFileSync(filePath);
    const mime = isVideo ? 'video/mp4' : `image/${ext.replace('.', '')}`;
    const base64 = data.toString('base64');
    res.json({ data: `data:${mime};base64,${base64}`, isVideo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate content for files
app.post('/api/generate', (req, res) => {
  try {
    const { files } = req.body;
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: 'files array required' });
    }

    const data = loadQueue();
    const generated = [];

    for (const f of files.slice(0, MAX_PER_BATCH)) {
      const item = generateContent(f.name, f.type);
      data.items.push(item);
      generated.push(item);
    }

    saveQueue(data);
    res.json({ items: generated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get queue / history
app.get('/api/queue', (req, res) => {
  const data = loadQueue();
  const { search, status, type } = req.query;

  let items = [...data.items];
  let history = [...data.history];

  if (search) {
    const s = search.toLowerCase();
    items = items.filter(i => i.fileName.toLowerCase().includes(s) || i.titles?.interno?.toLowerCase().includes(s));
    history = history.filter(i => i.fileName.toLowerCase().includes(s) || i.titles?.interno?.toLowerCase().includes(s));
  }
  if (status && status !== 'todos') {
    items = items.filter(i => i.status === status);
    history = history.filter(i => i.status === status);
  }
  if (type && type !== 'todos') {
    items = items.filter(i => i.contentType === type);
    history = history.filter(i => i.contentType === type);
  }

  res.json({ items, history, folder: contentFolder, publishedFolder });
});

// Approve an item
app.post('/api/approve', (req, res) => {
  const { id } = req.body;
  const data = loadQueue();
  const item = data.items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  item.approved = true;
  item.status = 'aprovado';
  saveQueue(data);
  res.json({ item });
});

// Update item fields
app.post('/api/update', (req, res) => {
  const { id, fields } = req.body;
  const data = loadQueue();
  const item = data.items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  Object.assign(item, fields);
  saveQueue(data);
  res.json({ item });
});

// Schedule an item
app.post('/api/schedule', (req, res) => {
  const { id } = req.body;
  const data = loadQueue();
  const item = data.items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  if (!item.approved) return res.status(400).json({ error: 'Item must be approved first' });

  const schedule = getNextSchedule();
  item.schedule = schedule;
  item.status = 'agendado';
  saveQueue(data);
  res.json({ item, schedule });
});

// Publish now
app.post('/api/publish-now', (req, res) => {
  const { id } = req.body;
  const data = loadQueue();
  const itemIdx = data.items.findIndex(i => i.id === id);
  if (itemIdx === -1) return res.status(404).json({ error: 'Item not found' });

  const item = data.items[itemIdx];
  if (!item.approved) return res.status(400).json({ error: 'Item must be approved first' });

  // Move to published folder
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const destFolder = path.join(publishedFolder, dateStr);

  try {
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    const srcPath = item.filePath;
    const destPath = path.join(destFolder, item.fileName);

    if (fs.existsSync(srcPath)) {
      fs.renameSync(srcPath, destPath);
    }

    item.status = 'publicado';
    item.publishedAt = now.toISOString();
    item.filePath = destPath;

    // Move to history
    data.history.push({ ...item, status: 'publicado' });
    data.items.splice(itemIdx, 1);

    saveQueue(data);
    res.json({ item, movedTo: destPath });
  } catch (err) {
    item.status = 'erro';
    item.error = err.message;
    saveQueue(data);
    res.status(500).json({ error: err.message });
  }
});

// Regenerate caption for an item
app.post('/api/regenerate', (req, res) => {
  const { id } = req.body;
  const data = loadQueue();
  const item = data.items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const newTemplate = pickRandom(JOB_TEMPLATES.filter(t => t !== item.caption?.split('.')[0]));

  item.caption = `${newTemplate}.\n\nA filosofia estoica nos ensina que a verdadeira força está em dominar a si mesmo.\n\n🏛️ Silêncio. Foco. Disciplina.\n\nCompartilhe com quem precisa dessa mensagem.`;
  item.hashtags = [...HASHTAG_POOL].sort(() => Math.random() - 0.5).slice(0, 8);

  saveQueue(data);
  res.json({ item });
});

// Bulk schedule (for the auto publisher)
app.post('/api/bulk-schedule', (req, res) => {
  const data = loadQueue();
  const approved = data.items.filter(i => i.approved && i.status === 'aprovado');

  if (approved.length === 0) {
    return res.status(400).json({ error: 'No approved items to schedule' });
  }

  const scheduled = [];
  for (const item of approved) {
    item.schedule = getNextSchedule();
    item.status = 'agendado';
    scheduled.push(item);
  }

  saveQueue(data);
  res.json({ items: scheduled, count: scheduled.length });
});

// Delete item
app.post('/api/delete', (req, res) => {
  const { id } = req.body;
  const data = loadQueue();
  data.items = data.items.filter(i => i.id !== id);
  saveQueue(data);
  res.json({ success: true });
});

// Set content folder
app.post('/api/set-content-folder', (req, res) => {
  const { folder } = req.body;
  if (!folder) return res.status(400).json({ error: 'folder required' });
  contentFolder = folder;
  res.json({ folder: contentFolder });
});

// Set published folder
app.post('/api/set-published-folder', (req, res) => {
  const { folder } = req.body;
  if (!folder) return res.status(400).json({ error: 'folder required' });
  publishedFolder = folder;
  res.json({ folder: publishedFolder });
});

// Get folders
app.get('/api/folders', (req, res) => {
  res.json({ contentFolder, publishedFolder });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    contentFolder,
    publishedFolder,
    contentExists: fs.existsSync(contentFolder),
    publishedExists: fs.existsSync(publishedFolder),
    scheduleHours: SCHEDULE_HOURS,
    maxPerBatch: MAX_PER_BATCH
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`  PUBLISHER SERVER`);
  console.log(`  Porta: ${PORT}`);
  console.log(`  Pasta conteúdo: ${contentFolder}`);
  console.log(`  Pasta publicados: ${publishedFolder}`);
  console.log(`========================================\n`);
});