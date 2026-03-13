-- Create projects table for portfolio
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  external_link TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media table for project files
CREATE TABLE public.portfolio_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'link')),
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;

-- Public read access for published projects
CREATE POLICY "Anyone can view published projects"
  ON public.portfolio_projects FOR SELECT
  USING (is_published = true);

-- Public read access for media of published projects
CREATE POLICY "Anyone can view media of published projects"
  ON public.portfolio_media FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.portfolio_projects
    WHERE id = portfolio_media.project_id AND is_published = true
  ));

-- Admin write policies (open for anon since admin is password-gated in UI)
CREATE POLICY "Allow insert on projects"
  ON public.portfolio_projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update on projects"
  ON public.portfolio_projects FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete on projects"
  ON public.portfolio_projects FOR DELETE
  USING (true);

CREATE POLICY "Allow insert on media"
  ON public.portfolio_media FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update on media"
  ON public.portfolio_media FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete on media"
  ON public.portfolio_media FOR DELETE
  USING (true);

-- Storage bucket for portfolio files
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

CREATE POLICY "Portfolio files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

CREATE POLICY "Anyone can upload to portfolio bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Anyone can update portfolio files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio');

CREATE POLICY "Anyone can delete portfolio files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_portfolio_media_project_id ON public.portfolio_media(project_id);
CREATE INDEX idx_portfolio_projects_published ON public.portfolio_projects(is_published);