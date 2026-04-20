const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');

const configPath = path.join(__dirname, 'config', 'config.yaml');
const config = yaml.parse(fs.readFileSync(configPath, 'utf8'));

const watchFolder = config.WATCH_FOLDER;

async function generateJsonFiles() {
  await fs.ensureDir(watchFolder);

  const files = await fs.readdir(watchFolder);
  const videoFiles = files.filter(f => f.endsWith('.mp4'));

  console.log(`📁 Pasta: ${watchFolder}`);
  console.log(`📹 Encontrados ${videoFiles.length} vídeos`);

  if (videoFiles.length === 0) {
    console.log('\n⚠️ Não há vídeos na pasta!');
    console.log('Crie vídeos em:', watchFolder);
    return;
  }

  for (const videoFile of videoFiles) {
    const baseName = path.basename(videoFile, '.mp4');
    const jsonFile = path.join(watchFolder, baseName + '.json');

    if (await fs.exists(jsonFile)) {
      console.log(`⏭️ Já existe: ${baseName}.json`);
      continue;
    }

    const words = baseName.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\d+-/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !['video', 'parte', 'completo'].includes(w))
      .slice(0, 5);

    const theme = detectTheme(words);
    const keywords = words;
    const title = words.length > 0
      ? words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : 'Video ' + baseName;

    const content = {
      title: title,
      theme: theme,
      keywords: keywords,
      description: `Vídeo sobre ${keywords.join(', ')}`,
      caption: generateCaption(theme, keywords),
      hashtags: generateHashtags(theme, keywords)
    };

    await fs.writeJson(jsonFile, content, { spaces: 2 });
    console.log(`✅ Criado: ${baseName}.json`);
  }

  console.log('\n🎉 Arquivos JSON gerados!');
}

function detectTheme(keywords) {
  const text = keywords.join(' ');

  if (/dinheiro|rico|fortuna|milhão|faturar|investimento|patrocínio/.test(text)) return 'dinheiro';
  if (/amor|relacionamento|casal|esposa|marido|família/.test(text)) return 'relacionamento';
  if (/deus|fe|oração|igreja|espírit|manifestação|bênção/.test(text)) return 'espiritual';
  if (/empresa|negócio|marketing|vendas|estratégia|gestão|liderança/.test(text)) return 'empresario';

  return 'sucesso';
}

function generateCaption(theme, keywords) {
  const captions = {
    sucesso: `🔥Assista até o final! ${keywords.slice(0, 2).join(', ')}.\n\n💬 Comenta aqui!`,
    dinheiro: `💰Assista até o final! ${keywords.slice(0, 2).join(', ')}.\n\n💬 Comenta aqui!`,
    relacionamento: `❤️Assista até o final! ${keywords.slice(0, 2).join(', ')}.\n\n💬 Comenta aqui!`,
    espiritual: `🙏Assista até o final! ${keywords.slice(0, 2).join(', ')}.\n💬 Comenta aqui!`,
    empresario: `📈Assista até o final! ${keywords.slice(0, 2).join(', ')}.\n\n💬 Comenta aqui!`
  };
  return captions[theme] || captions.sucesso;
}

function generateHashtags(theme, keywords) {
  const baseTags = {
    sucesso: ['#sucesso', '#motivação', '#determinação', '#foco'],
    dinheiro: ['#dinheiro', '#riqueza', '#faturamento', '#investimento'],
    relacionamento: ['#amor', '#relacionamento', '#casal', '#família'],
    espiritual: ['#fé', '#deus', '#oração', '#benção'],
    empresario: ['#empresa', '#negócios', '#vendas', '#marketing']
  };

  const kwTags = keywords.slice(0, 3).map(k => '#' + k.toLowerCase().replace(/\s/g, ''));
  const tags = [...kwTags, ...(baseTags[theme] || baseTags.sucesso)];

  return [...new Set(tags)].slice(0, 15).join(' ');
}

generateJsonFiles().catch(console.error);