-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    authors TEXT,
    year INTEGER,
    venue TEXT,
    topic TEXT,
    keywords TEXT[],
    abstract_short TEXT,
    abstract_full TEXT,
    arxiv_id TEXT,
    download_url TEXT,
    score_boost INTEGER DEFAULT 0
);

-- Optional: Enable RLS and setup a read-only policy
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to papers"
    ON public.papers
    FOR SELECT
    USING (true);
