const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

client
  .from('publications')
  .select('id,scheduled_for,overall_status')
  .eq('user_id', userId)
  .not('scheduled_for', 'is', null)
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro:', error.message);
      return;
    }
    console.log(`📋 TOTAL de vídeos agendados: ${data.length}`);
    
    const byMonth = {};
    data.forEach(p => {
      const d = new Date(p.scheduled_for);
      const key = `${d.getMonth()+1}/${d.getFullYear()}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    });
    
    console.log('\nPor mês:');
    Object.entries(byMonth).forEach(([m, c]) => console.log(`  ${m}: ${c}`));
  });