import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BreakingNews from '../../components/home/BreakingNews';
import HeroSlider from '../../components/home/HeroSlider';
import CategorySection from '../../components/home/CategorySection';
import TrendingSidebar from '../../components/home/TrendingSidebar';
import { NewsCard } from '../../components/common/NewsCard';
import { categoryAPI, newsAPI } from '../../services/api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, latestRes] = await Promise.all([
          categoryAPI.getAll(),
          newsAPI.getAll({ limit: 6 }),
        ]);
        setCategories(categoriesRes.data.data);
        setLatestNews(latestRes.data.data);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>काभ्रे समाचार | Kavrepanlanchok News Portal</title>
        <meta
          name="description"
          content="काभ्रेपलाञ्चोक जिल्लाको विश्वसनीय समाचार पोर्टल। स्थानीय समाचार, राजनीति, खेलकुद र मनोरञ्जनको ताजा अपडेट।"
        />
      </Helmet>

      {/* Breaking News Ticker */}
      <BreakingNews />

      <main className="container-custom py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <HeroSlider />
            </div>
            <div className="hidden lg:block">
              <TrendingSidebar />
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold border-l-4 border-[var(--color-primary)] pl-4 mb-6">
            ताजा समाचार
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <div className="h-48 skeleton" />
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <div className="h-4 skeleton rounded mb-2" />
                      <div className="h-4 skeleton rounded w-3/4" />
                    </div>
                  </div>
                ))
              : latestNews.map((item) => (
                  <NewsCard key={item._id} news={item} />
                ))}
          </div>
        </section>

        {/* Category Sections */}
        {categories.slice(0, 4).map((category) => (
          <CategorySection key={category._id} category={category} />
        ))}

        {/* Mobile Trending (shown only on mobile) */}
        <div className="lg:hidden mb-12">
          <TrendingSidebar />
        </div>

        {/* More Category Sections */}
        {categories.slice(4, 8).map((category) => (
          <CategorySection key={category._id} category={category} />
        ))}
      </main>
    </>
  );
};

export default Home;
