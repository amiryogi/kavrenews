import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Trash2, ExternalLink, MessageCircle, Clock } from 'lucide-react';
import { commentAPI } from '../../services/api';
import { toast } from 'react-toastify';

const CommentsList = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 15 };
        if (filter) params.isApproved = filter;
        
        const { data } = await commentAPI.getAll(params);
        setComments(data.data);
        setTotalPages(data.pages);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        toast.error('टिप्पणीहरू लोड गर्न असफल');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [page, filter]);

  const handleApprove = async (id) => {
    try {
      await commentAPI.approve(id);
      toast.success('टिप्पणी स्वीकृत भयो');
      setComments(comments.map((c) => 
        c._id === id ? { ...c, isApproved: true } : c
      ));
    } catch (error) {
      toast.error('स्वीकृत गर्न असफल');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('यो टिप्पणी मेटाउने हो?')) return;
    
    try {
      await commentAPI.delete(id);
      toast.success('टिप्पणी मेटियो');
      setComments(comments.filter((c) => c._id !== id));
    } catch (error) {
      toast.error('मेटाउन असफल');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ne-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Helmet>
        <title>टिप्पणी व्यवस्थापन | काभ्रे समाचार</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">टिप्पणी व्यवस्थापन</h1>
            <p className="text-gray-600 text-lg mt-1">
              पाठकहरूले पठाएका टिप्पणीहरू स्वीकृत वा मेटाउनुहोस्
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input w-48"
          >
            <option value="">सबै टिप्पणी</option>
            <option value="false">पेन्डिङ (स्वीकृत नभएको)</option>
            <option value="true">स्वीकृत भएको</option>
          </select>
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : comments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {comments.map((comment) => (
                <div key={comment._id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Comment Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          {comment.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                          <p className="text-sm text-gray-600">{comment.email}</p>
                        </div>
                        <span className={`ml-auto badge ${comment.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {comment.isApproved ? 'स्वीकृत' : 'पेन्डिङ'}
                        </span>
                      </div>

                      {/* Comment Content */}
                      <p className="text-gray-800 mb-3 text-base">{comment.content}</p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDate(comment.createdAt)}
                        </span>
                        {comment.news && (
                          <Link
                            to={`/news/${comment.news.slug}`}
                            target="_blank"
                            className="flex items-center gap-1 text-red-600 hover:underline"
                          >
                            <ExternalLink size={14} />
                            {comment.news.title?.slice(0, 50)}...
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!comment.isApproved && (
                        <button
                          onClick={() => handleApprove(comment._id)}
                          className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                          title="स्वीकृत गर्नुहोस्"
                        >
                          <Check size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        title="मेटाउनुहोस्"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">कुनै टिप्पणी छैन</p>
            </div>
          )}

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

export default CommentsList;
