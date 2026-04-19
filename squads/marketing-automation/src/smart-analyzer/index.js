/**
 * SMART ANALYZER - Analisa vídeos e gera conteúdo que performa
 * Baseado em padrões de alto desempenho do YouTube e Instagram
 */
const fs = require('fs-extra');
const path = require('path');

class SmartAnalyzer {
  constructor() {
    this.niche = 'motivacao_negocios'; // Vida de Milionário
    
    // Padrões de títulos que funcionam (baseado em análise de milhões de vídeos)
    this.titlePatterns = {
      hook: [
        'Ninguem Te Conta',
        'O Segredo de',
        'Por Que',
        'O Que',
        'Como',
        'A Verdade Sobre',
        'Por Que Todos',
        'O Motivo Pelo Qual',
        'A Razão',
        'Descubra'
      ],
      emotion: [
        'Emocionante',
        'Impactante',
        'Chocante',
        'Incrível',
        'Espetacular',
        'Transformador',
        'Revolucionário',
        'Nunca Visto'
      ],
      urgency: [
        'Agora',
        'Hoje',
        'Antes Que',
        'Enquanto',
        'Antes de',
        'Última Chance',
        'Não Espere',
        'Você Precisa'
      ]
    };

    // Palavras que aumentam CTR
    this.powerWords = {
      dinheiro: ['Milhão', 'Riqueza', 'Dinheiro', 'Faturamento', 'Lucro', 'Renda', 'Fortuna', 'Investimento', 'Patrocínio'],
      sucesso: ['Sucesso', 'Vencedor', 'Topo', 'Vitória', 'Conquista', 'Glória', 'Transformação', 'Crescimento'],
      emocional: ['Chocado', 'Incrível', 'Impossível', 'Inacreditável', 'Esquecido', 'Secreto', 'Oculto', 'Revelado'],
      acao: ['Faça', 'Comece', 'Pare', 'Continue', 'Aprenda', 'Descubra', 'Entenda', 'Execute']
    };

    // Fórmulas de título que funcionam
    this.titleFormulas = [
      'O Segredo de {keyword} que Ninguém Te Conta',
      'Como {keyword} em 30 dias (sem experiência)',
      'Por Que {keyword} é o Que Realmente Importa',
      'A Verdade Sobre {keyword} que Ninguém Fala',
      '{keyword} - O Que Ninguem Te Conta',
      'Como {keyword} Mudou Minha Vida',
      'O MotivoPelo Qual Você Precisa de {keyword} Agora',
      'A Fórmula Secreta de {keyword}',
      'Por Que {keyword} Funciona (E Como Aplicar)',
      '{keyword} - Guia Completo (2026)'
    ];

    // Hashtags que funcionam no nicho
    this.nicheHashtags = {
      dinheiro: ['#dinheiro', '#riqueza', '#milhao', '#sucesso', '#faturamento', '#negocios', '#empreendedorismo', '#finanças', '#investimento', '#prosperidade', '#vendas', '#cliente', '#marketing', '#empresa', '#lucro', '#fortuna', '#riquerealsemtentar', '#fique rico', '# dinheirofacil'],
      sucesso: ['#sucesso', '#motivação', '#vencedor', '#foco', '#disciplina', '#mentalidade', '#sonho', '#objetivo', '#determinação', '#força', '#coragem', '#ação', '#transformation', '#goals', '#hustle', '#grind', '#mindset', '#growth'],
      empresario: ['#empresa', '#vendas', '#marketing', '#negocio', '#cliente', '#empreendedor', '#gestao', '#estrategia', '#crescimento', '#liderança', '#business', '#entrepreneur', '#startup', '#sales', '#marketingdigital', '#inbound', '#funil'],
      espiritual: ['#fé', '#deus', '#amor', '#espiritual', '#oração', '#biblia', '#manifestação', '#benção', '#esperança', '#luz', '#vida', '#amorproprio', '#autoconhecimento', '#espiritualidade', '#universo', '#lei da atração'],
      relacionamento: ['#relacionamento', '#amor', '#casal', '#família', '#parceiro', '#esposa', '#marido', '#união', '#intimidade', '#comunicação', '# couples', '#love', '#relationship', '#marriage']
    };

    // CTAs que convertem
    this.ctaPatterns = {
      youtube: [
        '🔔 INSCREVA-SE e ative o sininho!',
        'Deixe seu LIKE e comente abaixo!',
        'Compartilhe com quem precisa!',
        'SIGA para mais conteúdo assim!'
      ],
      instagram: [
        '💬 Comenta aqui!',
        'Salva pra depois!',
        'Compartilha com alguém!',
        'Marca alguém que precisa ver isso!'
      ]
    };
  }

