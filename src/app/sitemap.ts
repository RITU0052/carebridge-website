import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog-posts';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/features',
    '/features/medicine-reminder',
    '/features/health-monitoring',
    '/features/health-reports',
    '/features/emergency-support',
    '/features/ai-health-assistant',
    '/for-patients',
    '/for-caregivers',
    '/for-families',
    '/for-doctors',
    '/blog',
    '/faq',
    '/contact',
    '/waitlist',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/medicine-reminder',
    '/medicine-reminder-for-elderly',
    '/medicine-reminder-for-parents',
    '/health-monitoring-for-elderly',
    '/medical-report-organizer',
    '/ai-health-report-summary',
    '/emergency-contacts-for-elderly',
    '/elderly-care',
    '/caregiver-support',
    '/care-for-aging-parents',
  ];

  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '' ? 'daily' : route === '/blog' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/features') ? 0.9 : 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedDate || post.publishedDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
