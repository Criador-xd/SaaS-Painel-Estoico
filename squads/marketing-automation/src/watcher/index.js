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
    this.publishedFolder = config.PUBLISHED_FOLDER;
    this.queue = [];
    this.processedFiles = new Set();
  }

  // Iniciar monitoramento
  async start() {
    console.log(`🔍 Watching: ${this.watchFolder}`);

    // Carregar arquivos já processados
    await this.loadProcessedFiles();

    // Escanear vídeos existentes na pasta
    await this.scanExistingVideos();

    // Iniciar watcher
    this.watcher = chokidar.watch(this.watchFolder, {
      ignored: /^\./,
      persistent: true,
      ignoreInitial: true,
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

  // Escanear vídeos existentes na pasta
  async scanExistingVideos() {
    const files = await fs.readdir(this.watchFolder).catch(() => []);
    const validExtensions = ['.mp4', '.mov', '.webm', '.avi'];
    
    let newCount = 0;
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!validExtensions.includes(ext)) continue;
      
      const filePath = path.join(this.watchFolder, file);
      try {
        const fileHash = await this.getFileHash(filePath);
        if (this.processedFiles.has(fileHash)) {
          continue;
        }
        
        const stats = await fs.stat(filePath);
        const sizeMB = stats.size / (1024 * 1024);
        
        if (sizeMB < 0.5 || sizeMB > 500) continue;
        
        const video = {
          id: this.generateId(),
          filename: file,
          filepath: filePath,
          path: filePath,
          size: sizeMB,
          duration: null,
          hash: fileHash,
          detectedAt: new Date().toISOString(),
          status: 'pending'
        };
        
        this.queue.push(video);
        await this.saveVideoToQueue(video);
        newCount++;
      } catch (e) {}
    }
    
    if (newCount > 0) {
      console.log(`📹 ${newCount} vídeos encontrados na pasta`);
    }
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
      filepath: filePath,
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
      
      // Mover vídeo para pasta de publicados
      await this.moveVideoToPublished(video);
    }
  }
  
  // Mover vídeo para pasta de publicados
  async moveVideoToPublished(video) {
    try {
      const sourcePath = video.filepath || video.path;
      const filename = video.filename;
      const destFolder = this.publishedFolder;
      
      await fs.ensureDir(destFolder);
      
      const destPath = path.join(destFolder, filename);
      
      // Verificar se arquivo existe e mover
      if (await fs.exists(sourcePath)) {
        await fs.move(sourcePath, destPath);
        console.log(`   📁 Movido para publicados: ${filename}`);
      }
    } catch (error) {
      console.error(`   ⚠️ Erro ao mover vídeo: ${error.message}`);
    }
  }
}

module.exports = VideoWatcher;