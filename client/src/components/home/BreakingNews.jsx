import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { newsAPI } from '../../services/api';

const BreakingNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const { data } = await newsAPI.getBreaking(5);
        setNews(data.data);
      } catch (error) {
        console.error('Failed to fetch breaking news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBreaking();
  }, []);

  if (loading || news.length === 0) return null;

  return (
    <div className="bg-[var(--color-accent)] text-white overflow-hidden">
      <div className="container-custom flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 py-2 pr-4 bg-[var(--color-accent-dark)] font-bold">
          <AlertCircle size={18} />
          <span>ब्रेकिंग</span>
        </div>
        <div className="flex-1 overflow-hidden py-2">
          <div className="animate-ticker whitespace-nowrap flex gap-12">
            {news.concat(news).map((item, index) => (
              <a
                key={`${item._id}-${index}`}
                href={`/news/${item.slug}`}
                className="inline-block hover:underline"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
