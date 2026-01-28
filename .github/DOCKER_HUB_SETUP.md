# Docker Hub Auto-Push Setup Guide

## Prerequisites

1. **Docker Hub Account**
   - Sign up at https://hub.docker.com if you don't have an account

2. **GitHub Repository**
   - Your code should be in a GitHub repository

## Step-by-Step Setup

### 1. Create Docker Hub Access Token

1. Go to https://hub.docker.com
2. Click your username (top right) → **Account Settings**
3. Go to **Security** → **New Access Token**
4. Name it: `github-actions`
5. Permissions: **Read, Write, Delete**
6. Click **Generate**
7. **COPY THE TOKEN** (you won't see it again!)

### 2. Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add these two secrets:

**Secret 1:**
- Name: `DOCKERHUB_USERNAME`
- Value: Your Docker Hub username (e.g., `johndoe`)

**Secret 2:**
- Name: `DOCKERHUB_TOKEN`
- Value: The access token you copied in Step 1

### 3. Verify Workflow Files

The following workflow files should exist in `.github/workflows/`:

- `docker-publish.yml` - Builds and pushes images automatically
- `docker-lint.yml` - Lints Dockerfile and scans for vulnerabilities

### 4. Update Image Name (Optional)

If you want a custom image name, edit `.github/workflows/docker-publish.yml`:

```yaml
env:
  IMAGE_NAME: ${{ secrets.DOCKERHUB_USERNAME }}/budget-wishlist
  # Change "budget-wishlist" to your preferred name
```

### 5. Test the Workflow

1. Make a small change to your code
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "test: trigger docker build"
   git push origin main
   ```
3. Go to your GitHub repo → **Actions** tab
4. Watch the workflow run!

### 6. Check Docker Hub

After the workflow completes:
1. Go to https://hub.docker.com
2. Go to **Repositories**
3. You should see `budget-wishlist` (or your custom name)
4. Click it to view tags

## What Gets Built

### Automatic Tags

The workflow creates multiple tags automatically:

- `latest` - Most recent build from main branch
- `main` - Current main branch
- `main-abc1234` - Commit SHA
- `v1.0.0` - Git tags (if you use semantic versioning)

### Example:

If you push to main branch, you'll get:
```
yourusername/budget-wishlist:latest
yourusername/budget-wishlist:main
yourusername/budget-wishlist:main-a1b2c3d
```

If you create a git tag `v1.0.0`:
```bash
git tag v1.0.0
git push origin v1.0.0
```

You'll also get:
```
yourusername/budget-wishlist:1.0.0
yourusername/budget-wishlist:1.0
yourusername/budget-wishlist:1
```

## Using Your Docker Image

Once pushed, anyone can pull and run your image:

```bash
# Pull the image
docker pull yourusername/budget-wishlist:latest

# Run it
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data yourusername/budget-wishlist:latest
```

Or with docker-compose:

```yaml
services:
  budget-wishlist:
    image: yourusername/budget-wishlist:latest
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

## Advanced Features

### Multi-Platform Support

The workflow builds for both:
- `linux/amd64` (Intel/AMD processors)
- `linux/arm64` (Apple Silicon, Raspberry Pi, etc.)

### Build Cache

Uses GitHub Actions cache to speed up builds:
- First build: ~5-10 minutes
- Subsequent builds: ~1-3 minutes

### Security Scanning

The `docker-lint.yml` workflow:
- ✅ Lints Dockerfile for best practices
- ✅ Scans for security vulnerabilities
- ✅ Reports issues in GitHub Security tab

### Pull Request Testing

When someone opens a pull request:
- ✅ Docker image is built (but not pushed)
- ✅ Ensures the Dockerfile still works
- ✅ Runs security scans

## Troubleshooting

### "Error: Cannot find DOCKERHUB_USERNAME"

**Solution:** Add the secret in GitHub Settings → Secrets → Actions

### "Error: authentication required"

**Solution:** 
1. Regenerate Docker Hub token
2. Update `DOCKERHUB_TOKEN` secret in GitHub

### Build fails with "no space left on device"

**Solution:** GitHub Actions has 14GB space. Optimize your Dockerfile or use `.dockerignore`

### Image not appearing on Docker Hub

**Solution:**
1. Check the Actions tab for errors
2. Verify secrets are correct
3. Make sure you pushed to `main` branch

### "Error: failed to solve: process "/bin/sh -c npm ci" did not complete"

**Solution:** Your dependencies might have issues. Test locally first:
```bash
docker build -t test .
```

## Monitoring

### Check Build Status

1. GitHub repo → **Actions** tab
2. Click on the latest workflow run
3. Expand steps to see detailed logs

### Email Notifications

GitHub sends emails when workflows fail. Configure in:
- GitHub Settings → Notifications → Actions

## Manual Trigger

You can manually trigger a build:

1. Go to **Actions** tab
2. Click **Build and Push Docker Image**
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## Cost

- ✅ GitHub Actions: **FREE** (2,000 minutes/month for public repos, unlimited for public repos)
- ✅ Docker Hub: **FREE** (unlimited public repositories, 1 private repo)

## Next Steps

1. Add tests to your workflow
2. Deploy automatically to a server
3. Set up staging/production environments
4. Add release automation

## Support

If you encounter issues:
1. Check the Actions tab for error logs
2. Search GitHub Issues
3. Check Docker Hub status page
4. Review the workflow file syntax

## Example Complete Workflow

After setup, your workflow will be:

```
1. Code changes → Git push
2. GitHub Actions triggered
3. Checkout code
4. Login to Docker Hub
5. Build multi-platform image
6. Push to Docker Hub
7. Available for deployment! 🎉
```

Enjoy automatic Docker deployments! 🐳🚀
