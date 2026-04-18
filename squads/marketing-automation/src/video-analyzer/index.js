/**
 * VIDEO ANALYZER - Extrai contexto dos vídeos para gerar conteúdo personalizado
 * Suporta: metadados, transcripts, arquivos de contexto
 */
const fs = require('fs-extra');
const path = require('path');

class VideoAnalyzer {
  constructor() {
    this.contextExtensions = ['.txt', '.json', '.md', '.srt', '.vtt'];
  }

  async analyze(videoPath) {
    const result = {
      filename: path.basename(videoPath),
      basename: path.basename(videoPath, path.extname(videoPath)),
      metadata: {},
      transcript: null,
      context: null,
      keywords: [],
      themes: []
    };

    try {
      result.metadata = await this.extractMetadata(videoPath);
      result.transcript = await this.findTranscript(videoPath);
      result.context = await this.findContextFile(videoPath);
      
      if (result.transcript || result.context) {
        result.keywords = this.extractKeywords(result.transcript || result.context);
        result.themes = this.detectThemes(result.keywords);
      }
    } catch (error) {
      console.log(`   ⚠️ Erro na análise: ${error.message}`);
    }

    return result;
  }

  async extractMetadata(videoPath) {
    const stats = await fs.stat(videoPath);
    const ext = path.extname(videoPath).toLowerCase();
    
    return {
      size: stats.size,
      sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
      extension: ext,
      created: stats.birthtime,
      modified: stats.mtime
    };
  }

  async findTranscript(videoPath) {
    const dir = path.dirname(videoPath);
    const basename = path.basename(videoPath, path.extname(videoPath));
    
    for (const ext of ['.srt', '.vtt', '.txt']) {
      const transcriptPath = path.join(dir, `${basename}${ext}`);
      if (await fs.pathExists(transcriptPath)) {
        const content = await fs.readFile(transcriptPath, 'utf8');
        return content.substring(0, 5000);
      }
    }
    
    return null;
  }

  async findContextFile(videoPath) {
    const dir = path.dirname(videoPath);
    const basename = path.basename(videoPath, path.extname(videoPath));
    
    for (const ext of ['.json', '.md', '.txt']) {
      const contextPath = path.join(dir, `${basename}_info${ext}`);
      if (await fs.pathExists(contextPath)) {
        const content = await fs.readFile(contextPath, 'utf8');
        return ext === '.json' ? JSON.parse(content) : content;
      }
    }
    
    const infoPath = path.join(dir, 'info', `${basename}.json`);
    if (await fs.pathExists(infoPath)) {
      return await fs.readJson(infoPath);
    }
    
    return null;
  }

  extractKeywords(text) {
    if (!text) return [];
    
    const stopWords = ['de', 'da', 'do', 'das', 'dos', 'em', 'um', 'uma', 'para', 'com', 'não', 'é', 'o', 'a', 'os', 'as', 'se', 'na', 'no', 'nos', 'nas', 'ao', 'aos', 'à', 'às', 'e', 'é', 'foi', 'ser', 'tem', 'à', 'que', 'por', 'mais', 'como', 'mas', 'são', 'sua', 'esse', 'essa', 'isso', 'ele', 'ela', 'eles', 'elas', 'está', 'estão', 'eu', 'você', 'nós', 'vocês', 'me', 'te', 'lhe', 'nos', 'vos', 'lhes', 'meu', 'teu', 'seu', 'nosso', 'vosso', 'minha', 'tua', 'sua', 'nossa', 'vossa'];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.includes(w));
    
    const wordCount = {};
    words.forEach(w => wordCount[w] = (wordCount[w] || 0) + 1);
    
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word);
  }

  detectThemes(keywords) {
    const themeKeywords = {
      dinheiro: ['dinheiro', 'riqueza', 'milhao', 'faturamento', 'renda', 'investimento', 'lucro', 'fortuna', 'ganhar', 'contrato', 'cliente', 'venda', 'vender', 'faturar', 'negocio', 'empresa', 'empreendedor', 'sucesso', 'financeiro', 'patrimonio'],
      sucesso: ['sucesso', 'vencer', 'vitoria', 'lutar', 'perseverar', 'foco', 'disciplina', 'objetivo', 'meta', 'sonho', 'realizar', 'conquistar', 'esforço', 'trabalho', 'dedicar', 'persistir', 'determinação', 'coragem', 'força', 'transformar'],
      espiritual: ['deus', 'fé', 'espirito', 'oração', 'biblia', 'manifestar', 'bênção', 'esperança', 'amor', 'luz', 'palavra', ' mensagem', 'promessa', 'cre', 'fé', 'igreja', 'crente', 'sagrado', 'espiritual', 'divino'],
      relacionamento: ['relacionamento', 'amor', 'parceiro', 'esposa', 'marido', 'família', 'casal', 'união', 'companheiro', 'intimidade', 'comunicação', 'sentimento', 'emoção', 'coração', 'apaixonar', 'amar', 'amar'],
      businessman: ['empresa', 'negócio', 'marketing', 'vendas', 'cliente', 'estratégia', 'crescimento', 'gestão', 'liderança', 'equipe', 'produto', 'serviço', 'marca', 'negociação', 'fechar', 'contrato', 'prospecção', 'lucro'],
      mindset: ['mentalidade', 'pensar', 'crença', 'medo', 'coragem', 'mudar', 'transformar', 'despertar', 'poder', 'potencial', 'limite', 'crescimento', 'pessoal', 'interior', 'autoconhecimento', 'fortaleza', 'vídeo', 'mensagem', 'tempo']
    };

    const detected = [];
    for (const [theme, themeWords] of Object.entries(themeKeywords)) {
      const matches = keywords.filter(k => themeWords.includes(k)).length;
      if (matches > 0) {
        detected.push({ theme, score: matches });
      }
    }

    return detected.sort((a, b) => b.score - a.score).map(t => t.theme);
  }
}

module.exports = VideoAnalyzer;