import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { NewsCard } from '../common/NewsCard';
import { newsAPI } from '../../services/api';

const CategorySection = ({ category, limit = 4 }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await newsAPI.getByCategory(category.slug, { limit });
        setNews(data.data);
      } catch (error) {
        console.error(`Failed to fetch news for ${category.slug}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [category.slug, limit]);

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{category.name.np}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <div className="h-48 skeleton" />
              <div className="p-4 bg-white dark:bg-gray-800">
                <div className="h-4 skeleton rounded mb-2" />
                <div className="h-4 skeleton rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-[var(--color-primary)] pl-4">
          {category.name.np}
        </h2>
        <Link
          to={`/category/${category.slug}`}
          className="flex items-center gap-1 text-[var(--color-primary)] font-medium hover:underline"
        >
          थप हेर्नुहोस्
          <ArrowRight size={18} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.map((item) => (
          <NewsCard key={item._id} news={item} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
