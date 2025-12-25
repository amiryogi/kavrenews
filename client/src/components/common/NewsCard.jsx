import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';

import { getRelativeTimeNepali } from '../../utils/nepaliDate';

// Featured Card - Large
export const NewsCardFeatured = ({ news }) => {
  return (
    <Link to={`/news/${news.slug}`} className="block group">
      <article className="relative h-96 md:h-[500px] rounded-xl overflow-hidden news-card">
        <img
          src={news.featuredImage?.url || '/placeholder.jpg'}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {news.category && (
            <span className="badge badge-primary mb-3">
              {news.category.name?.np || news.category.name}
            </span>
          )}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 line-clamp-3">
            {news.title}
          </h2>
          <p className="text-white/80 mb-4 line-clamp-2 hidden md:block">
            {news.excerpt}
          </p>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {getRelativeTimeNepali(news.publishedAt)}
            </span>
            {news.viewCount > 0 && (
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {news.viewCount}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

// Standard Card
export const NewsCard = ({ news, variant = 'default' }) => {
  if (variant === 'horizontal') {
    return (
      <Link to={`/news/${news.slug}`} className="block group">
        <article className="flex gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 news-card">
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-24 rounded-lg overflow-hidden">
            <img
              src={news.featuredImage?.url || '/placeholder.jpg'}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex-1 min-w-0">
            {news.category && (
              <span className="text-xs font-semibold text-[var(--color-primary)]">
                {news.category.name?.np || news.category.name}
              </span>
            )}
            <h3 className="font-bold text-sm md:text-base line-clamp-2 mt-1 group-hover:text-[var(--color-primary)]">
              {news.title}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
              <Clock size={12} />
              {getRelativeTimeNepali(news.publishedAt)}
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/news/${news.slug}`} className="block group">
      <article className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 news-card h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={news.featuredImage?.url || '/placeholder.jpg'}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {news.isBreaking && (
            <span className="absolute top-3 left-3 badge badge-accent">
              ब्रेकिंग
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          {news.category && (
            <span className="text-xs font-semibold text-[var(--color-primary)] mb-2">
              {news.category.name?.np || news.category.name}
            </span>
          )}
          <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] flex-1">
            {news.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {news.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {getRelativeTimeNepali(news.publishedAt)}
            </span>
            {news.viewCount > 0 && (
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {news.viewCount}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

// Compact Card for sidebar
export const NewsCardCompact = ({ news, index }) => {
  return (
    <Link to={`/news/${news.slug}`} className="block group">
      <article className="flex items-start gap-3 py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
        {index !== undefined && (
          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white font-bold text-sm">
            {index + 1}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-[var(--color-primary)]">
            {news.title}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
            {getRelativeTimeNepali(news.publishedAt)}
          </span>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;
