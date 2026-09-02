'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BlogCard } from '@/components/ui/BlogCard';
import { SeoImage } from '@/components/ui/SeoImage';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { blogPosts } from '@/data/blog-posts';
import { Clock, Search, ArrowRight, User } from 'lucide-react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Medicine Management',
    'Elderly Care',
    'Caregiver Guides',
    'Family Health',
    'Health Monitoring',
    'Health Reports',
    'Emergency Preparedness',
    'Digital Health',
  ];

  const featuredPost = blogPosts[0];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }]} />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        <SectionHeader
          badge="CareBridge Health Knowledge Hub"
          title="Practical Guides for Caregivers &amp; Family Health"
          subtitle="Evidence-based articles, medication safety tips, and long-distance caregiving strategies."
        />

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative pt-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides (e.g. medicine reminders, emergency checklist)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Hero Article */}
      {selectedCategory === 'All' && !searchQuery && featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
            <div className="lg:col-span-7">
              <Link href={`/blog/${featuredPost.slug}`}>
                <SeoImage
                  src={featuredPost.featuredImage}
                  alt={featuredPost.imageAlt}
                  width={800}
                  height={480}
                  priority
                  aspectRatio="aspect-[16/10]"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </div>
            <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
                  Featured Guide
                </span>
                <span className="text-xs text-slate-500 font-medium">{featuredPost.category}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h2>

              <p className="text-slate-600 text-base leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800">{featuredPost.author.name}</span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{featuredPost.readingTime}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-colors"
                >
                  <span>Read Featured Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {selectedCategory === 'All' ? 'Latest Health &amp; Caregiving Guides' : `${selectedCategory} Articles`}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredPosts.length} of {blogPosts.length} posts
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <p className="text-lg font-bold text-slate-800">No articles found matching your filter.</p>
            <p className="text-sm text-slate-500">Try searching for a different keyword or select another category.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-2 text-sm font-bold text-teal-700 underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Safety Notice */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <MedicalDisclaimerBanner variant="card" />
      </section>
    </div>
  );
}
