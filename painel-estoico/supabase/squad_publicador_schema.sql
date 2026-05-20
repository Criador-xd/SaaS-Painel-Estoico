-- Tabela contents
CREATE TABLE contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_file_path TEXT NOT NULL,
    published_file_path TEXT,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    format TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'rascunho',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    approval_status BOOLEAN DEFAULT false,
    is_duplicate BOOLEAN DEFAULT false,
    source_hash TEXT
);

-- Tabela generated_metadata
CREATE TABLE generated_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    internal_title TEXT,
    instagram_title TEXT,
    caption TEXT,
    hashtags TEXT,
    cta TEXT,
    auto_comment TEXT,
    comment_delay_minutes INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela publishing_logs
CREATE TABLE publishing_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    status TEXT NOT NULL,
    published_url TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela settings
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_folder TEXT DEFAULT 'D:\menteestoicaabsoluta',
    published_folder TEXT DEFAULT 'D:\Videos publicados\menteestoicaabsoluta',
    daily_slots JSONB DEFAULT '[3, 10, 15, 22]',
    auto_comment_enabled BOOLEAN DEFAULT true,
    approval_required BOOLEAN DEFAULT true,
    default_platforms JSONB DEFAULT '["instagram", "youtube"]',
    max_batch_size INTEGER DEFAULT 10
);

-- Tabela scheduled_posts
CREATE TABLE scheduled_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'agendado',
    instagram_status TEXT,
    youtube_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
