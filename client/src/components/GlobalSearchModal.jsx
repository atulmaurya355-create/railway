import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  HelpCircle,
  FileDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  BookOpen,
  Sliders,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { searchService } from '../features/search/searchService.js';

export function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [type, setType] = useState('all');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [revealedAnswers, setRevealedAnswers] = useState({}); // { [questionId]: boolean }

  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // 1. Listen for global open requests (Custom Event) & Keyboard Shortcuts
  useEffect(() => {
    const handleOpenRequest = () => {
      setIsOpen(true);
    };

    const handleKeyDown = (e) => {
      // Toggle search on Ctrl + K or '/'
      if (
        (e.ctrlKey && e.key.toLowerCase() === 'k') ||
        (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('open-global-search', handleOpenRequest);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-global-search', handleOpenRequest);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 2. Keystroke Debounce Logic (300ms delay)
  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedQ(q);
    }, 300);

    return () => {
      window.clearTimeout(handler);
    };
  }, [q]);

  // Reset pagination page to 1 whenever search terms or types change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedQ, type, difficulty, category]);

  // 3. Fetch search results when parameters change
  useEffect(() => {
    if (!isOpen) return;

    const performSearch = async () => {
      setLoading(true);
      try {
        const queryParams = {
          q: debouncedQ,
          type,
          page: pagination.page,
          limit: pagination.limit,
        };

        if (difficulty) queryParams.difficulty = difficulty;
        if (category) queryParams.category = category;

        const response = await searchService.globalSearch(queryParams);
        if (response?.success) {
          setResults(response.data.results || []);
          setPagination(response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
        }
      } catch (error) {
        window.console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [isOpen, debouncedQ, type, difficulty, category, pagination.page, pagination.limit]);

  // Handle clicking outside the modal content to close it
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const toggleAnswerReveal = (id) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleItemNavigation = (item) => {
    setIsOpen(false);
    if (item.type === 'current_affair') {
      navigate(`/current-affairs/${item.id}`);
    } else if (item.type === 'note' || item.type === 'pdf') {
      navigate('/study-materials');
    } else if (item.type === 'question') {
      navigate('/quiz');
    }
  };

  const handlePdfDownload = (e, fileUrl) => {
    e.stopPropagation();
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-10 backdrop-blur-md transition-all duration-300 animate-fade-in sm:pt-20"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="flex h-full max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 animate-fade-up"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-200 p-4 dark:border-slate-800">
          <Search className="absolute left-6 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent py-2 pl-10 pr-24 text-base font-medium text-slate-950 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-slate-500"
            placeholder="Search questions, study notes, PDFs, current affairs..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="absolute right-4 flex items-center gap-2">
            <span className="hidden rounded bg-slate-100 px-2 py-0.5 text-xxs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:inline">
              ESC
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All', icon: Sparkles },
              { id: 'question', label: 'Questions', icon: HelpCircle },
              { id: 'note', label: 'Notes', icon: BookOpen },
              { id: 'pdf', label: 'PDFs', icon: FileDown },
              { id: 'current_affair', label: 'News', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setType(tab.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                  type === tab.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Sliders Toggle for Specific Filters */}
          <div className="flex items-center gap-2">
            {(type === 'all' || type === 'question') && (
              <div className="flex items-center gap-1">
                <Sliders className="h-3 w-3 text-slate-400" />
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-600 outline-none hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                >
                  <option value="">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            )}
            <input
              type="text"
              placeholder="Category..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-24 bg-transparent text-xs font-semibold text-slate-600 outline-none placeholder-slate-400 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
            />
          </div>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex h-40 flex-col items-center justify-center gap-3">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Searching resource records...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <Search className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">No match found</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Try refining your key phrase or adjusting the filters.
              </p>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemNavigation(item)}
                className="group relative block cursor-pointer rounded-lg border border-slate-200/70 bg-white p-4 shadow-sm transition hover:border-brand-500 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Header: Title and Type Pill */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xxs font-bold uppercase transition ${
                          item.type === 'question'
                            ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300'
                            : item.type === 'note'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                            : item.type === 'pdf'
                            ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300'
                            : 'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300'
                        }`}
                      >
                        {item.type === 'question' ? (
                          <HelpCircle className="h-3 w-3" />
                        ) : item.type === 'note' ? (
                          <BookOpen className="h-3 w-3" />
                        ) : item.type === 'pdf' ? (
                          <FileDown className="h-3 w-3" />
                        ) : (
                          <Calendar className="h-3 w-3" />
                        )}
                        {item.type.replace('_', ' ')}
                      </span>

                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-xxs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Main Title Content */}
                    <h3 className="mt-2 text-sm font-bold leading-6 text-slate-950 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>

                    {/* Subtitle / Description Snippet */}
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {item.subtitle}
                    </p>

                    {/* INTERACTIVE QUESTION LAYOUT */}
                    {item.type === 'question' && item.meta && (
                      <div
                        className="mt-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800/40 dark:bg-slate-900/40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => toggleAnswerReveal(item.id)}
                          className="flex items-center gap-1.5 text-xxs font-bold text-brand-600 hover:text-brand-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition"
                        >
                          <Eye className="h-3 w-3" />
                          {revealedAnswers[item.id] ? 'Hide Answer Options' : 'Reveal Answer & Explanation'}
                        </button>

                        {revealedAnswers[item.id] && (
                          <div className="mt-3 space-y-2 animate-fade-in">
                            <div className="grid gap-2 sm:grid-cols-2">
                              {Object.entries(item.meta.options).map(([key, val]) => {
                                const isCorrect = key === item.meta.correctAnswer;
                                return (
                                  <div
                                    key={key}
                                    className={`rounded-md border p-2 text-xs font-medium transition ${
                                      isCorrect
                                        ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-300'
                                        : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300'
                                    }`}
                                  >
                                    <span className="mr-1.5 font-bold uppercase">{key}.</span>
                                    {val}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-3 border-t border-slate-200/50 pt-2 dark:border-slate-800/50">
                              <p className="text-xxs font-bold text-emerald-600 dark:text-emerald-400">
                                Correct Answer: Option {item.meta.correctAnswer}
                              </p>
                              <p className="mt-1 text-xxs leading-5 text-slate-500 dark:text-slate-400">
                                <span className="font-bold">Explanation: </span>
                                {item.meta.explanation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* INTERACTIVE PDF DOWNLOAD LINK */}
                    {item.type === 'pdf' && item.meta?.fileUrl && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={(e) => handlePdfDownload(e, item.meta.fileUrl)}
                          className="inline-flex items-center gap-1.5 rounded bg-brand-50 px-2.5 py-1 text-xxs font-bold text-brand-700 hover:bg-brand-100 dark:bg-slate-800 dark:text-cyan-300 dark:hover:bg-slate-700"
                        >
                          <FileDown className="h-3 w-3" />
                          Download PDF File
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Navigation Arrow */}
                  <span className="mt-1 text-slate-400 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100 dark:text-slate-500">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing matched <span className="font-bold text-slate-800 dark:text-slate-200">{results.length}</span> of{' '}
              <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.total}</span> items
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="flex items-center gap-1 rounded border border-slate-200/80 bg-white p-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="flex items-center gap-1 rounded border border-slate-200/80 bg-white p-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
