/**
 * CONTENT GENERATOR - Gera títulos, legendas, hashtags otimizados para performance
 * Baseado em análise de padrões de alto CTR e engajamento
 */
const path = require('path');
const SmartAnalyzer = require('../smart-analyzer');

class ContentGenerator {
  constructor() {
    this.userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';
    this.analyzer = new SmartAnalyzer();
  }

  async generateAllContent(videoPath) {
    let videoInfo = {
      filename: path.basename(videoPath),
      originalName: path.basename(videoPath).replace(/\.(mp4|webm|mov)$/, ''),
      theme: 'sucesso',
      keywords: [],
      confidence: 'low'
    };

    try {
      console.log(`   🔍 Analisando: ${path.basename(videoPath)}`);
      const analysis = await this.analyzer.analyze(videoPath);
      
      videoInfo = {
        ...videoInfo,
        theme: analysis.theme,
        keywords: analysis.keywords,
        confidence: analysis.confidence
      };
      
      console.log(`   📊 Tema: ${analysis.theme} (confiança: ${analysis.confidence})`);
      console.log(`   🔑 Keywords: ${analysis.keywords.slice(0, 5).join(', ')}`);
    } catch (e) {
      console.log(`   ⚠️ Análise simplificada (erro: ${e.message})`);
    }

    return {
      user_id: this.userId,
      title: this.analyzer.generateYoutubeTitle(videoInfo),
      caption: this.analyzer.generateCaption(videoInfo),
      hashtags: this.analyzer.generateHashtags(videoInfo.theme, videoInfo.keywords),
      cta: this.analyzer.generateCTA(videoInfo.theme),
      content_format: 'reels',
      approval_status: 'draft',
      overall_status: 'rascunho',
      
      platformContent: {
        youtube: {
          title: this.analyzer.generateYoutubeTitle(videoInfo),
          description: this.analyzer.generateYoutubeDescription(videoInfo),
          caption: this.analyzer.generateCaption(videoInfo)
        },
        instagram: {
          title: this.analyzer.generateInstagramTitle(videoInfo),
          caption: this.analyzer.generateCaption(videoInfo),
          hashtags: this.analyzer.generateHashtags(videoInfo.theme, videoInfo.keywords)
        }
      },
      
      metadata: {
        theme: videoInfo.theme,
        keywords: videoInfo.keywords,
        confidence: videoInfo.confidence,
        generatedAt: new Date().toISOString()
      }
    };
  }
}

module.exports = ContentGenerator;