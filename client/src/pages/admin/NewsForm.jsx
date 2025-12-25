import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import { newsAPI, categoryAPI, mediaAPI } from '../../services/api';
import { toast } from 'react-toastify';

const NewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft',
    isFeatured: false,
    isBreaking: false,
    featuredImage: { url: '', publicId: '', caption: '' },
    seo: { metaTitle: '', metaDescription: '', keywords: '' },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await categoryAPI.getAll();
        setCategories(catRes.data.data);

        if (isEdit) {
          const { data } = await newsAPI.getAllAdmin({ limit: 100 });
          const news = data.data.find((n) => n._id === id);
          if (news) {
            setForm({
              title: news.title,
              excerpt: news.excerpt,
              content: news.content,
              category: news.category?._id || '',
              tags: news.tags?.join(', ') || '',
              status: news.status,
              isFeatured: news.isFeatured,
              isBreaking: news.isBreaking,
              featuredImage: news.featuredImage || { url: '', publicId: '', caption: '' },
              seo: {
                metaTitle: news.seo?.metaTitle || '',
                metaDescription: news.seo?.metaDescription || '',
                keywords: news.seo?.keywords?.join(', ') || '',
              },
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('डाटा लोड गर्न असफल');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await mediaAPI.upload(formData);
      setForm({
        ...form,
        featuredImage: {
          url: data.data.url,
          publicId: data.data.publicId,
          caption: '',
        },
      });
      toast.success('तस्विर अपलोड भयो');
    } catch (error) {
      toast.error('तस्विर अपलोड असफल');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title || !form.excerpt || !form.content || !form.category) {
      toast.error('कृपया सबै आवश्यक फिल्ड भर्नुहोस्');
      return;
    }

    if (!form.featuredImage?.url) {
      toast.error('कृपया मुख्य तस्विर अपलोड गर्नुहोस्');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        seo: {
          ...form.seo,
          keywords: form.seo.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        },
      };

      if (isEdit) {
        await newsAPI.update(id, payload);
        toast.success('समाचार अपडेट भयो');
      } else {
        await newsAPI.create(payload);
        toast.success('समाचार सिर्जना भयो');
      }
      navigate('/admin/news');
    } catch (error) {
      toast.error(error.response?.data?.message || 'सेभ गर्न असफल');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'समाचार सम्पादन' : 'नयाँ समाचार'} | काभ्रे समाचार</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/news')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">
            {isEdit ? 'समाचार सम्पादन' : 'नयाँ समाचार'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                शीर्षक <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input"
                placeholder="समाचारको शीर्षक"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                सारांश <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="input"
                rows={3}
                placeholder="समाचारको छोटो सारांश"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                विवरण <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="input font-mono"
                rows={12}
                placeholder="समाचारको पूर्ण विवरण (HTML समर्थित)"
                required
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium mb-2">
                मुख्य तस्विर <span className="text-red-500">*</span>
              </label>
              {form.featuredImage?.url ? (
                <div className="relative inline-block">
                  <img
                    src={form.featuredImage.url}
                    alt="Featured"
                    className="h-48 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        featuredImage: { url: '', publicId: '', caption: '' },
                      })
                    }
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[var(--color-primary)]">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-gray-500">
                    {uploading ? 'अपलोड हुँदैछ...' : 'तस्विर छान्नुहोस्'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">तस्विर क्याप्सन</label>
              <input
                type="text"
                value={form.featuredImage?.caption || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    featuredImage: { ...form.featuredImage, caption: e.target.value },
                  })
                }
                className="input"
                placeholder="तस्विरको विवरण"
              />
            </div>
          </div>

          {/* Sidebar Options */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  वर्ग <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">वर्ग छान्नुहोस्</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name.np}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">स्थिति</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input"
                >
                  <option value="draft">ड्राफ्ट</option>
                  <option value="published">प्रकाशित</option>
                  <option value="archived">संग्रहित</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ट्यागहरू</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="input"
                placeholder="ट्याग1, ट्याग2, ट्याग3"
              />
              <p className="text-xs text-gray-500 mt-1">कमाले छुट्ट्याउनुहोस्</p>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded text-[var(--color-primary)]"
                />
                <span>फिचर्ड समाचार</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isBreaking}
                  onChange={(e) => setForm({ ...form, isBreaking: e.target.checked })}
                  className="w-5 h-5 rounded text-[var(--color-primary)]"
                />
                <span>ब्रेकिंग न्यूज</span>
              </label>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-bold text-lg">SEO सेटिङ</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Meta Title</label>
              <input
                type="text"
                value={form.seo.metaTitle}
                onChange={(e) =>
                  setForm({ ...form, seo: { ...form.seo, metaTitle: e.target.value } })
                }
                className="input"
                placeholder="SEO को लागि शीर्षक"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <textarea
                value={form.seo.metaDescription}
                onChange={(e) =>
                  setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })
                }
                className="input"
                rows={2}
                placeholder="SEO को लागि विवरण"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Keywords</label>
              <input
                type="text"
                value={form.seo.keywords}
                onChange={(e) =>
                  setForm({ ...form, seo: { ...form.seo, keywords: e.target.value } })
                }
                className="input"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/news')}
              className="btn-secondary"
            >
              रद्द गर्नुहोस्
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              <Save size={18} />
              {saving ? 'सेभ हुँदैछ...' : isEdit ? 'अपडेट गर्नुहोस्' : 'प्रकाशित गर्नुहोस्'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewsForm;