  async analyze(videoPath) {
    const filename = path.basename(videoPath, path.extname(videoPath));

    // 1. Extrair contexto do nome do arquivo
    const filenameAnalysis = this.analyzeFilename(filename);

    // 2. Buscar transcript ou contexto
    const context = await this.findContext(videoPath);

    // 3. Detectar nicho/tema principal
    const theme = this.detectTheme(filenameAnalysis, context);

    // 4. Extrair keywords do conteúdo
    const keywords = this.extractKeywords(filenameAnalysis, context);

    // 5. Evitar repetição analisando conteúdo real vs nome do arquivo
    const contentAnalysis = this.analyzeContentRepetitionRisk(filenameAnalysis, context);

    return {
      filename,
      originalName: filename,
      theme,
      keywords,
      context,
      confidence: this.calculateConfidence(theme, keywords),
      repetitionRisk: contentAnalysis.risk,
      suggestedVariations: contentAnalysis.variations
    };
  }

  analyzeFilename(filename) {
    const clean = filename.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    const words = clean.split(' ');
    
    return {
      raw: filename,
      clean,
      words,
      length: words.length,
      hasNumbers: /\d/.test(filename),
      hasEmotion: /parei|pareiaqui|STOP|importante|ATENCAO|urgente/i.test(filename)
    };
  }

  async findContext(videoPath) {
    const dir = path.dirname(videoPath);
    const basename = path.basename(videoPath, path.extname(videoPath));
    
    const files = await fs.readdir(dir);
    
    // Buscar por arquivos de contexto relacionados ao vídeo
    const relatedFiles = files.filter(f => 
      f.includes(basename) && 
      !f.endsWith('.mp4') && 
      !f.endsWith('.mov')
    );
    
    let context = {
      transcript: null,
      description: null,
      keywords: []
    };
    
    for (const file of relatedFiles) {
      const ext = path.extname(file).toLowerCase();
      const content = await fs.readFile(path.join(dir, file), 'utf8').catch(() => '');
      
      if (ext === '.txt' || ext === '.srt') {
        context.transcript = content.substring(0, 10000);
      } else if (ext === '.json') {
        try {
          const json = JSON.parse(content);
          context.keywords = json.keywords || [];
          context.description = json.description || json.tema || null;
        } catch (e) {}
      }
    }
    
    return context;
  }

  detectTheme(filenameAnalysis, context) {
    const text = (filenameAnalysis.clean + ' ' + (context.description || '')).toLowerCase();
    
    const themeScores = {
      dinheiro: this.countMatches(text, ['dinheiro', 'rico', 'fortuna', 'milhao', 'faturar', 'renda', 'investimento', 'lucro', 'patrimonio', 'ganhar', 'contrato', 'venda', 'cliente', 'negocio', 'faturamento', 'patrocínio']),
      sucesso: this.countMatches(text, ['sucesso', 'vencer', 'vitoria', 'lutar', 'perseverar', 'foco', 'disciplina', 'objetivo', 'meta', 'sonho', 'conquistar', 'consegui', 'consigo', 'primeiro', 'vencedor', 'determinação', 'força', 'coragem', 'nunca', 'sempre', 'conseguir']),
      empresario: this.countMatches(text, ['empresa', 'negocio', 'marketing', 'vendas', 'estrategia', 'gestao', 'liderança', 'equipe', 'produto', 'marca']),
      espiritual: this.countMatches(text, ['deus', 'fe', 'espirito', 'oração', 'biblia', 'manifestar', 'benção', 'esperança', 'amor', 'espiritual', 'igreja', 'fé', 'manifestação']),
      relacionamento: this.countMatches(text, ['relacionamento', 'amor', 'parceiro', 'esposa', 'marido', 'família', 'casal', 'união', 'intimidade'])
    };
    
    const sorted = Object.entries(themeScores).sort((a, b) => b[1] - a[1]);
    return sorted[0][1] > 0 ? sorted[0][0] : 'sucesso';
  }

