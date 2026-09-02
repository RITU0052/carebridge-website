import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SeoImage } from '@/components/ui/SeoImage';
import { BlogCard } from '@/components/ui/BlogCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata, generateArticleSchema } from '@/lib/seo';
import { Clock, Calendar, User, BookOpen, ExternalLink, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return constructMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    ogType: 'article',
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    authors: [post.author.name],
  });
}

export default async function SingleArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((p) => post.relatedSlugs.includes(p.slug));

  return (
    <>
      <JsonLd
        data={generateArticleSchema({
          title: post.title,
          description: post.description,
          slug: post.slug,
          publishedDate: post.publishedDate,
          updatedDate: post.updatedDate,
          authorName: post.author.name,
          image: post.featuredImage,
        })}
      />

      <article className="py-10 space-y-12">
        {/* Breadcrumb Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.category, href: '/blog' },
              { label: post.title, href: `/blog/${post.slug}` },
            ]}
          />
        </div>

        {/* Title & Metadata */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
            <span>{post.category}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            {post.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 text-sm text-slate-600">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 leading-none">{post.author.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{post.author.role}</p>
              </div>
            </div>

            {/* Dates & Time */}
            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Published: {post.publishedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{post.readingTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SeoImage
            src={post.featuredImage}
            alt={post.imageAlt}
            width={1200}
            height={675}
            priority
            aspectRatio="aspect-[16/9]"
            className="shadow-xl"
          />
        </div>

        {/* Content Body Grid */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-12 space-y-8">
            {/* Medical Safety Callout */}
            <MedicalDisclaimerBanner variant="card" />

            {/* Table of Contents */}
            <div className="p-6 rounded-3xl bg-slate-100/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <span>Table of Contents</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-700 font-medium">
                {post.toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="hover:text-teal-700 hover:underline transition-colors block py-0.5"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Sections */}
            <div className="space-y-10 text-slate-800 text-base sm:text-lg leading-relaxed">
              {post.sections.map((sec) => (
                <section key={sec.id} id={sec.id} className="space-y-4 scroll-mt-24">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight pt-2 border-t border-slate-100">
                    {sec.heading}
                  </h2>
                  <div className="prose prose-slate max-w-none space-y-4">
                    {sec.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {sec.callout && (
                    <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-sm font-semibold flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{sec.callout}</span>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* In-Article Conversion CTA */}
            <div className="bg-gradient-to-r from-teal-700 to-sky-800 text-white rounded-3xl p-8 sm:p-10 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-teal-200 font-bold text-xs uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" />
                <span>CareBridge Family Platform</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Never Miss a Medication Schedule Again
              </h3>
              <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
                CareBridge brings medication reminders, daily vitals tracking, and emergency alert circles into one easy-to-use family platform.
              </p>
              <div className="pt-2">
                <Link
                  href="/waitlist"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-teal-900 bg-white hover:bg-teal-50 shadow-md transition-colors text-sm"
                >
                  <span>Join Free Waitlist</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* References / Sources */}
            {post.references.length > 0 && (
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Credible Sources &amp; References
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {post.references.map((ref, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">[{i + 1}]</span>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-teal-700 hover:underline flex items-center gap-1 font-medium text-slate-700"
                      >
                        <span>{ref.title}</span>
                        <span className="text-slate-400 text-xs">({ref.publisher})</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-slate-200 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
              Related Health &amp; Caregiver Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rel) => (
                <BlogCard key={rel.slug} post={rel} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
