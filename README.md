# The Space Project

A 3D museum experience for Trinh Chau's fashion design work. Visitors enter a virtual gallery to explore collections of hand-crafted garments in an immersive, poetic exhibition.

## 🎨 Vision

- **Whitespace** is not emptiness. It is respect for the work.
- **The 3D museum** is not a feature. It is the statement.
- **The typography** is not decoration. It is the voice.
- **The language** is not copy. It is poetry.
- **The absence of a "Buy" button** is not an oversight. It is the philosophy.

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (React 18)
- **3D Rendering**: React Three Fiber (R3F) + Three.js
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📁 Project Structure

```
app/
├── page.tsx              # Main app (state management)
├── layout.tsx            # Root layout with metadata
├── globals.css           # Global styles & CSS variables
├── components/
│   ├── Scene.tsx         # 3D canvas manager
│   ├── 3d/
│   │   ├── Lobby.tsx     # 3D museum lobby
│   │   └── CollectionRoom.tsx  # 3D gallery room
│   └── UI/
│       ├── Navigation.tsx      # Top navigation
│       ├── LookDetail.tsx      # Detail popup
│       └── LoadingScreen.tsx   # Loading state
└── lib/
    ├── supabase.ts       # Supabase client & queries
    └── types.ts          # TypeScript interfaces
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### 1. Clone or Download
```bash
# Copy all files to your project directory
cd the-space-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase
See **SUPABASE_SETUP.md** for detailed instructions.

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 4. Run Locally
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Explore
- **Lobby**: Rotate the view (auto-rotating), click doors to enter
- **Collection**: Browse looks, click to see details
- **Detail**: Read inspiration, see materials, share

## 🎮 Interactions

### Desktop
- **Rotate**: Drag mouse
- **Zoom**: Scroll wheel
- **Pan**: Right-click + drag
- **Click**: Select collection or look

### Mobile
- **Rotate**: Swipe/drag
- **Zoom**: Pinch or two-finger scroll
- **Click**: Tap collection or look

## 🛠️ Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  'bg': '#F8F7F4',
  'accent': '#C8B89A',
  // ...
}
```

Also update in `app/globals.css` CSS variables.

### Modify 3D Geometry
Edit `components/3d/Lobby.tsx` and `components/3d/CollectionRoom.tsx`:
- Door size, color, position
- Wall dimensions
- Lighting

### Adjust Typography
Edit `components/UI/Navigation.tsx` and `components/UI/LookDetail.tsx`:
- Change Shakespeare quotes
- Modify text content
- Update layouts

### Image Optimization
In `components/3d/CollectionRoom.tsx`:
```tsx
// Load images from Supabase
const handleImageLoad = (texture: THREE.Texture) => {
  // Resize texture to optimized size
  texture.source.data.scale(0.5, 0.5)
}
```

## 📊 Performance Optimization

### Mobile First
- Reduced geometry on mobile (`dpr` settings)
- Lazy loading of collections
- Image optimization with WebP

### 3D Optimization
- Simplified Lobby geometry
- Abstraction > realism (faster rendering)
- Efficient lighting setup

### Bundle Size
- R3F + Three.js: ~200KB (gzipped)
- All dependencies: ~1.2MB

## 🌐 SEO & Sharing

Metadata is configured in `app/layout.tsx`:
- Open Graph tags
- Twitter Card
- Collection/Look pages can include structured data

To add per-look metadata:
```tsx
// In a future [lookId] dynamic route
export async function generateMetadata({ params }) {
  const look = await getLook(params.lookId)
  return {
    title: look.name,
    description: look.inspiration,
    openGraph: {
      images: [{ url: look.image_url }],
    },
  }
}
```

## 🚢 Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: The Space Project"
git push origin main
```

### 2. Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### 3. Custom Domain
In Vercel project settings → "Domains":
- Add your custom domain
- Configure DNS settings

## 📈 Analytics

To track success metrics (time spent, shares):

### Option 1: Vercel Analytics
Built in automatically (free tier).

### Option 2: Supabase Analytics
Create a `page_views` table to track visits:
```sql
CREATE TABLE page_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  view_type VARCHAR(50), -- 'lobby', 'collection', 'look'
  collection_id UUID,
  look_id UUID,
  session_id VARCHAR(255),
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT now()
);
```

Track in `app/page.tsx`:
```tsx
useEffect(() => {
  const sessionStart = Date.now()
  return () => {
    const duration = Math.round((Date.now() - sessionStart) / 1000)
    // Log to Supabase
  }
}, [])
```

## 🐛 Troubleshooting

**"Three not found"**
- Run `npm install three @react-three/fiber @react-three/drei`

**Canvas not rendering**
- Check browser console for errors
- Verify GPU support (enable hardware acceleration)

**Images not loading**
- Verify `image_url` in Supabase is valid and public
- Check CORS in Supabase Storage settings

**Mobile performance issues**
- Reduce `dpr` in Scene.tsx
- Simplify 3D geometry
- Optimize images to <200KB

## 🔐 Security

Current setup is read-only (public gallery):
- RLS policies allow public SELECT only
- No authentication needed
- No data modification through the app

For future admin panel:
- Add Supabase Auth with magic links
- Implement INSERT/UPDATE policies
- Use row-level security

## 📝 Content Management

### Add New Look
1. Go to Supabase dashboard
2. In `looks` table, click "Insert row"
3. Fill in fields (all required except image_url)
4. Refresh the app

### Update Collection
Edit in Supabase:
- Name, description, slug
- Order (changes display order in lobby)

### Upload Images
1. In Supabase Storage, upload to `looks` bucket
2. Copy public URL
3. Paste into `image_url` field in looks table

## 🎯 Next Steps (Phase 2)

- [ ] Add user accounts & wishlists
- [ ] 3D garment models (rotating displays)
- [ ] AR try-on feature
- [ ] Blog / behind-the-scenes content
- [ ] Advanced analytics dashboard
- [ ] Email signup for collection updates
- [ ] Dark mode toggle

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check Next.js docs for React 18 features
4. Three.js examples at [threejs.org](https://threejs.org)

## 📄 License

This project is custom-created for Trinh Chau's fashion design portfolio.

---

**Created with ❤️ for The Space Project**
