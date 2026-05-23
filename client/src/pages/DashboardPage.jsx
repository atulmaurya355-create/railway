import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Flame,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  Medal,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  User,
  X,
  Zap,
  Search,
  Home,
  Clock,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { useLanguage } from '../providers/LanguageProvider.jsx';
import { NotificationDropdown } from '../components/NotificationDropdown.jsx';
import { RailwayLogo } from '../components/layout/Header.jsx';

const getTranslationKey = (label) => {
  if (label === 'Home Page') return 'home';
  if (label === 'Mock Tests') return 'mockTests';
  if (label === 'Study Materials') return 'studyMaterials';
  if (label === 'Previous Papers') return 'previousPapers';
  if (label === 'AI Tutor') return 'aiTutor';
  if (label === 'Study Plan') return 'studyPlan';
  return label.toLowerCase();
};

const navigationItems = [
  { label: 'Home Page', icon: Home, href: '/' },
  { label: 'Dashboard', icon: LayoutDashboard, active: true, href: '/dashboard' },
  { label: 'Mock Tests', icon: ClipboardList, href: '/mock-tests' },
  { label: 'Study Materials', icon: BookOpenCheck, href: '/study-materials' },
  { label: 'Previous Papers', icon: FileText, href: '/previous-papers' },
  { label: 'AI Tutor', icon: Sparkles, href: '/ai-tutor' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Study Plan', icon: CalendarDays, href: '/study-plan' },
  { label: 'Achievements', icon: Trophy, href: '/achievements' },
  { label: 'Settings', icon: Settings, href: '/profile' },
];

const stats = [
  {
    label: 'Total Tests Taken',
    value: '42 Runs',
    helper: '+6 revision mock sets completed this week',
    icon: ClipboardList,
    color: 'from-blue-600 to-indigo-650',
    tone: 'text-blue-500 bg-blue-500/10'
  },
  {
    label: 'Average Score',
    value: '78%',
    helper: '+4.8% improvement vs last Saturday',
    icon: Gauge,
    color: 'from-emerald-500 to-teal-650',
    tone: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    label: 'Test Accuracy',
    value: '84%',
    helper: 'Ranked high in Numerical Ability',
    icon: Target,
    color: 'from-purple-600 to-indigo-600',
    tone: 'text-purple-500 bg-purple-500/10'
  },
  {
    label: 'Aspirant Rank',
    value: '#128',
    helper: 'Top 8% on active Vande Bharat Tier',
    icon: Medal,
    color: 'from-amber-500 to-orange-650',
    tone: 'text-amber-500 bg-amber-500/10'
  },
  {
    label: 'Daily Streak',
    value: '15 Days',
    helper: 'Streak multiplier active (1.5x XP)',
    icon: Flame,
    color: 'from-rose-500 to-orange-600',
    tone: 'text-rose-550 bg-rose-550/10'
  },
  {
    label: 'XP Points Earned',
    value: '12,480',
    helper: '+320 XP awarded for today\'s tasks',
    icon: Zap,
    color: 'from-cyan-500 to-blue-600',
    tone: 'text-cyan-500 bg-cyan-500/10'
  },
];

const recentActivity = [
  {
    title: 'Completed RRB NTPC Full Mock Test 07',
    meta: 'Scored 82% with 88% reasoning accuracy',
    time: '12 min ago',
    icon: ShieldCheck,
    badge: 'CBT Test',
    badgeColor: 'bg-blue-500/15 text-blue-500'
  },
  {
    title: 'Practiced Arithmetic Speed Set',
    meta: 'Solved 35 questions in 28 minutes',
    time: '1 hr ago',
    icon: Target,
    badge: 'Quant Set',
    badgeColor: 'bg-indigo-500/15 text-indigo-500'
  },
  {
    title: 'Unlocked Consistency Badge',
    meta: 'Maintained a 15-day daily streak',
    time: 'Yesterday',
    icon: Award,
    badge: 'Achievement',
    badgeColor: 'bg-amber-500/15 text-amber-555'
  },
  {
    title: 'Reviewed Current Affairs Notes',
    meta: 'Finished railway and economy quick revision',
    time: 'Yesterday',
    icon: BookOpenCheck,
    badge: 'Study File',
    badgeColor: 'bg-emerald-500/15 text-emerald-500'
  },
];

export function ProgressRing({ percentage, size = 52, strokeWidth = 4.5, colorClass = "text-railway-blue" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="text-slate-200 dark:text-slate-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800 dark:text-slate-100">
        {percentage}%
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const initials = getInitials(user?.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#060b19] dark:to-[#030712] transition-colors duration-300">
      
      {/* Interactive Collapsible Sidebar shell */}
      <div className="flex h-screen overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <aside 
          className={`hidden lg:flex flex-col border-r border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-900/60 transition-all duration-300 relative z-20 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Header Brand */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/50 dark:border-slate-850">
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="bg-slate-950 p-1.5 rounded-lg flex items-center justify-center shrink-0 shadow-inner">
                <RailwayLogo className="h-6 w-6 text-white" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-railway-blue to-cyan-500 bg-clip-text text-transparent truncate">
                  STUDENT DECK
                </span>
              )}
            </Link>
            
            {/* Collapse Trigger arrow */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:grid size-7 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 shadow-sm"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <SidebarContent isCollapsed={isSidebarCollapsed} />
          </div>
        </aside>

        {/* MOBILE DRAWER DRAWER */}
        <AnimatePresence>
          {isSidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative h-full w-72 border-r border-slate-250 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-950 p-1.5 rounded-lg">
                      <RailwayLogo className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">
                      STUDENT DECK
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    aria-label="Close navigation"
                    className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-655 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-900"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
                
                <div className="h-[calc(100vh-8rem)] overflow-y-auto">
                  <SidebarContent isCollapsed={false} onClose={() => setIsSidebarOpen(false)} />
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN BODY AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top dashboard menu */}
          <nav className="sticky top-0 z-10 h-16 border-b border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 dark:border-slate-800/40 dark:bg-[#060b19]/80 sm:px-6 flex items-center justify-between gap-3">
            
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900 lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={18} aria-hidden="true" />
              </button>
              
              <div className="min-w-0">
                <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">
                  Student Workspace
                </p>
                <h1 className="truncate text-base sm:text-xl font-extrabold text-slate-950 dark:text-white -mt-0.5 leading-tight">
                  Welcome back, {user?.name ?? 'Student'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search triggers */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new window.CustomEvent('open-global-search'))}
                className="hidden md:flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3.5 font-bold text-slate-500 hover:bg-white hover:text-slate-900 hover:border-railway-blue/30 dark:border-slate-850 dark:bg-slate-950/70 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white shadow-sm"
              >
                <Search size={13} className="text-slate-400" />
                <span className="text-[11px]">Search Workspace...</span>
                <kbd className="inline-flex pointer-events-none select-none items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-1 font-mono text-[8px] text-slate-450 dark:border-slate-800 dark:bg-slate-900">
                  /
                </kbd>
              </button>

              {/* Notification bell dropdown */}
              <NotificationDropdown />

              {/* Streak multiplier status */}
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:border-amber-500/25 dark:bg-amber-500/5 dark:text-amber-400 font-extrabold text-[10px] animate-pulse-slow">
                <Flame size={12} className="fill-current animate-bounce text-orange-500" />
                <span>1.5x XP</span>
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 text-left dark:border-slate-800 dark:bg-slate-950 shadow-sm"
                  aria-expanded={isProfileOpen}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="grid size-7 place-items-center rounded bg-gradient-to-tr from-railway-blue to-railway-red text-xs font-black text-white shadow-inner">
                    {initials}
                  </span>
                  <span className="hidden max-w-28 truncate text-xs font-bold text-slate-800 dark:text-slate-200 sm:block">
                    {user?.name ?? 'Student'}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" aria-hidden="true" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-40"
                      >
                        <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800/80">
                          <p className="truncate text-xs font-black text-slate-900 dark:text-white">
                            {user?.name ?? 'Student'}
                          </p>
                          <p className="truncate text-[10px] text-slate-500 mt-0.5">{user?.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="mt-1.5 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800"
                        >
                          <User size={13} className="text-slate-450" />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800"
                        >
                          <Settings size={13} className="text-slate-455" />
                          <span>Settings</span>
                        </Link>
                        
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-railway-red hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/20"
                          onClick={logout}
                        >
                          <LogOut size={13} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </nav>

          {/* Main workspace layout container */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-[#060b19]/60">
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Daily targets progress panel */}
              <div className="rounded-2xl border border-white/20 bg-white/60 p-5 shadow-lg dark:bg-slate-900/40 dark:border-slate-800/60 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none rounded-bl-full animate-pulse" />
                
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between relative z-10">
                  <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:bg-cyan-500/5 dark:text-cyan-350 border border-cyan-500/15">
                      <Sparkles size={13} className="text-railway-gold animate-bounce" />
                      <span>Smart Diagnostic Target Active</span>
                    </p>
                    <h2 className="text-xl font-extrabold text-slate-950 dark:text-white sm:text-2xl tracking-tight leading-tight">
                      You are 3 tasks away from completing today&apos;s station targets.
                    </h2>
                    <p className="max-w-2xl text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                      Clearing these targets boosts your overall score metrics. Continue with a full mock test, a shift paper download, and the topic diagnostic.
                    </p>
                  </div>

                  {/* Circular widget */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/50 dark:border-slate-850 dark:bg-slate-950/50 shadow-inner shrink-0">
                    <ProgressRing percentage={68} size={54} strokeWidth={5.5} colorClass="text-railway-blue dark:text-cyan-400" />
                    <div>
                      <p className="text-[9px] uppercase font-black tracking-wider text-slate-400">Weekly Route Goal</p>
                      <p className="text-sm font-extrabold text-slate-950 dark:text-white -mt-0.5">Shatabdi Target</p>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">280 XP to upgrade</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Six glowing metrics */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat, i) => (
                  <StatCard key={stat.label} stat={stat} index={i} />
                ))}
              </div>

              {/* Two Column details section */}
              <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
                
                {/* Recent Activities Panel */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-md">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-950 dark:text-white leading-tight">Recent Activity</h2>
                      <p className="text-xs text-slate-450 font-semibold mt-0.5">Your resolved runs and unlocked awards</p>
                    </div>
                    
                    <Link
                      to="/previous-papers"
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-950 flex items-center gap-1 shadow-sm transition-all"
                    >
                      <span>View history</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                  
                  <div className="space-y-3">
                    {recentActivity.map((activity, i) => (
                      <ActivityItem key={activity.title} activity={activity} index={i} />
                    ))}
                  </div>
                </section>

                {/* Focus Areas Diagnostic list */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-950 dark:text-white leading-tight">Weak Area Diagnostics</h2>
                    <p className="text-xs text-slate-450 font-semibold mt-0.5">
                      Recommended sprints based on CBT runs
                    </p>
                    
                    <div className="mt-5 space-y-4">
                      {[
                        { topic: 'Profit, Loss and Discount', progress: '72%', val: 72, color: 'from-blue-500 to-cyan-500', status: 'Moderate speed' },
                        { topic: 'Coding Decoding & Analogies', progress: '81%', val: 81, color: 'from-emerald-500 to-teal-500', status: 'Optimal accuracy' },
                        { topic: 'Modern History & Constitution', progress: '58%', val: 58, color: 'from-rose-500 to-red-650', status: 'Needs revision' },
                      ].map((item) => (
                        <div key={item.topic} className="space-y-1.5 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
                          <div className="flex items-center justify-between text-xs font-extrabold">
                            <span className="text-slate-850 dark:text-slate-250 truncate pr-2">{item.topic}</span>
                            <span className="text-slate-900 dark:text-slate-100 shrink-0">{item.progress}</span>
                          </div>
                          
                          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-850 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: item.progress }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold">
                            <span className="flex items-center gap-0.5">
                              <Clock size={10} />
                              {item.status}
                            </span>
                            <span className="text-railway-blue hover:underline cursor-pointer dark:text-cyan-400">Start Sprint</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                    <Link
                      to="/study-plan"
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-black text-railway-blue dark:text-cyan-400 hover:brightness-110"
                    >
                      <CalendarDays size={14} />
                      <span>Review Train Route study schedule</span>
                    </Link>
                  </div>
                </section>

              </div>

            </div>
          </main>
        </div>

      </div>
    </div>
  );
}

function SidebarContent({ isCollapsed, onClose }) {
  const { t } = useLanguage();

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-6">
        
        {/* Profile Branding box */}
        {!isCollapsed ? (
          <div className="rounded-2xl bg-gradient-to-br from-railway-blue via-railway-blue to-[#0a1128] p-4 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none rounded-bl-full animate-pulse-slow" />
            <p className="text-[9px] font-black uppercase tracking-widest text-cyan-300">
              {t('candidateDeck')}
            </p>
            <p className="mt-0.5 text-base font-extrabold leading-tight">{t('studyCockpit')}</p>
            <div className="mt-3.5 flex items-center gap-2 text-[9px] bg-white/15 px-2.5 py-1 rounded-md font-bold w-fit">
              <ShieldCheck size={11} className="text-railway-gold animate-bounce" />
              <span>{t('secureAccount')}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <div className="bg-gradient-to-br from-railway-blue to-cyan-500 p-2 rounded-xl text-white shadow-md">
              <ShieldCheck size={16} />
            </div>
          </div>
        )}

        {/* Links list */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.href ?? '/dashboard'}
              onClick={onClose}
              className={`flex items-center rounded-xl transition-all relative group ${
                isCollapsed ? 'justify-center p-3' : 'px-3.5 py-3 text-xs font-black gap-3'
              } ${
                item.active
                  ? 'bg-gradient-to-r from-railway-blue/10 to-transparent text-railway-blue border-l-[3px] border-railway-blue dark:text-cyan-400 dark:from-cyan-500/10 dark:border-cyan-400'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100'
              }`}
            >
              <item.icon 
                size={15} 
                className={`shrink-0 ${item.active ? 'text-railway-blue dark:text-cyan-400' : 'text-slate-400 group-hover:scale-105 transition-transform'}`} 
                aria-hidden="true" 
              />
              
              {!isCollapsed ? (
                <span>{t(getTranslationKey(item.label))}</span>
              ) : (
                /* Collapsed tooltip hover */
                <span className="absolute left-16 z-50 scale-0 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg group-hover:scale-100 whitespace-nowrap transition-all duration-200">
                  {t(getTranslationKey(item.label))}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {!isCollapsed && (
        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[9px] text-slate-400 font-extrabold">
            {t('version')}
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ stat, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur group overflow-hidden relative transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
      
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {stat.label}
          </p>
          <p className="text-2xl font-black text-slate-950 dark:text-white leading-tight">
            {stat.value}
          </p>
        </div>
        
        <span className={`grid size-10 place-items-center rounded-xl shadow-inner shrink-0 ${stat.tone}`}>
          <stat.icon size={18} aria-hidden="true" className="group-hover:scale-110 group-hover:rotate-3 transition-all" />
        </span>
      </div>
      
      <p className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <Sparkles size={11} className="text-railway-gold shrink-0 animate-bounce" />
        <span className="truncate">{stat.helper}</span>
      </p>
    </motion.article>
  );
}

function ActivityItem({ activity, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex gap-4 rounded-xl border border-slate-200/80 p-4 dark:border-slate-850 dark:bg-slate-950/20 hover:border-slate-350 dark:hover:border-slate-800 transition-colors"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-600 border border-slate-100 dark:bg-slate-900 dark:text-slate-350 dark:border-slate-800/80 shadow-xs">
        <activity.icon size={16} aria-hidden="true" />
      </span>
      
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
            {activity.title}
          </h3>
          <span className="shrink-0 text-[10px] font-black text-slate-400">
            {activity.time}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-3 text-xs font-semibold">
          <p className="text-slate-500 dark:text-slate-400 truncate">
            {activity.meta}
          </p>
          <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded tracking-wide border border-current/10 ${activity.badgeColor}`}>
            {activity.badge}
          </span>
        </div>
      </div>
    </motion.article>
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
