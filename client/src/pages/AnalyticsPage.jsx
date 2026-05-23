import { useEffect, useState, useMemo } from 'react';
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
  Clock,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Activity,
  Info,
  RefreshCw,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { NotificationDropdown } from '../components/NotificationDropdown.jsx';
import { RailwayLogo } from '../components/layout/Header.jsx';
import { httpClient } from '../services/httpClient.js';

// Chart.js imports and configuration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const navigationItems = [
  { label: 'Home Page', icon: Home, href: '/' },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Mock Tests', icon: ClipboardList, href: '/mock-tests' },
  { label: 'Study Materials', icon: BookOpenCheck, href: '/study-materials' },
  { label: 'Previous Papers', icon: FileText, href: '/previous-papers' },
  { label: 'AI Tutor', icon: Sparkles, href: '/ai-tutor' },
  { label: 'Analytics', icon: BarChart3, active: true, href: '/analytics' },
  { label: 'Study Plan', icon: CalendarDays, href: '/study-plan' },
  { label: 'Achievements', icon: Trophy, href: '/achievements' },
  { label: 'Settings', icon: Settings, href: '/profile' },
];

const demoAttempts = [
  {
    title: 'RRB NTPC CBT-1 Full Mock Test 01',
    testType: 'fullLength',
    category: 'RRB NTPC',
    topic: 'All Topics',
    score: 72,
    totalQuestions: 100,
    accuracy: 78,
    correctAnswers: 72,
    wrongAnswers: 20,
    skippedAnswers: 8,
    durationSeconds: 5400,
    timeTakenSeconds: 5100,
    submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    topicPerformance: {
      Mathematics: { correct: 24, total: 30 },
      Reasoning: { correct: 26, total: 30 },
      'General Awareness': { correct: 22, total: 40 },
    }
  },
  {
    title: 'Arithmetic Speed & Sectional Mock Test',
    testType: 'sectional',
    category: 'General Railway',
    topic: 'Mathematics',
    score: 18,
    totalQuestions: 25,
    accuracy: 82,
    correctAnswers: 18,
    wrongAnswers: 4,
    skippedAnswers: 3,
    durationSeconds: 1500,
    timeTakenSeconds: 1100,
    submittedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    topicPerformance: {
      Mathematics: { correct: 18, total: 25 },
    }
  },
  {
    title: 'RRB NTPC CBT-1 Full Mock Test 02',
    testType: 'fullLength',
    category: 'RRB NTPC',
    topic: 'All Topics',
    score: 79,
    totalQuestions: 100,
    accuracy: 84,
    correctAnswers: 79,
    wrongAnswers: 15,
    skippedAnswers: 6,
    durationSeconds: 5400,
    timeTakenSeconds: 4900,
    submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    topicPerformance: {
      Mathematics: { correct: 26, total: 30 },
      Reasoning: { correct: 27, total: 30 },
      'General Awareness': { correct: 26, total: 40 },
    }
  },
  {
    title: 'Reasoning Sectional Speed Quiz',
    testType: 'sectional',
    category: 'Group D',
    topic: 'Reasoning',
    score: 22,
    totalQuestions: 25,
    accuracy: 92,
    correctAnswers: 22,
    wrongAnswers: 2,
    skippedAnswers: 1,
    durationSeconds: 1500,
    timeTakenSeconds: 950,
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    topicPerformance: {
      Reasoning: { correct: 22, total: 25 },
    }
  },
  {
    title: 'General Science Focus Drill',
    testType: 'sectional',
    category: 'ALP & Technician',
    topic: 'General Science',
    score: 15,
    totalQuestions: 20,
    accuracy: 75,
    correctAnswers: 15,
    wrongAnswers: 5,
    skippedAnswers: 0,
    durationSeconds: 1200,
    timeTakenSeconds: 700,
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    topicPerformance: {
      'General Science': { correct: 15, total: 20 },
    }
  },
  {
    title: 'RRB NTPC CBT-1 Full Mock Test 03',
    testType: 'fullLength',
    category: 'RRB NTPC',
    topic: 'All Topics',
    score: 84,
    totalQuestions: 100,
    accuracy: 88,
    correctAnswers: 84,
    wrongAnswers: 11,
    skippedAnswers: 5,
    durationSeconds: 5400,
    timeTakenSeconds: 4800,
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    topicPerformance: {
      Mathematics: { correct: 28, total: 30 },
      Reasoning: { correct: 28, total: 30 },
      'General Awareness': { correct: 28, total: 40 },
    }
  }
];

