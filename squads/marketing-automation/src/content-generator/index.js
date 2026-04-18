/**
 * CONTENT GENERATOR - Gera títulos, legendas, hashtags, CTA para cada vídeo
 * Baseado no conteúdo do vídeo para criar copywriting apropriado
 */

const fs = require('fs-extra');
const path = require('path');

class ContentGenerator {
  constructor() {
    this.userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';
  }

  // Analisar nome do arquivo para entender o tema do vídeo
  analyzeFilename(filename) {
    const name = filename.toLowerCase().replace(/\.(mp4|webm|mov)$/, '');
    
    const themes = {
      dinheiro: ['dinheiro', 'rico', 'fortuna', 'milhao', 'rico overnight', 'faturamento'],
      sucesso: ['sucesso', 'vitoria', 'vencer', 'lutar', 'perseverar', 'foco', 'disciplina'],
      empresarios: ['empresario', 'empresa', 'negócio', 'cliente', 'venda', 'marketing'],
      Mindset: ['mindset', 'mentalidade', 'pensar', 'crença', 'medo', 'coragem'],
      relacionamento: ['relacionamento', 'amor', 'parceiro', 'esposa', 'família'],
      spiritual: ['deus', 'fe', 'espirito', 'oração', 'biblia', 'manifestação']
    };

    let detectedThemes = [];
    for (const [theme, keywords] of Object.entries(themes)) {
      if (keywords.some(k => name.includes(k))) {
        detectedThemes.push(theme);
      }
    }

    if (detectedThemes.length === 0) {
      detectedThemes = ['Mindset', 'sucesso'];
    }

    return {
      filename,
      originalName: name,
      themes: detectedThemes
    };
  }

  // Gerar título interno
  generateInternalTitle(videoInfo) {
    const theme = videoInfo.themes[0] || 'sucesso';
    const titles = {
      dinheiro: [
        'O Segredo do Dinheiro que Ninguém Te Conta',
        'Como Ficar Rico Sem Sair de Casa',
        'A Fórmula do Milhão',
        'Dinheiro No Seu Chase',
        'A Riqueza que Você Merece'
      ],
      sucesso: [
        'O Caminho Para o Topo',
        'A Mentalidade do Vencedor',
        'Não Desista Agora',
        'Você Está Pront(o)a Para Vencer',
        'O Preço do Sucesso'
      ],
      empresario: [
        'Empresário de Sucesso',
        'Como Vender Mais Hoje',
        'O Segredo do Mercado',
        'Estratégia de Crescimento',
        'Marketing Que Vende'
      ],
      Mindset: [
        'Mude Sua Mentalidade',
        'O Poder Do Pensamento',
        'Libere Seu Potencial',
        'A Nova Versão de Você',
        'Desperte Seu Poder'
      ],
      relacionamento: [
        'O Relacionamento Perfeito',
        'Encontre Seu Par Ideal',
        'Amor Verdadeiro',
        'Conexão Espiritual',
        'Relacionamento Que Funciona'
      ],
      spiritual: [
        'A Mensagem de Deus Para Você',
        'Fe Que Move Montanhas',
        'A Promessa de Deus',
        'Manifeste Sua Realidade',
        'O Poder da Oração'
      ]
    };

    const options = titles[theme] || titles.Mindset;
    return options[Math.floor(Math.random() * options.length)];
  }

