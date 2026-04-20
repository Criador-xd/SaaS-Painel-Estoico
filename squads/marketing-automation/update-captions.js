const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

const captions = {
  Determinacao: '🔥 VOCE ESTA PRONTO PARA MUDAR SUA VIDA?\n\nDeterminacao nao e sobre nunca cair.\nE sobre levantar toda vez que voce cai.\n\nNeste video, vou te mostrar:\n- 3 estrategias para desenvolver determinacao\n- Como manter o foco quando tudo parece impossivel\n- A mindset dos vencedores\n\nAssista ate o final e prepare-se para transformar!\n\nQual e seu maior desafio? Comenta aqui!',

  Forca: '💪 FORTE INTERIOR\n\nVoce ja se perguntou por que algumas pessoas superam obstaculos que destruiriam outros?\n\nA resposta esta na forca interior.\n\nNeste video:\n- Como desenvolver forca mental\n- Como lidar com momentos dificeis\n- A importancia da persistencia\n\nAssista ate o final e comece hoje!\n\nCompartilhe com alguien que precisa de forca!',

  Coragem: '⚡ CORAGEM PARA AGIR\n\nMedo e normal.\nNao agir e que destroi sonhos.\n\nNeste video:\n- Como vencer o medo\n- O segredo de agir apesar da ansiedade\n- Cases de pessoas que vencem\n\nAssista ate o final e tome coragem!\n\nVoce ja superou algum medo? Conta pra gente!',

  Foco: '🎯 O SEGREDO DO FOCO\n\nVoce tem muitos objetivos?\nNao consegue focar em nada?\n\nA realidade e: quem tenta fazer tudo, nao faz nada.\n\nNeste video:\n- Como definir prioridades\n- Como eliminar distrações\n- A rotina dos focados\n\nAssista e aprenda a focar de verdade!\n\nQual e seu foco principal HOJE?',

  Disciplina: '📈 DISCIPLINA E O SEGREDO\n\nMotivacao dura 5 minutos.\nDisciplina dura uma vida.\n\nA diferenca entre quem succeede e quem desiste:\nA disciplina.\n\nNeste video:\n- Como criar disciplina\n- Rutinas que funcionam\n- Como manter o ritmo\n\nAssista e comece hoje!\n\nVoce e disciplinado?'
};

async function update() {
  console.log('Atualizando legendas...\n');

  const { data: pubs } = await client
    .from('publications')
    .select('id,title')
    .eq('user_id', userId)
    .not('scheduled_for', 'is', null)
    .order('scheduled_for', { ascending: true });

  for (const pub of pubs) {
    const title = pub.title.replace('🔥', '').replace('⚡', '').replace('💎', '').replace('📈', '').replace('🎯', '').trim();

    const caption = captions[title] || 'Assista ate o final! ' + title;

    const hashtags = '#sucesso #' + title.toLowerCase() + ' #motivacao #determinacao #foco #mindset #growth #hustle #transformacao';

    await client.from('publications').update({
      caption: caption,
      hashtags: hashtags
    }).eq('id', pub.id);

    console.log('✅ ' + title);
  }

  console.log('\n✅ Legendas atualizadas!');
}

update().catch(console.error);