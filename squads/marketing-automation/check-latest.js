const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

client
  .from('publications')
  .select('id,created_at,scheduled_for,overall_status')
  .eq('user_id', userId)
  .not('scheduled_for', 'is', null)
  .order('created_at', { ascending: false })
  .limit(100)
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro:', error.message);
      return;
    }
    
    console.log(`Total: ${data.length} publicacoes mais recentes\n`);
    
    const today = new Date('2026-04-19');
    const april = data.filter(p => new Date(p.created_at) >= today);
    console.log(`Criados hoje (19/04) ou depois: ${april.length}`);
    
    console.log(`\nÚltimas 10 publicacoes:`);
    april.slice(0,10).forEach(p => {
      const created = new Date(p.created_at).toLocaleString('pt-BR');
      const scheduled = new Date(p.scheduled_for).toLocaleString('pt-BR');
      console.log(`Criado: ${created} | Agendado: ${scheduled}`);
    });
  });