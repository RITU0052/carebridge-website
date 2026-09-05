import type { Metadata } from 'next';

export const SITE_NAME = 'CareBridge';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.carebridgehealth.com';
export const SITE_DESCRIPTION = 'CareBridge helps families monitor medicines, health reports, reminders, and AI-powered health summaries in one secure platform.';
export const OFFICIAL_CONTACT_EMAIL = 'support.carebridge@gmail.com';
export const SYSTEM_NOTIFICATION_EMAIL = 'CareBridge.notifications@gmail.com';
export const OFFICIAL_CONTACT_PHONE_1 = '+91 7042363267';
export const OFFICIAL_CONTACT_PHONE_2 = '+91 9953920052';
export const OFFICIAL_CONTACT_PHONE = OFFICIAL_CONTACT_PHONE_1;

export interface PageSeoProps {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noindex?: boolean;
}

export function constructMetadata({
  title,
  description,
  path,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  authors,
  noindex = false,
}: PageSeoProps): Metadata {
  const fullTitle = title === 'CareBridge – AI Healthcare Monitoring Platform' ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: ogType,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
      images: [
        {
          url: `${SITE_URL}/logo.png`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} – AI Healthcare Monitoring Platform`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      site: '@CareBridgeHealth',
      creator: '@CareBridgeHealth',
      images: [`${SITE_URL}/logo.png`],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CareBridge AI',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/CareBridgeHealth',
      'https://linkedin.com/company/carebridge-health',
      'https://facebook.com/CareBridgeHealth',
    ],
    description: SITE_DESCRIPTION,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: OFFICIAL_CONTACT_EMAIL,
      telephone: OFFICIAL_CONTACT_PHONE,
      availableLanguage: ['English'],
    },
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CareBridge',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CareBridge Health Platform',
    operatingSystem: 'Web, iOS, Android',
    applicationCategory: 'HealthApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'CareBridge is a smart healthcare and patient care platform providing medicine reminder tracking, family health monitoring, and medical report analysis.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1280',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.item}`,
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  publishedDate: string;
  updatedDate: string;
  authorName: string;
  image: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${article.slug}`,
    },
    datePublished: article.publishedDate,
    dateModified: article.updatedDate,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CareBridge Health',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/carebridge-logo.webp`,
      },
    },
    image: `${SITE_URL}${article.image}`,
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
