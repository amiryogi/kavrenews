import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import NewsDetail from './pages/public/NewsDetail';
import CategoryPage from './pages/public/CategoryPage';
import SearchResults from './pages/public/SearchResults';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import NewsList from './pages/admin/NewsList';
import NewsForm from './pages/admin/NewsForm';
import CommentsList from './pages/admin/CommentsList';
import UsersList from './pages/admin/UsersList';
import CategoryList from './pages/admin/CategoryList';
import MediaLibrary from './pages/admin/MediaLibrary';
import SubscriberList from './pages/admin/SubscriberList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/news/:slug" element={<NewsDetail />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/search" element={<SearchResults />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="news" element={<NewsList />} />
                <Route path="news/create" element={<NewsForm />} />
                <Route path="news/edit/:id" element={<NewsForm />} />
                <Route path="comments" element={<CommentsList />} />
                <Route path="categories" element={<CategoryList />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="subscribers" element={<SubscriberList />} />
                <Route path="users" element={<UsersList />} />
              </Route>

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-[var(--color-primary)]">404</h1>
                      <p className="text-xl mt-4">पृष्ठ फेला परेन</p>
                      <a href="/" className="btn-primary mt-6 inline-block">
                        गृहपृष्ठमा फर्कनुहोस्
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </BrowserRouter>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
