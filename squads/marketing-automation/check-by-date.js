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
  .order('scheduled_for', { ascending: true })
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro:', error.message);
      return;
    }
    
    const byMonth = {};
    data.forEach(p => {
      const d = new Date(p.scheduled_for);
      const key = `${d.getDate()}/${d.getMonth()+1}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    });
    
    console.log('Agendamentos por dia:');
    Object.entries(byMonth).forEach(([d, c]) => console.log(`  ${d}: ${c}`));
    
    const last = data[data.length-1];
    console.log(`\nUltimo agendamento: ${new Date(last.scheduled_for).toLocaleDateString('pt-BR')}`);
  });