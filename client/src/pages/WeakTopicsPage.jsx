import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  AlertTriangle,
  Play,
  X,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  BookOpenCheck,
  BookMarked,
  TrendingUp,
  Calendar,
  Sparkles,
  BarChart3,
  Trophy,
  Menu,
  User,
  LogOut,
  ShieldCheck,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { useLanguage } from '../providers/LanguageProvider.jsx';
import { httpClient } from '../services/httpClient.js';
import { NotificationDropdown } from '../components/NotificationDropdown.jsx';
import { RailwayLogo } from '../components/layout/Header.jsx';

export function WeakTopicsPage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Weak topics list
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sprint Quiz states
  const [sprintQuestions, setSprintQuestions] = useState([]);
  const [sprintTopic, setSprintTopic] = useState('');
  const [sprintSubject, setSprintSubject] = useState('');
  const [isSprintOpen, setIsSprintOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [sprintScore, setSprintScore] = useState(0);
  const [sprintFinished, setSprintFinished] = useState(false);

  const initials = getInitials(user?.name);
  const navigationItems = [
    { label: t('dashboard'), icon: LayoutDashboard, href: '/dashboard' },
    { label: t('mockTests'), icon: ClipboardList, href: '/mock-tests' },
    { label: t('notes'), icon: BookOpenCheck, href: '/notes' },
    { label: t('bookmarks'), icon: BookMarked, href: '/bookmarks' },
    { label: t('recommendations'), icon: TrendingUp, href: '/recommendations' },
    { label: t('weakTopics'), icon: Compass, active: true, href: '/weak-topics' },
    { label: t('revisions'), icon: Calendar, href: '/revisions' },
    { label: t('aiTutor'), icon: Sparkles, href: '/ai-tutor' },
    { label: t('analytics'), icon: BarChart3, href: '/analytics' },
    { label: t('achievements'), icon: Trophy, href: '/achievements' },
  ];

  useEffect(() => {
    fetchWeakTopics();
  }, []);

  async function fetchWeakTopics() {
    setLoading(true);
    try {
      const response = await httpClient.get('/recommendations/weak-topics');
      if (response.data?.data?.weakTopics) {
        setWeakTopics(response.data.data.weakTopics);
      }
    } catch (_err) {
      // recovery silent
    } finally {
      setLoading(false);
    }
  }

  async function triggerSprint(topicName) {
    try {
      const response = await httpClient.post(`/recommendations/weak-topics/${encodeURIComponent(topicName)}/sprint`);
      if (response.data?.data?.sprint) {
        const sprintData = response.data.data.sprint;
        setSprintQuestions(sprintData.questions || []);
        setSprintTopic(sprintData.sprintTopic);
        setSprintSubject(sprintData.subject);
        
        setCurrentIdx(0);
        setSelectedAnswer('');
        setShowExplanation(false);
        setSprintScore(0);
        setSprintFinished(false);
        setIsSprintOpen(true);
      }
    } catch (_err) {
      // Silence
    }
  }

  function handleAnswerSubmit(ans) {
    if (selectedAnswer) return;
    setSelectedAnswer(ans);
    setShowExplanation(true);
    
    const correctAns = sprintQuestions[currentIdx].correctOption || 'B';
    if (ans === correctAns) {
      setSprintScore(prev => prev + 1);
    }
  }

  function handleNextQuestion() {
    if (currentIdx + 1 < sprintQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    } else {
      setSprintFinished(true);
      
      // Update local weak topic accuracy optimistically if score is perfect
      if (sprintScore >= 3) {
        setWeakTopics(prev => prev.map(w => {
          if (w.topicName === sprintTopic) {
            const nextAcc = Math.min(100, w.accuracyScore + 15);
            return { ...w, accuracyScore: nextAcc, sprintCompleted: true };
          }
          return w;
        }));
      }
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
                      {t('weakTopics')}
                    </p>
                    <h1 className="truncate text-base font-extrabold text-slate-950 dark:text-white sm:text-lg -mt-0.5">
                      {t('weakTopicsSub')}
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
                    <span>Analyzing Performance Logs...</span>
                  </span>
                </div>
              ) : (
                <div className="grid gap-6 max-w-4xl mx-auto">
                  {weakTopics.map((item, idx) => {
                    const progressColor = item.accuracyScore < 50 ? 'bg-rose-500' : 'bg-amber-500';
                    const isAlert = item.accuracyScore < 50;

                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-850 dark:bg-slate-900/30 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="space-y-1">
                            <span className="rounded bg-sky-500/10 text-sky-600 dark:bg-sky-500/5 dark:text-sky-400 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                              {item.subject}
                            </span>
                            <h3 className="text-xs font-extrabold text-slate-855 dark:text-white">
                              {item.topicName}
                            </h3>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-slate-450 font-extrabold uppercase">{t('accuracyScore')}</p>
                              <p className={`text-base font-extrabold ${isAlert ? 'text-rose-500' : 'text-amber-500'}`}>{item.accuracyScore}%</p>
                            </div>
                            
                            <button
                              onClick={() => triggerSprint(item.topicName)}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white text-xs font-extrabold shadow-sm active:scale-95 transition flex items-center gap-1 shrink-0"
                            >
                              <Play size={10} className="fill-current" />
                              <span>{t('triggerSprint')}</span>
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-slate-450 font-bold uppercase">
                            <span>Syllabus Accuracy Index</span>
                            <span>{item.questionsCorrect} / {item.questionsAttempted} Correct</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${item.accuracyScore}%` }} />
                          </div>
                        </div>

                        {item.aiStrategy && (
                          <div className="p-3 rounded-lg border border-slate-150 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 text-[11px] text-slate-500 dark:text-slate-400 font-semibold space-y-1">
                            <h4 className="font-extrabold text-[10px] text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                              <Compass size={11} className="text-railway-blue" />
                              <span>{t('aiImprovementStrategy')}</span>
                            </h4>
                            <p className="pl-4">{item.aiStrategy}</p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* ACCURACY DYNAMIC SPRINT MODAL */}
              <AnimatePresence>
                {isSprintOpen && (
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
                            <Compass size={16} className="animate-spin-slow" />
                          </span>
                          <div>
                            <h3 className="text-xs font-extrabold text-slate-855 dark:text-white uppercase tracking-wider">{t('sprintQuizTitle')}</h3>
                            <p className="text-[10px] text-slate-450">{t('sprintQuizSub')} ({sprintTopic})</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsSprintOpen(false)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {sprintFinished ? (
                        <div className="py-8 text-center space-y-4">
                          <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 animate-bounce">
                            <CheckCircle2 size={28} />
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Sprint Complete!</h4>
                          <p className="text-xs text-slate-450">You scored <span className="text-emerald-500 font-extrabold">{sprintScore}</span> out of <span className="font-bold">{sprintQuestions.length}</span>.</p>
                          <p className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg max-w-md mx-auto">
                            🎉 Performance Index Boosted! Accuracy index for {sprintTopic} has increased by +15%.
                          </p>
                          <button
                            onClick={() => setIsSprintOpen(false)}
                            className="px-4 py-2 rounded-lg bg-railway-blue hover:brightness-110 text-white text-xs font-bold"
                          >
                            Return to Weak Topics
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-[10px] text-slate-455 font-bold uppercase">
                            <span>Question {currentIdx + 1} of {sprintQuestions.length}</span>
                            <span>Score: {sprintScore}</span>
                          </div>

                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                            <p className="text-xs leading-relaxed font-bold text-slate-855 dark:text-white">
                              {sprintQuestions[currentIdx]?.questionText}
                            </p>
                          </div>

                          <div className="grid gap-2">
                            {sprintQuestions[currentIdx]?.options?.map((opt, oIdx) => {
                              const optChar = String.fromCharCode(65 + oIdx);
                              const isSelected = selectedAnswer === optChar;
                              const isCorrect = (sprintQuestions[currentIdx]?.correctOption || 'B') === optChar;
                              
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
                                  <span className="grid size-5 shrink-0 place-items-center rounded bg-slate-100 font-extrabold text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-355">
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
                                  {sprintQuestions[currentIdx]?.explanation}
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
