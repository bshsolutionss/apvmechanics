-- ========================================================
-- APV Mobile Mechanics — Supabase Database Schema
-- Run this complete SQL script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. Contact Form Quote Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT 'N/A',
    suburb TEXT DEFAULT 'N/A',
    service TEXT DEFAULT 'General Care',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure suburb column exists if table was created previously
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS suburb TEXT DEFAULT 'N/A';

-- Index for fast lead sorting by date
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries (created_at DESC);

-- 2. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast newsletter subscriber lookup
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers (email);

-- 3. Dynamic Site Settings Table (Opening Hours, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default opening hours & terms and conditions note
INSERT INTO public.site_settings (key, value)
VALUES 
    ('opening_hours', '8:00 AM to 5:00 PM (Monday to Friday)'),
    ('terms_conditions', 'The $70 call-out fee covers travel to your location and an initial inspection. The fee applies whether or not you proceed with repairs. Additional charges may apply for further diagnosis, labour, repairs or parts. All additional work will be discussed before proceeding.')
ON CONFLICT (key) DO NOTHING;

-- ========================================================
-- Security & Permissions (Enable Public Insert & Admin Access)
-- ========================================================

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a contact quote enquiry
DROP POLICY IF EXISTS "Allow public insert into enquiries" ON public.enquiries;
CREATE POLICY "Allow public insert into enquiries"
    ON public.enquiries FOR INSERT
    WITH CHECK (true);

-- Allow authenticated users & service role to select/update/delete enquiries
DROP POLICY IF EXISTS "Allow full access to enquiries for service role and auth" ON public.enquiries;
CREATE POLICY "Allow full access to enquiries for service role and auth"
    ON public.enquiries FOR ALL
    USING (true)
    WITH CHECK (true);

-- Allow anyone to subscribe to the newsletter
DROP POLICY IF EXISTS "Allow public insert into newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow public insert into newsletter_subscribers"
    ON public.newsletter_subscribers FOR INSERT
    WITH CHECK (true);

-- Allow full access to newsletter_subscribers for service role and auth
DROP POLICY IF EXISTS "Allow full access to newsletter_subscribers for service role and auth" ON public.newsletter_subscribers;
CREATE POLICY "Allow full access to newsletter_subscribers for service role and auth"
    ON public.newsletter_subscribers FOR ALL
    USING (true)
    WITH CHECK (true);

-- Allow public read of site_settings (for topbar & contact page opening hours)
DROP POLICY IF EXISTS "Allow public read of site_settings" ON public.site_settings;
CREATE POLICY "Allow public read of site_settings"
    ON public.site_settings FOR SELECT
    USING (true);

-- Allow full access to site_settings for service role and auth
DROP POLICY IF EXISTS "Allow full access to site_settings for service role and auth" ON public.site_settings;
CREATE POLICY "Allow full access to site_settings for service role and auth"
    ON public.site_settings FOR ALL
    USING (true)
    WITH CHECK (true);