  countMatches(text, keywords) {
    return keywords.filter(k => text.includes(k)).length;
  }

  extractKeywords(filenameAnalysis, context) {
    const stopWords = ['se', 'alguem', 'ninguem', 'eu', 'tambem', 'consigo', 'serei', 'primeiro', 'que', 'o', 'a', 'de', 'da', 'do', 'em', 'um', 'uma', 'para', 'com', 'não', 'é', 'os', 'as', 'me', 'te', 'lhe', 'nos', 'vos', 'e', 'foi', 'ser', 'tem', 'por', 'mais', 'como', 'mas', 'são', 'sua', 'esse', 'essa', 'isso', 'ele', 'ela', 'está', 'estão', 'você', 'nós', 'vocês', 'meu', 'teu', 'seu', 'nosso', 'voss', 'minha', 'tua', 'sua', 'nossa', 'vossa'];
    
    let keywords = [];
    
    // Do filename - filtrar stop words e palavras muito curtas
    const importantWords = filenameAnalysis.words.filter(w => 
      w.length > 3 && 
      !stopWords.includes(w)
    );
    keywords.push(...importantWords);
    
    // Do contexto
    if (context.keywords) {
      keywords.push(...context.keywords);
    }
    
    // Se ainda não tem keywords boas, adicionar keywords do tema
    if (keywords.length < 3) {
      const themeKeywords = {
        sucesso: ['determinação', 'força', 'coragem', 'foco', 'disciplina', 'sonho', 'objetivo', 'conquista', 'vitória', 'transformação'],
        dinheiro: ['riqueza', 'faturamento', 'investimento', 'lucro', 'renda', 'fortuna', 'negoócio', 'venda', 'cliente'],
        empresario: ['estratégia', 'crescimento', 'liderança', 'gestão', 'marketing', 'vendas', 'empresa', 'negócio'],
        espiritual: ['fé', 'benção', 'esperança', 'amor', 'transformação', 'manifestação', 'oração'],
        relacionamento: ['amor', 'parceiro', 'comunicação', 'intimidade', 'família', 'união']
      };
      const theme = this.detectTheme(filenameAnalysis, context);
      keywords = [...keywords, ...(themeKeywords[theme] || themeKeywords.sucesso)].slice(0, 10);
    }
    
    return [...new Set(keywords)].slice(0, 10);
  }

  calculateConfidence(theme, keywords) {
    if (keywords.length >= 5 && theme !== 'sucesso') return 'high';
    if (keywords.length >= 3) return 'medium';
    return 'low';
  }

