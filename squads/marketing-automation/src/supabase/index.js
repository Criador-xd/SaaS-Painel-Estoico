/**
 * SUPABASE - Integração com o banco de dados da plataforma
 */
const { createClient } = require('@supabase/supabase-js');

class SupabaseClient {
  constructor(url, serviceKey) {
    this.url = url;
    this.serviceKey = serviceKey;
    this.client = null;
    this.initialized = false;
  }

  // Inicializar cliente
  initialize() {
    if (!this.serviceKey || this.serviceKey === 'your_service_role_key_here') {
      console.warn('⚠️ Supabase: chave não configurada. Configure a chave no arquivo config/config.yaml');
      return false;
    }

    try {
      this.client = createClient(this.url, this.serviceKey);
      this.initialized = true;
      console.log('✅ Supabase conectado');
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar Supabase:', error.message);
      return false;
    }
  }

  // Verificar se está conectado
  isConnected() {
    return this.initialized && this.client !== null;
  }

  // Obter vídeos agendados da plataforma Sparkle
  async getScheduledVideos() {
    if (!this.isConnected()) return [];

    try {
      const { data, error } = await this.client
        .from('publications')
        .select('*, publication_targets(*)')
        .eq('overall_status', 'scheduled')
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar vídeos agendados:', error.message);
      return [];
    }
  }

  // Obter próximo vídeo para publicar
  async getNextVideoToPublish() {
    if (!this.isConnected()) return null;

    try {
      const { data, error } = await this.client
        .from('publications')
        .select('*, publication_targets(*)')
        .eq('overall_status', 'scheduled')
        .lte('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.code !== 'PGRST116') {
        console.error('Erro ao buscar próximo vídeo:', error.message);
      }
      return null;
    }
  }

  // Criar/agendar vídeo na plataforma Sparkle
  async scheduleVideo(videoData) {
    if (!this.isConnected()) {
      console.log('📝 Vídeo agendado (modo offline):', videoData.filename);
      return { offline: true, ...videoData };
    }

    const systemUserId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

    try {
      // 1. Criar publicação na tabela publications
      const { data: publication, error: pubError } = await this.client
        .from('publications')
        .insert({
          user_id: systemUserId,
          title: videoData.filename.replace('.mp4', ''),
          caption: videoData.scheduleReason || 'Agendado via Marketing Automation',
          scheduled_for: videoData.scheduledAt,
          overall_status: 'scheduled'
        })
        .select()
        .single();

      if (pubError) throw pubError;

      // 2. Criar publication_targets para cada plataforma
      const platforms = ['youtube', 'instagram'];
      for (const platform of platforms) {
        await this.client.from('publication_targets').insert({
          publication_id: publication.id,
          platform: platform,
          status: 'pendente',
          privacy_status: 'public'
        });
      }

      console.log(`✅ Vídeo agendado na plataforma Sparkle: ${videoData.filename}`);
      return { publication_id: publication.id, ...videoData };
    } catch (error) {
      console.error('Erro ao agendar vídeo:', error.message);
      return { error: error.message };
    }
  }

  // Marcar vídeo como publicado
  async markAsPublished(videoId, platformResponse) {
    if (!this.isConnected()) {
      console.log(`📝 Marcado como publicado (offline): ${videoId}`);
      return { offline: true };
    }

    try {
      // Atualizar publication_targets
      const { data, error } = await this.client
        .from('publication_targets')
        .update({
          status: 'publicado',
          published_at: new Date().toISOString(),
          platform_post_id: platformResponse?.platform_post_id || null,
          platform_post_url: platformResponse?.platform_post_url || null
        })
        .eq('publication_id', videoId)
        .select();

      if (error) throw error;
      console.log(`✅ Vídeo marcado como publicado: ${videoId}`);
      return data;
    } catch (error) {
      console.error('Erro ao marcar vídeo:', error.message);
      return { error: error.message };
    }
  }

  // Obter estatísticas da plataforma Sparkle
  async getStats() {
    if (!this.isConnected()) {
      return { offline: true, message: 'Modo offline - estatísticas não disponíveis' };
    }

    try {
      const [scheduled, published] = await Promise.all([
        this.client.from('publications').select('id', { count: 'exact' }).eq('overall_status', 'scheduled'),
        this.client.from('publication_targets').select('id', { count: 'exact' }).eq('status', 'publicado')
      ]);

      return {
        scheduled: scheduled.count || 0,
        published: published.count || 0,
        total: (scheduled.count || 0) + (published.count || 0)
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error.message);
      return { error: error.message };
    }
  }

  // Obter data do último vídeo AGENDADO (scheduled_for mais recente no banco)
  async getLastScheduledDate() {
    if (!this.isConnected()) return null;

    try {
      const { data, error } = await this.client
        .from('publications')
        .select('scheduled_for')
        .eq('user_id', this.userId || 'ca424590-39cc-4e47-a5fc-a0b72fdcf131')
        .not('scheduled_for', 'is', null)
        .order('scheduled_for', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data ? new Date(data.scheduled_for) : null;
    } catch (error) {
      if (error.code !== 'PGRST116') {
        console.error('Erro ao buscar último agendamento:', error.message);
      }
      return null;
    }
  }

  // Manter compatibilidade com código antigo
  async getLastPublishedDate() {
    return this.getLastScheduledDate();
  }

  // Verificar estrutura da tabela (para debug)
  async checkTableStructure() {
    if (!this.isConnected()) return null;

    try {
      const { data, error } = await this.client
        .from('videos')
        .select('*')
        .limit(1);

      if (error) throw error;
      return { success: true, columns: data ? Object.keys(data[0] || {}) : [] };
    } catch (error) {
      console.log('Tabela videos pode não existir ou estar vazia');
      return { error: error.message };
    }
  }
}

module.exports = SupabaseClient;