import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  BookOpenCheck,
  BookMarked,
  TrendingUp,
  Compass,
  Sparkles,
  BarChart3,
  Trophy,
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck,
  Award,
  Star,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { useLanguage } from '../providers/LanguageProvider.jsx';
import { httpClient } from '../services/httpClient.js';
import { NotificationDropdown } from '../components/NotificationDropdown.jsx';
import { RailwayLogo } from '../components/layout/Header.jsx';

export function RevisionPlannerPage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Revision schedules
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Rating states per schedule ID
  const [hoveredStars, setHoveredStars] = useState({});
  const [selectedConfidence, setSelectedConfidence] = useState({});
  const [updatingId, setUpdatingId] = useState('');

  const initials = getInitials(user?.name);
  const navigationItems = [
    { label: t('dashboard'), icon: LayoutDashboard, href: '/dashboard' },
    { label: t('mockTests'), icon: ClipboardList, href: '/mock-tests' },
    { label: t('notes'), icon: BookOpenCheck, href: '/notes' },
    { label: t('bookmarks'), icon: BookMarked, href: '/bookmarks' },
    { label: t('recommendations'), icon: TrendingUp, href: '/recommendations' },
    { label: t('weakTopics'), icon: Compass, href: '/weak-topics' },
    { label: t('revisions'), icon: Calendar, active: true, href: '/revisions' },
    { label: t('aiTutor'), icon: Sparkles, href: '/ai-tutor' },
    { label: t('analytics'), icon: BarChart3, href: '/analytics' },
    { label: t('achievements'), icon: Trophy, href: '/achievements' },
  ];

  useEffect(() => {
    fetchRevisions();
  }, []);

  async function fetchRevisions() {
    setLoading(true);
    try {
      const response = await httpClient.get('/recommendations/revisions');
      if (response.data?.data?.revisionSchedules) {
        setRevisions(response.data.data.revisionSchedules);
      }
    } catch (_err) {
      // recovery silent
    } finally {
      setLoading(false);
    }
  }

  // Handle Confidence Updates (Spaced Repetition Trigger)
  async function handleConfidenceSelect(scheduleId, score) {
    setUpdatingId(scheduleId);
    setSelectedConfidence(prev => ({ ...prev, [scheduleId]: score }));

    try {
      const response = await httpClient.put(`/recommendations/revisions/${scheduleId}/confidence`, {
        confidenceScore: score,
      });

      if (response.data?.success) {
        // Refresh schedules list to show updated timelines
        await fetchRevisions();
      }
    } catch (_err) {
      // silence
    } finally {
      setUpdatingId('');
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
                      {t('revisions')}
                    </p>
                    <h1 className="truncate text-base font-extrabold text-slate-950 dark:text-white sm:text-lg -mt-0.5">
                      {t('spacedRepSub')}
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
              
              {loading ? (
                <div className="grid h-48 place-items-center text-slate-450 font-bold text-xs">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="animate-spin text-railway-blue" size={14} />
                    <span>Synchronizing Memory Timestamps...</span>
                  </span>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
                  {revisions.map((item, idx) => {
                    const nextDateStr = new Date(item.nextRevisionAt).toLocaleDateString();
                    const lastDateStr = new Date(item.lastRevisedAt).toLocaleDateString();
                    
                    const hoverVal = hoveredStars[item._id] || 0;
                    const activeConfidence = selectedConfidence[item._id] || item.confidenceScore || 3;
                    const isUpdating = updatingId === item._id;

                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.08 }}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-850 dark:bg-slate-900/30 flex flex-col justify-between space-y-4 hover:shadow-md transition relative overflow-hidden"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="rounded bg-sky-500/10 text-sky-600 dark:bg-sky-500/5 dark:text-sky-400 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                              {item.category}
                            </span>
                            
                            <span className="rounded-md bg-amber-500/10 text-amber-600 dark:bg-amber-500/5 dark:text-amber-400 px-2 py-0.5 text-[9px] font-bold">
                              Interval: {item.intervalDays} Days
                            </span>
                          </div>

                          <h3 className="text-xs font-extrabold text-slate-855 dark:text-white leading-relaxed pr-4">
                            {item.topicName}
                          </h3>

                          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-450 font-bold border-t border-slate-100 dark:border-slate-850 pt-2">
                            <div>
                              <p className="uppercase tracking-widest text-[9px]">{t('lastRevised')}</p>
                              <p className="text-slate-700 dark:text-slate-300 mt-0.5">{lastDateStr}</p>
                            </div>
                            <div>
                              <p className="uppercase tracking-widest text-[9px] text-railway-blue dark:text-cyan-400">{t('nextRevision')}</p>
                              <p className="text-slate-700 dark:text-slate-300 mt-0.5">{nextDateStr}</p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Spaced Repetition Confidence Stars */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                          <span className="text-[10px] text-slate-450 font-extrabold uppercase shrink-0">
                            {t('confidenceScore')}
                          </span>

                          <div className="flex items-center gap-1">
                            {isUpdating ? (
                              <RefreshCw size={14} className="animate-spin text-railway-blue shrink-0" />
                            ) : (
                              Array.from({ length: 5 }).map((_, sIdx) => {
                                const starVal = sIdx + 1;
                                const isLit = hoverVal ? starVal <= hoverVal : starVal <= activeConfidence;

                                return (
                                  <button
                                    key={sIdx}
                                    type="button"
                                    onClick={() => handleConfidenceSelect(item._id, starVal)}
                                    onMouseEnter={() => setHoveredStars(prev => ({ ...prev, [item._id]: starVal }))}
                                    onMouseLeave={() => setHoveredStars(prev => ({ ...prev, [item._id]: 0 }))}
                                    className="p-0.5 text-slate-300 hover:scale-110 active:scale-95 transition"
                                  >
                                    <Star
                                      size={14}
                                      className={isLit ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'}
                                    />
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Confidence description badge */}
                        <div className="text-center text-[9px] font-bold text-slate-400">
                          {activeConfidence <= 2 ? t('low') : activeConfidence === 3 ? t('medium') : t('high')}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

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
