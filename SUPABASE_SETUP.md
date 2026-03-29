# The Space Project - Supabase Setup Guide

## Quick Start

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Name it "the-space-project"
4. Choose a strong password
5. Select a region closest to your users
6. Wait for the project to initialize

### 2. Get Credentials
Once your project is ready:
1. Go to **Settings** → **API**
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` (public) key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Create `.env.local` in your project root with these values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

### 3. Create Database Tables

#### Collections Table
In Supabase SQL Editor, run:

```sql
CREATE TABLE collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Insert sample collections
INSERT INTO collections (name, description, slug, order) VALUES
  ('Ethereal Metamorphosis', 'A journey through transformation and silence.', 'ethereal', 1),
  ('Threads of Time', 'Where past whispers to future in fabric.', 'threads', 2),
  ('Nocturne', 'The elegance of darkness, the poetry of night.', 'nocturne', 3);
```

#### Looks Table
```sql
CREATE TABLE looks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  materials TEXT NOT NULL,
  inspiration TEXT NOT NULL,
  image_url VARCHAR(512),
  order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Insert sample looks
INSERT INTO looks (collection_id, name, materials, inspiration, order) VALUES
  ((SELECT id FROM collections WHERE slug = 'ethereal'), 'Soliloquy', 'Silk charmeuse, organza, hand-stitched lace', 'In the stillness of midnight, a soul speaks to itself through fabric. Each fold is a confession, each stitch a heartbeat.', 1),
  ((SELECT id FROM collections WHERE slug = 'ethereal'), 'Reverie', 'Linen, natural indigo, bone beads', 'Inspired by the wanderings of the mind when it escapes the bounds of reason.', 2),
  ((SELECT id FROM collections WHERE slug = 'threads'), 'Tempest', 'Wool, silk, hand-dyed with madder root', 'The violent beauty of storms, the raw power of nature untempered.', 1);
```

### 4. Set Up Row Level Security (RLS)

Since this is a public gallery, we only need SELECT permissions:

```sql
-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE looks ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access" ON collections
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON looks
  FOR SELECT USING (true);
```

### 5. Storage for Images (Optional)
If you want to host images in Supabase:

1. Go to **Storage** → **Create new bucket**
2. Name it `looks`
3. Set it to **Public**
4. Upload your 3:4 aspect ratio images
5. Copy the public URL and update the `image_url` field in the looks table

### Test Connection
Run in your Next.js app:
```bash
npm install
npm run dev
```

Visit http://localhost:3000 - you should see the 3D museum with your collections!

### Production Deployment
When deploying to Vercel:
1. Add environment variables in Vercel project settings
2. Deploy:
   ```bash
   vercel
   ```

## Data Structure Reference

### Collections Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR | Display name |
| description | TEXT | Shown in lobby |
| slug | VARCHAR | URL-safe identifier |
| order | INTEGER | Display order in lobby |
| created_at | TIMESTAMP | Auto-generated |

### Looks Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| collection_id | UUID | Foreign key to collections |
| name | VARCHAR | Garment name |
| materials | TEXT | Materials/construction |
| inspiration | TEXT | Shakespearean description |
| image_url | VARCHAR | Image URL (3:4 ratio) |
| order | INTEGER | Display order in collection |
| created_at | TIMESTAMP | Auto-generated |

## Tips for Content

### Photography
- Aspect ratio: 3:4 (portrait)
- Resolution: 1200x1600px minimum
- File size: Optimize to <500KB per image

### Inspiration Text
- Use poetic, Shakespearean language
- 2-3 sentences recommended
- Reference materials, techniques, or emotions

### Material Lists
- List primary materials and techniques
- Use commas to separate
- Example: "Silk charmeuse, hand-stitched lace, natural dyes"

## Troubleshooting

**"Cannot find Supabase client"**
- Verify `.env.local` has correct values
- Check that keys are not wrapped in quotes

**"Table not found"**
- Confirm SQL commands were executed successfully
- Check table names match exactly (case-sensitive)

**Images not loading**
- Verify image_url is a complete, valid URL
- Check CORS settings in Supabase Storage

## Next Steps
1. Add your fashion collections and looks
2. Update collection names/descriptions with Trinh's vision
3. Upload high-quality images
4. Test the full experience locally
5. Deploy to Vercel
