/**
 * WATCHER - Monitora pasta de vídeos e detecta novos arquivos
 */
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');

class VideoWatcher {
  constructor(config) {
    this.watchFolder = config.WATCH_FOLDER;
    this.outputFolder = config.OUTPUT_FOLDER;
    this.queue = [];
    this.processedFiles = new Set();
  }

  // Iniciar monitoramento
  async start() {
    console.log(`🔍 Watching: ${this.watchFolder}`);

    // Carregar arquivos já processados
    await this.loadProcessedFiles();

    // Iniciar watcher
    this.watcher = chokidar.watch(this.watchFolder, {
      ignored: /^\./,
      persistent: true,
      ignoreInitial: false,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      }
    });

    this.watcher
      .on('add', (filePath) => this.handleNewFile(filePath))
      .on('error', (error) => console.error('Watcher error:', error));

    console.log('✅ Watcher iniciado');
  }

  // Parar monitoramento
  async stop() {
    await this.watcher?.close();
    console.log('⏹️ Watcher parado');
  }

  // Processar novo arquivo
  async handleNewFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const validExtensions = ['.mp4', '.mov', '.webm', '.avi'];

    if (!validExtensions.includes(ext)) {
      return; // Ignorar arquivos não-vídeo
    }

    // Verificar se já foi processado
    const fileHash = await this.getFileHash(filePath);
    if (this.processedFiles.has(fileHash)) {
      console.log(`⏭️ Já processado: ${path.basename(filePath)}`);
      return;
    }

    // Validar vídeo
    const validation = await this.validateVideo(filePath);
    if (!validation.valid) {
      console.log(`❌ Vídeo inválido: ${path.basename(filePath)} - ${validation.reason}`);
      return;
    }

    // Adicionar à fila
    const video = {
      id: this.generateId(),
      filename: path.basename(filePath),
      path: filePath,
      size: validation.size,
      duration: validation.duration,
      hash: fileHash,
      detectedAt: new Date().toISOString(),
      status: 'pending'
    };

    this.queue.push(video);
    console.log(`📹 Novo vídeo detectado: ${video.filename}`);

    // Salvar na pasta de saída
    await this.saveVideoToQueue(video);
  }

  // Validar vídeo
  async validateVideo(filePath) {
    const stats = await fs.stat(filePath);
    const sizeMB = stats.size / (1024 * 1024);

    // Validações de tamanho
    if (sizeMB < 0.5) {
      return { valid: false, reason: 'Arquivo muito pequeno' };
    }
    if (sizeMB > 500) {
      return { valid: false, reason: 'Arquivo muito grande' };
    }

    // Por enquanto, aceitamos todos os formatos de vídeo válidos
    // Uma versão futura pode usar ffprobe para validar codecs e duração
    return {
      valid: true,
      size: sizeMB,
      duration: null // Para implementar com ffprobe
    };
  }

  // Gerar hash do arquivo
  async getFileHash(filePath) {
    const content = await fs.readFile(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  }

  // Gerar ID único
  generateId() {
    return `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Salvar vídeo na fila de saída
  async saveVideoToQueue(video) {
    const queueFile = path.join(this.outputFolder, 'queue', `${video.id}.json`);
    await fs.ensureDir(path.dirname(queueFile));
    await fs.writeJson(queueFile, video, { spaces: 2 });
  }

  // Carregar arquivos processados
  async loadProcessedFiles() {
    const dbFile = path.join(this.outputFolder, 'processed-files.json');
    if (await fs.exists(dbFile)) {
      const data = await fs.readJson(dbFile);
      this.processedFiles = new Set(data.hashes);
    }
  }

  // Obter próxima fila
  getQueue() {
    return this.queue;
  }

  // Marcar como processado
  async markAsProcessed(videoId) {
    const queueFile = path.join(this.outputFolder, 'queue', `${videoId}.json`);
    if (await fs.exists(queueFile)) {
      const video = await fs.readJson(queueFile);
      video.status = 'processed';
      await fs.writeJson(queueFile, video, { spaces: 2 });
      this.processedFiles.add(video.hash);
      
      // Atualizar lista de processados
      const dbFile = path.join(this.outputFolder, 'processed-files.json');
      await fs.writeJson(dbFile, {
        hashes: Array.from(this.processedFiles),
        lastUpdated: new Date().toISOString()
      }, { spaces: 2 });
    }
  }
}

module.exports = VideoWatcher;