-- =========================================================================
-- SUPABASE DATABASE SETUP FOR GAYATRI'S COZY CORNER
-- Copy and paste this entire file into the Supabase SQL Editor and run it!
-- =========================================================================

-- 1. Create 'posts' table
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text CHECK (category IN ('skincare', 'fashion', 'lifestyle')),
  thumbnail_url text,
  content text,
  tags text[],
  views integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create 'affiliate_products' table
CREATE TABLE affiliate_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  name text NOT NULL,
  image_url text,
  affiliate_url text NOT NULL
);

-- 3. Create 'contacts' table
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- SECURITY & ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Posts: Anyone can read, only admin (authenticated) can write
CREATE POLICY "Public can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Admin can insert posts" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update posts" ON posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete posts" ON posts FOR DELETE USING (auth.role() = 'authenticated');

-- Affiliate Products: Anyone can read, only admin can write
CREATE POLICY "Public can view products" ON affiliate_products FOR SELECT USING (true);
CREATE POLICY "Admin can insert products" ON affiliate_products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update products" ON affiliate_products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete products" ON affiliate_products FOR DELETE USING (auth.role() = 'authenticated');

-- Contacts: Anyone can submit (insert), but ONLY admin can read or delete
CREATE POLICY "Anyone can submit contact form" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view contacts" ON contacts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete contacts" ON contacts FOR DELETE USING (auth.role() = 'authenticated');

-- =========================================================================
-- CREATE STORAGE BUCKETS (Thumbnails & Products images)
-- =========================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('thumbnails', 'thumbnails', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true);

-- Setup Storage Security (Public read, Admin write)
CREATE POLICY "Public Access to Thumbnails/Products" ON storage.objects FOR SELECT USING ( bucket_id IN ('thumbnails', 'products') );
CREATE POLICY "Admin Insert Thumbnails/Products" ON storage.objects FOR INSERT WITH CHECK ( bucket_id IN ('thumbnails', 'products') AND auth.role() = 'authenticated' );
CREATE POLICY "Admin Update Thumbnails/Products" ON storage.objects FOR UPDATE USING ( bucket_id IN ('thumbnails', 'products') AND auth.role() = 'authenticated' );
CREATE POLICY "Admin Delete Thumbnails/Products" ON storage.objects FOR DELETE USING ( bucket_id IN ('thumbnails', 'products') AND auth.role() = 'authenticated' );
