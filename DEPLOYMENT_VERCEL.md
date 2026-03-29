# Deployment to Vercel - Step by Step

## Prerequisites
- GitHub account (for version control)
- Vercel account (free tier)
- Supabase project with tables set up

## Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: The Space Project MVP"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/the-space-project.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Paste: `https://github.com/YOUR_USERNAME/the-space-project`
5. Click "Import"

## Step 3: Configure Environment Variables

In the Vercel import dialog (before deploying):

1. Click "Environment Variables"
2. Add two variables:

   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://xxxxx.supabase.co` (from Supabase settings)
   - Scope: Production, Preview, Development

   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGc...` (from Supabase API keys)
   - Scope: Production, Preview, Development

3. Click "Deploy"

## Step 4: Monitor Deployment

Vercel will automatically:
1. Install dependencies
2. Build the Next.js project
3. Run tests (if any)
4. Deploy to a temporary URL

Watch the deployment logs. Once green ✓ it's live!

## Step 5: Custom Domain (Optional)

Once deployment succeeds:

1. Go to your Vercel project → "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `thespacepy.com`)
4. Follow DNS setup instructions for your registrar
5. Update Open Graph metadata in `app/layout.tsx` with your new URL

## Step 6: Enable Analytics (Optional)

Vercel automatically tracks:
- Page load times
- Core Web Vitals
- Error rates
- Deployment frequency

View in project dashboard → "Analytics" tab

## Step 7: Set Up Automated Deployments

Vercel auto-deploys on every push to main:

```bash
# Make a change locally
echo "# Updated content" >> README.md

# Commit and push
git add README.md
git commit -m "Update README"
git push origin main

# Vercel automatically deploys within 1-2 minutes!
```

## Troubleshooting

### Build Fails: "Cannot find module"
```bash
# Your local dependencies might differ from deployment
# Solution: Update package-lock.json

npm install
git add package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### 3D Canvas is Black
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure Supabase is accessible (check CORS)

### Images Not Loading
1. Check Supabase Storage CORS settings
2. Verify `image_url` in database is complete URL
3. Test image URLs in browser directly

### Slow Performance
- Check Vercel Analytics for bottlenecks
- Reduce image file sizes (<300KB each)
- Consider upgrading to Pro for more serverless functions

## Production Checklist

Before going live:

- [ ] Database tables created in Supabase
- [ ] Sample content added (3 collections, ~10 looks)
- [ ] Environment variables set in Vercel
- [ ] Domain configured (if using custom domain)
- [ ] Metadata updated with actual site info
- [ ] Images optimized and uploaded
- [ ] Tested on mobile browsers
- [ ] Social media sharing tested (Open Graph)
- [ ] Analytics configured (if desired)
- [ ] Email/Instagram links updated in UI

## Monitoring & Maintenance

### Weekly
- Check Vercel dashboard for errors
- Monitor Supabase database usage

### Monthly
- Review analytics
- Check error logs
- Update content if needed

### Quarterly
- Review performance metrics
- Plan new features (Phase 2)
- Gather visitor feedback

## Database Backups

Supabase automatically backs up data:
- Daily snapshots (7 days retention)
- Point-in-time recovery available
- Export data anytime from dashboard

To manually export:
1. Go to Supabase project
2. Click "Settings" → "Backups"
3. Click "Back up now"

## Rollback (If Needed)

If a deployment breaks:

1. Go to Vercel project → "Deployments"
2. Find the last working deployment
3. Click "..." → "Promote to Production"

Or manually revert on GitHub:
```bash
git revert <bad-commit-hash>
git push origin main
```

## Cost Considerations

**Vercel (Free tier covers this):**
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless functions included

**Supabase (Free tier covers this):**
- 500MB database
- 1GB bandwidth
- 2GB storage

For larger datasets, upgrade:
- Supabase Pro: $25/month
- Vercel Pro: $20/month (optional)

## Support

- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)

---

**Deployment Time**: ~5-10 minutes
**Maintenance**: ~5 minutes per month
**Cost**: Free (up to reasonable traffic)
