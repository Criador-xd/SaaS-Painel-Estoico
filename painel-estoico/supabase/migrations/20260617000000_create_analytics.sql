-- Tabela de eventos do funil de vendas
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'quiz_start', 'quiz_complete', 'checkout_click'
    session_id TEXT NOT NULL,
    email TEXT,
    score INTEGER,
    result_label TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para queries comuns
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_email ON analytics_events(email);

-- View agregada do funil
CREATE OR REPLACE VIEW funnel_summary AS
SELECT
    (SELECT COUNT(DISTINCT session_id) FROM analytics_events WHERE event_type = 'quiz_start') AS quiz_starts,
    (SELECT COUNT(DISTINCT session_id) FROM analytics_events WHERE event_type = 'quiz_complete') AS quiz_completes,
    (SELECT COUNT(DISTINCT session_id) FROM analytics_events WHERE event_type = 'checkout_click') AS checkout_clicks,
    (SELECT COUNT(*) FROM profiles WHERE is_premium = true) AS total_sales;

-- View de conversao por dia
CREATE OR REPLACE VIEW funnel_daily AS
SELECT
    DATE(created_at) AS day,
    COUNT(DISTINCT CASE WHEN event_type = 'quiz_start' THEN session_id END) AS quiz_starts,
    COUNT(DISTINCT CASE WHEN event_type = 'quiz_complete' THEN session_id END) AS quiz_completes,
    COUNT(DISTINCT CASE WHEN event_type = 'checkout_click' THEN session_id END) AS checkout_clicks
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY day DESC;

-- Permitir inserts anonimos via anon key
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow reading own events" ON analytics_events
    FOR SELECT USING (true);
