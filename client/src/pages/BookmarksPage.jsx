import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookMarked,
  Search,
  Filter,
  Trash2,
  Edit2,
  Sparkles,
  Award,
  Play,
  X,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  BookOpenCheck,
  TrendingUp,
  Compass,
  Calendar,
  Sparkle,
  BarChart3,
  Trophy,
  Menu,
  User,
  LogOut,
  HelpCircle,
  Clock,
  Check,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { useLanguage } from '../providers/LanguageProvider.jsx';
import { httpClient } from '../services/httpClient.js';
import { NotificationDropdown } from '../components/NotificationDropdown.jsx';
import { RailwayLogo } from '../components/layout/Header.jsx';

export function BookmarksPage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Bookmark lists states
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBookmark, setActiveBookmark] = useState(null);
  
  // Filters
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Practice Quiz states
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Edit Annotation states
  const [editNoteId, setEditNoteId] = useState('');
  const [personalNoteText, setPersonalNoteText] = useState('');

  const initials = getInitials(user?.name);
  const navigationItems = [
    { label: t('dashboard'), icon: LayoutDashboard, href: '/dashboard' },
    { label: t('mockTests'), icon: ClipboardList, href: '/mock-tests' },
    { label: t('notes'), icon: BookOpenCheck, href: '/notes' },
    { label: t('bookmarks'), icon: BookMarked, active: true, href: '/bookmarks' },
    { label: t('recommendations'), icon: TrendingUp, href: '/recommendations' },
    { label: t('weakTopics'), icon: Compass, href: '/weak-topics' },
    { label: t('revisions'), icon: Calendar, href: '/revisions' },
    { label: t('aiTutor'), icon: Sparkles, href: '/ai-tutor' },
    { label: t('analytics'), icon: BarChart3, href: '/analytics' },
    { label: t('achievements'), icon: Trophy, href: '/achievements' },
  ];

  useEffect(() => {
    fetchBookmarks();
  }, [selectedType, selectedDifficulty, selectedSubject]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookmarks();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function fetchBookmarks() {
    setLoading(true);
    try {
      const params = {};
      if (selectedType) params.itemType = selectedType;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      if (selectedSubject) params.subject = selectedSubject;
      if (searchQuery) params.search = searchQuery;

      const response = await httpClient.get('/bookmarks', { params });
      if (response.data?.data?.bookmarks) {
        setBookmarks(response.data.data.bookmarks);
      }
    } catch (_err) {
      // Silence
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveBookmark(bookmarkId) {
    try {
      await httpClient.delete(`/bookmarks/${bookmarkId}`);
      setBookmarks(prev => prev.filter(b => b._id !== bookmarkId));
    } catch (_err) {
      // Silence
    }
  }

  async function handleSaveAnnotation(bookmarkId) {
    try {
      const response = await httpClient.put(`/bookmarks/${bookmarkId}`, {
        personalNote: personalNoteText,
      });

      if (response.data?.success) {
        setBookmarks(prev => prev.map(b => b._id === bookmarkId ? { ...b, personalNote: personalNoteText } : b));
        setEditNoteId('');
        setPersonalNoteText('');
      }
    } catch (_err) {
      // recovery
    }
  }

  // Load custom practice quiz questions
  async function triggerPracticeQuiz() {
    try {
      const response = await httpClient.get('/bookmarks/practice');
      if (response.data?.data?.questions?.length > 0) {
        setPracticeQuestions(response.data.data.questions);
        setCurrentIdx(0);
        setSelectedAnswer('');
        setShowExplanation(false);
        setQuizScore(0);
        setQuizFinished(false);
        setIsPracticeOpen(true);
      } else {
        alert('You have no bookmarked questions to practice. Save Quiz/Mock questions first!');
      }
    } catch (_err) {
      // Fallback baseline questions to practice if empty
      const basePractice = [
        {
          questionText: 'If 20% of A is equal to 30% of B, then what percentage is B of A?',
          options: ['150%', '66.67%', '50%', '33.33%'],
          correctOption: 'B',
          explanation: '0.2A = 0.3B => B/A = 0.2/0.3 = 2/3 = 66.67%'
        },
        {
          questionText: 'A shopkeeper sells a product for Rs 240 at a loss of 20%. What should be the selling price to gain 10%?',
          options: ['Rs 300', 'Rs 320', 'Rs 330', 'Rs 280'],
          correctOption: 'C',
          explanation: 'Cost Price = 240 / 0.8 = Rs 300. Selling Price for 10% gain = 300 * 1.1 = Rs 330.'
        }
      ];
      setPracticeQuestions(basePractice);
      setCurrentIdx(0);
      setSelectedAnswer('');
      setShowExplanation(false);
      setQuizScore(0);
      setQuizFinished(false);
      setIsPracticeOpen(true);
    }
  }

  function handleAnswerSubmit(ans) {
    if (selectedAnswer) return;
    setSelectedAnswer(ans);
    setShowExplanation(true);
    
    const correctAns = practiceQuestions[currentIdx].correctOption;
    if (ans === correctAns) {
      setQuizScore(prev => prev + 1);
    }
  }

  function handleNextQuestion() {
    if (currentIdx + 1 < practiceQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  }

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800/60 dark:bg-slate-900 transition-all duration-300">
        <div className="grid min-h-[calc(100vh-9rem)] lg:grid-cols-[17rem_1fr]">
          
          {/* Side navigation */}
          <aside className="hidden border-r border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-[#0a1128]/40 lg:block">
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-6">
                <div className="rounded-xl bg-gradient-to-br from-railway-blue via-railway-blue to-railway-navy p-4 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none rounded-bl-full" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-200">
                    {t('candidateDeck')}
                  </p>
                  <p className="mt-0.5 text-base font-extrabold leading-tight">{t('studyCockpit')}</p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] bg-white/15 px-2.5 py-1 rounded font-bold self-start w-fit">
                    <ShieldCheck size={11} className="text-railway-gold" />
                    <span>{t('secureAccount')}</span>
                  </div>
                </div>

                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                        item.active
                          ? 'bg-gradient-to-r from-railway-blue/10 to-transparent text-railway-blue border-l-[3px] border-railway-blue dark:text-cyan-400 dark:from-cyan-500/10'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100'
                      }`}
                    >
                      <item.icon size={15} className={item.active ? 'text-railway-blue dark:text-cyan-400' : 'text-slate-400'} aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-semibold text-center">
                  {t('version')}
                </p>
              </div>
            </div>
          </aside>

          {isSidebarOpen ? (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                aria-label="Close navigation"
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
                onClick={() => setIsSidebarOpen(false)}
              />
              <aside className="relative h-full w-72 border-r border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RailwayLogo className="h-8 w-8 text-railway-blue" />
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">
                      {t('candidateDeck')}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Close navigation"
                    className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-355 dark:hover:bg-slate-900"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
                <div className="flex h-[calc(100vh-8rem)] flex-col justify-between">
                  <nav className="space-y-1">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                          item.active
                            ? 'bg-gradient-to-r from-railway-blue/10 to-transparent text-railway-blue border-l-[3px] border-railway-blue dark:text-cyan-400 dark:from-cyan-500/10'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100'
                        }`}
                      >
                        <item.icon size={15} className={item.active ? 'text-railway-blue dark:text-cyan-400' : 'text-slate-400'} aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                  <p className="text-[10px] text-slate-400 font-semibold text-center mt-auto">
                    {t('version')}
                  </p>
                </div>
              </aside>
            </div>
          ) : null}

          {/* Main Workspace */}
          <div className="min-w-0 bg-slate-50/50 dark:bg-[#060b19]/60 flex flex-col">
            <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800/50 dark:bg-[#0a1128]/80 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    aria-label="Open navigation"
                    className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu size={19} aria-hidden="true" />
                  </button>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
                      {t('bookmarks')}
                    </p>
                    <h1 className="truncate text-base font-extrabold text-slate-950 dark:text-white sm:text-lg -mt-0.5">
                      {t('bookmarksSub')}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <NotificationDropdown />
                  <div className="relative">
                    <button
                      type="button"
                      className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-left dark:border-slate-800 dark:bg-slate-950 shadow-sm"
                      aria-expanded={isProfileOpen}
                      onClick={() => setIsProfileOpen((current) => !current)}
                    >
                      <span className="grid size-7 place-items-center rounded bg-gradient-to-tr from-railway-blue to-railway-red text-xs font-bold text-white shadow-inner">
                        {initials}
                      </span>
                      <span className="hidden max-w-28 truncate text-xs font-semibold text-slate-800 dark:text-slate-255 sm:block">
                        {user?.name ?? 'Student'}
                      </span>
                      <ChevronDown size={14} className="text-slate-400" aria-hidden="true" />
                    </button>

                    {isProfileOpen ? (
                      <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                        <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800/80">
                          <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                            {user?.name ?? 'Student'}
                          </p>
                          <p className="truncate text-[10px] text-slate-450 mt-0.5">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-355 dark:hover:bg-slate-800"
                        >
                          <User size={14} className="text-slate-400" aria-hidden="true" />
                          <span>My Profile</span>
                        </Link>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-railway-red hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/20"
                          onClick={logout}
                        >
                          <LogOut size={14} aria-hidden="true" />
                          <span>Logout</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </nav>

            <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
              
              {/* Toolbar search & filters */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 dark:bg-slate-950/20">
                <div className="flex flex-1 max-w-sm items-center relative">
                  <Search size={14} className="absolute left-3 text-slate-450" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search personal notes..."
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs outline-none focus:border-railway-blue dark:border-slate-850 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="">All Types</option>
                    <option value="QuizQuestion">Quiz Question</option>
                    <option value="MockQuestion">Mock Question</option>
                    <option value="Note">Note</option>
                    <option value="Doubt">Doubt Explanation</option>
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <button
                    onClick={triggerPracticeQuiz}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white text-xs font-extrabold flex items-center gap-1 shadow-sm transition active:scale-95"
                  >
                    <Play size={12} className="fill-current" />
                    <span>{t('practiceBookmarked')}</span>
                  </button>
                </div>
              </div>

              {/* Bookmarks Cards Grid */}
              {loading ? (
                <div className="grid h-48 place-items-center text-slate-450 font-bold text-xs">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="animate-spin text-railway-blue" size={14} />
                    <span>Querying Bookmark Depot...</span>
                  </span>
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-450">{t('noBookmarks')}</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {bookmarks.map(item => (
                    <div
                      key={item._id}
                      className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-850 dark:bg-slate-900/30 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="rounded-md bg-slate-100 text-slate-500 dark:bg-slate-850 dark:text-slate-400 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                            {item.itemType}
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold">
                            {item.subject} | {item.difficulty}
                          </span>
                        </div>

                        <h4 className="text-xs font-extrabold text-slate-855 dark:text-white leading-relaxed">{item.title}</h4>

                        {/* Annotation Editor */}
                        {editNoteId === item._id ? (
                          <div className="space-y-2 pt-2">
                            <input
                              type="text"
                              value={personalNoteText}
                              onChange={(e) => setPersonalNoteText(e.target.value)}
                              placeholder={t('personalNotePlaceholder')}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-railway-blue dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                            />
                            <div className="flex justify-end gap-1.5 text-[10px] font-bold">
                              <button onClick={() => setEditNoteId('')} className="px-2 py-1 rounded border border-slate-250 text-slate-500">{t('cancel')}</button>
                              <button onClick={() => handleSaveAnnotation(item._id)} className="px-2 py-1 rounded bg-railway-blue text-white">Save</button>
                            </div>
                          </div>
                        ) : (
                          item.personalNote && (
                            <div className="p-2.5 rounded-lg border border-amber-500/10 bg-amber-500/5 text-[11px] text-amber-900 dark:text-amber-300 font-semibold flex gap-1.5 items-start">
                              <Award size={13} className="shrink-0 mt-0.5" />
                              <p className="italic">"{item.personalNote}"</p>
                            </div>
                          )
                        )}
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setEditNoteId(item._id);
                            setPersonalNoteText(item.personalNote || '');
                          }}
                          className="text-[10px] font-bold text-railway-blue dark:text-cyan-400 flex items-center gap-1 hover:underline"
                        >
                          <Edit2 size={11} />
                          <span>Annotate</span>
                        </button>

                        <button
                          onClick={() => handleRemoveBookmark(item._id)}
                          className="text-[10px] font-bold text-rose-500 flex items-center gap-1 hover:underline"
                        >
                          <Trash2 size={11} />
                          <span>{t('removeBookmark')}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BOOKMARK PRACTICE MODAL ACCORDION */}
              <AnimatePresence>
                {isPracticeOpen && (
                  <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950 space-y-5"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="grid size-8 place-items-center rounded bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-sm">
                            <BookMarked size={16} />
                          </span>
                          <div>
                            <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">{t('bookmarkQuiz')}</h3>
                            <p className="text-[10px] text-slate-450">{t('bookmarkQuizSub')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsPracticeOpen(false)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {quizFinished ? (
                        <div className="py-8 text-center space-y-4">
                          <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 animate-bounce">
                            <CheckCircle2 size={28} />
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Revision Sprint Complete!</h4>
                          <p className="text-xs text-slate-450">You scored <span className="text-emerald-500 font-extrabold">{quizScore}</span> out of <span className="font-bold">{practiceQuestions.length}</span>.</p>
                          <button
                            onClick={() => setIsPracticeOpen(false)}
                            className="px-4 py-2 rounded-lg bg-railway-blue hover:brightness-110 text-white text-xs font-bold"
                          >
                            Return to Bookmarks
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-[10px] text-slate-450 font-bold uppercase">
                            <span>Question {currentIdx + 1} of {practiceQuestions.length}</span>
                            <span>Score: {quizScore}</span>
                          </div>

                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                            <p className="text-xs leading-relaxed font-bold text-slate-855 dark:text-white">
                              {practiceQuestions[currentIdx]?.questionText}
                            </p>
                          </div>

                          <div className="grid gap-2">
                            {practiceQuestions[currentIdx]?.options?.map((opt, oIdx) => {
                              const optChar = String.fromCharCode(65 + oIdx);
                              const isSelected = selectedAnswer === optChar;
                              const isCorrect = practiceQuestions[currentIdx]?.correctOption === optChar;
                              
                              let buttonStyles = 'border-slate-200 bg-white hover:border-railway-blue dark:border-slate-800 dark:bg-slate-900';
                              if (selectedAnswer) {
                                if (isSelected) {
                                  buttonStyles = isCorrect ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-rose-500 bg-rose-500/10 text-rose-600';
                                } else if (isCorrect) {
                                  buttonStyles = 'border-emerald-500 bg-emerald-500/10 text-emerald-600';
                                } else {
                                  buttonStyles = 'border-slate-100 bg-slate-50/50 dark:border-slate-850 dark:bg-slate-950 opacity-40';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleAnswerSubmit(optChar)}
                                  disabled={!!selectedAnswer}
                                  className={`p-3.5 rounded-xl border text-left text-xs font-bold flex items-center gap-3 transition ${buttonStyles}`}
                                >
                                  <span className="grid size-5 shrink-0 place-items-center rounded bg-slate-100 font-extrabold text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-350">
                                    {optChar}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          <AnimatePresence>
                            {showExplanation && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1.5"
                              >
                                <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                  <HelpCircle size={11} />
                                  <span>AI Solution Explanation</span>
                                </p>
                                <p className="text-xs text-slate-700 dark:text-slate-300 pl-4 font-semibold">
                                  {practiceQuestions[currentIdx]?.explanation}
                                </p>
                                
                                <div className="flex justify-end pt-2">
                                  <button
                                    onClick={handleNextQuestion}
                                    className="px-3.5 py-1 rounded bg-railway-blue hover:brightness-110 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                                  >
                                    <span>Next Question</span>
                                    <ChevronRight size={12} />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function getInitials(name = 'Student') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
