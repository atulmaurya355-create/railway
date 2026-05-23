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
  Lock,
  Unlock,
  Download,
  CheckCircle2,
  Calendar,
  ArrowRight,
  RefreshCw,
  Info,
  Star,
  DownloadCloud,
  Home,
  Search
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { leaderboardService } from '../features/leaderboard/leaderboardService.js';
import { NotificationDropdown } from '../components/NotificationDropdown.jsx';
import { RailwayLogo } from '../components/layout/Header.jsx';

const navigationItems = [
  { label: 'Home Page', icon: Home, href: '/' },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Mock Tests', icon: ClipboardList, href: '/mock-tests' },
  { label: 'Study Materials', icon: BookOpenCheck, href: '/study-materials' },
  { label: 'Previous Papers', icon: FileText, href: '/previous-papers' },
  { label: 'AI Tutor', icon: Sparkles, href: '/ai-tutor' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Study Plan', icon: CalendarDays, href: '/study-plan' },
  { label: 'Achievements', icon: Trophy, active: true, href: '/achievements' },
  { label: 'Settings', icon: Settings, href: '/profile' },
];

// High fidelity seed data for Demo Mode
const demoStats = {
  totalXP: 1280,
  totalTests: 15,
  totalQuizzes: 4,
  totalScore: 420,
  correctAnswers: 145,
  totalAttempts: 180,
  accuracy: 81,
  currentStreak: 15,
  longestStreak: 22,
  lastActivityDate: new Date().toISOString(),
  badges: [
    { name: 'First Quiz', earnedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
    { name: '10 Quizzes', earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { name: '100 Questions Solved', earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
  ]
};

// Activity log for the past 7 days for streak calendar visual
const getPast7DaysActivity = (useDemo, attempts) => {
  const days = [];
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayLabel = labels[d.getDay()];
    const dateStr = d.toDateString();
    
    let hasActivity = false;
    if (useDemo) {
      const activeIndices = [0, 1, 2, 4, 6]; 
      const currentBackIndex = 6 - i;
      hasActivity = activeIndices.includes(currentBackIndex);
    } else {
      hasActivity = attempts.some(attempt => {
        const attemptDate = new Date(attempt.submittedAt || attempt.createdAt);
        return attemptDate.toDateString() === dateStr;
      });
    }

    days.push({
      label: dayLabel,
      date: d.getDate(),
      isToday: i === 0,
      active: hasActivity
    });
  }
  return days;
};

// 3D/Crest Shield Plate Component
function RailwayCrestShield({ badge }) {
  const IconComponent = badge.icon;
  return (
    <motion.div
      whileHover={{ y: -6, rotateY: 10 }}
      transition={{ duration: 0.4 }}
      className={`relative flex flex-col items-center justify-center p-6 text-center rounded-2xl border transition-all duration-300 overflow-hidden ${
        badge.unlocked 
          ? 'border-yellow-500/20 bg-gradient-to-br from-railway-navy via-slate-900 to-railway-navy shadow-xl shadow-yellow-500/5 group'
          : 'border-slate-800 bg-slate-950/40 opacity-55'
      }`}
    >
      
      {/* Dynamic shining shimmer overlay */}
      {badge.unlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      
      {/* 3D Shield Crest SVG Container */}
      <div className="relative mb-4 flex items-center justify-center shrink-0">
        <svg className="h-20 w-20 drop-shadow-[0_4px_8px_rgba(255,193,7,0.2)] transition-transform duration-500 group-hover:scale-105" viewBox="0 0 100 100" fill="none">
          <path d="M50 5 L85 20 V50 C85 75 50 95 50 95 C50 95 15 75 15 50 V20 L50 5 Z" 
            fill={badge.unlocked ? "url(#gold-shield-grad)" : "#1e293b"} 
            stroke={badge.unlocked ? "#FFC107" : "#475569"} 
            strokeWidth="3.5" 
            strokeLinejoin="round" 
          />
          <path d="M50 11 L79 23 V48 C79 69 50 86 50 86 C50 86 21 69 21 48 V23 L50 11 Z" 
            fill={badge.unlocked ? "#0A1128" : "#0f172a"} 
            stroke={badge.unlocked ? "#FFD700" : "#334155"} 
            strokeWidth="1.5" 
          />
          {badge.unlocked && (
            <>
              <circle cx="50" cy="78" r="1.5" fill="#FFC107" />
              <path d="M50 17 L52 21 L57 21 L53 24 L55 29 L50 26 L45 29 L47 24 L43 21 L48 21 Z" fill="#FFC107" />
            </>
          )}
          <defs>
            <linearGradient id="gold-shield-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="40%" stopColor="#FFD700" />
              <stop offset="70%" stopColor="#DAA520" />
              <stop offset="100%" stopColor="#8B6508" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central Icon Placement */}
        <div className="absolute inset-0 flex items-center justify-center -mt-1 z-10">
          <IconComponent className={`size-8 ${
            badge.unlocked ? 'text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-pulse-slow' : 'text-slate-500'
          }`} />
        </div>
      </div>

      <div className="relative z-10 space-y-1">
        <h4 className={`text-xs sm:text-sm font-black tracking-wide ${
          badge.unlocked ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-250 to-yellow-400' : 'text-slate-400'
        }`}>
          {badge.name}
        </h4>
        <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-snug font-medium line-clamp-2 px-2">
          {badge.description}
        </p>
      </div>

      {/* Unlocked / progress stamp */}
      <div className="relative z-10 mt-4 pt-3 border-t border-slate-800/80 w-full">
        {badge.unlocked ? (
          <p className="text-[9px] uppercase font-extrabold tracking-widest text-emerald-400 flex items-center justify-center gap-1">
            <CheckCircle2 size={10} />
            <span>UNLOCKED</span>
          </p>
        ) : (
          <div className="space-y-1 px-1">
            <div className="flex justify-between text-[9px] font-extrabold text-slate-500">
              <span>PROGRESS</span>
              <span>{badge.percent}%</span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-slate-650 rounded-full" style={{ width: `${badge.percent}%` }} />
            </div>
          </div>
        )}
      </div>

    </motion.div>
  );
}

// Vintage Ticket Certificate Component
function VintageTrainTicket({ reward, onDownload, downloadingId }) {
  const pnrNumber = `PNR: ${reward.id === 'reward_alp' ? '820' : reward.id === 'reward_arithmetic' ? '930' : '990'}-${Math.floor(1000000 + Math.random() * 9000000)}`;
  const ticketClass = "CLASS: 1AC (AI PREMIUM CHAMP)";
  const ticketDate = "BOARDING DATE: MAY 2026";
  const farePrice = reward.id === 'reward_challenger' ? "FARE: TOP ACCURACY" : `LEVEL PASS: ${reward.minLevel}`;

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 border-[#d9c391] bg-[#fcf9ef] p-5 text-slate-800 shadow-md flex flex-col md:flex-row justify-between gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
      !reward.unlocked && 'opacity-60 grayscale'
    }`}>
      
      {/* Background Vintage Watermarks */}
      <div className="absolute inset-0 bg-[radial-gradient(#b89855_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10 pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-32 h-32 border-[4px] border-[#b89855]/10 rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-36 h-36 border-[4px] border-[#b89855]/10 rounded-full pointer-events-none" />

      {/* Main Ticket Deck */}
      <div className="flex-1 space-y-4 relative z-10 min-w-0">
        
        {/* Ticket Header */}
        <div className="border-b border-dashed border-[#b89855]/40 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#a8863b]">
              Indian Railways Preparation Ticket
            </span>
            <h4 className="text-sm sm:text-base font-extrabold text-[#785b1a] font-serif">
              {reward.title}
            </h4>
          </div>
          <div className="rounded bg-[#a8863b]/15 px-2.5 py-1 text-[10px] font-black tracking-wide text-[#785b1a] uppercase border border-[#a8863b]/30">
            {pnrNumber}
          </div>
        </div>

        {/* Ticket Details Board */}
        <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-4 text-[10px] sm:text-xs font-bold text-[#5c4a22]">
          <div className="p-2 rounded bg-[#f5efe0] border border-[#d9c391]/30 min-w-0">
            <span className="text-[8px] text-[#a8863b] block uppercase">TRAIN SERVICE</span>
            <span className="text-slate-800 font-extrabold truncate block">Vande Bharat Prep</span>
          </div>
          <div className="p-2 rounded bg-[#f5efe0] border border-[#d9c391]/30 min-w-0">
            <span className="text-[8px] text-[#a8863b] block uppercase">CLASS CLASS</span>
            <span className="text-slate-800 font-extrabold truncate block">{ticketClass}</span>
          </div>
          <div className="p-2 rounded bg-[#f5efe0] border border-[#d9c391]/30 min-w-0">
            <span className="text-[8px] text-[#a8863b] block uppercase">FARE COST</span>
            <span className="text-slate-800 font-extrabold truncate block">{farePrice}</span>
          </div>
          <div className="p-2 rounded bg-[#f5efe0] border border-[#d9c391]/30 min-w-0">
            <span className="text-[8px] text-[#a8863b] block uppercase">BOARDING TIME</span>
            <span className="text-slate-800 font-extrabold truncate block">{ticketDate}</span>
          </div>
        </div>

        {/* Route Details */}
        <div className="flex items-center justify-between gap-4 py-2 text-xs font-extrabold text-[#785b1a]">
          <div className="text-left shrink-0">
            <span className="text-[8px] text-[#a8863b] block uppercase">DEPARTURE</span>
            <span>ASN (ASPIRANT)</span>
          </div>
          {/* Arrow / Track line divider */}
          <div className="flex-1 h-0.5 border-t border-dashed border-[#b89855] relative flex items-center justify-center min-w-[20px]">
            <Star size={11} className="text-[#a8863b] absolute bg-[#fcf9ef] px-0.5" />
          </div>
          <div className="text-right shrink-0">
            <span className="text-[8px] text-[#a8863b] block uppercase">DESTINATION</span>
            <span>{reward.subtitle.split(' ')[0]} TERMINUS</span>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-[#615233] font-medium italic">
          {reward.description}
        </p>

      </div>

      {/* Side Stub (Clipping / Barcode area) */}
      <div className="w-full md:w-36 flex md:flex-col items-center justify-between md:justify-center gap-4 pl-0 md:pl-5 border-t md:border-t-0 md:border-l border-dashed border-[#b89855]/50 pt-4 md:pt-0 shrink-0 relative z-10">
        
        {/* Vintage Circular Gold Foil Seal */}
        {reward.unlocked ? (
          <div className="relative flex items-center justify-center size-16 shrink-0">
            <svg className="absolute inset-0 size-full rotate-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" viewBox="0 0 100 100">
              <path d="M50 5 L55 12 L63 10 L65 18 L73 18 L72 26 L79 29 L75 36 L80 42 L74 48 L77 56 L70 60 L71 68 L63 70 L62 78 L54 78 L50 85 L46 78 L38 78 L37 70 L29 68 L30 60 L23 56 L26 48 L20 42 L25 36 L21 29 L28 26 L27 18 L35 18 L37 10 L45 12 Z" 
                fill="#FFC107" 
                stroke="#D4AF37" 
                strokeWidth="1.5" 
              />
              <circle cx="50" cy="46" r="28" fill="#FFF2A3" stroke="#B89855" strokeWidth="1" />
              <circle cx="50" cy="46" r="22" fill="none" stroke="#B89855" strokeWidth="0.5" strokeDasharray="3,3" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center -mt-2 font-serif select-none pointer-events-none scale-65">
              <span className="text-[7px] font-black text-[#8B6508] uppercase leading-tight">OFFICIAL</span>
              <span className="text-[9px] font-black text-[#5C4A22] leading-tight">PASSED</span>
              <span className="text-[6px] font-black text-[#a8863b] leading-tight">GATEWAY</span>
            </div>
          </div>
        ) : (
          <div className="size-14 rounded-full border border-dashed border-slate-350 flex items-center justify-center text-slate-400 shrink-0">
            <Lock size={16} />
          </div>
        )}

        {/* Barcode component with vertical bars */}
        <div className="flex flex-col items-center gap-1 shrink-0 bg-white/70 p-1.5 rounded border border-[#d9c391]/30">
          <div className="flex items-end h-6 w-24 gap-0.5 justify-center" aria-hidden="true">
            {[2,1,3,1,2,1,4,1,2,3,1,2,1,1,3,2,1].map((w, idx) => (
              <span 
                key={idx} 
                className={`bg-slate-800 h-full`} 
                style={{ width: `${w * 0.8}px` }} 
              />
            ))}
          </div>
          <span className="font-mono text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none">
            {reward.id === 'reward_alp' ? 'ALP-820X' : reward.id === 'reward_arithmetic' ? 'MTH-930X' : 'NTPC-CHALL'}
          </span>
        </div>

        {/* Action Button */}
        {reward.unlocked ? (
          <button
            type="button"
            onClick={() => onDownload(reward)}
            disabled={downloadingId !== null}
            className="w-full inline-flex items-center justify-center gap-1 bg-[#a8863b] hover:bg-[#785b1a] text-white font-extrabold text-[10px] uppercase tracking-wide px-3 py-2 rounded shadow-md transition shrink-0 disabled:bg-slate-400 active:scale-95"
          >
            {downloadingId === reward.id ? (
              <>
                <RefreshCw size={11} className="animate-spin" />
                <span>Clipping...</span>
              </>
            ) : (
              <>
                <Download size={11} />
                <span>Clip Ticket</span>
              </>
            )}
          </button>
        ) : (
          <div className="w-full text-center text-[10px] font-black uppercase text-slate-400 bg-slate-100 border border-slate-200 px-3 py-2 rounded">
            LOCKED STOP
          </div>
        )}

      </div>

    </div>
  );
}

export function AchievementsPage() {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [useDemoData, setUseDemoData] = useState(true);
  const [liveStats, setLiveStats] = useState(null);
  const [liveAttempts, setLiveAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingRewardId, setDownloadingRewardId] = useState(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState('');

  // Fetch live stats and attempts history
  useEffect(() => {
    async function fetchStatsAndAttempts() {
      try {
        setIsLoading(true);
        const statsResponse = await leaderboardService.getUserStats();
        const stats = statsResponse?.data?.stats;
        
        if (stats) {
          setLiveStats(stats);
          if (stats.totalXP > 0 || stats.totalTests > 0) {
            setUseDemoData(false);
          }
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch gamification stats:', err);
        setError('Could not fetch your live achievements. Displaying demo stats instead.');
        setUseDemoData(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatsAndAttempts();
  }, []);

  // Compute active stats
  const activeStats = useMemo(() => {
    return useDemoData ? demoStats : (liveStats || {
      totalXP: 0,
      totalTests: 0,
      totalQuizzes: 0,
      totalScore: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      accuracy: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      badges: []
    });
  }, [useDemoData, liveStats]);

  // Calculations for level progression
  const levelDetails = useMemo(() => {
    const totalXP = activeStats.totalXP;
    const level = Math.floor(totalXP / 500) + 1;
    const xpInCurrentLevel = totalXP % 500;
    const xpNeededForNextLevel = 500;
    const progressPercent = Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100);
    const xpToUnlockNext = xpNeededForNextLevel - xpInCurrentLevel;

    return {
      level,
      xpInCurrentLevel,
      xpNeededForNextLevel,
      progressPercent,
      xpToUnlockNext
    };
  }, [activeStats]);

  // Calculate 7 days activity
  const weeklyActivity = useMemo(() => {
    return getPast7DaysActivity(useDemoData, liveAttempts);
  }, [useDemoData, liveAttempts]);

  // Badges lists configuration
  const badgesList = useMemo(() => {
    const earnedBadgeNames = new Set(activeStats.badges.map(b => b.name));

    return [
      {
        id: 'first_quiz',
        name: 'First Quiz',
        description: 'Complete your first mock test or practice drill on the platform.',
        icon: Medal,
        colorClass: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-955 border-cyan-200 dark:border-cyan-800',
        unlocked: earnedBadgeNames.has('First Quiz') || activeStats.totalTests >= 1,
        progressText: `${Math.min(activeStats.totalTests, 1)}/1 mock completed`,
        percent: Math.min(Math.round((activeStats.totalTests / 1) * 100), 100),
        earnedDate: activeStats.badges.find(b => b.name === 'First Quiz')?.earnedAt
      },
      {
        id: 'ten_quizzes',
        name: '10 Quizzes',
        description: 'Establish a powerful learning habit by finishing 10 total tests.',
        icon: Trophy,
        colorClass: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-955 border-amber-200 dark:border-amber-800',
        unlocked: earnedBadgeNames.has('10 Quizzes') || activeStats.totalTests >= 10,
        progressText: `${Math.min(activeStats.totalTests, 10)}/10 mocks completed`,
        percent: Math.min(Math.round((activeStats.totalTests / 10) * 100), 100),
        earnedDate: activeStats.badges.find(b => b.name === '10 Quizzes')?.earnedAt
      },
      {
        id: 'questions_solved',
        name: '100 Solved',
        description: 'Engage with core syllabus and achieve 100 correct answers.',
        icon: Target,
        colorClass: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-955 border-emerald-200 dark:border-emerald-800',
        unlocked: earnedBadgeNames.has('100 Questions Solved') || activeStats.correctAnswers >= 100,
        progressText: `${Math.min(activeStats.correctAnswers, 100)}/100 correct questions`,
        percent: Math.min(Math.round((activeStats.correctAnswers / 100) * 100), 100),
        earnedDate: activeStats.badges.find(b => b.name === '100 Questions Solved')?.earnedAt
      },
      {
        id: 'top_scorer',
        name: 'Top Scorer',
        description: 'Score an elite 90% or higher accuracy on any full-length mock test.',
        icon: Star,
        colorClass: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-955 border-violet-200 dark:border-violet-800',
        unlocked: earnedBadgeNames.has('Top Scorer') || activeStats.accuracy >= 90,
        progressText: activeStats.accuracy >= 90 ? 'Unlocked!' : `Best: ${activeStats.accuracy}% (Need 90%)`,
        percent: Math.min(Math.round((activeStats.accuracy / 90) * 100), 100),
        earnedDate: activeStats.badges.find(b => b.name === 'Top Scorer')?.earnedAt
      }
    ];
  }, [activeStats]);

  // Milestone rewards configuration
  const rewardsList = useMemo(() => {
    const isTopScorerUnlocked = badgesList.find(b => b.id === 'top_scorer')?.unlocked;

    return [
      {
        id: 'reward_alp',
        title: 'RRB ALP & Tech Quick Revision PDF',
        subtitle: 'Level 2 Milestone Reward',
        description: 'A compressed summary of physics, engineering mechanics, and technical speed formulas tailored for ALP/Technician CBT candidates.',
        minLevel: 2,
        requirementText: 'Requires Level 2',
        unlocked: levelDetails.level >= 2,
        downloadName: 'RRB_ALP_Technician_Quick_Revision_CheatSheet.txt',
        content: `===============================================================
RRB ALP & TECHNICIAN QUICK REVISION CHEATSHEET
===============================================================
CRITICAL PHYSICS FORMULAS:
1. FORCE & MOTION
   - Newton's Second Law: F = m * a (Force = Mass x Acceleration)
   - Equations of Motion:
     * v = u + a * t
     * s = u * t + 0.5 * a * t^2
     * v^2 = u^2 + 2 * a * s
   - Momentum: p = m * v

2. WORK, ENERGY & POWER
   - Work Done: W = F * d * cos(theta)
   - Kinetic Energy: KE = 0.5 * m * v^2
   - Potential Energy: PE = m * g * h
   - Power: P = Work / Time = Force x Velocity

3. ELECTRICAL ENGINEERING BASICS
   - Ohm's Law: V = I * R (Voltage = Current x Resistance)
   - Electric Power: P = V * I = I^2 * R = V^2 / R
   - Series Resistance: R_total = R1 + R2 + R3
   - Parallel Resistance: 1/R_total = 1/R1 + 1/R2 + 1/R3

FAST REVISION TIPS FOR ALP FLUID MECHANICS & BASIC SCIENCE:
- Density: Density = Mass / Volume
- Specific Gravity = Density of substance / Density of water at 4C
- Speed of Sound is fastest in solids, followed by liquids, and slowest in gases.
===============================================================
Prep hard, clear ALP! Brought to you by Railway Exam Prep Platform.
===============================================================`
      },
      {
        id: 'reward_arithmetic',
        title: 'Arithmetic Speed & Core Formula Guide',
        subtitle: 'Level 3 Milestone Reward',
        description: 'Quantitative aptitude shortcut handbook covering Speed-Time-Distance, Ratio Proportions, and interest calculation formulas.',
        minLevel: 3,
        requirementText: 'Requires Level 3',
        unlocked: levelDetails.level >= 3,
        downloadName: 'Quantitative_Aptitude_Speed_Formulas_Guide.txt',
        content: `===============================================================
QUANTITATIVE APTITUDE SPEED & CORE FORMULA GUIDE
===============================================================
1. TIME, SPEED & DISTANCE
   - Speed = Distance / Time
   - Average Speed (Two equal distances at x km/h and y km/h):
     Average Speed = (2 * x * y) / (x + y)
   - Relative Speed:
     * Same direction: S1 - S2
     * Opposite direction: S1 + S2
   - Train Problems: Time to cross a pole = Train Length / Speed

2. PERCENTAGE & PROFIT/LOSS
   - Profit % = (Profit / Cost Price) * 100
   - Loss % = (Loss / Cost Price) * 100
   - Selling Price (Profit): SP = CP * (100 + Profit%) / 100
   - Selling Price (Loss):   SP = CP * (100 - Loss%) / 100
   - Successive Percentage Changes: A + B + (A * B) / 100

3. INTEREST SYSTEMS
   - Simple Interest: SI = (P * R * T) / 100
   - Compound Interest: Amount = P * (1 + R/100)^T
   - Difference between CI and SI for 2 years: Diff = P * (R/100)^2

SPEED MATH TRICKS:
- Multiplying by 5: Multiply by 10 and divide by 2.
- Squaring numbers ending in 5: For (10x + 5)^2, write x*(x+1) followed by 25. Example: 65^2 = (6*7)25 = 4225.
===============================================================
Practice makes perfect! Best of luck!
===============================================================`
      },
      {
        id: 'reward_challenger',
        title: 'Premium NTPC Challenger Full Mock Pack',
        subtitle: 'Top Scorer Milestone Reward',
        description: 'Exclusive unlocking of 3 full-length advanced level mock test sets featuring high-tier reasoning questions and general science challenges.',
        minLevel: null,
        requirementText: 'Requires Top Scorer Badge',
        unlocked: isTopScorerUnlocked,
        downloadName: 'Premium_NTPC_Challenger_Mock_Questions.txt',
        content: `===============================================================
PREMIUM RRB NTPC CHALLENGER FULL MOCK PACK
===============================================================
TEST 01 - QUANTITATIVE SKILLS (CHALLENGER LEVEL)
1. A sum of money amounts to INR 6,690 after 3 years and INR 10,035 after 6 years on compound interest. Find the sum.
   [A] INR 4,400  [B] INR 4,460  [C] INR 4,520  [D] INR 4,600
   Explanation: Amount = P(1 + R/100)^n. P(1+R/100)^3 = 6690, P(1+R/100)^6 = 10035. Division gives (1+R/100)^3 = 1.5. Thus, P = 6690 / 1.5 = INR 4,460. Correct answer: B.

TEST 02 - LOGICAL REASONING (ADVANCED SYLLOGISM)
2. Statements:
   I. All scientists are graduates.
   II. No graduates are politicians.
   Conclusions:
   I. No scientists are politicians.
   II. Some graduates are scientists.
   [A] Only I follows  [B] Only II follows  [C] Both I and II follow  [D] Neither follows
   Explanation: Since all scientists are graduates, and no graduates are politicians, it is absolutely true that no scientists are politicians. Also, some graduates must be scientists since scientists are subset of graduates. Correct answer: C.

TEST 03 - GENERAL SCIENCE (CBT-2 SYLLABUS)
3. What is the equivalent resistance of an infinite network of 1-ohm resistors connected in a ladder format?
   [Hint: Solve the quadratic equation R_eq = 1 + 1 / (1 + 1/R_eq)...]
===============================================================
Keep studying and scoring 90%+!
===============================================================`
      }
    ];
  }, [levelDetails.level, badgesList]);

  // Handle reward download simulation
  const handleDownload = (reward) => {
    if (!reward.unlocked) return;

    setDownloadingRewardId(reward.id);
    setDownloadSuccessMessage('');

    setTimeout(() => {
      try {
        const blob = new Blob([reward.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', reward.downloadName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setDownloadSuccessMessage(`Success! Successfully clipped and downloaded ticket certificate: ${reward.title}`);
      } catch (err) {
        console.error('Download failed:', err);
      } finally {
        setDownloadingRewardId(null);
        setTimeout(() => setDownloadSuccessMessage(''), 4500);
      }
    }, 1500);
  };

  const initials = getInitials(user?.name);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
                  Gamification
                </p>
                <h1 className="truncate text-base sm:text-xl font-extrabold text-slate-950 dark:text-white -mt-0.5 leading-tight">
                  Achievements & Credentials
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
                          className="mt-1.5 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-355 dark:hover:bg-slate-800"
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
              
              {/* Gamification Status Switcher Card */}
              <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-850 dark:bg-slate-900/80 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      useDemoData
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      <Info size={11} />
                      <span>{useDemoData ? 'Demo System Active' : 'Live Data Stream Active'}</span>
                    </span>
                    {error && (
                      <span className="text-[10px] text-railway-red font-bold">
                        (Offline Mode Enforced)
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-white leading-tight">
                    {useDemoData
                      ? 'Demonstrating 3D Railway crest shields and printable ticket vouchers'
                      : 'Displaying your active stats logged from CBT test attempts'}
                  </h2>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setUseDemoData(!useDemoData)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-railway-blue px-3.5 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition"
                  >
                    <RefreshCw size={13} className="animate-spin-slow" />
                    <span>Switch to {useDemoData ? 'Live Logs' : 'Demo Showcase'}</span>
                  </button>
                </div>
              </div>

              {/* Download success banner */}
              <AnimatePresence>
                {downloadSuccessMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:border-emerald-950/20 dark:bg-emerald-950/30 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{downloadSuccessMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Level progression & daily streaks grid */}
              <div className="grid gap-6 md:grid-cols-[1fr_22rem]">
                
                {/* SVG circular level meter */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-railway-blue bg-railway-blue/5 px-2.5 py-1 rounded dark:text-cyan-300 dark:bg-cyan-500/10">
                        <Sparkles size={11} className="animate-bounce" />
                        <span>Shatabdi Level System</span>
                      </span>
                      <h2 className="text-base font-extrabold text-slate-950 dark:text-white mt-2">Active Syllabus Level</h2>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      500 XP / Level
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-[11rem_1fr] items-center gap-6 my-6">
                    
                    {/* SVG circular gauge */}
                    <div className="relative size-36 mx-auto flex items-center justify-center shrink-0">
                      <svg className="size-full -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          className="stroke-slate-100 dark:stroke-slate-800/60"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          className="stroke-railway-blue dark:stroke-cyan-400 transition-all duration-1000 ease-out"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={377}
                          strokeDashoffset={377 - (377 * levelDetails.progressPercent) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Shatabdi Tier</p>
                        <p className="text-3xl font-extrabold text-slate-950 dark:text-white mt-0.5">{levelDetails.level}</p>
                        <p className="text-[10px] font-black text-railway-blue dark:text-cyan-400 mt-1">{levelDetails.progressPercent}% Cleared</p>
                      </div>
                    </div>

                    {/* Progress breakdown */}
                    <div className="space-y-4 min-w-0">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Total Points Stacked</span>
                          <span className="text-slate-950 dark:text-white font-extrabold">{activeStats.totalXP.toLocaleString()} XP</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full dark:bg-slate-800/80 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-railway-blue to-indigo-650 transition-all duration-1000"
                            style={{ width: `${levelDetails.progressPercent}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-450 mt-1.5 flex justify-between font-semibold">
                          <span>{levelDetails.xpInCurrentLevel} / 500 XP</span>
                          <span className="text-railway-blue dark:text-cyan-400 font-extrabold">{levelDetails.xpToUnlockNext} XP to upgrade signals</span>
                        </div>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-150 dark:bg-slate-950/40 dark:border-slate-850">
                        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-semibold">
                          📝 <strong className="text-slate-700 dark:text-slate-350">Base XP Index:</strong> Standard topic logs grant 40 XP, full Mock CBTs grant 120 XP, and 1.5x daily streak multipliers activate automatically on consecutive days!
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-450 dark:text-slate-500">
                    <span>Solved: <strong className="text-slate-800 dark:text-slate-300">{activeStats.totalTests} CBT Mocks</strong></span>
                    <span>Corrects: <strong className="text-slate-800 dark:text-slate-300">{activeStats.correctAnswers} Qs</strong></span>
                    <span>Accuracy: <strong className="text-slate-800 dark:text-slate-300">{activeStats.accuracy}%</strong></span>
                  </div>
                </div>

                {/* Daily streaks & week active calendar */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Daily Preparation Streak</span>
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                        <Flame size={14} className="fill-rose-500" />
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/20 to-orange-50/10 dark:border-rose-950/30 dark:from-rose-950/10 dark:to-orange-950/5 p-4 flex items-center gap-3.5">
                      <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-rose-500 text-white shadow-md shadow-rose-500/20 animate-pulse">
                        <Flame size={24} className="fill-white" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">Streak Multiplier</p>
                        <p className="text-2xl font-black text-slate-950 dark:text-white mt-0.5">{activeStats.currentStreak} Days Run</p>
                        <p className="text-[10px] text-slate-450 font-bold mt-1">
                          Longest record: <strong className="text-slate-750 dark:text-slate-300">{activeStats.longestStreak} days</strong>
                        </p>
                      </div>
                    </div>

                    {/* Weekly calendar logs */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Weekly Halt Activity</p>
                      <div className="grid grid-cols-7 gap-1">
                        {weeklyActivity.map((day, idx) => (
                          <div key={idx} className="space-y-1">
                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 text-center">{day.label}</p>
                            <span
                              className={`mx-auto size-7.5 rounded-full font-extrabold text-[10px] flex items-center justify-center border transition-all duration-300 ${
                                day.active
                                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-sm'
                                  : day.isToday
                                  ? 'bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350 animate-pulse'
                                  : 'bg-white border-slate-200 text-slate-450 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-650'
                              }`}
                            >
                              {day.active ? (
                                <Flame size={12} className="fill-white text-white" />
                              ) : (
                                <span>{day.date}</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-450 dark:text-slate-550 text-center mt-4 border-t border-slate-100 pt-2.5 dark:border-slate-800 font-bold">
                    Streak maintenance boosts level multipliers up to 1.5x base XP!
                  </p>
                </div>

              </div>

              {/* Achievements Shield Plates Grid */}
              <section className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-950 dark:text-white leading-tight flex items-center gap-2">
                    <Trophy className="text-railway-gold" size={18} />
                    <span>Unlocked Milestone Crests</span>
                  </h2>
                  <p className="text-xs text-slate-450 font-semibold mt-0.5">
                    Ornate credentials rendered as gold railway shields with hover active rotation states
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {badgesList.map((badge) => (
                    <RailwayCrestShield key={badge.id} badge={badge} />
                  ))}
                </div>
              </section>

              {/* Printable Train Tickets Milestone Certificates */}
              <section className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-950 dark:text-white leading-tight flex items-center gap-2">
                    <DownloadCloud className="text-railway-blue dark:text-cyan-400" size={18} />
                    <span>Milestone Ticket Certificates</span>
                  </h2>
                  <p className="text-xs text-slate-450 font-semibold mt-0.5">
                    Printable vouchers styled as vintage, high-quality passenger train boarding cards with barcodes and golden seals
                  </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  {rewardsList.map((reward) => (
                    <VintageTrainTicket 
                      key={reward.id} 
                      reward={reward} 
                      levelDetails={levelDetails} 
                      user={user} 
                      onDownload={handleDownload} 
                      downloadingId={downloadingRewardId} 
                    />
                  ))}
                </div>
              </section>

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
