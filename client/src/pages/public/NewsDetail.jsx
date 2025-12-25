import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Clock,
  Eye,
  User,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  ChevronLeft,
} from 'lucide-react';
import { newsAPI, commentAPI } from '../../services/api';
import { NewsCard } from '../../components/common/NewsCard';
import { toast } from 'react-toastify';

import { formatBsDate } from '../../utils/nepaliDate';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const adDate = date.toLocaleDateString('ne-NP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const bsDate = formatBsDate(dateString);
  return `${bsDate} (${adDate})`;
};

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data } = await newsAPI.getBySlug(slug);
        setNews(data.data);

        // Fetch related and comments
        const [relatedRes, commentsRes] = await Promise.all([
          newsAPI.getRelated(data.data._id, 4),
          commentAPI.getByNews(data.data._id),
        ]);
        setRelated(relatedRes.data.data);
        setComments(commentsRes.data.data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.email || !commentForm.content) {
      toast.error('कृपया सबै फिल्ड भर्नुहोस्');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await commentAPI.create({
        ...commentForm,
        news: news._id,
      });
      toast.success(data.message);
      setCommentForm({ name: '', email: '', content: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'टिप्पणी पठाउन असफल');
    } finally {
      setSubmitting(false);
    }
  };

  const shareUrl = window.location.href;

  const handleShare = (platform) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${news?.title}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <main className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 skeleton rounded w-3/4 mb-4" />
          <div className="h-96 skeleton rounded-xl mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 skeleton rounded" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!news) {
    return (
      <main className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">समाचार फेला परेन</h1>
        <Link to="/" className="btn-primary">
          गृहपृष्ठमा फर्कनुहोस्
        </Link>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{news.seo?.metaTitle || news.title} | काभ्रे समाचार</title>
        <meta
          name="description"
          content={news.seo?.metaDescription || news.excerpt}
        />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.excerpt} />
        <meta property="og:image" content={news.featuredImage?.url} />
        <meta property="og:url" content={shareUrl} />
      </Helmet>

      <main className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] mb-6"
          >
            <ChevronLeft size={18} />
            गृहपृष्ठमा फर्कनुहोस्
          </Link>

          {/* Category Badge */}
          {news.category && (
            <Link
              to={`/category/${news.category.slug}`}
              className="badge badge-primary mb-4"
            >
              {news.category.name?.np || news.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{news.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            {news.author && (
              <span className="flex items-center gap-1">
                <User size={16} />
                {news.author.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {formatDate(news.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={16} />
              {news.viewCount} पटक हेरिएको
            </span>
          </div>

          {/* Featured Image */}
          <figure className="mb-8">
            <img
              src={news.featuredImage?.url}
              alt={news.title}
              className="w-full rounded-xl"
            />
            {news.featuredImage?.caption && (
              <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                {news.featuredImage.caption}
              </figcaption>
            )}
          </figure>

          {/* Excerpt */}
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 font-medium">
            {news.excerpt}
          </p>

          {/* Content */}
          <div
            className="prose max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {news.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/search?q=${tag}`}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Social Share */}
          <div className="flex items-center gap-4 mb-12 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <span className="flex items-center gap-2 font-medium">
              <Share2 size={18} />
              साझा गर्नुहोस्:
            </span>
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              aria-label="Share on Facebook"
            >
              <Facebook size={18} />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600"
              aria-label="Share on Twitter"
            >
              <Twitter size={18} />
            </button>
          </div>

          {/* Comments Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle size={24} />
              टिप्पणीहरू ({comments.length})
            </h2>

            {/* Comment Form */}
            <form
              onSubmit={handleCommentSubmit}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mb-8"
            >
              <h3 className="font-bold mb-4">टिप्पणी लेख्नुहोस्</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="तपाईंको नाम"
                  value={commentForm.name}
                  onChange={(e) =>
                    setCommentForm({ ...commentForm, name: e.target.value })
                  }
                  className="input"
                />
                <input
                  type="email"
                  placeholder="तपाईंको इमेल"
                  value={commentForm.email}
                  onChange={(e) =>
                    setCommentForm({ ...commentForm, email: e.target.value })
                  }
                  className="input"
                />
              </div>
              <textarea
                placeholder="तपाईंको टिप्पणी..."
                rows={4}
                value={commentForm.content}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, content: e.target.value })
                }
                className="input mb-4"
              />
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'पठाउँदै...' : 'टिप्पणी पठाउनुहोस्'}
              </button>
            </form>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold">{comment.name}</h4>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                अहिलेसम्म कुनै टिप्पणी छैन। पहिलो हुनुहोस्!
              </p>
            )}
          </section>

          {/* Related News */}
          {related.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 border-l-4 border-[var(--color-primary)] pl-4">
                सम्बन्धित समाचार
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((item) => (
                  <NewsCard key={item._id} news={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default NewsDetail;
