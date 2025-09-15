# 🚀 Production Deployment Guide

## Overview

This guide covers deploying the Forkable AI Framework to production with full infrastructure setup including database, cache, monitoring, and automated forking capabilities.

## 📋 Prerequisites

### Required Accounts & Services
- [Vercel](https://vercel.com) account
- [GitHub](https://github.com) account
- [Google Cloud](https://cloud.google.com) account (for Gemini API)
- [Sentry](https://sentry.io) account (for error tracking)

### Required Tokens & Keys
Create and store these in your `.env` file:

```bash
# AI Service
GEMINI_API_KEY=your_gemini_api_key_here

# Database & Cache (Vercel)
POSTGRES_URL=your_vercel_postgres_url
KV_REST_API_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_vercel_kv_token

# GitHub Integration
GITHUB_TOKEN=your_github_personal_access_token

# Vercel Deployment
VERCEL_TOKEN=your_vercel_api_token
VERCEL_ORG_ID=your_vercel_organization_id
VERCEL_PROJECT_ID=your_vercel_project_id

# Monitoring & Security
SENTRY_DSN=your_sentry_dsn
JWT_SECRET=your_jwt_secret_32_chars_min
ENCRYPTION_KEY=your_encryption_key_32_characters

# Production Settings
NODE_ENV=production
ENABLE_CACHE=true
AUTO_MIGRATE=false
CORS_ORIGIN=https://your-domain.com
```

## 🏗️ Infrastructure Setup

### 1. Database Setup (Vercel Postgres)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection strings to your `.env`
4. Initialize the database schema:

```bash
cd backend
npm run db:init
```

### 2. Cache Setup (Vercel KV)

1. In Vercel Dashboard, go to Storage → Create Database → KV
2. Copy the REST API URL and tokens to your `.env`
3. Test the cache connection:

```bash
cd backend
node -e "require('./cache.js').cache.healthCheck().then(console.log)"
```

### 3. Monitoring Setup (Sentry)

1. Create a new Sentry project
2. Copy the DSN to your `.env`
3. Monitoring will auto-initialize with the DSN

## 🚀 Deployment Process

### Option 1: Manual Deployment

1. **Prepare the application**:
```bash
# Install dependencies
npm run install:all

# Run tests
npm run test

# Lint code
npm run lint
```

2. **Deploy to Vercel**:
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

3. **Set environment variables in Vercel Dashboard**:
   - Go to your project settings
   - Add all environment variables from `.env`
   - Redeploy to apply changes

### Option 2: Automated CI/CD

The project includes GitHub Actions for automated deployment:

1. **Set up repository secrets**:
   - Go to GitHub repository → Settings → Secrets
   - Add all environment variables as repository secrets
   - Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

2. **Push to main branch**:
```bash
git push origin main
```

The GitHub Action will automatically:
- Run tests
- Deploy to Vercel
- Run health checks

## 🍴 Creating Forks

### Using the Enhanced Fork Manager

Create complete forks with full automation:

```bash
# Create a new fork with custom domain
node scripts/fork-manager-enhanced.js create "Sketchify" "Convert images to pencil sketches" "sketchify.com"

# Create a fork without custom domain
node scripts/fork-manager-enhanced.js create "PhotoCartoon" "Convert photos to cartoon style" "none"

# List all deployments
node scripts/fork-manager-enhanced.js list
```

The fork manager will:
1. ✅ Create GitHub repository
2. ✅ Customize the code
3. ✅ Deploy to Vercel
4. ✅ Set up database
5. ✅ Configure environment variables
6. ✅ Set up custom domain (if provided)
7. ✅ Initialize monitoring
8. ✅ Create documentation

### Manual Fork Creation

For more control, use the basic fork script:

```bash
node scripts/create-fork.js "My App Name" "my-domain.com" "Convert images to artistic style"
```

## 🔒 Security Configuration

### 1. Rate Limiting

The application includes built-in rate limiting:
- **General API**: 100 requests per 15 minutes per IP
- **AI Processing**: 50 requests per hour per IP/user
- **Cached in Redis/KV for distributed rate limiting**

### 2. Security Headers

Automatic security headers via Helmet.js:
- Content Security Policy
- HSTS (HTTPS Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options

### 3. Input Validation

All inputs are automatically:
- Sanitized for XSS prevention
- Validated for required fields
- Size-limited for DoS prevention

## 📊 Monitoring & Health Checks

### Health Check Endpoint

```bash
curl https://your-domain.com/health
```

Returns comprehensive health status:
```json
{
  "status": "healthy",
  "timestamp": "2024-09-14T...",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "database": { "status": "healthy" },
  "cache": { "status": "healthy" },
  "metrics": {
    "totalRequests": 1000,
    "errorRate": "0.1%",
    "averageResponseTime": "150ms"
  }
}
```

### Metrics Dashboard

Access detailed metrics (requires API key):
```bash
curl -H "X-API-Key: your-api-key" https://your-domain.com/api/metrics
```

### Real-time Monitoring

- **Error Tracking**: Automatic via Sentry
- **Performance**: Built-in response time tracking
- **Business Metrics**: Image processing counts, token usage
- **Uptime**: Health check monitoring

## 🔧 Configuration Management

### Environment-Specific Settings

The application supports multiple environments:

- **Development**: Local development with in-memory cache
- **Preview**: Vercel preview deployments
- **Production**: Full production with all services

### Feature Flags

Control features via environment variables:
- `ENABLE_CACHE=true` - Enable Redis/KV caching
- `AUTO_MIGRATE=true` - Auto-run database migrations
- `SENTRY_DSN=...` - Enable error tracking

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   ```bash
   # Test database connection
   cd backend
   npm run db:health
   ```

2. **Cache Connection Error**:
   ```bash
   # Test cache connection
   node -e "require('./cache.js').cache.healthCheck().then(console.log)"
   ```

3. **Deployment Failures**:
   - Check Vercel function logs
   - Verify environment variables
   - Ensure all dependencies are listed in package.json

4. **API Rate Limiting**:
   - Check rate limit headers in responses
   - Implement exponential backoff
   - Contact support for rate limit increases

### Debug Mode

Enable verbose logging:
```bash
# Set in environment variables
DEBUG=true
LOG_LEVEL=debug
```

## 📈 Scaling & Optimization

### Performance Optimization

1. **Caching Strategy**:
   - Image processing results cached for 1 hour
   - Database query results cached
   - Static assets cached via Vercel CDN

2. **Database Optimization**:
   - Connection pooling enabled
   - Indexed queries for performance
   - Automatic cleanup of old logs

3. **Monitoring Optimization**:
   - Metrics aggregated per minute
   - Automatic cleanup of old metrics
   - Efficient error tracking

### Cost Optimization

- **Vercel Functions**: Optimized for minimal execution time
- **Database**: Connection pooling reduces costs
- **Cache**: Reduces API calls to external services
- **Monitoring**: Sampled error tracking in production

## 📝 Maintenance

### Regular Tasks

1. **Weekly**:
   - Review error rates in Sentry
   - Check performance metrics
   - Update dependencies if needed

2. **Monthly**:
   - Review database usage and costs
   - Clean up old deployment records
   - Update security patches

3. **Quarterly**:
   - Security audit
   - Performance review
   - Infrastructure cost analysis

### Backup & Recovery

- **Database**: Vercel Postgres includes automatic backups
- **Code**: All code in GitHub repositories
- **Configuration**: Environment variables documented
- **Deployments**: Full deployment history in Vercel

## 🎯 Success Metrics

### Infrastructure Targets

- ✅ **99.9% uptime** (monitored via health checks)
- ✅ **<2s response time** (P95, monitored continuously)
- ✅ **<5min deployment time** (automated via CI/CD)
- ✅ **Zero data loss** (automated backups)

### Business Metrics

- 📊 **Image processing rate** (requests per minute)
- 📊 **User token consumption** (for billing)
- 📊 **Fork creation rate** (business growth)
- 📊 **Error rate** (<0.1% target)

---

## 🆘 Support

For deployment issues:

1. Check the health endpoint: `/health`
2. Review Vercel function logs
3. Check Sentry for errors
4. Contact the development team

**Production Infrastructure Status**: ✅ Ready for Business Operations