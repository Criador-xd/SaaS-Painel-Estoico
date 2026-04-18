const SmartAnalyzer = require('./src/smart-analyzer');

const analyzer = new SmartAnalyzer();

async function test() {
  const videoPath = "D:\\Videos Prontos projeto 2- ja postado\\15parei aqui.mp4";
  
  console.log('=== TESTE SMART ANALYZER ===\n');
  
  // 1. Analisar vídeo
  const analysis = await analyzer.analyze(videoPath);
  console.log('Análise:', JSON.stringify(analysis, null, 2));
  
  // 2. Gerar título YouTube
  console.log('\n--- TÍTULO YOUTUBE ---');
  console.log(analyzer.generateYoutubeTitle(analysis));
  
  // 3. Gerar título Instagram
  console.log('\n--- TÍTULO INSTAGRAM ---');
  console.log(analyzer.generateInstagramTitle(analysis));
  
  // 4. Gerar caption
  console.log('\n--- LEGENDA ---');
  console.log(analyzer.generateCaption(analysis));
  
  // 5. Gerar hashtags
  console.log('\n--- HASHTAGS ---');
  console.log(analyzer.generateHashtags(analysis.theme, analysis.keywords));
  
  // 6. Gerar descrição YouTube
  console.log('\n--- DESCRIÇÃO YOUTUBE ---');
  console.log(analyzer.generateYoutubeDescription(analysis));
}

test().catch(console.error);