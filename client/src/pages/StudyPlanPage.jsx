import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Compass,
  BookOpen,
  Sparkles,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  LayoutDashboard,
  ClipboardList,
  BookOpenCheck,
  FileText,
  BarChart3,
  Trophy,
  Settings as SettingsIcon,
  X,
  Menu,
  ChevronDown,
  LogOut,
  Home,
  Train,
  MapPin,
  Milestone,
  ShieldCheck,
  User,
  ArrowUpRight,
  ChevronRight,
  Search,
  BookMarked
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { useLanguage } from '../providers/LanguageProvider.jsx';
import { Button } from '../components/ui/Button.jsx';
import { httpClient } from '../services/httpClient.js';
import { NotificationDropdown } from '../components/NotificationDropdown.jsx';
import { RailwayLogo } from '../components/layout/Header.jsx';

const VandeBharatMini = ({ className = "h-5 w-12" }) => (
  <svg className={className} viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 14C1 14 0 11 0 8C0 5 1 2 4 2H30C34 2 40 5 40 8C40 11 34 14 30 14H4Z" fill="url(#vb-grad)" />
    <path d="M25 4C28 4 33 5.5 35 8C33 10.5 28 12 25 12H20C19 12 18 10.5 18 8C18 5.5 19 4 20 4H25Z" fill="#0A1128" opacity="0.85" />
    <path d="M30 6.5C31.5 6.5 33 7.2 33.5 8C33 8.8 31.5 9.5 30 9.5H26C25.5 9.5 25 8.8 25 8C25 7.2 25.5 6.5 26 6.5H30Z" fill="#67E8F9" />
    <path d="M2 9H22C23 9 24 10 24 11C24 12 23 13 22 13H2C1 13 0 12 0 11C0 10 1 9 2 9Z" fill="#005BAC" />
    <circle cx="36" cy="6" r="1.2" fill="#FFC107" className="animate-pulse" />
    <circle cx="36" cy="10" r="1.2" fill="#FFC107" className="animate-pulse" />
    <defs>
      <linearGradient id="vb-grad" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#005BAC" />
      </linearGradient>
    </defs>
  </svg>
);

export function StudyPlanPage() {
  const { logout, user } = useAuth();
  const { t, language } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Active plan states
  const [activePlan, setActivePlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Custom task form states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Maths');
  const [newTaskTime, setNewTaskTime] = useState('30 mins');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState('Medium');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Questionnaire states
  const [examTarget, setExamTarget] = useState('RRB NTPC');
  const [examDate, setExamDate] = useState('2026-12-15');
  const [dailyHours, setDailyHours] = useState(4);
  const [strongSubjects, setStrongSubjects] = useState('');
  const [weakSubjects, setWeakSubjects] = useState('');
  const [prepLevel, setPrepLevel] = useState('intermediate');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [activeStationIdx, setActiveStationIdx] = useState(0);

  const initials = getInitials(user?.name);
  
  useEffect(() => {
    fetchActivePlan();
  }, []);

  async function fetchActivePlan() {
    setLoading(true);
    try {
      const response = await httpClient.get('/study-plans');
      if (response.data?.data) {
        setActivePlan(response.data.data.plan);
        setTasks(response.data.data.tasks || []);
        
        // Find index of first In Progress week
        const inProgressIdx = response.data.data.plan.weeklyPlan?.findIndex(w => w.status === 'In Progress');
        if (inProgressIdx !== -1) {
          setActiveStationIdx(inProgressIdx);
        }
      } else {
        setActivePlan(null);
        setTasks([]);
      }
    } catch (_err) {
      setActivePlan(null);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const dailyProgressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleTask = async (taskId) => {
    try {
      const response = await httpClient.put(`/study-plans/tasks/${taskId}/toggle`);
      if (response.data?.success) {
        // Optimistic toggle
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, completed: !t.completed } : t));
        
        // Refresh active plan progress parameters
        const planRes = await httpClient.get('/study-plans');
        if (planRes.data?.data) {
          setActivePlan(planRes.data.data.plan);
        }
      }
    } catch (_err) {
      // Recovery silent
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await httpClient.post('/study-plans/tasks', {
        title: newTaskTitle,
        category: newTaskCategory,
        time: newTaskTime,
        difficulty: newTaskDifficulty,
      });

      if (response.data?.data?.task) {
        setTasks(prev => [...prev, response.data.data.task]);
        setNewTaskTitle('');
        setShowAddForm(false);
      }
    } catch (_err) {
      // Silence
    }
  };

  const handleGenerateAiRoute = async (e) => {
    e.preventDefault();
    setGeneratingAi(true);

    const payload = {
      examTarget,
      examDate,
      dailyHours: Number(dailyHours),
      strongSubjects: strongSubjects.split(',').map(s => s.trim()).filter(Boolean),
      weakSubjects: weakSubjects.split(',').map(s => s.trim()).filter(Boolean),
      prepLevel,
      language: language === 'hi' ? 'Hindi' : 'English',
    };

    try {
      const response = await httpClient.post('/study-plans/generate', payload);
      if (response.data?.data) {
        setActivePlan(response.data.data.plan);
        setTasks(response.data.data.tasks || []);
        setActiveStationIdx(0);
      }
    } catch (_err) {
      // recovery fallback handled inside the API service beautifully
    } finally {
      setGeneratingAi(false);
    }
  };

  const navigationItems = [
    { label: t('dashboard'), icon: LayoutDashboard, href: '/dashboard' },
    { label: t('mockTests'), icon: ClipboardList, href: '/mock-tests' },
    { label: t('notes'), icon: BookOpenCheck, href: '/notes' },
    { label: t('bookmarks'), icon: BookMarked, href: '/bookmarks' },
    { label: t('recommendations'), icon: TrendingUp, href: '/recommendations' },
    { label: t('weakTopics'), icon: Compass, href: '/weak-topics' },
    { label: t('revisions'), icon: Calendar, href: '/revisions' },
    { label: t('aiTutor'), icon: Sparkles, href: '/ai-tutor' },
    { label: t('analytics'), icon: BarChart3, href: '/analytics' },
    { label: t('achievements'), icon: Trophy, href: '/achievements' },
  ];

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
                        item.href === '/study-plan'
                          ? 'bg-gradient-to-r from-railway-blue/10 to-transparent text-railway-blue border-l-[3px] border-railway-blue dark:text-cyan-400 dark:from-cyan-500/10'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100'
                      }`}
                    >
                      <item.icon size={15} className={item.href === '/study-plan' ? 'text-railway-blue dark:text-cyan-400' : 'text-slate-400'} aria-hidden="true" />
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
                    className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-900"
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
                          item.href === '/study-plan'
                            ? 'bg-gradient-to-r from-railway-blue/10 to-transparent text-railway-blue border-l-[3px] border-railway-blue dark:text-cyan-400 dark:from-cyan-500/10'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100'
                        }`}
                      >
                        <item.icon size={15} className={item.href === '/study-plan' ? 'text-railway-blue dark:text-cyan-400' : 'text-slate-400'} aria-hidden="true" />
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
                      {t('plannerRoute')}
                    </p>
                    <h1 className="truncate text-base font-extrabold text-slate-950 dark:text-white sm:text-lg -mt-0.5">
                      {t('prepRoute')}
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
                          className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800"
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

            <div className="space-y-6 p-4 sm:p-6 flex-1">
              {loading ? (
                <div className="grid h-72 place-items-center text-slate-450 font-bold text-sm">
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} className="animate-spin text-railway-blue" />
                    <span>Loading Route Logs...</span>
                  </span>
                </div>
              ) : activePlan ? (
                <>
                  {/* Route Progress Header Banner */}
                  <div className="rounded-xl border border-white/30 bg-gradient-to-br from-railway-blue to-railway-navy p-5 shadow-lg text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none rounded-bl-full" />
                    
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">
                      <div className="space-y-2">
                        <p className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-xs font-bold text-cyan-200 border border-white/5 shadow-inner">
                          <Flame size={13} className="animate-pulse text-railway-gold" />
                          <span>Prepare Smarter with AI Route Assistance</span>
                        </p>
                        <h2 className="text-xl font-extrabold text-white sm:text-2xl tracking-tight leading-tight">
                          {t('todaysTargets', { completed: completedCount, total: totalCount })}
                        </h2>
                        <p className="max-w-2xl text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                          {t('aiPlannerDesc')} (Current Stop: <span className="text-railway-gold font-bold">{activePlan.weeklyPlan[activeStationIdx]?.stationName || 'Prep Depot'}</span>)
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm shadow-md text-center shrink-0">
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-cyan-200">{t('dailyProgress')}</p>
                          <p className="mt-1 text-3xl font-extrabold text-white">{dailyProgressPercent}%</p>
                          <div className="mt-2.5 h-2 w-44 rounded-full bg-white/20 overflow-hidden relative">
                            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500 ease-out" style={{ width: `${dailyProgressPercent}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Workspace Split Grid */}
                  <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
                    
                    {/* Left Column: Daily Checklist "Platform Log" */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-md space-y-5">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <h2 className="text-base font-extrabold text-slate-950 dark:text-white leading-tight flex items-center gap-2">
                            <ClipboardList className="text-railway-blue dark:text-cyan-400" size={18} />
                            <span>{t('checklistTitle')}</span>
                          </h2>
                          <p className="text-xs text-slate-450 font-semibold mt-0.5">{t('checklistSub')}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 shadow-sm transition"
                          >
                            <Plus size={14} /> 
                            <span>{t('addTask')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Add Task Form Inline */}
                      <AnimatePresence>
                        {showAddForm && (
                          <motion.form 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onSubmit={handleAddTask} 
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40 space-y-3"
                          >
                            <div className="grid gap-3 sm:grid-cols-4">
                              <input
                                type="text"
                                required
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Study task (e.g. Average Arithmetic Speed test)..."
                                className="col-span-2 rounded-lg border border-slate-350 bg-white px-3 py-2 text-xs outline-none transition placeholder:text-slate-400 focus:border-railway-blue dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                              <select
                                value={newTaskCategory}
                                onChange={(e) => setNewTaskCategory(e.target.value)}
                                className="rounded-lg border border-slate-355 bg-white px-2 py-2 text-xs font-bold outline-none transition focus:border-railway-blue dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              >
                                <option value="Maths">Maths</option>
                                <option value="Reasoning">Reasoning</option>
                                <option value="Science">Science</option>
                                <option value="GK">GK</option>
                                <option value="Current Affairs">Current Affairs</option>
                                <option value="Mock Test">Mock Test</option>
                                <option value="General">General</option>
                              </select>
                              <select
                                value={newTaskDifficulty}
                                onChange={(e) => setNewTaskDifficulty(e.target.value)}
                                className="rounded-lg border border-slate-355 bg-white px-2 py-2 text-xs font-bold outline-none transition focus:border-railway-blue dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                              </select>
                            </div>
                            <div className="flex justify-end gap-2 text-[11px] font-bold">
                              <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                              >
                                {t('cancel')}
                              </button>
                              <button
                                type="submit"
                                className="px-3 py-1.5 rounded-lg bg-railway-blue text-white shadow-sm hover:brightness-110"
                              >
                                {t('saveCargo')}
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {/* Checklist Tasks List */}
                      <div className="space-y-2.5">
                        {tasks.map(task => (
                          <motion.div
                            key={task._id}
                            layoutId={task._id}
                            onClick={() => handleToggleTask(task._id)}
                            className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-300 cursor-pointer group ${
                              task.completed
                                ? 'border-slate-200 bg-slate-50/50 dark:border-slate-850 dark:bg-slate-950/20 opacity-60'
                                : 'border-slate-200 bg-white hover:border-railway-blue/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-800/40 hover:shadow-md'
                            }`}
                          >
                            <button type="button" className="mt-0.5 text-slate-400 hover:text-railway-blue dark:hover:text-cyan-400 shrink-0">
                              {task.completed ? (
                                <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400 fill-emerald-500/10" />
                              ) : (
                                <Circle size={18} className="group-hover:scale-105 transition-transform" />
                              )}
                            </button>

                            <div className="min-w-0 flex-1">
                              <p className={`text-xs sm:text-sm font-bold ${
                                task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                              }`}>
                                {task.title}
                              </p>
                              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[9px] font-extrabold tracking-wide uppercase">
                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-500 dark:bg-slate-850 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/40">
                                  {task.category}
                                </span>
                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-500 dark:bg-slate-850 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/40">
                                  ⏱️ {task.time}
                                </span>
                                {task.difficulty && (
                                  <span className={`rounded-md px-2 py-0.5 ${
                                    task.difficulty === 'Hard'
                                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/20'
                                      : task.difficulty === 'Medium'
                                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100/20'
                                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/20'
                                  }`}>
                                    {task.difficulty}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Quick Info Callout */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50 flex items-start gap-3">
                        <ShieldCheck size={18} className="text-railway-blue shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                          Your daily log updates automatically on exam attempts. Standard syllabus quizzes boost accuracy indexes, while completed CBT shift simulations reward high XP multipliers.
                        </p>
                      </div>
                    </section>

                    {/* Right Column: Premium Train Route Timeline */}
                    <div className="space-y-6">
                      
                      {/* Train Route Road Map */}
                      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-md relative overflow-hidden">
                        
                        <div className="mb-4">
                          <h2 className="text-base font-extrabold text-slate-950 dark:text-white leading-tight flex items-center gap-2">
                            <Train className="text-railway-red animate-pulse" size={18} />
                            <span>{t('roadmapTitle')}</span>
                          </h2>
                          <p className="text-xs text-slate-450 font-semibold mt-0.5">{t('roadmapSub')}</p>
                        </div>

                        {/* Vertical Railway track timeline container */}
                        <div className="relative pl-9 pr-1 space-y-8 pt-3 pb-2">
                          
                          {/* Real Premium Double Railway Track SVG running down the side */}
                          <svg className="absolute left-[17px] top-0 h-full w-2" pointerEvents="none">
                            <line x1="1" y1="0" x2="1" y2="100%" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 dark:text-slate-800" />
                            <line x1="7" y1="0" x2="7" y2="100%" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 dark:text-slate-800" />
                            
                            {Array.from({ length: 45 }).map((_, i) => (
                              <line key={i} x1="1" y1={i * 15} x2="7" y2={i * 15} stroke="currentColor" strokeWidth="1" className="text-slate-200 dark:text-slate-800/40" />
                            ))}

                            <line x1="1" y1="0" x2="1" y2="140" stroke="#FFC107" strokeWidth="2" className="shadow-lg" />
                            <line x1="7" y1="0" x2="7" y2="140" stroke="#FFC107" strokeWidth="2" className="shadow-lg" />
                          </svg>

                          {activePlan.weeklyPlan?.map((item, idx) => {
                            const isCompleted = item.status === 'Completed';
                            const isInProgress = item.status === 'In Progress';
                            const isUpcoming = item.status === 'Upcoming';
                            const isActive = idx === activeStationIdx;

                            return (
                              <div 
                                key={idx} 
                                onClick={() => setActiveStationIdx(idx)}
                                className="relative group cursor-pointer"
                              >
                                <span className={`absolute -left-[30px] top-1.5 flex size-5 items-center justify-center rounded-full border bg-white dark:bg-slate-900 z-10 transition-all duration-300 ${
                                  isCompleted
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:border-emerald-400 dark:bg-emerald-950/60 shadow-lg shadow-emerald-500/20 scale-105'
                                    : isInProgress
                                      ? 'border-amber-500 bg-amber-50 text-amber-600 dark:border-amber-400 dark:bg-amber-950/60 shadow-lg shadow-amber-500/30 scale-110 ring-4 ring-amber-500/10'
                                      : 'border-slate-300 text-slate-400 dark:border-slate-700'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle2 size={11} className="stroke-[3]" />
                                  ) : isInProgress ? (
                                    <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />
                                  ) : (
                                    <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                  )}
                                </span>

                                {isInProgress && (
                                  <div className="absolute -left-[48px] -top-3.5 z-20 pointer-events-none transform -rotate-90">
                                    <VandeBharatMini className="h-4 w-9 drop-shadow-[0_2px_5px_rgba(0,91,172,0.4)]" />
                                  </div>
                                )}

                                <div className={`p-3.5 rounded-xl border transition-all duration-300 ${
                                  isActive
                                    ? 'border-railway-blue bg-white dark:border-cyan-500 dark:bg-slate-950 shadow-md translate-x-1'
                                    : 'border-slate-200 bg-slate-50/50 dark:border-slate-850 dark:bg-slate-950/15 hover:border-slate-300 dark:hover:border-slate-800'
                                }`}>
                                  
                                  <div className="flex items-start justify-between gap-2.5">
                                    <div className="min-w-0">
                                      <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400 block">
                                        {item.week}
                                      </span>
                                      <h3 className={`text-xs font-bold truncate mt-0.5 ${
                                        isCompleted ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white'
                                      }`}>
                                        {item.stationName}
                                      </h3>
                                    </div>
                                    <span className={`rounded-full px-2 py-0.2 text-[8px] font-extrabold uppercase tracking-wide shrink-0 ${
                                      isCompleted
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                                        : isInProgress
                                          ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                                          : 'bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-500'
                                    }`}>
                                      {item.status}
                                    </span>
                                  </div>

                                  <p className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${item.haltColor}`}>
                                    <MapPin size={10} />
                                    <span>{item.haltTime}</span>
                                  </p>

                                  {!isUpcoming && (
                                    <div className="mt-3.5">
                                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mb-1">
                                        <span>{t('clearedTracks')}</span>
                                        <span>{item.progress}%</span>
                                      </div>
                                      <div className="h-1 rounded-full bg-slate-250 dark:bg-slate-800 overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                          style={{ width: `${item.progress}%` }} 
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>

                      {/* Active Station Detailed Halted Info */}
                      <motion.section 
                        key={activeStationIdx}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-md space-y-4"
                      >
                        <div className="flex items-center gap-2 text-railway-blue dark:text-cyan-400">
                          <Milestone size={18} />
                          <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                            {t('stationHalt')}
                          </h3>
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {activePlan.weeklyPlan[activeStationIdx]?.stationName || 'N/A'}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                            {t('sprintSchedule')}
                          </p>
                        </div>

                        <ul className="space-y-1.5">
                          {activePlan.weeklyPlan[activeStationIdx]?.topics?.map((tItem, idx) => (
                            <li key={idx} className="text-xs text-slate-650 dark:text-slate-350 font-bold flex items-center gap-2 p-2 rounded-lg bg-slate-50/80 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850">
                              <span className="size-1.5 rounded-full bg-railway-blue dark:bg-cyan-400 shrink-0" />
                              <span className="truncate pr-1">{tItem}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                          <Link
                            to="/study-materials"
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-railway-blue hover:text-brand-600 dark:text-cyan-400 dark:hover:text-cyan-300"
                          >
                            <span>{t('acquireDocs')}</span>
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </motion.section>

                      {/* AI Planner Widget */}
                      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-md bg-gradient-to-br from-indigo-50/20 via-white to-cyan-50/15 dark:from-[#0a1128]/30 dark:via-slate-900 dark:to-[#0a1128]/10 flex gap-3.5">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 text-white shadow-inner">
                          <Sparkles size={16} className="animate-spin-slow" />
                        </span>
                        <div className="space-y-1.5 min-w-0">
                          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            {t('needSignals')}
                          </h3>
                          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-semibold">
                            {t('needSignalsDesc')}
                          </p>
                          <Link
                            to="/ai-tutor"
                            className="inline-flex items-center gap-1 text-[11px] font-extrabold text-railway-blue hover:underline dark:text-cyan-400"
                          >
                            <span>{t('launchAiPlanner')}</span>
                            <ArrowRight size={12} />
                          </Link>
                        </div>
                      </section>

                    </div>

                  </div>
                </>
              ) : (
                /* RENDER DIAGNOSTIC QUESTIONNAIRE FORM */
                <div className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-md space-y-6">
                  <div className="text-center space-y-2">
                    <span className="mx-auto grid size-12 place-items-center rounded-xl bg-gradient-to-tr from-railway-blue to-cyan-400 text-white shadow-inner">
                      <Compass size={24} className={generatingAi ? "animate-spin" : "animate-bounce"} />
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">
                      {generatingAi ? t('generatingPlan') : t('configureRoute')}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Configure your Vande Bharat blueprint to load personalized railway stop milestones, daily timetables, and mock timelines.
                    </p>
                  </div>

                  {generatingAi ? (
                    <div className="py-12 space-y-4 text-center">
                      <div className="flex justify-center gap-1">
                        <span className="h-2 w-8 bg-railway-blue rounded-full animate-pulse" />
                        <span className="h-2 w-8 bg-cyan-400 rounded-full animate-pulse [animation-delay:200ms]" />
                        <span className="h-2 w-8 bg-railway-red rounded-full animate-pulse [animation-delay:400ms]" />
                      </div>
                      <p className="text-xs text-slate-450 font-bold animate-pulse">{t('generatingPlan')}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleGenerateAiRoute} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('targetExam')}</label>
                          <select
                            value={examTarget}
                            onChange={(e) => setExamTarget(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-railway-blue dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          >
                            <option value="RRB NTPC">RRB NTPC</option>
                            <option value="Group D">Group D</option>
                            <option value="ALP">ALP</option>
                            <option value="JE">JE</option>
                            <option value="RPF">RPF</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('examDate')}</label>
                          <input
                            type="date"
                            required
                            value={examDate}
                            onChange={(e) => setExamDate(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-railway-blue dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('dailyHours')}</label>
                          <input
                            type="number"
                            required
                            min={1}
                            max={24}
                            value={dailyHours}
                            onChange={(e) => setDailyHours(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-railway-blue dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('prepLevel')}</label>
                          <select
                            value={prepLevel}
                            onChange={(e) => setPrepLevel(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-railway-blue dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          >
                            <option value="beginner">{t('beginner')}</option>
                            <option value="intermediate">{t('intermediate')}</option>
                            <option value="advanced">{t('advanced')}</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('strongSubjects')}</label>
                        <input
                          type="text"
                          required
                          value={strongSubjects}
                          onChange={(e) => setStrongSubjects(e.target.value)}
                          placeholder="e.g. Percentage, Profit & Loss, Coding-Decoding"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-railway-blue dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('weakSubjects')}</label>
                        <input
                          type="text"
                          required
                          value={weakSubjects}
                          onChange={(e) => setWeakSubjects(e.target.value)}
                          placeholder="e.g. Syllogism, Blood Relations, Classical Physics"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-railway-blue dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-gradient-to-r from-railway-blue to-cyan-500 hover:brightness-110 text-white font-extrabold text-sm py-2.5 shadow-md active:scale-98 transition duration-200"
                      >
                        {t('generatePlan')}
                      </button>
                    </form>
                  )}
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
