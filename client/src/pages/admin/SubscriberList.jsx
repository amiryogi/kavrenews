import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Mail, Calendar, Check, X } from 'lucide-react';
import { subscriberAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatBsDate } from '../../utils/nepaliDate';

const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSubscribers();
  }, [page]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data } = await subscriberAPI.getAll({ page, limit: 20 });
      setSubscribers(data.data);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
      toast.error('सदस्यहरू लोड गर्न असफल');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`"${email}" लाई हटाउने हो?`)) return;

    try {
      await subscriberAPI.delete(id);
      toast.success('सदस्य हटाइयो');
      setSubscribers(subscribers.filter((s) => s._id !== id));
    } catch (error) {
      toast.error('हटाउन असफल');
    }
  };

  return (
    <>
      <Helmet>
        <title>सदस्य व्यवस्थापन | काभ्रे समाचार</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">सदस्य व्यवस्थापन</h1>
            <p className="text-gray-600 text-lg mt-1">
              न्यूजलेटर सदस्यहरूको सूची ({subscribers.length})
            </p>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">इमेल</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">नाम</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">दर्ता मिति</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">स्थिति</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">कार्यहरू</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="h-4 skeleton rounded w-48" /></td>
                      <td className="px-6 py-4"><div className="h-4 skeleton rounded w-24" /></td>
                      <td className="px-6 py-4"><div className="h-4 skeleton rounded w-32" /></td>
                      <td className="px-6 py-4"><div className="h-4 skeleton rounded w-16" /></td>
                      <td className="px-6 py-4"><div className="h-4 skeleton rounded w-10 ml-auto" /></td>
                    </tr>
                  ))
                ) : subscribers.length > 0 ? (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 font-medium">{subscriber.email}</td>
                      <td className="px-6 py-4 text-gray-600">{subscriber.name || '-'}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatBsDate(subscriber.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${subscriber.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {subscriber.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(subscriber._id, subscriber.email)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="हटाउनुहोस्"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">कुनै सदस्य छैन</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50 hover:bg-gray-200"
              >
                अघिल्लो
              </button>
              <span className="px-4 text-gray-700">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50 hover:bg-gray-200"
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

export default SubscriberList;