  // Analisar risco de repetição entre nome do arquivo e conteúdo real
  analyzeContentRepetitionRisk(filenameAnalysis, context) {
    const filenameWords = new Set(filenameAnalysis.words.map(w => w.toLowerCase()));
    let contextWords = new Set();

    // Extrair palavras do contexto
    if (context.transcript) {
      const transcriptWords = context.transcript.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');

      // Filtrar stop words e palavras muito curtas
      const stopWords = ['se', 'alguem', 'ninguem', 'eu', 'tambem', 'consigo', 'serei', 'primeiro', 'que', 'o', 'a', 'de', 'da', 'do', 'em', 'um', 'uma', 'para', 'com', 'nao', 'e', 'os', 'as', 'me', 'te', 'lhe', 'nos', 'vos', 'e', 'foi', 'ser', 'tem', 'por', 'mais', 'como', 'mas', 'sao', 'sua', 'esse', 'essa', 'isso', 'ele', 'ela', 'esta', 'estao', 'voce', 'nos', 'voces', 'meu', 'teu', 'seu', 'nosso', 'vosso', 'minha', 'tua', 'sua', 'nossa', 'vossa'];

      contextWords = new Set(transcriptWords.filter(w =>
        w.length > 3 &&
        !stopWords.includes(w)
      ));
    }

    // Se temos descrição no JSON
    if (context.description) {
      const descWords = context.description.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');

      const stopWords = ['se', 'alguem', 'ninguem', 'eu', 'tambem', 'consigo', 'serei', 'primeiro', 'que', 'o', 'a', 'de', 'da', 'do', 'em', 'um', 'uma', 'para', 'com', 'nao', 'e', 'os', 'as', 'me', 'te', 'lhe', 'nos', 'vos', 'e', 'foi', 'ser', 'tem', 'por', 'mais', 'como', 'mas', 'sao', 'sua', 'esse', 'essa', 'isso', 'ele', 'ela', 'esta', 'estao', 'voce', 'nos', 'voces', 'meu', 'teu', 'seu', 'nosso', 'vosso', 'minha', 'tua', 'sua', 'nossa', 'vossa'];

      descWords.forEach(w => {
        if (w.length > 3 && !stopWords.includes(w)) {
          contextWords.add(w);
        }
      });
    }

    // Se temos keywords extraídas
    if (context.keywords && Array.isArray(context.keywords)) {
      context.keywords.forEach(k => {
        if (typeof k === 'string' && k.length > 3) {
          contextWords.add(k.toLowerCase());
        }
      });
    }

    // Calcular sobreposição
    let overlapCount = 0;
    filenameWords.forEach(word => {
      if (contextWords.has(word)) {
        overlapCount++;
      }
    });

    const totalUnique = new Set([...filenameWords, ...contextWords]).size;
    const overlapPercentage = totalUnique > 0 ? (overlapCount * 2) / (filenameWords.size + contextWords.size) * 100 : 0;

    // Determinar nível de risco
    let risk = 'low';
    if (overlapPercentage > 70) {
      risk = 'high';
    } else if (overlapPercentage > 40) {
      risk = 'medium';
    }

    // Sugerir variações se risco alto ou médio
    let variations = [];
    if (risk !== 'low') {
      variations = this.generateContentVariations(filenameAnalysis, context);
    }

    return {
      risk,
      overlapPercentage,
      variations
    };
  }

  // Gerar variações de conteúdo para evitar repetições
  generateContentVariations(filenameAnalysis, context) {
    const variations = [];
    const theme = this.detectTheme(filenameAnalysis, context);

    // Variações de hook baseado no tema
    const themeHooks = {
      dinheiro: [
        'O que 99% das pessoas erram sobre dinheiro',
        'Por que você ainda não é rico (e como mudar isso)',
        'O segredo dos milionários que ninguém revela',
        'Como transformar sua relação com o dinheiro',
        'Por que trabalhar duro não te deixa rico'
      ],
      sucesso: [
        'O que realmente separa vencedores de perdedores',
        'Por que seu plano de sucesso está falhando',
        'O mindset que ninguém te ensina sobre conquistas',
        'Como manter a motivação quando tudo dá errado',
        'Por que o sucesso é mais sobre hábito do que talento'
      ],
      empresario: [
        'Por que seu negócio não está crescendo (mesmo com esforço)',
        'O erro fatal que empreendedores cometem no primeiro ano',
        'Como validar sua ideia antes de investir um centavo',
        'Por que copiar concorrentes está te deixando para trás',
        'A métrica que nenhum empreendedor olha (mas deveria)'
      ],
      espiritual: [
        'Por que suas orações parecem não ser respondidas',
        'O que a fé realmente significa nos tempos difíceis',
        'Como manter a esperança quando tudo parece perdido',
        'Por que espiritualidade não é sobre ser perfeito',
        'O que fazer quando você sente que Deus está distante'
      ],
      relacionamento: [
        'Por que comunicação não é o que você pensa',
        'O erro que casais cometem que destrói relacionamentos',
        'Como amar alguém sem perder a si mesmo',
        'Por que conflitos na verdade fortalecem relacionamentos',
        'O que fazer quando você se sente sozinho no relacionamento'
      ]
    };

    const hooks = themeHooks[theme] || themeHooks.sucesso;

    // Gerar 3 variações de título
    for (let i = 0; i < Math.min(3, hooks.length); i++) {
      variations.push({
        type: 'title',
        content: hooks[i],
        confidence: 'medium'
      });
    }

    // Adicionar variação de abordagem
    variations.push({
      type: 'approach',
      content: `Abordagem prática: 3 passos para aplicar isso hoje`,
      confidence: 'high'
    });

    return variations;
  }

