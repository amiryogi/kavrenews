import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { NewsCard } from '../../components/common/NewsCard';
import { newsAPI } from '../../services/api';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!query) return;

    const searchNews = async () => {
      setLoading(true);
      try {
        const { data } = await newsAPI.search({ q: query, page, limit: 12 });
        setNews(data.data);
        setTotalPages(data.pages);
        setTotal(data.total);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };
    searchNews();
  }, [query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
      setPage(1);
    }
  };

  return (
    <>
      <Helmet>
        <title>खोज: {query} | काभ्रे समाचार</title>
      </Helmet>

      <main className="container-custom py-8">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-center mb-6">समाचार खोज्नुहोस्</h1>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="समाचार खोज्नुहोस्..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input py-3 pl-12"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <button type="submit" className="btn-primary px-6">
              खोज्नुहोस्
            </button>
          </form>
        </div>

        {/* Results */}
        {query && (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-bold text-[var(--color-text)]">"{query}"</span> को लागि{' '}
                <span className="font-bold text-[var(--color-primary)]">{total}</span> परिणामहरू
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-xl text-gray-500 mb-4">
                  कुनै परिणाम फेला परेन।
                </p>
                <p className="text-gray-400">
                  कृपया अर्को शब्द प्रयोग गरी खोज्नुहोस्।
                </p>
              </div>
            )}
          </>
        )}

        {!query && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">
              माथिको खोज बाकसमा शब्द लेखेर खोज्नुहोस्।
            </p>
          </div>
        )}
      </main>
    </>
  );
};

export default SearchResults;
