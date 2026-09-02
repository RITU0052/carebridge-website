import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/data/blog-posts';
import { SeoImage } from './SeoImage';
import { Clock, User, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group">
      <div>
        <Link href={`/blog/${post.slug}`} className="block overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-600">
          <SeoImage
            src={post.featuredImage}
            alt={post.imageAlt}
            width={600}
            height={340}
            aspectRatio="aspect-video"
            className="group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500">
            <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80">
              {post.category}
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readingTime}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px]">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-slate-700">{post.author.name}</span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-800 transition-colors"
        >
          <span>Read Article</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
