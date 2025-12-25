import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { NewsCardCompact } from '../common/NewsCard';
import { newsAPI } from '../../services/api';

const TrendingSidebar = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await newsAPI.getTrending(5);
        setNews(data.data);
      } catch (error) {
        console.error('Failed to fetch trending news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-[var(--color-primary)]">
        <TrendingUp size={20} />
        ट्रेन्डिङ
      </h3>
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 skeleton rounded-full" />
              <div className="flex-1">
                <div className="h-4 skeleton rounded mb-2" />
                <div className="h-3 skeleton rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {news.map((item, index) => (
            <NewsCardCompact key={item._id} news={item} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingSidebar;
