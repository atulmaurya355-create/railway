import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, BookmarkIcon, Share2 } from 'lucide-react';
import { currentAffairsService } from '../features/currentAffairs/currentAffairsService.js';

export const CurrentAffairsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [affair, setAffair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchAffair = async () => {
      try {
        setLoading(true);
        const response = await currentAffairsService.getAffairsById(id);
        setAffair(response.data.affairs);
        setError(null);
      } catch (err) {
        setError('Failed to load current affairs details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAffair();
  }, [id]);

  const handleSave = () => {
    setSaved(!saved);
    // TODO: Implement save functionality
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: affair?.title,
        text: affair?.description,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin inline-flex h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !affair) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-700 dark:text-red-400">
            {error || 'Current affairs not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Current Affairs
        </button>

        {/* Main Content */}
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          {affair.imageUrl && (
            <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
              <img
                src={affair.imageUrl}
                alt={affair.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {affair.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar size={18} />
                <span>{new Date(affair.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Eye size={18} />
                <span>{affair.views || 0} views</span>
              </div>
              <div className="flex gap-2">
                {affair.category && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded">
                    {affair.category}
                  </span>
                )}
                {affair.importance && (
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      affair.importance === 'high'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : affair.importance === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }`}
                  >
                    {affair.importance.toUpperCase()} IMPORTANCE
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  saved
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <BookmarkIcon size={18} />
                {saved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Overview</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {affair.description}
              </p>
            </div>

            {/* Content */}
            <div className="mb-8 prose prose-invert dark:prose-invert max-w-none">
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {affair.content}
              </div>
            </div>

            {/* Key Points */}
            {affair.keyPoints && affair.keyPoints.length > 0 && (
              <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Key Points
                </h3>
                <ul className="space-y-2">
                  {affair.keyPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Topics */}
            {affair.relatedTopics && affair.relatedTopics.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {affair.relatedTopics.map((topic, index) => (
                    <Link
                      key={index}
                      to={`/current-affairs?search=${topic}`}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      {topic}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Source */}
            {affair.source && (
              <div className="text-sm text-slate-500 dark:text-slate-400 pt-6 border-t border-slate-200 dark:border-slate-700">
                <strong>Source:</strong> {affair.source}
              </div>
            )}
          </div>
        </article>

        {/* Related Quiz Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Test Your Knowledge
          </h2>
          <Link
            to="/current-affairs/quiz"
            className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2">Current Affairs Quiz</h3>
            <p className="text-blue-100">Challenge yourself with curated quizzes based on the latest current affairs</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairsDetailPage;
