import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, User, Mail, Shield, X, Upload, Check } from 'lucide-react';
import { userAPI, mediaAPI } from '../../services/api';
import { toast } from 'react-toastify';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'reporter',
    avatar: '',
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getAll();
      setUsers(data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('प्रयोगकर्ताहरू लोड गर्न असफल');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        avatar: user.avatar || '',
        isActive: user.isActive,
      });
    } else {
      setEditingUser(null);
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'reporter',
        avatar: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await mediaAPI.upload(formData);
      setForm({ ...form, avatar: data.data.url });
      toast.success('प्रोफाइल तस्विर अपलोड भयो');
    } catch (error) {
      toast.error('तस्विर अपलोड असफल');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email) {
      toast.error('कृपया नाम र इमेल भर्नुहोस्');
      return;
    }

    if (!editingUser && !form.password) {
      toast.error('कृपया पासवर्ड भर्नुहोस्');
      return;
    }

    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      if (editingUser) {
        await userAPI.update(editingUser._id, payload);
        toast.success('प्रयोगकर्ता अपडेट भयो');
      } else {
        await userAPI.create(payload);
        toast.success('प्रयोगकर्ता सिर्जना भयो');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'सेभ गर्न असफल');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" मेटाउने हो?`)) return;

    try {
      await userAPI.delete(id);
      toast.success('प्रयोगकर्ता मेटियो');
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      toast.error('मेटाउन असफल');
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-100 text-red-700',
      editor: 'bg-blue-100 text-blue-700',
      reporter: 'bg-green-100 text-green-700',
    };
    const labels = {
      admin: 'एडमिन',
      editor: 'सम्पादक',
      reporter: 'रिपोर्टर',
    };
    return <span className={`badge ${styles[role]}`}>{labels[role]}</span>;
  };

  return (
    <>
      <Helmet>
        <title>प्रयोगकर्ता व्यवस्थापन | काभ्रे समाचार</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">प्रयोगकर्ता व्यवस्थापन</h1>
            <p className="text-gray-600 text-lg mt-1">
              एडमिन, सम्पादक र रिपोर्टरहरू व्यवस्थापन गर्नुहोस्
            </p>
          </div>
          <button onClick={() => openModal()} className="btn-primary">
            <Plus size={20} />
            नयाँ प्रयोगकर्ता
          </button>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 skeleton rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 skeleton rounded w-3/4" />
                    <div className="h-4 skeleton rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {user.isActive && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{user.name}</h3>
                    <p className="text-gray-600 text-sm truncate flex items-center gap-1">
                      <Mail size={14} />
                      {user.email}
                    </p>
                    <div className="mt-2">{getRoleBadge(user.role)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openModal(user)}
                    className="flex-1 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <Edit size={16} />
                    सम्पादन
                  </button>
                  <button
                    onClick={() => handleDelete(user._id, user.name)}
                    className="flex-1 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} />
                    मेटाउनुहोस्
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-xl p-12 text-center shadow-md">
              <User size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-gray-500">कुनै प्रयोगकर्ता छैन</p>
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {editingUser ? 'प्रयोगकर्ता सम्पादन' : 'नयाँ प्रयोगकर्ता'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center">
                {form.avatar ? (
                  <div className="relative">
                    <img
                      src={form.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, avatar: '' })}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-red-500">
                    <Upload size={24} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">
                      {uploading ? 'अपलोड...' : 'तस्विर'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">नाम *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                  placeholder="पूरा नाम"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-2">इमेल *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  पासवर्ड {!editingUser && '*'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input"
                  placeholder={editingUser ? 'खाली छोड्नुहोस्' : '••••••••'}
                  required={!editingUser}
                />
                {editingUser && (
                  <p className="text-sm text-gray-500 mt-1">
                    परिवर्तन नगर्ने हो भने खाली छोड्नुहोस्
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">भूमिका</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="input"
                >
                  <option value="reporter">रिपोर्टर</option>
                  <option value="editor">सम्पादक</option>
                  <option value="admin">एडमिन</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-5 h-5 rounded text-red-600"
                  />
                  <span>सक्रिय खाता</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                >
                  रद्द गर्नुहोस्
                </button>
                <button type="submit" className="flex-1 btn-primary py-3">
                  {editingUser ? 'अपडेट गर्नुहोस्' : 'सिर्जना गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersList;
