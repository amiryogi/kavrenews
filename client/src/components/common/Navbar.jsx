import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import { categoryAPI } from '../../services/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await categoryAPI.getAll();
        setCategories(data.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header>
      {/* Top Bar - Primary Dark - Scrolls away */}
      <div className="bg-primary-800 text-white">
        <div className="container-custom flex items-center justify-between py-1.5 md:py-2">
          <span className="text-sm font-medium">
            {new Date().toLocaleDateString('ne-NP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </span>
          <div className="flex gap-4 text-sm">
            <Link to="/about" className="hover:text-accent-400">
              हाम्रो बारेमा
            </Link>
            <Link to="/contact" className="hover:text-accent-400">
              सम्पर्क
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar - Primary Base - STICKY */}
      <div
        className={`sticky top-0 z-50 bg-primary-600 transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <h1 className="text-2xl md:text-3xl font-bold text-white transition-transform group-hover:scale-105">
                काभ्रे<span className="text-accent-400">समाचार</span>
              </h1>
            </Link>

            {/* Desktop Search */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block w-72 lg:w-96 relative">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="समाचार खोज्नुहोस्..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 px-4 pr-10 text-sm rounded-full bg-white/95 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary-600"
                  >
                    <Search size={18} />
                  </button>
                </form>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                title={isDark ? 'Light Mode' : 'Dark Mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Category Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 py-2 border-t border-primary-500 overflow-x-auto">
            <Link
              to="/"
              className="px-4 py-1.5 text-base font-semibold text-white hover:text-accent-400 whitespace-nowrap transition-colors"
            >
              गृहपृष्ठ
            </Link>
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="px-4 py-1.5 text-base font-semibold text-white hover:text-accent-400 whitespace-nowrap transition-colors"
              >
                {category.name.np}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-primary-600 border-t border-primary-500">
          <div className="container-custom py-5">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="समाचार खोज्नुहोस्..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 px-5 pr-12 text-base rounded-full bg-white text-gray-800"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <Search size={22} />
                </button>
              </div>
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                className="px-5 py-4 text-lg font-semibold text-white rounded-lg hover:bg-primary-700"
                onClick={() => setIsMenuOpen(false)}
              >
                गृहपृष्ठ
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="px-5 py-4 text-lg font-semibold text-white rounded-lg hover:bg-primary-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name.np}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
