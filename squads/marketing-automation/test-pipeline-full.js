/**
 * TESTE COMPLETO DO PIPELINE
 * 1. Cria rascunho com conteúdo gerado
 * 2. Aprova a publicação
 * 3. Agenda para próximo slot
 */
const path = require('path');
const yaml = require('yaml');
const fs = require('fs-extra');
const { createClient } = require('@supabase/supabase-js');
const SmartAnalyzer = require('./src/smart-analyzer');

async function runPipeline() {
  console.log('='.repeat(50));
  console.log('🧪 TESTE COMPLETO DO PIPELINE');
  console.log('='.repeat(50));
  
  // Carregar config
  const configPath = path.join(__dirname, 'config', 'config.yaml');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.parse(configFile);
  
  // Inicializar Supabase
  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);
  const analyzer = new SmartAnalyzer();
  const userId = config.USER_ID;
  
  // Vídeo de teste
  const videoPath = "D:\\Videos Prontos projeto 2- ja postado\\76 se alquem conseguiu eu tambem consigo e se ninguem conseguiu eu serei o primeiro.mp4";
  
  console.log('\n📹 Vídeo:', path.basename(videoPath));
  console.log('🎯 Iniciando pipeline...\n');
  
  try {
    // === PASSO 1: Analisar e gerar conteúdo ===
    console.log('📝 PASSO 1: Analisando e gerando conteúdo...');
    const analysis = await analyzer.analyze(videoPath);
    
    const content = {
      title: analyzer.generateYoutubeTitle(analysis),
      caption: analyzer.generateCaption(analysis),
      hashtags: analyzer.generateHashtags(analysis.theme, analysis.keywords),
      cta: analyzer.generateCTA(analysis.theme),
      youtubeTitle: analyzer.generateYoutubeTitle(analysis),
      youtubeDesc: analyzer.generateYoutubeDescription(analysis),
      instagramTitle: analyzer.generateInstagramTitle(analysis),
      instagramCaption: analyzer.generateCaption(analysis)
    };
    
    console.log('   ✅ Título:', content.title);
    console.log('   ✅ Hashtags:', content.hashtags.substring(0, 60) + '...');
    
    // === PASSO 2: Criar rascunho ===
    console.log('\n📋 PASSO 2: Criando rascunho no Supabase...');
    
    const { data: publication, error: pubError } = await supabase
      .from('publications')
      .insert({
        user_id: userId,
        title: content.title,
        caption: content.caption,
        hashtags: content.hashtags,
        cta: content.cta,
        content_format: 'reels',
        approval_status: 'draft',
        overall_status: 'rascunho'
      })
      .select()
      .single();
    
    if (pubError) throw pubError;
    console.log('   ✅ Rascunho criado:', publication.id);
    
    // === PASSO 3: Criar publication_targets ===
    console.log('\n🎯 PASSO 3: Criando targets para YouTube e Instagram...');
    
    const targets = [
      {
        publication_id: publication.id,
        platform: 'youtube',
        status: 'pendente',
        privacy_status: 'public',
        platform_specific_title: content.youtubeTitle,
        platform_specific_caption: content.youtubeDesc
      },
      {
        publication_id: publication.id,
        platform: 'instagram',
        status: 'pendente',
        privacy_status: 'public',
        platform_specific_title: content.instagramTitle,
        platform_specific_caption: content.instagramCaption
      }
    ];
    
    const { error: targetError } = await supabase
      .from('publication_targets')
      .insert(targets);
    
    if (targetError) throw targetError;
    console.log('   ✅ Targets criados para YouTube e Instagram');
    
    // === PASSO 4: Aprovar publicação ===
    console.log('\n✅ PASSO 4: Aprovando publicação...');
    
    const { data: approved, error: approveError } = await supabase
      .from('publications')
      .update({
        approval_status: 'approved',
        overall_status: 'pendente'
      })
      .eq('id', publication.id)
      .select()
      .single();
    
    if (approveError) throw approveError;
    console.log('   ✅ Publicação aprovada!');
    console.log('   📊 Status:', approved.approval_status, '/', approved.overall_status);
    
    // === PASSO 5: Agendar para próximo slot ===
    console.log('\n📅 PASSO 5: Agendando para próximo slot...');
    
    // Buscar schedule existente
    const { data: existing } = await supabase
      .from('publications')
      .select('id, scheduled_for')
      .eq('user_id', userId)
      .eq('overall_status', 'pendente')
      .not('scheduled_for', 'is', null);
    
    // Calcular próximo slot
    const now = new Date();
    const saoPaulo = new Date(now.getTime() - (3 * 60 * 60 * 1000));
    
    const slots = [
      { name: 'Madrugada', hour: 2 },
      { name: 'Manhã', hour: 10 },
      { name: 'Tarde', hour: 12 },
      { name: 'Noite', hour: 18 }
    ];
    
    let nextSlot = null;
    let slotDate = new Date(saoPaulo);
    
    for (let day = 0; day < 7; day++) {
      slotDate.setDate(saoPaulo.getDate() + day);
      slotDate.setHours(0, 0, 0, 0);
      
      for (const slot of slots) {
        const candidate = new Date(slotDate);
        candidate.setHours(slot.hour, 0, 0, 0);
        
        const occupied = existing?.some(e => {
          const eDate = new Date(e.scheduled_for);
          return Math.abs(eDate.getTime() - candidate.getTime()) < 3600000;
        });
        
        if (candidate > saoPaulo && !occupied) {
          nextSlot = { date: candidate, name: slot.name };
          break;
        }
      }
      if (nextSlot) break;
    }
    
    if (!nextSlot) {
      nextSlot = { 
        date: new Date(saoPaulo.getTime() + 24 * 60 * 60 * 1000), 
        name: 'Manhã' 
      };
      nextSlot.date.setHours(10, 0, 0, 0);
    }
    
    const { data: scheduled, error: scheduleError } = await supabase
      .from('publications')
      .update({
        scheduled_for: nextSlot.date.toISOString(),
        overall_status: 'pendente'
      })
      .eq('id', publication.id)
      .select()
      .single();
    
    if (scheduleError) throw scheduleError;
    console.log('   ✅ Agendado para:', nextSlot.date.toLocaleString('pt-BR'));
    console.log('   📍 Slot:', nextSlot.name);
    
    // === RESUMO ===
    console.log('\n' + '='.repeat(50));
    console.log('🎉 PIPELINE COMPLETO COM SUCESSO!');
    console.log('='.repeat(50));
    console.log('\n📊 Resumo:');
    console.log('   • Publicação ID:', publication.id);
    console.log('   • Título:', content.title);
    console.log('   • Plataformas: YouTube + Instagram');
    console.log('   • Status: approved + pendente');
    console.log('   • Agendado para:', nextSlot.date.toLocaleString('pt-BR'));
    console.log('\n🔗 Ver no dashboard do SaaS');
    
  } catch (error) {
    console.error('\n❌ ERRO NO PIPELINE:', error.message);
    console.error(error);
  }
}

runPipeline();