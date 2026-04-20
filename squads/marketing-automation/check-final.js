const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

client
  .from('publications')
  .select('id,created_at,scheduled_for')
  .eq('user_id', userId)
  .not('scheduled_for', 'is', null)
  .gte('created_at', '2026-04-19')
  .order('scheduled_for', { ascending: true })
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro:', error.message);
      return;
    }
    
    console.log(`✅ Videos processadosHOJE (19/04/2026): ${data.length}\n`);
    
    if (data.length > 0) {
      const first = new Date(data[0].scheduled_for).toLocaleString('pt-BR');
      const last = new Date(data[data.length-1].scheduled_for).toLocaleString('pt-BR');
      console.log(`Primeiro agendamento: ${first}`);
      console.log(`Ultimo agendamento: ${last}`);
      
      const days = Math.ceil((new Date(data[data.length-1].scheduled_for) - new Date(data[0].scheduled_for)) / (1000*60*60*24));
      console.log(`Dias de publicacao: ${days} dias`);
      console.log(`Publicacoes por dia: ~${Math.round(data.length/days)}`);
    }
  });