  // Gerar título para YouTube
  generateYoutubeTitle(videoInfo) {
    const theme = videoInfo.themes[0] || 'sucesso';
    const baseTitle = this.generateInternalTitle(videoInfo);
    
    const suffixes = ['(ASSISTA)', '🔥', '🚨', '💎', '✨', '🙏'];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${baseTitle} ${suffix}`;
  }

  // Gerar CTA (Call to Action)
  generateCTA(theme) {
    const ctas = {
      dinheiro: [
        'Quer saber como faturar mais? Clique aqui!',
        'Descubra o segredo do dinheiro!',
        'Quer ser rico? Comece agora!',
        'Acesse e descubra como enriquecer!'
      ],
      sucesso: [
        'Não pare agora, continue assistindo!',
        'Quer alcançar o sucesso? Continue aqui!',
        'Assista até o final para descobrir!',
        'Compartilhe com quem precisa!'
      ],
      empresario: [
        'Quer aprender a vender mais? Clique!',
        'Descubra como fazer seu negócio crescer!',
        'Aprenda as estratégias dos ricos!',
        'Comece sua transformação empresarial!'
      ],
      Mindset: [
        'Mude sua vida hoje mesmo!',
        'Assista e transforme seu pensamento!',
        'Você merece esse conteúdo!',
        'Continue nessa jornada de crescimento!'
      ],
      espiritual: [
        'Deus tem uma mensagem para você!',
        'Compartilhe essa palavra!',
        'Receba a benção hoje!',
        'Deus está falando com você!'
      ]
    };

    const options = ctas[theme] || ctas.Mindset;
    return options[Math.floor(Math.random() * options.length)];
  }

  // Gerar hashtags
  generateHashtags(theme, count = 10) {
    const hashtags = {
      dinheiro: [
        '#dinheiro', '#riqueza', '#milhao', '#sucesso', '#faturamento',
        '#negocionline', '#empreendedorismo', '#finanças', '#investimento', '#prosperidade'
      ],
      sucesso: [
        '#sucesso', '#motivação', '#vencedor', '#foco', '#disciplina',
        '#mentalidade', '#autodeterminação', '#sonho', '#objetivo', '#guerra'
      ],
      empresario: [
        '#empresa', '#vendas', '#marketing', '#negocio', '#cliente',
        '#empreendedor', '#gestao', '#estrategia', '#crescimento', '#liderança'
      ],
      Mindset: [
        '#mindset', '#mentalidade', '#transformação', '#crescimento', '#poder',
        '#despertar', '#potencial', '#força', '#coragem', '#ação'
      ],
      espiritual: [
        '#fé', '#deus', '#amor', '#espiritual', '#oração',
        '#biblia', '#manifestação', '#benção', '#esperança', '#luz'
      ]
    };

    const options = hashtags[theme] || hashtags.Mindset;
    const shuffled = options.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).join(' ');
  }

  // Gerar legenda principal
  generateCaption(videoInfo) {
    const theme = videoInfo.themes[0] || 'sucesso';
    const cta = this.generateCTA(theme);
    const hashtags = this.generateHashtags(theme, 15);
    
    const openers = {
      dinheiro: [
        '💰 Isso vai mudar como você vê o dinheiro para sempre.',
        '⚠️ O segredo que os ricos não querem que você saiba.',
        '🔓 Descubra como acessar a riqueza que você merece.'
      ],
      sucesso: [
        '🔥 Você está pronto para a vitória?',
        '⚡ Não desistir é o que separa os vencedores.',
        '💪 O sucesso exige sacrifício, mas vale a pena.'
      ],
      empresario: [
        '📈 Isso vai transformar seu negócio.',
        '🎯 A estratégia que muda tudo.',
        '💼 Empresários de sucesso fazem isso.'
      ],
      Mindset: [
        '🧠 Sua mentalidade determina seu destino.',
        '✨ Você é mais forte do que pensa.',
        '🚀 O momento de mudar é agora.'
      ],
      espiritual: [
        '🙏 Deus tem uma palavra para você hoje.',
        '✨ A fé move montanhas.',
        '💫 Sua bênção está a caminho.'
      ]
    };

    const options = openers[theme] || openers.Mindset;
    const opener = options[Math.floor(Math.random() * options.length)];
    
    return `${opener}\n\n🔥 ${cta}\n\n${hashtags}`;
  }

  // Gerar legenda para Instagram
  generateInstagramCaption(videoInfo) {
    const theme = videoInfo.themes[0] || 'sucesso';
    const caption = this.generateCaption(videoInfo);
    return caption;
  }

  // Gerar descrição para YouTube
  generateYoutubeDescription(videoInfo) {
    const theme = videoInfo.themes[0] || 'sucesso';
    const cta = this.generateCTA(theme);
    
    return `🔔 INSCREVA-SE e ative o sininho!

${cta}

📱 Siga nas redes sociais:
Instagram: @vidademilionario
YouTube: Vida de Milionário

💼 Negócios e parcerias:
contato@vidademilionario.com

#VidaDeMilionário #Sucesso #Motivação #Riqueza #Mindset #Empreendedorismo`;
  }

  // Gerar todo o conteúdo para um vídeo
  generateAllContent(filename) {
    const videoInfo = this.analyzeFilename(filename);
    const theme = videoInfo.themes[0] || 'sucesso';

    return {
      // Campos para a tabela publications
      user_id: this.userId,
      title: this.generateInternalTitle(videoInfo),
      caption: this.generateCaption(videoInfo),
      hashtags: this.generateHashtags(theme, 10),
      cta: this.generateCTA(theme),
      content_format: 'reels',
      approval_status: 'draft',
      overall_status: 'rascunho',
      
      // Campos específicos por plataforma (serão salvos via publication_targets)
      platformContent: {
        youtube: {
          title: this.generateYoutubeTitle(videoInfo),
          description: this.generateYoutubeDescription(videoInfo),
          caption: this.generateCaption(videoInfo)
        },
        instagram: {
          caption: this.generateInstagramCaption(videoInfo),
          hashtags: this.generateHashtags(theme, 20)
        }
      }
    };
  }
}

module.exports = ContentGenerator;