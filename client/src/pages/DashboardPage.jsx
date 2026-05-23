import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { NotificationDropdown } from '../components/NotificationDropdown.jsx';
import { RailwayLogo } from '../components/layout/Header.jsx';

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
    value: '42',
    helper: '+6 revision mock sets completed this week',
    icon: ClipboardList,
    color: 'from-blue-600 to-indigo-600',
    tone: 'text-blue-500 bg-blue-500/10'
  },
  {
    label: 'Average Score',
    value: '78%',
    helper: '+4.8% improvement vs last Saturday',
    icon: Gauge,
    color: 'from-emerald-500 to-teal-600',
    tone: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    label: 'Test Accuracy',
    value: '84%',
    helper: 'Ranked high in Numerical Ability',
    icon: Target,
    color: 'from-violet-600 to-purple-700',
    tone: 'text-violet-500 bg-violet-500/10'
  },
  {
    label: 'Aspirant Rank',
    value: '#128',
    helper: 'Top 8% on active Vande Bharat Tier',
    icon: Medal,
    color: 'from-amber-500 to-orange-600',
    tone: 'text-amber-500 bg-amber-500/10'
  },
  {
    label: 'Daily Streak',
    value: '15 Days',
    helper: 'Streak multiplier active (1.5x XP)',
    icon: Flame,
    color: 'from-rose-500 to-red-650',
    tone: 'text-rose-500 bg-rose-500/10'
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
    badgeColor: 'bg-violet-500/15 text-violet-500'
  },
  {
    title: 'Unlocked Consistency Badge',
    meta: 'Maintained a 15-day daily streak',
    time: 'Yesterday',
    icon: Award,
    badge: 'Achievement',
    badgeColor: 'bg-amber-500/15 text-amber-500'
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
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-slate-800 dark:text-slate-100">
        {percentage}%
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const initials = getInitials(user?.name);

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800/60 dark:bg-slate-900 transition-all duration-300">
        <div className="grid min-h-[calc(100vh-9rem)] lg:grid-cols-[17rem_1fr]">
          
          {/* Side navigation */}
          <aside className="hidden border-r border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-[#0a1128]/40 lg:block">
            <SidebarContent />
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
                      STUDENT DECK
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
                <SidebarContent onClose={() => setIsSidebarOpen(false)} />
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
                      Aspirant Workspace
                    </p>
                    <h1 className="truncate text-base font-extrabold text-slate-950 dark:text-white sm:text-lg -mt-0.5">
                      Welcome back, {user?.name ?? 'Student'}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Dashboard Header Search trigger */}
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new window.CustomEvent('open-global-search'))}
                    className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-3 font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white shadow-sm"
                    title="Search (Press /)"
                  >
                    <Search size={14} className="text-slate-400" />
                    <span className="hidden md:inline text-xs">Search platform...</span>
                    <kbd className="hidden lg:inline-flex pointer-events-none select-none items-center gap-0.5 rounded border border-slate-250 bg-slate-50 px-1.5 font-mono text-[9px] text-slate-450 dark:border-slate-800 dark:bg-slate-900">
                      /
                    </kbd>
                  </button>
                  
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
                        <Link
                          to="/profile"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800"
                        >
                          <Settings size={14} className="text-slate-400" aria-hidden="true" />
                          <span>Account settings</span>
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
              
              {/* Daily Preparation Summary banner */}
              <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/90 to-white/40 p-5 shadow-md dark:from-slate-900/60 dark:to-slate-950/30 dark:border-slate-800/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-railway-blue/5 to-transparent pointer-events-none rounded-bl-full" />
                
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between relative z-10">
                  <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 rounded-md bg-railway-blue/10 px-2.5 py-1 text-xs font-bold text-railway-blue dark:bg-cyan-500/10 dark:text-cyan-300">
                      <Sparkles size={13} aria-hidden="true" className="text-railway-gold animate-bounce" />
                      <span>Smart Diagnostic Active</span>
                    </p>
                    <h2 className="text-xl font-extrabold text-slate-950 dark:text-white sm:text-2xl tracking-tight leading-tight">
                      You are 3 tasks away from completing today&apos;s station targets.
                    </h2>
                    <p className="max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                      Clearing these targets boosts your overall score metrics. Continue with a full mock test, a shift paper download, and the topic diagnostic.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/50 dark:border-slate-850 dark:bg-slate-950/50 shadow-inner">
                    <ProgressRing percentage={68} size={54} strokeWidth={5} colorClass="text-railway-blue" />
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Weekly Route Goal</p>
                      <p className="text-base font-extrabold text-slate-950 dark:text-white -mt-0.5">Shatabdi Target</p>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">280 XP to upgrade</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Six Key Metrics Grid */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat, i) => (
                  <StatCard key={stat.label} stat={stat} index={i} />
                ))}
              </div>

              {/* Two Column details section */}
              <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
                
                {/* Recent Activities Panel */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-md">
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

                {/* Focus Areas Progress bars */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-950 dark:text-white leading-tight">Weak Area Diagnostics</h2>
                    <p className="text-xs text-slate-450 font-semibold mt-0.5">
                      Recommended sprints based on CBT runs
                    </p>
                    
                    <div className="mt-5 space-y-4">
                      {[
                        { topic: 'Profit, Loss and Discount', progress: '72%', val: 72, color: 'from-blue-500 to-indigo-600', status: 'Moderate speed' },
                        { topic: 'Coding Decoding & Analogies', progress: '81%', val: 81, color: 'from-emerald-500 to-teal-500', status: 'Optimal accuracy' },
                        { topic: 'Modern History & Constitution', progress: '58%', val: 58, color: 'from-rose-500 to-red-600', status: 'Needs revision' },
                      ].map((item) => (
                        <div key={item.topic} className="space-y-1.5 p-3 rounded-lg bg-slate-50/80 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-800 dark:text-slate-250 truncate pr-2">{item.topic}</span>
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
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                            <span className="flex items-center gap-0.5">
                              <Clock size={10} />
                              {item.status}
                            </span>
                            <span className="text-railway-blue hover:underline cursor-pointer">Start Sprint</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                    <Link
                      to="/study-plan"
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-railway-blue dark:text-cyan-400 hover:brightness-110"
                    >
                      <CalendarDays size={14} />
                      <span>Review Train Route study schedule</span>
                    </Link>
                  </div>
                </section>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function SidebarContent({ onClose }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-6">
        {/* Profile Branding Header */}
        <div className="rounded-xl bg-gradient-to-br from-railway-blue via-railway-blue to-railway-navy p-4 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none rounded-bl-full" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-200">
            Exam Prep Deck
          </p>
          <p className="mt-0.5 text-base font-extrabold leading-tight">Aspirant Console</p>
          <div className="mt-3 flex items-center gap-2 text-[10px] bg-white/15 px-2.5 py-1 rounded font-bold self-start w-fit">
            <ShieldCheck size={11} className="text-railway-gold" />
            <span>Secure account verified</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.href ?? '/dashboard'}
              onClick={onClose}
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
          Railway Prep Engine v2.0
        </p>
      </div>
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
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur group overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-transparent via-slate-100 dark:via-slate-800 to-transparent" />
      
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {stat.label}
          </p>
          <p className="text-2xl font-extrabold text-slate-950 dark:text-white leading-tight">
            {stat.value}
          </p>
        </div>
        <span className={`grid size-10 place-items-center rounded-lg shadow-inner shrink-0 ${stat.tone}`}>
          <stat.icon size={18} aria-hidden="true" className="group-hover:scale-105 transition-transform" />
        </span>
      </div>
      
      <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
        <Sparkles size={11} className="text-railway-gold shrink-0" />
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
      className="flex gap-4 rounded-xl border border-slate-200/80 p-4 dark:border-slate-850 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-slate-800 transition-colors"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-600 border border-slate-100 dark:bg-slate-900 dark:text-slate-350 dark:border-slate-800/80 shadow-xs">
        <activity.icon size={16} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
            {activity.title}
          </h3>
          <span className="shrink-0 text-[10px] font-bold text-slate-400">
            {activity.time}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs">
          <p className="text-slate-500 dark:text-slate-400 font-semibold truncate">
            {activity.meta}
          </p>
          <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide ${activity.badgeColor}`}>
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
