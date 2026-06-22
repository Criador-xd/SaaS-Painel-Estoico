import { supabase } from './supabase';

const SESSION_KEY = 'painel_estoico_session';

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function trackQuizStart() {
  const sessionId = getSessionId();
  await supabase.from('analytics_events').insert({
    event_type: 'quiz_start',
    session_id: sessionId,
    metadata: {
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent.substring(0, 200),
      timestamp: new Date().toISOString()
    }
  }).then(({ error }) => {
    if (error) console.error('trackQuizStart:', error.message);
  });
}

export async function trackQuizComplete(email: string, score: number, resultLabel: string) {
  const sessionId = getSessionId();
  await supabase.from('analytics_events').insert({
    event_type: 'quiz_complete',
    session_id: sessionId,
    email: email.toLowerCase().trim(),
    score,
    result_label: resultLabel,
    metadata: {
      timestamp: new Date().toISOString()
    }
  }).then(({ error }) => {
    if (error) console.error('trackQuizComplete:', error.message);
  });
}

export async function trackCheckoutClick(email?: string, resultLabel?: string) {
  const sessionId = getSessionId();
  await supabase.from('analytics_events').insert({
    event_type: 'checkout_click',
    session_id: sessionId,
    email: email || null,
    result_label: resultLabel || null,
    metadata: {
      timestamp: new Date().toISOString()
    }
  }).then(({ error }) => {
    if (error) console.error('trackCheckoutClick:', error.message);
  });
}

export async function getFunnelSummary() {
  const { data, error } = await supabase.from('funnel_summary').select('*').single();
  if (error) return { quiz_starts: 0, quiz_completes: 0, checkout_clicks: 0, total_sales: 0 };
  return data;
}

export async function getFunnelDaily() {
  const { data, error } = await supabase
    .from('funnel_daily')
    .select('*')
    .order('day', { ascending: false })
    .limit(30);
  if (error) return [];
  return data;
}
