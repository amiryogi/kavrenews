import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, FolderTree, X, Check } from 'lucide-react';
import { categoryAPI } from '../../services/api';
import { toast } from 'react-toastify';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({
    nameNp: '',
    nameEn: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await categoryAPI.getAllAdmin();
      setCategories(data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('वर्गहरू लोड गर्न असफल');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setForm({
        nameNp: category.name.np,
        nameEn: category.name.en,
        order: category.order || 0,
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setForm({
        nameNp: '',
        nameEn: '',
        order: categories.length + 1,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nameNp || !form.nameEn) {
      toast.error('कृपया दुबै नाम भर्नुहोस्');
      return;
    }

    try {
      const payload = {
        name: {
          np: form.nameNp,
          en: form.nameEn,
        },
        order: parseInt(form.order),
        isActive: form.isActive,
      };

      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, payload);
        toast.success('वर्ग अपडेट भयो');
      } else {
        await categoryAPI.create(payload);
        toast.success('वर्ग सिर्जना भयो');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'सेभ गर्न असफल');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" र यस अन्तर्गतका समाचारहरू मेटाउने हो?`)) return;

    try {
      await categoryAPI.delete(id);
      toast.success('वर्ग मेटियो');
      setCategories(categories.filter((c) => c._id !== id));
    } catch (error) {
      toast.error('मेटाउन असफल');
    }
  };

  return (
    <>
      <Helmet>
        <title>वर्ग व्यवस्थापन | काभ्रे समाचार</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">वर्ग व्यवस्थापन</h1>
            <p className="text-gray-600 text-lg mt-1">
              समाचारका वर्गहरू (Categories) व्यवस्थापन गर्नुहोस्
            </p>
          </div>
          <button onClick={() => openModal()} className="btn-primary">
            <Plus size={20} />
            नयाँ वर्ग
          </button>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">क्रम</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">नेपाली नाम</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">अंग्रेजी नाम</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">स्लग (Slug)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">स्थिति</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">कार्यहरू</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="h-4 skeleton rounded w-8" /></td>
                      <td className="px-6 py-4"><div className="h-4 skeleton rounded w-24" /></td>
                      <td className="px-6 py-4"><div className="h-4 skeleton rounded w-24" /></td>
                      <td className="px-6 py-4"><div className="h-4 skeleton rounded w-20" /></td>
                      <td className="px-6 py-4"><div className="h-4 skeleton rounded w-16" /></td>
                      <td className="px-6 py-4"><div className="h-4 skeleton rounded w-20 ml-auto" /></td>
                    </tr>
                  ))
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 font-medium">#{category.order}</td>
                      <td className="px-6 py-4 text-gray-900 font-bold">{category.name.np}</td>
                      <td className="px-6 py-4 text-gray-600">{category.name.en}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-sm">{category.slug}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {category.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="सम्पादन"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id, category.name.np)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
                      <FolderTree size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">कुनै वर्ग छैन</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'वर्ग सम्पादन' : 'नयाँ वर्ग'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block font-medium mb-2">नेपाली नाम *</label>
                <input
                  type="text"
                  value={form.nameNp}
                  onChange={(e) => setForm({ ...form, nameNp: e.target.value })}
                  className="input font-bold"
                  placeholder="जस्तै: राजनीति"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-2">अंग्रेजी नाम *</label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  className="input font-sans"
                  placeholder="e.g. Politics"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-2">देखिने क्रम (Order)</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="input"
                  min="0"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-5 h-5 rounded text-red-600"
                  />
                  <span>सक्रिय (Active)</span>
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
                  {editingCategory ? 'अपडेट गर्नुहोस्' : 'सिर्जना गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryList;
