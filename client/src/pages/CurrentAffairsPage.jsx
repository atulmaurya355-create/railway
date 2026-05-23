import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, Search, ChevronRight } from 'lucide-react';
import { currentAffairsService } from '../features/currentAffairs/currentAffairsService.js';

const AFFAIR_TYPES = [
  { id: 'daily', label: 'Daily', icon: Clock },
  { id: 'weekly', label: 'Weekly', icon: TrendingUp },
  { id: 'monthly', label: 'Monthly', icon: Calendar },
];

const CATEGORIES = [
  'governance',
  'economy',
  'defence',
  'sports',
  'sciencetech',
  'international',
  'national',
  'other',
];

export const CurrentAffairsPage = () => {
  const [affairs, setAffairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('daily');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    const fetchAffairs = async () => {
      try {
        setLoading(true);
        const params = {
          affairsType: selectedType,
          limit: pagination.limit,
          page: pagination.page,
        };
        if (selectedCategory) params.category = selectedCategory;

        const response = await currentAffairsService.getAffairsList(params);
        setAffairs(response.data.affairs);
        setPagination(response.data.pagination);
        setError(null);
      } catch (err) {
        setError('Failed to load current affairs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAffairs();
  }, [selectedType, selectedCategory, pagination.page]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await currentAffairsService.searchAffairs(searchQuery, {
        affairsType: selectedType,
        limit: pagination.limit,
        page: 1,
      });
      setAffairs(response.data.affairs);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Current Affairs
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Stay updated with latest current affairs for railway exams
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search current affairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {AFFAIR_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedType(type.id);
                setPagination({ ...pagination, page: 1 });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <type.icon size={18} />
              {type.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Affairs List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin inline-flex h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : affairs.length > 0 ? (
          <div className="space-y-6">
            {affairs.map((affair) => (
              <Link
                key={affair._id}
                to={`/current-affairs/${affair._id}`}
                className="block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {affair.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                      {affair.description}
                    </p>
                  </div>
                  <ChevronRight className="text-slate-400 flex-shrink-0" />
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
                    {affair.category}
                  </span>
                  {affair.importance && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        affair.importance === 'high'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : affair.importance === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      }`}
                    >
                      {affair.importance.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-4">
                    <span>{new Date(affair.date).toLocaleDateString()}</span>
                    <span>{affair.views || 0} views</span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: Math.max(1, pagination.page - 1),
                    })
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: Math.min(pagination.totalPages, pagination.page + 1),
                    })
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No current affairs found
            </p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/current-affairs/quiz"
            className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Current Affairs Quiz</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Test your knowledge</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairsPage;