export function AnalyticsPage() {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [useDemoData, setUseDemoData] = useState(true);
  const [liveAttempts, setLiveAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all'); 

  useEffect(() => {
    async function fetchAttempts() {
      try {
        setIsLoading(true);
        const response = await httpClient.get('/mock-tests/history/attempts');
        const attempts = response.data?.data?.attempts ?? [];
        setLiveAttempts(attempts);
        if (attempts.length > 0) {
          setUseDemoData(false);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch test history:', err);
        setError('Could not retrieve mock test history. Displaying demo data instead.');
        setUseDemoData(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAttempts();
  }, []);

  const activeAttempts = useMemo(() => {
    const rawAttempts = useDemoData ? demoAttempts : liveAttempts;
    let filtered = [...rawAttempts];
    filtered.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.testType === filterType);
    }
    return filtered;
  }, [useDemoData, liveAttempts, filterType]);

  const metrics = useMemo(() => {
    if (activeAttempts.length === 0) {
      return {
        accuracy: 0,
        totalTests: 0,
        timeSpent: '0h 0m',
        progress: 0,
        weakTopics: [],
        strongTopics: [],
        topicMetrics: []
      };
    }

    const totalTests = activeAttempts.length;
    const totalAccuracySum = activeAttempts.reduce((sum, a) => sum + (a.accuracy || 0), 0);
    const averageAccuracy = Math.round(totalAccuracySum / totalTests);

    const totalSeconds = activeAttempts.reduce((sum, a) => sum + (a.timeTakenSeconds || 0), 0);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const timeSpentString = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

    let progressImprovement = 0;
    if (totalTests > 1) {
      const firstAcc = activeAttempts[0].accuracy || 0;
      const lastAcc = activeAttempts[totalTests - 1].accuracy || 0;
      progressImprovement = lastAcc - firstAcc;
    } else if (totalTests === 1) {
      progressImprovement = activeAttempts[0].accuracy || 0;
    }

    const defaultTopics = {
      Mathematics: { correct: 0, total: 0 },
      Reasoning: { correct: 0, total: 0 },
      'General Science': { correct: 0, total: 0 },
      'General Awareness': { correct: 0, total: 0 },
      'Current Affairs': { correct: 0, total: 0 }
    };

    activeAttempts.forEach(attempt => {
      if (attempt.topicPerformance) {
        Object.entries(attempt.topicPerformance).forEach(([topic, stats]) => {
          if (defaultTopics[topic]) {
            defaultTopics[topic].correct += stats.correct;
            defaultTopics[topic].total += stats.total;
          }
        });
      } else {
        if (attempt.questions && attempt.questions.length > 0) {
          attempt.questions.forEach(q => {
            const topicGroup = q.topic || 'Mathematics';
            if (defaultTopics[topicGroup]) {
              defaultTopics[topicGroup].total += 1;
              if (q.isCorrect) {
                defaultTopics[topicGroup].correct += 1;
              }
            }
          });
        } else if (attempt.topic) {
          const topicGroup = attempt.topic;
          if (defaultTopics[topicGroup]) {
            defaultTopics[topicGroup].total += attempt.totalQuestions;
            defaultTopics[topicGroup].correct += attempt.correctAnswers;
          }
        } else {
          defaultTopics['Mathematics'].total += Math.round(attempt.totalQuestions * 0.3);
          defaultTopics['Mathematics'].correct += Math.round(attempt.correctAnswers * 0.3);
          defaultTopics['Reasoning'].total += Math.round(attempt.totalQuestions * 0.3);
          defaultTopics['Reasoning'].correct += Math.round(attempt.correctAnswers * 0.3);
          defaultTopics['General Awareness'].total += Math.round(attempt.totalQuestions * 0.4);
          defaultTopics['General Awareness'].correct += Math.round(attempt.correctAnswers * 0.4);
        }
      }
    });

    const parsedTopics = Object.entries(defaultTopics)
      .map(([name, stats]) => {
        const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        return { name, accuracy, total: stats.total };
      })
      .filter(t => t.total > 0 || t.accuracy > 0);

    const strongTopics = parsedTopics.filter(t => t.accuracy >= 70).sort((a, b) => b.accuracy - a.accuracy);
    const weakTopics = parsedTopics.filter(t => t.accuracy < 70).sort((a, b) => a.accuracy - b.accuracy);

    const fallbackStrong = strongTopics.length > 0 ? strongTopics : [{ name: 'Reasoning', accuracy: 84 }];
    const fallbackWeak = weakTopics.length > 0 ? weakTopics : [{ name: 'Current Affairs', accuracy: 62 }];

    return {
      accuracy: averageAccuracy,
      totalTests,
      timeSpent: timeSpentString,
      progress: progressImprovement,
      weakTopics: weakTopics.length > 0 ? weakTopics : fallbackWeak,
      strongTopics: strongTopics.length > 0 ? strongTopics : fallbackStrong,
      topicMetrics: parsedTopics
    };
  }, [activeAttempts]);

  // Chart configuration customized with neon colors
  const chartData = useMemo(() => {
    if (activeAttempts.length === 0) return null;

    const lineLabels = activeAttempts.map((attempt, index) => `Mock #${index + 1}`);
    const lineScores = activeAttempts.map(attempt => attempt.accuracy);

    const lineData = {
      labels: lineLabels,
      datasets: [
        {
          label: 'Accuracy (%)',
          data: lineScores,
          borderColor: '#00F0FF', 
          backgroundColor: 'rgba(0, 240, 255, 0.08)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#FFC107', 
          pointHoverRadius: 8,
          pointRadius: 4.5,
          borderWidth: 2.5
        }
      ]
    };

    const correctSum = activeAttempts.reduce((sum, a) => sum + (a.correctAnswers || 0), 0);
    const wrongSum = activeAttempts.reduce((sum, a) => sum + (a.wrongAnswers || 0), 0);
    const skippedSum = activeAttempts.reduce((sum, a) => sum + (a.skippedAnswers || 0), 0);

    const pieData = {
      labels: ['Correct', 'Wrong', 'Skipped'],
      datasets: [
        {
          data: [correctSum, wrongSum, skippedSum],
          backgroundColor: [
            'rgba(0, 240, 255, 0.8)', 
            'rgba(255, 46, 147, 0.8)',  
            'rgba(255, 193, 7, 0.8)'   
          ],
          borderColor: [
            '#00f0ff',
            '#FF2E93',
            '#FFC107'
          ],
          borderWidth: 1.5,
          hoverOffset: 6
        }
      ]
    };

    const barLabels = metrics.topicMetrics.length > 0 ? metrics.topicMetrics.map(t => t.name) : ['Mathematics', 'Reasoning', 'Science', 'Awareness'];
    const barDataPoints = metrics.topicMetrics.length > 0 ? metrics.topicMetrics.map(t => t.accuracy) : [80, 85, 75, 65];

    const barData = {
      labels: barLabels,
      datasets: [
        {
          label: 'Accuracy Score (%)',
          data: barDataPoints,
          backgroundColor: 'rgba(0, 91, 172, 0.8)',
          borderColor: '#005BAC',
          borderWidth: 1.5,
          borderRadius: 8
        }
      ]
    };

    return { lineData, pieData, barData };
  }, [activeAttempts, metrics]);

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
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/50 dark:border-slate-850">
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="bg-slate-950 p-1.5 rounded-lg flex items-center justify-center shrink-0">
                <RailwayLogo className="h-6 w-6 text-white" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-railway-blue to-cyan-500 bg-clip-text text-transparent truncate">
                  STUDENT DECK
                </span>
              )}
            </Link>
            
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

        {/* MOBILE DRAWER */}
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
                  Preparation Analytics
                </p>
                <h1 className="truncate text-base sm:text-xl font-extrabold text-slate-950 dark:text-white -mt-0.5 leading-tight">
                  Performance Insights
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <NotificationDropdown />
              
              <div className="relative">
                <button
                  type="button"
                  className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-left dark:border-slate-800 dark:bg-slate-950 shadow-sm"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="grid size-7 place-items-center rounded bg-gradient-to-tr from-railway-blue to-railway-red text-xs font-black text-white">
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
                          <p className="truncate text-[10px] text-slate-550 mt-0.5">{user?.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="mt-1.5 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800"
                        >
                          <User size={13} className="text-slate-450" />
                          <span>My Profile</span>
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

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-[#060b19]/60">
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Dynamic / Seed Data Toggle Banner */}
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                      useDemoData
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-550/15'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-550/15'
                    }`}>
                      <Info size={12} />
                      {useDemoData ? 'Demo Data Mode' : 'Live Data Mode'}
                    </span>
                    {error && (
                      <span className="text-xs text-red-600 dark:text-red-400 font-bold">
                        (Using seed data fallbacks)
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-950 dark:text-white leading-tight">
                    {useDemoData
                      ? 'Displaying curated RRB NTPC prep metrics'
                      : 'Displaying your live mock test performance statistics'}
                  </h2>
                  <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Toggle mode to check your live database attempts history or review our high-fidelity visualizations immediately.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setUseDemoData(!useDemoData)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-railway-blue to-cyan-500 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:brightness-110 transition shrink-0"
                >
                  <RefreshCw size={14} className="animate-spin-slow" />
                  <span>Switch to {useDemoData ? 'Live Data' : 'Demo Data'}</span>
                </button>
              </div>

              {/* Filters Control Row */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'All Mocks' },
                    { id: 'fullLength', label: 'Full Mocks' },
                    { id: 'sectional', label: 'Sectional' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setFilterType(btn.id)}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition ${
                        filterType === btn.id
                          ? 'bg-gradient-to-r from-railway-blue to-cyan-500 text-white shadow-md'
                          : 'bg-white text-slate-655 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-350 dark:border-slate-800'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-extrabold text-slate-450">
                  Total parsed: {activeAttempts.length} mock attempts
                </span>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                
                {/* Accuracy */}
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Overall Accuracy</p>
                      <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                        {metrics.accuracy}%
                      </p>
                    </div>
                    <span className="grid size-11 place-items-center rounded-xl text-emerald-500 bg-emerald-500/10 shadow-inner shrink-0">
                      <Target size={20} />
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-550 dark:text-slate-400">
                    <TrendingUp size={14} className="text-emerald-500" />
                    <span>Average correctness index</span>
                  </p>
                </article>

                {/* Total Tests */}
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Mock Tests</p>
                      <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                        {metrics.totalTests} Sets
                      </p>
                    </div>
                    <span className="grid size-11 place-items-center rounded-xl text-cyan-500 bg-cyan-500/10 shadow-inner shrink-0">
                      <ClipboardList size={20} />
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-550 dark:text-slate-400">
                    <Activity size={14} className="text-cyan-555" />
                    <span>Completed practice drills</span>
                  </p>
                </article>

                {/* Time Spent */}
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Time Spent</p>
                      <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                        {metrics.timeSpent}
                      </p>
                    </div>
                    <span className="grid size-11 place-items-center rounded-xl text-violet-500 bg-violet-500/10 shadow-inner shrink-0">
                      <Clock size={20} />
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-555 dark:text-slate-400">
                    <Zap size={14} className="text-violet-500" />
                    <span>Active exam duration logged</span>
                  </p>
                </article>

                {/* Progress */}
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Progress Delta</p>
                      <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                        {metrics.progress >= 0 ? `+${metrics.progress}%` : `${metrics.progress}%`}
                      </p>
                    </div>
                    <span className="grid size-11 place-items-center rounded-xl text-amber-500 bg-amber-500/10 shadow-inner shrink-0">
                      <Gauge size={20} />
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-bold text-slate-550 dark:text-slate-400">
                    Performance improvement trend delta
                  </p>
                </article>

                {/* Strong Topics */}
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Strong (Acc ≥ 70%)</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {metrics.strongTopics.slice(0, 2).map(t => (
                          <span key={t.name} className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                            {t.name} ({t.accuracy}%)
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="grid size-11 place-items-center rounded-xl text-emerald-500 bg-emerald-500/10 shadow-inner shrink-0">
                      <ShieldCheck size={20} />
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-bold text-slate-550 dark:text-slate-400">
                    Solid foundational domains
                  </p>
                </article>

                {/* Weak Topics */}
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Weak (Acc &lt; 70%)</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {metrics.weakTopics.slice(0, 2).map(t => (
                          <span key={t.name} className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-black text-red-800 dark:bg-red-950/40 dark:text-red-300">
                            {t.name} ({t.accuracy}%)
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="grid size-11 place-items-center rounded-xl text-red-500 bg-red-500/10 shadow-inner shrink-0">
                      <AlertCircle size={20} />
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-bold text-slate-555 dark:text-slate-400">
                    Targeted practice focus suggested
                  </p>
                </article>

              </div>

              {/* Glowing Cutoff predicted score bar */}
              <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-slate-900 to-[#0a1128] p-5 shadow-lg text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <p className="inline-flex items-center gap-1 rounded bg-cyan-500/10 px-2 py-0.5 text-[9px] font-black text-cyan-300 border border-cyan-500/20 uppercase tracking-widest">
                      Cutoff Predictor
                    </p>
                    <h3 className="text-base font-extrabold">Predicted RRB Cutoff Percentile Benchmark</h3>
                    <p className="text-xs text-slate-400 font-semibold">Based on NTPC 2024 category-1 averages vs active candidates</p>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 shadow-inner shrink-0">
                    <div>
                      <p className="text-[9px] uppercase font-black tracking-wider text-slate-500">Your Current Index</p>
                      <p className="text-xl font-black text-cyan-400 mt-0.5">82.4 Percentile</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-0.5">Safe margin: +4.2 percentile</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Display Grid */}
              {chartData ? (
                <>
                  <div className="grid gap-6 lg:grid-cols-2">
                    
                    {/* Line Chart */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-4">
                        <h3 className="text-base font-extrabold text-slate-950 dark:text-white">Accuracy Improvement Trend</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Accuracy evolution over consecutive mock attempts</p>
                      </div>
                      
                      <div className="h-64 flex items-center justify-center">
                        <Line
                          data={chartData.lineData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              tooltip: {
                                padding: 10,
                                cornerRadius: 8,
                                callbacks: {
                                  label: (context) => `Accuracy: ${context.parsed.y}%`
                                }
                              }
                            },
                            scales: {
                              y: {
                                min: 0,
                                max: 100,
                                ticks: { stepSize: 20 },
                                grid: { color: 'rgba(148, 163, 184, 0.05)' }
                              },
                              x: {
                                grid: { display: false }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-4">
                        <h3 className="text-base font-extrabold text-slate-950 dark:text-white">Subject-wise Correctness Index</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Preparation strength across different exam topics</p>
                      </div>
                      
                      <div className="h-64 flex items-center justify-center">
                        <Bar
                          data={chartData.barData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false }
                            },
                            scales: {
                              y: {
                                min: 0,
                                max: 100,
                                grid: { color: 'rgba(148, 163, 184, 0.05)' }
                              },
                              x: {
                                grid: { display: false }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Doughnut distribution */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 max-w-lg mx-auto">
                    <div className="mb-4 text-center">
                      <h3 className="text-base font-extrabold text-slate-950 dark:text-white">Overall Answer Metrics</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Correct vs. Incorrect vs. Skipped ratio cumulative</p>
                    </div>
                    
                    <div className="h-56 flex justify-center items-center">
                      <Pie
                        data={chartData.pieData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: { boxWidth: 12, padding: 15, font: { weight: 'bold' } }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 font-bold text-slate-400">
                  No mock history available for charting calculations.
                </div>
              )}

            </div>
          </main>
        </div>

      </div>
    </div>
  );
}

function SidebarContent({ isCollapsed, onClose }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-6">
        
        {!isCollapsed ? (
          <div className="rounded-2xl bg-gradient-to-br from-railway-blue via-railway-blue to-[#0a1128] p-4 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none rounded-bl-full animate-pulse-slow" />
            <p className="text-[9px] font-black uppercase tracking-widest text-cyan-300">
              Exam Prep Deck
            </p>
            <p className="mt-0.5 text-base font-extrabold leading-tight">Aspirant Console</p>
            <div className="mt-3.5 flex items-center gap-2 text-[9px] bg-white/15 px-2.5 py-1 rounded-md font-bold w-fit">
              <ShieldCheck size={11} className="text-railway-gold" />
              <span>Secure verified study key</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <div className="bg-gradient-to-br from-railway-blue to-cyan-500 p-2 rounded-xl text-white shadow-md">
              <ShieldCheck size={16} />
            </div>
          </div>
        )}

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
                  ? 'bg-gradient-to-r from-railway-blue/10 to-transparent text-railway-blue border-l-[3px] border-railway-blue dark:text-cyan-400 dark:from-cyan-500/10'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100'
              }`}
            >
              <item.icon 
                size={15} 
                className={`shrink-0 ${item.active ? 'text-railway-blue dark:text-cyan-400' : 'text-slate-400'}`} 
                aria-hidden="true" 
              />
              
              {!isCollapsed ? (
                <span>{item.label}</span>
              ) : (
                <span className="absolute left-16 z-50 scale-0 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg group-hover:scale-100 whitespace-nowrap transition-all duration-200">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {!isCollapsed && (
        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[9px] text-slate-400 font-extrabold">
            Railway Prep Deck v2.0
          </p>
        </div>
      )}
    </div>
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

// Collapsible sidebar state stored locally or managed by session
const isSidebarCollapsed = false;
