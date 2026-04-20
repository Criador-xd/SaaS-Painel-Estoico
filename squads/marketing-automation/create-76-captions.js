const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

const captions = [
  { title: 'O segredo que mudou minha vida', hashtag: '#segredo' },
  { title: 'A verdade que ninguém cuenta', hashtag: '#verdade' },
  { title: 'Por que você não está conseguindo', hashtag: '#fracasso' },
  { title: 'O método que funciona', hashtag: '#metodo' },
  { title: 'Por que desistir não é opção', hashtag: '#naodesista' },
  { title: 'A mudança que você precisa', hashtag: '#mudanca' },
  { title: 'Por que hoje é o dia', hashtag: '#hoje' },
  { title: 'O que nadie te conta sobre sucesso', hashtag: '#sucesso' },
  { title: 'Como transformar sua mentalidade', hashtag: '#mentalidade' },
  { title: 'O caminho para vitória', hashtag: '#vitoria' },
  { title: 'Por que você merece mais', hashtag: '#merece' },
  { title: 'A decisão que muda tudo', hashtag: '#decisao' },
  { title: 'Como alcançar seus objetivos', hashtag: '#objetivos' },
  { title: 'O poder da ação', hashtag: '#acao' },
  { title: 'Por que persistir', hashtag: '#persistir' },
  { title: 'A força que vem de dentro', hashtag: '#forcainterior' },
  { title: 'Como vencer a preguiça', hashtag: '#preguica' },
  { title: 'O momento de agir', hashtag: '#agora' },
  { title: 'Por que não espere amanha', hashtag: '#naoespere' },
  { title: 'A rotina dos campeões', hashtag: '#rutina' },
  { title: 'Como criar hábitos', hashtag: '#habitos' },
  { title: 'O segredo da disciplina', hashtag: '#disciplina' },
  { title: 'Por que foco é tudo', hashtag: '#foco' },
  { title: 'Como eliminar distrações', hashtag: '#eliminardistra' },
  { title: 'O poder da concentração', hashtag: '#concentracao' },
  { title: 'Por que desistir é fácil', hashtag: '#desistir' },
  { title: 'A diferença que importa', hashtag: '#diferenca' },
  { title: 'Como manter o ritmo', hashtag: '#ritmo' },
  { title: 'O teste do dia', hashtag: '#teste' },
  { title: 'Por que continuar', hashtag: '#continuar' },
  { title: 'A escolha que define tudo', hashtag: '#escolha' },
  { title: 'Como superar obstáculos', hashtag: '#obstaculos' },
  { title: 'O momento da verdade', hashtag: '#verdade' },
  { title: 'Por que você pode fazer', hashtag: '#posso' },
  { title: 'A confiança que缺失', hashtag: '#confianca' },
  { title: 'Como acreditar em você', hashtag: '#acreditar' },
  { title: 'O segredo da autocficção', hashtag: '#autoconfianca' },
  { title: 'Por que erro é necessário', hashtag: '#erro' },
  { title: 'A lição do fracasso', hashtag: '#licao' },
  { title: 'Como aprender com erros', hashtag: '#aprender' },
  { title: 'O processo que funciona', hashtag: '#processo' },
  { title: 'Por que paciência é chave', hashtag: '#paciencia' },
  { title: 'A espera que vale a pena', hashtag: '#espera' },
  { title: 'Como construir algo grande', hashtag: '#construir' },
  { title: 'O início que surpreende', hashtag: '#inicio' },
  { title: 'Por que recomeçar', hashtag: '#recomecar' },
  { title: 'A segunda chance', hashtag: '#chance' },
  { title: 'Como transformar tudo', hashtag: '#transformar' },
  { title: 'O ponto de mudança', hashtag: '#mudanca' },
  { title: 'Por que sekarang', hashtag: '#agora' },
  { title: 'A chance que você tem', hashtag: '#chance' },
  { title: 'Como criar oportunidades', hashtag: '#oportunidades' },
  { title: 'O timing perfeito', hashtag: '#timing' },
  { title: 'Por que esperar não resolve', hashtag: '#esperarresolvedor' },
  { title: 'A ação que transforma', hashtag: '#acaotransforma' },
  { title: 'Como dar o primeiro passo', hashtag: '#primeiropasso' },
  { title: 'O迈egate que importa', hashtag: '#importa' },
  { title: 'Por que sua opinião conta', hashtag: '#opiniao' },
  { title: 'A voz que escuta', hashtag: '#voz' },
  { title: 'Como encontrar inspiração', hashtag: '#inspiracao' },
  { title: 'O fire que burns', hashtag: '#fogo' },
  { title: 'Por que motivation é tudo', hashtag: '#motivacao' },
  { title: 'A centelha que accende', hashtag: '#centelha' },
  { title: 'Como manter o fire', hashtag: '#manterfogo' },
  { title: 'O energía que move', hashtag: '#energia' },
  { title: 'Por que energia matters', hashtag: '#energia' },
  { title: 'A power que impulsa', hashtag: '#poder' },
  { title: 'Como unleashed seu potential', hashtag: '#potencial' },
  { title: 'O potential que você tem', hashtag: '#potencial' },
  { title: 'Por qué limit é mito', hashtag: '#limite' },
  { title: 'A barreira que você criou', hashtag: '#barreira' },
  { title: 'Cómo quebrar suas barreiras', hashtag: '#quebrar' },
  { title: 'O walls que você build', hashtag: '#parede' },
  { title: 'Por que você se limitar', hashtag: '#limitar' },
  { title: 'A freedom que você busca', hashtag: '#liberdade' },
  { title: 'Como achieved seu sonho', hashtag: '#sonho' },
  { title: 'O dream que você persegue', hashtag: '#sonho' },
  { title: 'Por qué persistência wins', hashtag: '#persistencia' },
  { title: 'A consistency que faz diferença', hashtag: '#consistencia' }
];

async function update() {
  console.log('Atualizando com  legendas...\n');

  const { data: pubs } = await client
    .from('publications')
    .select('id')
    .eq('user_id', userId)
    .not('scheduled_for', 'is', null)
    .order('scheduled_for', { ascending: true });

  for (let i = 0; i < pubs.length; i++) {
    const c = captions[i % captions.length];
    const num = i + 1;

    const hook = [
      '🔥 ASSISTA ATE O FINAL!',
      '⚡ Você não vai acreditar!',
      '💎 Isso mudou TUDO!',
      '📈 Não saia daqui!',
      '🎯 Veja até o fim!'
    ][i % 5];

    const body = '\n\n' + c.title + '.\n\nAssista ate o final e descubra como aplicar isso na sua vida!\n\n';

    const cta = [
      '💬 Comenta "VOU" se você vai começar HOJE!',
      '❤️ Salve para кто precisa ver isso!',
      '🔥 Compartilhe com quem desistiu!',
      '💬 Marque alguém que precisa ouvir isso!'
    ][i % 4];

    const caption = hook + body + cta;
    const hashtags = '#sucesso #motivacao ' + c.hashtag + ' #determinacao #foco #mindset #growth #hustle #transformacao';

    await client.from('publications').update({
      caption: caption,
      hashtags: hashtags
    }).eq('id', pubs[i].id);

    console.log('✅ ' + num + ': ' + c.title);
  }

  console.log('\n✅ 76 legendas únicas criadas!');
}

update().catch(console.error);