import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FileText,
  Eye,
  TrendingUp,
  Users,
  MessageCircle,
  Plus,
} from 'lucide-react';
import { newsAPI, commentAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link
    to={to}
    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
  >
    <div className="flex items-center gap-4">
      <div
        className={`p-4 rounded-xl ${color}`}
      >
        <Icon size={28} className="text-white" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-gray-600 text-base font-medium">{label}</p>
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalNews: 0,
    totalViews: 0,
    pendingComments: 0,
    totalUsers: 0,
  });
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const newsRes = await newsAPI.getAllAdmin({ limit: 5 });
        setRecentNews(newsRes.data.data);

        let totalViews = 0;
        newsRes.data.data.forEach((n) => {
          totalViews += n.viewCount || 0;
        });

        const newStats = {
          totalNews: newsRes.data.total,
          totalViews,
          pendingComments: 0,
          totalUsers: 0,
        };

        try {
          const commentsRes = await commentAPI.getAll({ isApproved: 'false', limit: 1 });
          newStats.pendingComments = commentsRes.data.total;
        } catch {}

        if (isAdmin) {
          try {
            const usersRes = await userAPI.getAll();
            newStats.totalUsers = usersRes.data.count;
          } catch {}
        }

        setStats(newStats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isAdmin]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ne-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>ड्यासबोर्ड | काभ्रे समाचार</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ड्यासबोर्ड</h1>
            <p className="text-gray-600 text-lg mt-1">
              स्वागत छ! यहाँ तपाईंको समाचार पोर्टलको सारांश छ।
            </p>
          </div>
          <Link to="/admin/news/create" className="btn-primary text-base">
            <Plus size={20} />
            नयाँ समाचार
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FileText}
            label="कुल समाचार"
            value={loading ? '-' : stats.totalNews}
            color="bg-blue-500"
            to="/admin/news"
          />
          <StatCard
            icon={Eye}
            label="कुल हेराइ"
            value={loading ? '-' : stats.totalViews}
            color="bg-green-500"
            to="/admin/news"
          />
          <StatCard
            icon={MessageCircle}
            label="पेन्डिङ टिप्पणी"
            value={loading ? '-' : stats.pendingComments}
            color="bg-amber-500"
            to="/admin/comments"
          />
          {isAdmin && (
            <StatCard
              icon={Users}
              label="प्रयोगकर्ता"
              value={loading ? '-' : stats.totalUsers}
              color="bg-purple-500"
              to="/admin/users"
            />
          )}
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">हालका समाचारहरू</h2>
            <Link
              to="/admin/news"
              className="text-red-600 hover:underline text-base font-medium"
            >
              सबै हेर्नुहोस्
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-base font-semibold text-gray-700">शीर्षक</th>
                  <th className="text-left px-6 py-4 text-base font-semibold text-gray-700">स्थिति</th>
                  <th className="text-left px-6 py-4 text-base font-semibold text-gray-700">हेराइ</th>
                  <th className="text-left px-6 py-4 text-base font-semibold text-gray-700">मिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div className="h-4 skeleton rounded w-3/4" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 skeleton rounded w-16" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 skeleton rounded w-12" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 skeleton rounded w-24" />
                      </td>
                    </tr>
                  ))
                ) : recentNews.length > 0 ? (
                  recentNews.map((news) => (
                    <tr key={news._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/news/edit/${news._id}`}
                          className="font-semibold text-gray-900 hover:text-red-600 line-clamp-1 text-base"
                        >
                          {news.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge ${
                            news.status === 'published'
                              ? 'badge-primary'
                              : news.status === 'draft'
                              ? 'bg-gray-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {news.status === 'published'
                            ? 'प्रकाशित'
                            : news.status === 'draft'
                            ? 'ड्राफ्ट'
                            : 'संग्रहित'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{news.viewCount || 0}</td>
                      <td className="px-6 py-4 text-gray-600 text-base">
                        {formatDate(news.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      कुनै समाचार छैन
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
