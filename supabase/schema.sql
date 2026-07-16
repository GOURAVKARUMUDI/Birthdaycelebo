-- Extended Relational Supabase Schema for Scrapbook Builder SaaS Platform

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    tier VARCHAR(50) DEFAULT 'free', -- free, premium, business
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, private, published
    countdown_date TIMESTAMP WITH TIME ZONE,
    bg_music_url TEXT,
    recipient_name VARCHAR(255) DEFAULT 'Recipient',
    passwords JSONB DEFAULT '{}'::jsonb, -- friend, relationship, family passwords
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- THEMES
CREATE TABLE IF NOT EXISTS public.themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    colors JSONB DEFAULT '{"primary": "#E8DEF8", "secondary": "#FADADD", "background": "#FFFDF9", "foreground": "#2C2C2C"}'::jsonb,
    fonts JSONB DEFAULT '{"heading": "Poppins", "body": "Nunito", "handwriting": "Caveat"}'::jsonb,
    radius VARCHAR(50) DEFAULT '24px',
    glass_effect VARCHAR(100) DEFAULT 'blur(12px)',
    cursor VARCHAR(50) DEFAULT 'sparkle',
    loader_type VARCHAR(50) DEFAULT 'gift',
    shadows VARCHAR(50) DEFAULT 'md',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PAGES
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    slug VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, slug)
);

-- SECTIONS
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    layout_type VARCHAR(50) DEFAULT 'single-col', -- single-col, two-col, grid
    styles JSONB DEFAULT '{"padding": "2rem", "gap": "1rem"}'::jsonb,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BLOCKS (INDIVIDUAL DYNAMIC COMPONENTS)
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- countdown, letter, memories, timeline, chats, games, gifts, video, text, image, quote, spotify, youtube
    properties JSONB DEFAULT '{}'::jsonb, -- component variables
    styles JSONB DEFAULT '{}'::jsonb, -- padding, alignment, custom color overrides
    animation JSONB DEFAULT '{"type": "fade", "duration": 0.5, "delay": 0}'::jsonb, -- animate-editor configurations
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ASSETS (GOOGLE DRIVE MOCK)
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- image, video, music, gif, sticker, svg
    url TEXT NOT NULL,
    folder_id VARCHAR(100) DEFAULT 'root', -- root, photos, audio, videos
    tags TEXT[] DEFAULT '{}'::text[],
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ANALYTICS SESSIONS
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    visitor_nickname VARCHAR(100) DEFAULT 'Guest',
    time_spent_seconds INT DEFAULT 0,
    completion_rate NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Profiles: Users can edit their own profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: Public read, owner full control
CREATE POLICY "Public read access to projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Owner write access to projects" ON public.projects FOR ALL USING (auth.uid() = user_id);

-- Themes, Pages, Sections, Blocks, Assets: Public read, project owner write
CREATE POLICY "Public read access to themes" ON public.themes FOR SELECT USING (true);
CREATE POLICY "Owner write access to themes" ON public.themes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);

CREATE POLICY "Public read access to pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Owner write access to pages" ON public.pages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);

CREATE POLICY "Public read access to sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Owner write access to sections" ON public.sections FOR ALL USING (
    EXISTS (SELECT 1 FROM public.pages p JOIN public.projects pr ON p.project_id = pr.id WHERE p.id = page_id AND pr.user_id = auth.uid())
);

CREATE POLICY "Public read access to blocks" ON public.blocks FOR SELECT USING (true);
CREATE POLICY "Owner write access to blocks" ON public.blocks FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.sections s 
        JOIN public.pages p ON s.page_id = p.id 
        JOIN public.projects pr ON p.project_id = pr.id 
        WHERE s.id = section_id AND pr.user_id = auth.uid()
    )
);

CREATE POLICY "Public read access to assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Owner write access to assets" ON public.assets FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);
