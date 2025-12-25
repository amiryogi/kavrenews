import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { newsAPI, categoryAPI } from '../../services/api';
import { toast } from 'react-toastify';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [newsRes, catRes] = await Promise.all([
          newsAPI.getAllAdmin({ page, limit: 10, ...filters }),
          categoryAPI.getAll(),
        ]);
        setNews(newsRes.data.data);
        setTotalPages(newsRes.data.pages);
        setCategories(catRes.data.data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        toast.error('समाचार लोड गर्न असफल');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, filters]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" मेटाउने हो?`)) return;

    try {
      await newsAPI.delete(id);
      toast.success('समाचार मेटियो');
      setNews(news.filter((n) => n._id !== id));
    } catch (error) {
      toast.error('मेटाउन असफल');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ne-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      archived: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    const labels = {
      published: 'प्रकाशित',
      draft: 'ड्राफ्ट',
      archived: 'संग्रहित',
    };
    return (
      <span className={`badge ${styles[status]}`}>{labels[status]}</span>
    );
  };

  return (
    <>
      <Helmet>
        <title>समाचार व्यवस्थापन | काभ्रे समाचार</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">समाचार व्यवस्थापन</h1>
          <Link to="/admin/news/create" className="btn-primary">
            <Plus size={18} />
            नयाँ समाचार
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="समाचार खोज्नुहोस्..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input w-full md:w-40"
            >
              <option value="">सबै स्थिति</option>
              <option value="published">प्रकाशित</option>
              <option value="draft">ड्राफ्ट</option>
              <option value="archived">संग्रहित</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input w-full md:w-48"
            >
              <option value="">सबै वर्ग</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name.np}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* News Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium">समाचार</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">वर्ग</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">स्थिति</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">हेराइ</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">मिति</th>
                  <th className="text-right px-6 py-4 text-sm font-medium">कार्य</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4" colSpan={6}>
                        <div className="h-4 skeleton rounded" />
                      </td>
                    </tr>
                  ))
                ) : news.length > 0 ? (
                  news
                    .filter((n) =>
                      search
                        ? n.title.toLowerCase().includes(search.toLowerCase())
                        : true
                    )
                    .map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.featuredImage?.url || '/placeholder.jpg'}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium line-clamp-1 max-w-xs">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.author?.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {item.category?.name?.np || '-'}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.viewCount || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {item.status === 'published' && (
                              <a
                                href={`/news/${item.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-500 hover:text-[var(--color-primary)] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="हेर्नुहोस्"
                              >
                                <Eye size={18} />
                              </a>
                            )}
                            <Link
                              to={`/admin/news/edit/${item._id}`}
                              className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                              title="सम्पादन"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(item._id, item.title)}
                              className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                              title="मेटाउनुहोस्"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      कुनै समाचार छैन
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
              >
                अघिल्लो
              </button>
              <span className="px-4">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
              >
                पछिल्लो
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsList;
