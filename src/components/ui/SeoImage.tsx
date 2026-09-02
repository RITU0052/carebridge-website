import Image, { ImageProps } from 'next/image';
import React from 'react';

interface SeoImageProps extends Omit<ImageProps, 'alt'> {
  alt: string;
  className?: string;
  aspectRatio?: string;
  fallbackText?: string;
}

export function SeoImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  aspectRatio = 'aspect-video',
  fallbackText,
  ...props
}: SeoImageProps) {
  // Defensive validation against empty alt tags
  const sanitizedAlt = alt && alt.trim().length > 0 ? alt : 'CareBridge platform image';

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-xl ${aspectRatio} ${className}`}>
      <Image
        src={src}
        alt={sanitizedAlt}
        width={width || 800}
        height={height || 450}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover w-full h-full transition-opacity duration-300"
        {...props}
      />
      {fallbackText && (
        <span className="sr-only">{fallbackText}</span>
      )}
    </div>
  );
}
