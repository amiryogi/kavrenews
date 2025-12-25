import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { subscriberAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('कृपया इमेल प्रविष्ट गर्नुहोस्');
      return;
    }

    setIsSubscribing(true);
    try {
      const { data } = await subscriberAPI.subscribe({ email });
      toast.success(data.message);
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'सदस्यता लिन असफल');
    } finally {
      setIsSubscribing(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'गृहपृष्ठ', to: '/' },
    { label: 'राजनीति', to: '/category/politics' },
    { label: 'समाज', to: '/category/society' },
    { label: 'खेलकुद', to: '/category/sports' },
    { label: 'मनोरञ्जन', to: '/category/entertainment' },
    { label: 'काभ्रे विशेष', to: '/category/kavre-special' },
  ];

  const aboutLinks = [
    { label: 'हाम्रो बारेमा', to: '/about' },
    { label: 'सम्पर्क', to: '/contact' },
    { label: 'गोपनीयता नीति', to: '/privacy' },
    { label: 'सेवाका सर्तहरू', to: '/terms' },
  ];

  return (
    <footer className="bg-primary-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-primary-700">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">न्यूजलेटर सदस्यता</h3>
              <p className="text-white/80">दैनिक समाचार अपडेट पाउनको लागि सदस्यता लिनुहोस्</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="तपाईंको इमेल ठेगाना"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input bg-white text-gray-900 flex-1 md:w-64"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="btn-secondary bg-primary-800 hover:bg-primary-900 whitespace-nowrap"
              >
                {isSubscribing ? 'पठाउँदै...' : 'सदस्यता लिनुहोस्'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold">
                काभ्रे<span className="text-accent-400">समाचार</span>
              </h2>
            </Link>
            <p className="text-gray-400 mb-6">
              काभ्रेपलाञ्चोक जिल्लाको विश्वसनीय समाचार पोर्टल। स्थानीय समाचार, राजनीति, खेलकुद र मनोरञ्जनको ताजा अपडेट।
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-primary-800 rounded-full hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-primary-800 rounded-full hover:bg-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-primary-800 rounded-full hover:bg-primary-600 transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">द्रुत लिंकहरू</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">जानकारी</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">सम्पर्क</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>काभ्रेपलाञ्चोक, बागमती प्रदेश, नेपाल</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="flex-shrink-0" />
                <span>+977-11-XXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="flex-shrink-0" />
                <span>info@kavrenews.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
            <p>© {currentYear} काभ्रे समाचार। सर्वाधिकार सुरक्षित।</p>
            <p>
              Developed with ❤️ for Kavrepanlanchok
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
