import React, { useEffect, useRef, useState } from 'react';
import { getOptimizedCloudinaryUrl } from '../utils';

interface LazyImageProps {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholderClassName?: string;
}

function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderClassName = 'bg-[#e9edf7]',
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!src) return;

    const node = imgRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [src]);

  const imageSrc = src
    ? getOptimizedCloudinaryUrl(src, { width: width ?? 200, height: height ?? 200, crop: 'fill' }) || src
    : undefined;

  if (!src) {
    return <div className={`${placeholderClassName} ${className}`} aria-label={alt} />;
  }

  return (
    <div ref={imgRef} className={`block overflow-hidden ${className}`}>
      {!isVisible && !hasLoaded ? (
        <div className={`${placeholderClassName} h-full w-full`} aria-label={alt} />
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          className='h-full w-full object-cover'
          onLoad={() => setHasLoaded(true)}
        />
      )}
    </div>
  );
}

export default LazyImage;