  // Gerar título otimizado para YouTube
  generateYoutubeTitle(videoInfo) {
    // Usar keywords do tema se as do vídeo não forem boas
    let keyword = videoInfo.keywords[0];
    if (!keyword || keyword.length < 4 || ['alquem', 'ninguem', 'tambem', 'consigo', 'serei'].includes(keyword)) {
      const themeKeywords = {
        sucesso: ['Sucesso', 'Vitória', 'Determinação', 'Força', 'Coragem'],
        dinheiro: ['Dinheiro', 'Riqueza', 'Faturamento', 'Fortuna'],
        empresario: ['Negócio', 'Vendas', 'Estratégia', 'Crescimento'],
        espiritual: ['Fé', 'Benção', 'Esperança', 'Transformação'],
        relacionamento: ['Amor', 'Relacionamento', 'Comunicação', 'União']
      };
      const keywords = themeKeywords[videoInfo.theme] || themeKeywords.sucesso;
      keyword = keywords[Math.floor(Math.random() * keywords.length)];
    } else {
      keyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }
    
    const formula = this.titleFormulas[Math.floor(Math.random() * this.titleFormulas.length)];
    let title = formula.replace('{keyword}', keyword);
    
    // Adicionar power word aleatória
    const powerWord = this.powerWords[videoInfo.theme]?.[Math.floor(Math.random() * 5)] || '';
    if (powerWord && Math.random() > 0.5) {
      title = `${powerWord}: ${title}`;
    }
    
    // Adicionar emoji de impacto
    const emojis = ['🔥', '🚨', '💎', '✨', '⚡', '📈', '🎯', '💪'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    return `${emoji} ${title}`;
  }

  // Gerar título para Instagram/Shorts
  generateInstagramTitle(videoInfo) {
    let keyword = videoInfo.keywords[0];
    if (!keyword || keyword.length < 4 || ['alquem', 'ninguem', 'tambem', 'consigo', 'serei'].includes(keyword)) {
      const themeKeywords = {
        sucesso: ['Sucesso', 'Vitória', 'Determinação', 'Coragem'],
        dinheiro: ['Dinheiro', 'Riqueza', 'Faturamento'],
        empresario: ['Negócio', 'Vendas', 'Estratégia'],
        espiritual: ['Fé', 'Benção', 'Esperança'],
        relacionamento: ['Amor', 'Relacionamento']
      };
      const keywords = themeKeywords[videoInfo.theme] || themeKeywords.sucesso;
      keyword = keywords[Math.floor(Math.random() * keywords.length)];
    } else {
      keyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }
    
    const patterns = [
      `${keyword} que muda tudo`,
      `Você sabe o que é ${keyword}?`,
      `A verdade sobre ${keyword}`,
      `Por que ${keyword} funciona?`,
      `${keyword} - você precisa ver isso`
    ];
    
    const emojis = ['👀', '💡', '🔥', '⚡', '🎬'];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    return `${emoji} ${pattern}`;
  }

  // Gerar caption principal
  generateCaption(videoInfo) {
    const theme = videoInfo.theme;
    const keywords = videoInfo.keywords.slice(0, 3);
    
    // Hook inicial baseado no tema
    const hooks = {
      dinheiro: [
        '💰 O segredo que os ricos não querem que você descubra...',
        '⚠️ Isso vai mudar como você vê o dinheiro PARA SEMPRE.',
        '🔓 Descubra como acessar a riqueza que você merece.'
      ],
      sucesso: [
        '🔥 Você está pronto para a vitória?',
        '⚡ O que separa os vencedores dos perdedores.',
        '💪 O sucesso exige sacrifício, mas vale a pena.'
      ],
      empresario: [
        '📈 A estratégia que muda tudo.',
        '🎯 Empresários de sucesso sabem disso.',
        '💼 O mercado favorece quem age.'
      ],
      espiritual: [
        '🙏 Deus tem uma palavra para você.',
        '✨ A fé move montanhas.',
        '💫 Sua bênção está a caminho.'
      ],
      relacionamento: [
        '💕 A verdade sobre relacionamentos.',
        '❤️ O que funciona de verdade.',
        '💔 Não erre mais nisso.'
      ]
    };

    const hook = hooks[theme]?.[Math.floor(Math.random() * 3)] || hooks.sucesso[0];
    
    // Corpo da legenda
    const bodies = {
      dinheiro: [
        ' Muitos pensam que riqueza é sorte, mas na verdade é estratégia.\n\nAssista até o final e descubra o que poucos sabem.',
        ' O dinheiro segue quem está preparado para recebê-lo.\n\nPrepare-se agora.',
        ' Você merece mais. E pode conquistar.\n\nAssista e tome a decisão.'
      ],
      sucesso: [
        ' O momento de mudar é agora. Não amanha, não depois.\n\nAssista e comece sua transformação.',
        ' Você tem o poder de transformar sua vida.\n\nNão espere mais.',
        ' others dream, you achieve.\n\nAssista e desperte.'
      ],
      empresario: [
        ' O mercado está cambiando. E quem adapta, sobrevive.\n\nAssista e aprende a estratégia.',
        ' Seus resultados dependem das suas decisões.\n\nAssista e tome a melhor decisão.',
        ' A diferença entre quem cresce e quem estagna é a ação.\n\nAssista e aja.'
      ],
      espiritual: [
        ' Deus está te preparando para algo extraordinário.\n\nReceba essa palavra.',
        ' Sua fé vai ser recompensada.\n\nAcredite e continue.',
        ' O universo conspira a favor de quem acredita.\n\nReceba essa bênção.'
      ]
    };

    const body = bodies[theme]?.[Math.floor(Math.random() * 3)] || bodies.sucesso[0];
    
    // Keywords contextuais
    const keywordContext = keywords.length > 0 
      ? `\n📌 ${keywords.slice(0, 2).join(' • ')}` 
      : '';

    // CTA
    const cta = this.generateCTA(theme);
    
    // Hashtags
    const hashtags = this.generateHashtags(theme, videoInfo.keywords);

    return `${hook}${body}${keywordContext}\n\n${cta}\n\n${hashtags}`;
  }

  // Gerar CTA
  generateCTA(theme) {
    const ctas = {
      dinheiro: [
        '💎 Clique no link para saber mais!',
        '📱 Quer saber como faturar mais? Clique aqui!',
        '🚀 Comece sua transformação financeira agora!'
      ],
      sucesso: [
        '🔥 Não pare agora - continue assistindo!',
        '💪 Compartilhe com quem precisa dessa mensagem!',
        '✨ Salve para não perder!'
      ],
      empresario: [
        '📈 Clique e learn as estratégias!',
        '💼 Precisa de ajuda? Chama no direct!',
        '🎯 Continue nessa jornada empresarial!'
      ],
      espiritual: [
        '🙏 Compartilhe essa palavra!',
        '💫 Salve a palavra de Deus!',
        '✨ Marque alguém que precisa dessa mensagem!'
      ],
      relacionamento: [
        '💕 Compartilhe com seu/sua parceiro(a)!',
        '❤️ Salve para você e seu relacionamento!',
        '💑 Marque alguém que precisa ver isso!'
      ]
    };

    const options = ctas[theme] || ctas.sucesso;
    return options[Math.floor(Math.random() * options.length)];
  }

  // Gerar hashtags
  generateHashtags(theme, customKeywords = []) {
    let tags = [...this.nicheHashtags[theme] || this.nicheHashtags.sucesso];
    
    // Adicionar keywords personalizadas
    if (customKeywords.length > 0) {
      const customTags = customKeywords.slice(0, 3).map(k => `#${k.toLowerCase().replace(/\s+/g, '')}`);
      tags = [...customTags, ...tags];
    }
    
    // Embaralhar e retornar 15-20 hashtags
    return tags.sort(() => 0.5 - Math.random()).slice(0, 18).join(' ');
  }

  // Gerar descrição para YouTube
  generateYoutubeDescription(videoInfo) {
    const theme = videoInfo.theme;
    const keywords = videoInfo.keywords.slice(0, 5);
    
    const base = `🔔 INSCREVA-SE e ative o sininho!

${this.generateCTA(theme)}

📱 Siga nas redes sociais:
Instagram: @vidademilionario
YouTube: Vida de Milionário
TikTok: @vidademilionario

💼 Negócios e parcerias:
contato@vidademilionario.com

📌 Tags relacionadas:
${keywords.map(k => `#${k.charAt(0).toUpperCase() + k.slice(1)}`).join(' ')}

#VidaDeMilionário #Sucesso #Motivação #Riqueza #Mindset #Empreendedorismo #Transformação #Crescimento #Business #Entrepreneur`;

    return base;
  }
}

module.exports = SmartAnalyzer;