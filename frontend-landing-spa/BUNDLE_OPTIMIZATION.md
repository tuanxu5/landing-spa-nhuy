# Bundle Size Optimization

This document describes the bundle size optimizations implemented for the Spa Booking Landing Page frontend application.

## Implemented Optimizations

### 1. Bundle Analyzer Configuration

**Package**: `@next/bundle-analyzer`

The bundle analyzer has been installed and configured in `next.config.ts` to enable detailed analysis of the production bundle.

**Usage**:
```bash
npm run analyze
```

This will:
- Build the application for production
- Generate interactive HTML reports showing bundle composition
- Open the reports in your default browser
- Show both client and server bundle breakdowns

**Configuration** (`next.config.ts`):
```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
```

### 2. Automatic Code Splitting (App Router)

The application uses Next.js 16 App Router, which provides **automatic code splitting** for all routes:

**Admin Panel Routes** (automatically code-split):
- `/admin/login` - Login page
- `/admin/bookings` - Bookings management
- `/admin/posts` - Posts list
- `/admin/posts/new` - Create post
- `/admin/posts/[id]/edit` - Edit post
- `/admin/settings` - Account settings

**Benefits**:
- Each admin route is loaded only when accessed
- Landing page bundle doesn't include admin panel code
- Reduces initial page load time for customers
- Improves Time to Interactive (TTI) metrics

### 3. Import Optimization

**Current Import Patterns** (already optimized):

#### Axios
```typescript
// ✅ Good - Named imports for tree-shaking
import axios, { AxiosInstance, AxiosError } from 'axios';
```

#### Next.js Image
```typescript
// ✅ Good - Using Next.js Image component for automatic optimization
import Image from 'next/image';
```

#### React
```typescript
// ✅ Good - Named imports only for what's needed
import { useState, useEffect } from 'react';
```

#### Zod
```typescript
// ✅ Good - Named import
import { z } from 'zod';
```

### 4. Image Optimization

**Next.js Image Component** is used throughout the application:

```typescript
<Image
  src={service.featuredImage}
  alt={service.title}
  fill
  className="object-cover"
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

**Benefits**:
- Automatic image optimization and compression
- Lazy loading for images below the fold
- Responsive images with `sizes` attribute
- Modern image formats (WebP, AVIF) when supported
- Reduced bandwidth usage

### 5. Tree-Shaking Enabled

Next.js automatically enables tree-shaking for production builds:

- Dead code elimination
- Unused exports are removed
- Only imported code is bundled
- Works with ES modules

## Performance Targets

Based on **Requirement 14.1** and **14.5**:

- ✅ Initial page load: < 3 seconds on standard broadband
- ✅ Image optimization: Automatic via Next.js Image
- ✅ Lazy loading: Implemented for below-the-fold images
- ✅ Minimized API requests: Efficient data fetching
- ✅ Static asset caching: Handled by Next.js

## Monitoring Bundle Size

### Regular Analysis

Run bundle analysis regularly to monitor size:

```bash
npm run analyze
```

### Key Metrics to Monitor

1. **First Load JS**: Total JavaScript loaded on initial page load
2. **Route Bundles**: Size of each route's JavaScript
3. **Shared Chunks**: Common code shared between routes
4. **Third-party Libraries**: Size of dependencies

### Bundle Size Thresholds

**Recommended limits**:
- Landing page (/) first load: < 200 KB
- Admin routes first load: < 300 KB
- Individual route chunks: < 100 KB

## Future Optimization Opportunities

### 1. Dynamic Imports for Heavy Components

If bundle analysis reveals large components, consider dynamic imports:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable SSR if not needed
});
```

### 2. Font Optimization

Currently using Google Fonts (Geist). Consider:
- Subsetting fonts to include only needed characters
- Using `font-display: swap` for better perceived performance
- Self-hosting fonts for better caching control

### 3. Dependency Audit

Regularly audit dependencies:

```bash
npm ls --depth=0
```

Look for:
- Duplicate dependencies
- Unused dependencies
- Heavy dependencies that could be replaced

### 4. Code Splitting for Large Libraries

If specific libraries are large, consider:
- Splitting into separate chunks
- Loading only when needed
- Using lighter alternatives

## Verification

### Build and Analyze

```bash
# Build for production
npm run build

# Analyze bundle
npm run analyze
```

### Check Build Output

The build output shows:
- Route sizes
- First Load JS for each route
- Shared chunks

Example output:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5 kB       100 kB
├ ○ /admin/bookings                      3 kB       98 kB
├ ○ /admin/login                         2 kB       97 kB
└ ○ /admin/posts                         4 kB       99 kB
```

## Related Requirements

- **Requirement 14.1**: Landing page loads within 3 seconds
- **Requirement 14.5**: Cache static assets for improved performance

## References

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Code Splitting](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
