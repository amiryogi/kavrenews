import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { NewsCard } from '../../components/common/NewsCard';
import TrendingSidebar from '../../components/home/TrendingSidebar';
import { newsAPI } from '../../services/api';

const CategoryPage = () => {
  const { slug } = useParams();
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data } = await newsAPI.getByCategory(slug, { page, limit: 12 });
        setNews(data.data);
        setCategory(data.category);
        setTotalPages(data.pages);
      } catch (error) {
        console.error('Failed to fetch category news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    window.scrollTo(0, 0);
  }, [slug, page]);

  return (
    <>
      <Helmet>
        <title>
          {category?.name?.np || slug} | काभ्रे समाचार
        </title>
        <meta
          name="description"
          content={`${category?.name?.np || slug} सम्बन्धी ताजा समाचार। काभ्रे समाचार - काभ्रेपलाञ्चोकको विश्वसनीय समाचार पोर्टल।`}
        />
      </Helmet>

      <main className="container-custom py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold border-l-4 border-[var(--color-primary)] pl-4">
            {category?.name?.np || slug}
          </h1>
          {category?.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2 pl-5">
              {category.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News Grid */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <div className="h-48 skeleton" />
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <div className="h-4 skeleton rounded mb-2" />
                      <div className="h-4 skeleton rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : news.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {news.map((item) => (
                    <NewsCard key={item._id} news={item} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      अघिल्लो
                    </button>
                    <span className="px-4 py-2">
                      पृष्ठ {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      पछिल्लो
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500">
                  यस वर्गमा कुनै समाचार छैन।
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <TrendingSidebar />
          </aside>
        </div>
      </main>
    </>
  );
};

export default CategoryPage;
