import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Trash2, Image, Copy, Check } from 'lucide-react';
import { mediaAPI } from '../../services/api';
import { toast } from 'react-toastify';

const MediaLibrary = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data } = await mediaAPI.getAll();
      setMedia(data.data);
    } catch (error) {
      console.error('Failed to fetch media:', error);
      toast.error('मिडिया लोड गर्न असफल');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await mediaAPI.upload(formData);
      toast.success('मिडिया अपलोड भयो');
      setMedia([data.data, ...media]);
    } catch (error) {
      toast.error('अपलोड असफल');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('यो मिडिया मेटाउने हो?')) return;

    try {
      await mediaAPI.delete(id);
      toast.success('मिडिया मेटियो');
      setMedia(media.filter((m) => m._id !== id));
    } catch (error) {
      toast.error('मेटाउन असफल');
    }
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.info('URL कपी भयो');
  };

  return (
    <>
      <Helmet>
        <title>मिडिया लाइब्रेरी | काभ्रे समाचार</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">मिडिया लाइब्रेरी</h1>
            <p className="text-gray-600 text-lg mt-1">
              तस्विर र भिडियोहरू व्यवस्थापन गर्नुहोस्
            </p>
          </div>
          <label className="btn-primary cursor-pointer">
            <Upload size={20} />
            {uploading ? 'अपलोड हुँदै...' : 'नयाँ अपलोड'}
            <input
              type="file"
              onChange={handleUpload}
              className="hidden"
              accept="image/*,video/*"
              disabled={uploading}
            />
          </label>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading ? (
            [...Array(10)].map((_, i) => (
              <div key={i} className="aspect-square skeleton rounded-xl" />
            ))
          ) : media.length > 0 ? (
            media.map((item) => (
              <div
                key={item._id}
                className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200"
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title || 'Media'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <button
                    onClick={() => copyToClipboard(item.url, item._id)}
                    className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-transform hover:scale-110"
                    title="URL कपी गर्नुहोस्"
                  >
                    {copiedId === item._id ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110"
                    title="मेटाउनुहोस्"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
              <Image size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">कुनै मिडिया छैन</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MediaLibrary;
