import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Image,
  Users,
  MessageCircle,
  Mail,
  LogOut,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'ड्यासबोर्ड', to: '/admin/dashboard' },
    { icon: FileText, label: 'समाचारहरू', to: '/admin/news' },
    { icon: FolderTree, label: 'वर्गहरू', to: '/admin/categories', adminOnly: true },
    { icon: Image, label: 'मिडिया', to: '/admin/media' },
    { icon: MessageCircle, label: 'टिप्पणीहरू', to: '/admin/comments' },
    { icon: Mail, label: 'सदस्यहरू', to: '/admin/subscribers', adminOnly: true },
    { icon: Users, label: 'प्रयोगकर्ता', to: '/admin/users', adminOnly: true },
  ];

  const filteredItems = menuItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-primary-800 text-white transition-all duration-300 z-50 shadow-xl ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-700">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold">
            काभ्रे<span className="text-accent-400">समाचार</span>
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-base text-white">{user?.name}</p>
              <p className="text-sm text-gray-300 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {filteredItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-base font-medium ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-primary-700 hover:text-white'
                  }`
                }
                title={item.label}
              >
                <item.icon size={22} />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900 text-red-400 hover:text-red-300 font-medium text-base"
          title="लग आउट"
        >
          <LogOut size={22} />
          {!isCollapsed && <span>लग आउट</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
