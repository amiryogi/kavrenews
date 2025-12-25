import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.email, form.password);
      toast.success('सफलतापूर्वक लग इन भयो!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'लग इन असफल');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>एडमिन लग इन | काभ्रे समाचार</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              काभ्रे<span className="text-[var(--color-primary)]">समाचार</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              एडमिन ड्यासबोर्डमा लग इन गर्नुहोस्
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            {error && (
              <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">इमेल</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">पासवर्ड</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3"
              >
                {loading ? (
                  'लग इन हुँदैछ...'
                ) : (
                  <>
                    <LogIn size={18} />
                    लग इन गर्नुहोस्
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            © {new Date().getFullYear()} काभ्रे समाचार। सर्वाधिकार सुरक्षित।
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
