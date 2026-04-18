/**
 * PUBLISHER - Cuida da publicação completa no Supabase
 * - Cria rascunho
 * - Preenche títulos, legendas, hashtags, CTA
 * - Aprova a publicação
 * - Agenda para o próximo slot
 */
const { createClient } = require('@supabase/supabase-js');
const ContentGenerator = require('../content-generator');
const Scheduler = require('../scheduler');

class Publisher {
  constructor(config) {
    this.config = config;
    this.supabaseUrl = config.SUPABASE_URL;
    this.supabaseKey = config.SUPABASE_SERVICE_KEY;
    this.userId = config.USER_ID || 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';
    
    this.client = null;
    this.contentGenerator = new ContentGenerator(config);
    this.scheduler = new Scheduler(config);
  }

  // Inicializar cliente Supabase
  initialize() {
    this.client = createClient(this.supabaseUrl, this.supabaseKey);
    console.log('✅ Publisher inicializado');
  }

  // Criar rascunho de publicação com todo o conteúdo
  async createPublicationDraft(video) {
    // Gerar todo o conteúdo (título, legendas, hashtags, CTA)
    const content = this.contentGenerator.generateAllContent(video.filename);
    
    console.log(`📝 Gerando conteúdo para: ${video.filename}`);
    console.log(`   Título: ${content.title}`);
    console.log(`   Hashtags: ${content.hashtags.substring(0, 50)}...`);

    try {
      // 1. Criar publicação como rascunho
      const { data: publication, error } = await this.client
        .from('publications')
        .insert({
          user_id: this.userId,
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

      if (error) throw error;

      console.log(`   📋 Rascunho criado: ${publication.id}`);

      // 2. Criar publication_targets para YouTube e Instagram
      const targets = [
        {
          publication_id: publication.id,
          platform: 'youtube',
          status: 'pendente',
          privacy_status: 'public',
          platform_specific_title: content.platformContent.youtube.title,
          platform_specific_caption: content.platformContent.youtube.description
        },
        {
          publication_id: publication.id,
          platform: 'instagram',
          status: 'pendente',
          privacy_status: 'public',
          platform_specific_title: content.title,
          platform_specific_caption: content.platformContent.instagram.caption
        }
      ];

      const { error: targetError } = await this.client
        .from('publication_targets')
        .insert(targets);

      if (targetError) throw targetError;

      console.log(`   ✅ Targets criados para YouTube e Instagram`);

      return {
        publicationId: publication.id,
        content,
        publication
      };

    } catch (error) {
      console.error('❌ Erro ao criar rascunho:', error.message);
      return { error: error.message };
    }
  }

  // Aprovar publicação (clicar no botão de aprovação do SaaS)
  async approvePublication(publicationId) {
    try {
      // Atualizar approval_status para 'approved' e overall_status para 'pendente'
      const { data, error } = await this.client
        .from('publications')
        .update({
          approval_status: 'approved',
          overall_status: 'pendente'
        })
        .eq('id', publicationId)
        .select()
        .single();

      if (error) throw error;

      console.log(`   ✅ Publicação aprovada: ${publicationId}`);
      return { success: true, publication: data };

    } catch (error) {
      console.error('❌ Erro ao aprovar publicação:', error.message);
      return { error: error.message };
    }
  }

  // Agendar publicação para o próximo slot disponível
  async schedulePublication(publicationId, existingSchedule) {
    try {
      // Encontrar próximo slot
      const nextSlot = this.scheduler.findNextSlot(existingSchedule);
      
      console.log(`   📅 Agendando para: ${nextSlot.datetime.toLocaleString('pt-BR')}`);

      // Atualizar scheduled_for
      const { data, error } = await this.client
        .from('publications')
        .update({
          scheduled_for: nextSlot.datetime.toISOString(),
          overall_status: 'pendente'
        })
        .eq('id', publicationId)
        .select()
        .single();

      if (error) throw error;

      console.log(`   ✅ Agendado com sucesso!`);
      return { 
        success: true, 
        scheduledFor: nextSlot.datetime.toISOString(),
        slotName: nextSlot.slotName
      };

    } catch (error) {
      console.error('❌ Erro ao agendar:', error.message);
      return { error: error.message };
    }
  }

  // Pipeline completo: criar -> aprovar -> agendar
  async publishVideo(video, existingSchedule = []) {
    console.log(`\n🚀 Processando: ${video.filename}`);

    // 1. Criar rascunho com conteúdo completo
    const draftResult = await this.createPublicationDraft(video);
    if (draftResult.error) {
      return { error: draftResult.error, stage: 'draft' };
    }

    // 2. Aprovar publicação (como se clicasse no botão do SaaS)
    const approveResult = await this.approvePublication(draftResult.publicationId);
    if (approveResult.error) {
      return { error: approveResult.error, stage: 'approve' };
    }

    // 3. Agendar para próximo slot
    const scheduleResult = await this.schedulePublication(
      draftResult.publicationId, 
      existingSchedule
    );
    if (scheduleResult.error) {
      return { error: scheduleResult.error, stage: 'schedule' };
    }

    // 4. Atualizar targets para 'agendado'
    try {
      await this.client
        .from('publication_targets')
        .update({ status: 'agendado' })
        .eq('publication_id', draftResult.publicationId);
    } catch (e) {
      // Ignorar erro aqui
    }

    return {
      success: true,
      publicationId: draftResult.publicationId,
      title: draftResult.content.title,
      scheduledFor: scheduleResult.scheduledFor,
      slotName: scheduleResult.slotName
    };
  }

  // Obter publicações existentes para evitar conflito de horários
  async getExistingSchedule() {
    try {
      const { data, error } = await this.client
        .from('publications')
        .select('id, scheduled_for, overall_status')
        .eq('user_id', this.userId)
        .eq('overall_status', 'pendente')
        .not('scheduled_for', 'is', null)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar schedule existente:', error.message);
      return [];
    }
  }
}

module.exports = Publisher;