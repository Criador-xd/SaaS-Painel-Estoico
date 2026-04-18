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

  // Obter vídeos agendados
  async getScheduledVideos() {
    if (!this.isConnected()) return [];

    try {
      const { data, error } = await this.client
        .from('videos')
        .select('*')
        .eq('status', 'scheduled')
        .order('scheduled_at', { ascending: true });

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
        .from('videos')
        .select('*')
        .eq('status', 'scheduled')
        .lte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao buscar próximo vídeo:', error.message);
      }
      return null;
    }
  }

  // Criar/agendar vídeo
  async scheduleVideo(videoData) {
    if (!this.isConnected()) {
      console.log('📝 Vídeo agendado (modo offline):', videoData.filename);
      return { offline: true, ...videoData };
    }

    try {
      const { data, error } = await this.client
        .from('videos')
        .insert({
          filename: videoData.filename,
          filepath: videoData.path,
          platform: videoData.platform,
          scheduled_at: videoData.scheduledAt,
          status: 'scheduled',
          priority: videoData.priority,
          category: videoData.category,
          metadata: {
            size: videoData.size,
            hash: videoData.hash,
            scheduled_reason: videoData.scheduleReason
          }
        })
        .select()
        .single();

      if (error) throw error;
      console.log(`✅ Vídeo agendado na plataforma: ${videoData.filename}`);
      return data;
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
      const { data, error } = await this.client
        .from('videos')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          platform_response: platformResponse
        })
        .eq('id', videoId)
        .select()
        .single();

      if (error) throw error;
      console.log(`✅ Vídeo marcado como publicado: ${videoId}`);
      return data;
    } catch (error) {
      console.error('Erro ao marcar vídeo:', error.message);
      return { error: error.message };
    }
  }

  // Obter estatísticas
  async getStats() {
    if (!this.isConnected()) {
      return { offline: true, message: 'Modo offline - estatísticas não disponíveis' };
    }

    try {
      const [scheduled, published] = await Promise.all([
        this.client.from('videos').select('id', { count: 'exact' }).eq('status', 'scheduled'),
        this.client.from('videos').select('id', { count: 'exact' }).eq('status', 'published')
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