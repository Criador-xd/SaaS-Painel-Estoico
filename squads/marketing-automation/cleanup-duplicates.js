const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

async function cleanup() {
  console.log('🔍 Buscando publicações...\n');

  const { data: all, error } = await client
    .from('publications')
    .select('id,created_at')
    .eq('user_id', userId)
    .not('scheduled_for', 'is', null)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro:', error.message);
    return;
  }

  console.log(`Total agendadas: ${all.length}`);

  if (all.length <= 76) {
    console.log('✅ Já temos apenas 76 ou menos. Nada a limpar.');
    return;
  }

  const toKeep = all.slice(0, 76).map(p => p.id);
  const toDelete = all.slice(76).map(p => p.id);

  console.log(`\n🗑️ Deletando ${toDelete.length} duplicatas...`);

  for (const id of toDelete) {
    await client
      .from('publications')
      .delete()
      .eq('id', id);
  }

  console.log('✅ Limpeza concluída!');

  const { data: remaining } = await client
    .from('publications')
    .select('id')
    .eq('user_id', userId)
    .not('scheduled_for', 'is', null);

  console.log(`\n📋 Total após limpeza: ${remaining.length} publicações`);
}

cleanup().catch(console.error);