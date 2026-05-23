import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  HelpCircle,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TimerReset,
  Trophy,
  Users,
  Zap,
  Search,
  Download,
  Award,
  TrendingUp,
  Lightbulb,
  Check,
  Lock,
  Mail
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

const examTracks = [
  {
    id: 'ntpc',
    title: 'RRB NTPC',
    subtitle: 'Non-Technical Popular Categories',
    description: 'Graduate & Undergraduate level posts (Clerk, Guard, Station Master).',
    color: 'from-blue-600 to-indigo-700',
    accentColor: '#005BAC',
    stats: '15,230 Vacancies',
    pyqCount: '48 Sets',
    difficulty: 'Medium-High',
    activeUsers: '18.4k today'
  },
  {
    id: 'groupd',
    title: 'RRB Group D',
    subtitle: 'Level 1 Track Maintainer & Pointsman',
    description: 'Focused practice on General Science, Maths, Reasoning & GK.',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#10B981',
    stats: '103,769 Vacancies',
    pyqCount: '62 Sets',
    difficulty: 'Medium',
    activeUsers: '24.1k today'
  },
  {
    id: 'alp',
    title: 'ALP & Technician',
    subtitle: 'Assistant Loco Pilot',
    description: 'Engineering aptitude, technical trades, and Stage-1 & 2 CBT practice.',
    color: 'from-amber-500 to-orange-600',
    accentColor: '#F59E0B',
    stats: '5,696 Vacancies',
    pyqCount: '34 Sets',
    difficulty: 'High (Technical)',
    activeUsers: '12.8k today'
  },
  {
    id: 'je',
    title: 'RRB JE',
    subtitle: 'Junior Engineer (Civil, Mech, Elect, IT)',
    description: 'Specialist engineering papers combined with general aptitude diagnostics.',
    color: 'from-purple-600 to-pink-700',
    accentColor: '#8B5CF6',
    stats: '7,911 Vacancies',
    pyqCount: '28 Sets',
    difficulty: 'High',
    activeUsers: '9.2k today'
  },
  {
    id: 'rpf',
    title: 'RPF Constable & SI',
    subtitle: 'Railway Protection Force',
    description: 'Rigorous quantitative tests, general awareness, and physical standards guidelines.',
    color: 'from-rose-500 to-red-700',
    accentColor: '#D32F2F',
    stats: '4,660 Vacancies',
    pyqCount: '20 Sets',
    difficulty: 'Medium',
    activeUsers: '15.6k today'
  }
];

const trendingExams = [
  { title: 'RRB NTPC Stage 1 - CBT Mock 12', attempts: '14,204 attempts', successRate: '68% Pass', rating: 4.8 },
  { title: 'ALP Technical Trade - Electrician Mock 3', attempts: '8,409 attempts', successRate: '54% Pass', rating: 4.6 },
  { title: 'Group D Science - Physics Booster 5', attempts: '22,110 attempts', successRate: '79% Pass', rating: 4.9 },
  { title: 'RRB JE General Aptitude - Revision Set 2', attempts: '5,992 attempts', successRate: '62% Pass', rating: 4.7 }
];

const pyqPapers = [
  { year: '2024', exam: 'RRB NTPC Shift 1', date: 'CBT-1 Jan 12, 2024', size: '2.4 MB', code: 'NTPC-2024-C1-S1' },
  { year: '2023', exam: 'Group D Stage 1 Combined', date: 'CBT Sept 18, 2023', size: '4.8 MB', code: 'GRPD-2023-COMB' },
  { year: '2022', exam: 'ALP Stage-2 Part A & B', date: 'CBT-2 Aug 04, 2022', size: '3.1 MB', code: 'ALP-2022-C2' },
  { year: '2021', exam: 'RRB JE Technical - Civil', date: 'CBT Nov 14, 2021', size: '1.9 MB', code: 'JE-2021-CIVIL' }
];

const aiDoubtPrompts = [
  {
    question: 'How do I solve train crossing pole problems?',
    answer: 'When a train passes a stationary pole, the distance traveled equals the length of the train. Formula: **Time = Train Length / Speed**.\n\n*Example:* A 150m train running at 54 km/h (15 m/s) crosses a pole in:\n**150 / 15 = 10 seconds**.'
  },
  {
    question: 'Short trick for Calendar matching years?',
    answer: 'To find when a calendar repeats, divide the year by 4:\n- Remainder 1: Add **+6 years**\n- Remainder 2 or 3: Add **+11 years**\n- Remainder 0 (Leap Year): Add **+28 years**\n\n*Example:* 2024 is a leap year (rem 0), so it repeats in 2024 + 28 = **2052**!'
  },
  {
    question: 'Concept of Relative Speed for opposite directions?',
    answer: 'When two trains move toward each other (opposite directions), their speeds **ADD UP** to calculate relative speed.\n\n**Relative Speed = Speed(A) + Speed(B)**\n*Note:* Multiply km/h by **5/18** to convert immediately to m/s!'
  }
];

export function HomePage() {
  // CBT Showcase states
  const [cbtActiveTab, setCbtActiveTab] = useState('math');
  const [cbtSelectedOption, setCbtSelectedOption] = useState(null);
  const [cbtTimeLeft, setCbtTimeLeft] = useState(120); // 2 minutes countdown
  
  // AI Doubt solver states
  const [activeDoubtIndex, setActiveDoubtIndex] = useState(0);
  const [aiTypingText, setAiTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // PYQ Download state
  const [downloadingId, setDownloadingId] = useState(null);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCbtTimeLeft((prev) => (prev > 0 ? prev - 1 : 120));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // AI typing simulation
  useEffect(() => {
    setIsTyping(true);
    setAiTypingText('');
    const fullText = aiDoubtPrompts[activeDoubtIndex].answer;
    let index = 0;
    
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setAiTypingText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 8); // Fast typing speed

    return () => clearInterval(typingInterval);
  }, [activeDoubtIndex]);

  // Handle mock download
  const handleDownload = (code) => {
    setDownloadingId(code);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Successfully downloaded PDF: ${code}.pdf. Good luck with your practice!`);
    }, 1500);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#060b19] dark:text-slate-100 min-h-screen pb-20 space-y-24">
      {/* BACKGROUND GRAPHICS: Train tracks grid */}
      <div className="absolute inset-0 pointer-events-none railway-grid opacity-70 z-0" />
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-railway-blue/5 dark:bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-railway-red/5 dark:bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* SECTION 1: HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-railway-blue/20 bg-white/80 px-4 py-2 text-xs sm:text-sm font-semibold text-railway-blue dark:border-cyan-500/20 dark:bg-slate-900/80 dark:text-cyan-300 shadow-sm glass-panel"
          >
            <Sparkles size={14} className="text-railway-gold animate-pulse" />
            <span>AI-Powered Exam Engine v2.0 Live</span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Crack RRB Exams with{' '}
              <span className="bg-gradient-to-r from-railway-blue via-railway-red to-railway-gold bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Preparation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-350"
            >
              Practice mock tests mimicking the actual Indian Railways computer-based exams (CBT). Solve previous year shift papers, track your subject analytics, and resolve complex physics or math questions instantly using our active AI Tutor.
            </motion.p>
          </div>

          {/* Primary Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              as={Link}
              to="/register"
              className="h-12 px-6 rounded-lg font-bold bg-gradient-to-r from-railway-blue to-railway-red hover:from-railway-blue/90 hover:to-railway-red/90 text-white shadow-lg flex items-center justify-center gap-2 border-none transform transition hover:scale-[1.02]"
            >
              Start Free Preparation
              <ArrowRight size={18} />
            </Button>
            <Button
              as={Link}
              to="/login"
              variant="secondary"
              className="h-12 px-6 rounded-lg font-semibold border-slate-200/80 bg-white/95 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm flex items-center justify-center gap-2"
            >
              <PlayCircle size={18} className="text-railway-red" />
              Take Free Mock Test
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60"
          >
            <p className="text-xs uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-4">
              COMMITTED TO EXCELLENCE
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Active Learners', val: '50,000+' },
                { label: 'Practice Sets', val: '10,000+' },
                { label: 'AI Doubt Support', val: '24/7 Live' },
                { label: 'Real Exam Layout', val: '100% CBT' }
              ].map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-railway-blue to-railway-gold bg-clip-text text-transparent">
                    {item.val}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 3D Train Visual Mockup Panel with floating features */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-railway-blue/10 to-railway-red/10 rounded-full blur-[60px] animate-pulse-slow pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative w-full max-w-md animate-float-soft"
          >
            {/* Real static Vande Bharat image loaded */}
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-slate-900/40 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800/40">
              <div className="relative h-60 w-full rounded-xl bg-slate-950/80 overflow-hidden flex items-center justify-center">
                {/* 3D Scene elements */}
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                {/* Motion track lines */}
                <div className="absolute bottom-6 w-[200%] h-1 bg-gradient-to-r from-transparent via-railway-gold to-transparent animate-train-running opacity-80" />
                <div className="absolute bottom-10 w-[200%] h-[2px] bg-white/20 animate-train-running animation-delay-300" />
                
                <img
                  src="/vande_bharat_3d.png"
                  alt="3D Vande Bharat Train"
                  className="relative z-20 h-44 object-contain filter drop-shadow-[0_15px_15px_rgba(0,91,172,0.4)]"
                />
                
                {/* Floating particle elements */}
                <div className="absolute top-8 left-12 w-2 h-2 rounded-full bg-railway-gold animate-ping opacity-60" />
                <div className="absolute top-16 right-16 w-3 h-3 rounded-full bg-cyan-400 animate-pulse opacity-40" />
                <div className="absolute bottom-20 left-24 w-1.5 h-1.5 rounded-full bg-railway-red animate-ping" />
              </div>

              {/* Connected glass cards summarizing daily activities */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 dark:bg-slate-950/50">
                  <div className="flex items-center gap-1.5 text-railway-gold font-bold mb-1">
                    <Trophy size={13} />
                    <span>Leaderboard</span>
                  </div>
                  <p className="text-white font-medium">Rank #142 (94th pct)</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 dark:bg-slate-950/50">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                    <Zap size={13} />
                    <span>Streak</span>
                  </div>
                  <p className="text-white font-medium">12 Days Active</p>
                </div>
              </div>
            </div>
            
            {/* Speed trails and motion lines outside */}
            <div className="absolute -left-6 top-[40%] w-12 h-1 bg-railway-red rounded-full opacity-60 blur-xs" />
            <div className="absolute -right-6 top-[30%] w-16 h-0.5 bg-railway-blue rounded-full opacity-60 blur-xs" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: EXAM CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <SectionHeading
          eyebrow="Exam categories"
          title="Choose Your Railway Exam Track"
          text="Start with a dedicated mock category designed directly from recent exam notifications."
        />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {examTracks.map((track, i) => (
            <motion.article
              key={track.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 group"
            >
              {/* Colored top bar indicator */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${track.color}`} />
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {track.difficulty}
                </span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded font-semibold">
                  {track.pyqCount}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-950 dark:text-white leading-tight mb-1 group-hover:text-railway-blue dark:group-hover:text-cyan-400 transition-colors">
                {track.title}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mb-2">{track.subtitle}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {track.description}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="font-bold text-railway-red">{track.stats}</span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Users size={11} />
                  {track.activeUsers}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* SECTION 3: POPULAR EXAMS HUB */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 relative z-10 items-center">
        <div className="lg:col-span-5 space-y-6">
          <SectionHeading
            eyebrow="Popular Exams"
            title="Trending Mock Exams Searched by Aspirants"
            text="Boost your computer aptitude. These practice mocks are currently yielding the highest rate of score improvements this week."
          />
          <div className="p-5 rounded-xl border border-railway-blue/10 bg-railway-blue/5 dark:bg-slate-900/40 space-y-4">
            <div className="flex gap-3">
              <span className="grid size-9 place-items-center rounded bg-railway-blue text-white shrink-0">
                <TrendingUp size={18} />
              </span>
              <div>
                <h4 className="font-bold text-sm">Real-time Competition Analysis</h4>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed mt-0.5">
                  Over 12,000 users are active on the NTPC sprint layout right now. Challenge your speeds today.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid gap-4">
          {trendingExams.map((exam, i) => (
            <motion.div
              key={exam.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-railway-blue/20 dark:border-slate-800 dark:bg-slate-900/60 transition-all group"
            >
              <div className="space-y-1 pr-4">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-railway-blue dark:group-hover:text-cyan-400 transition-all">
                  {exam.title}
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-slate-400" />
                    {exam.attempts}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={12} />
                    {exam.successRate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-railway-gold text-xs font-bold">
                  <Star size={12} fill="currentColor" />
                  {exam.rating}
                </div>
                <Button
                  as={Link}
                  to="/register"
                  className="h-8 w-8 p-0 rounded-full bg-slate-100 hover:bg-railway-blue hover:text-white text-slate-700 dark:bg-slate-800 dark:hover:bg-cyan-500 dark:text-slate-300 flex items-center justify-center transition-all"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE MOCK TEST SHOWCASE (CBT DIAGNOSTIC) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-railway-red bg-railway-red/10 px-3 py-1 rounded-full">
            Computer Based Test (CBT) Diagnostic
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Experience the Actual Exam Layout Beforehand
          </h2>
          <p className="text-slate-655 dark:text-slate-350 text-sm">
            Practice with our immersive simulated console. Choose a subject below to test your quick responses.
          </p>
        </div>

        {/* Mock CBT Console Container */}
        <div className="rounded-xl border border-slate-350 dark:border-slate-800 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden max-w-4xl mx-auto">
          {/* Console Header */}
          <div className="bg-slate-950 px-4 py-3 flex flex-wrap items-center justify-between border-b border-slate-800 text-xs gap-3">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-railway-blue text-white font-bold tracking-wide">
                STAGE-1 CBT
              </span>
              <span className="text-slate-400 font-semibold hidden sm:inline">RRB NTPC Sample Diagnostic</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
                <TimerReset size={14} className="animate-spin-slow" />
                <span>Time Left: {formatTime(cbtTimeLeft)}</span>
              </div>
              <span className="text-slate-500">|</span>
              <span className="font-bold text-slate-300">Aspirant ID: RRB-2026-MOCK</span>
            </div>
          </div>

          {/* Subject Navigation Tabs */}
          <div className="bg-slate-950/40 px-4 py-2 border-b border-slate-800/80 flex overflow-x-auto gap-2">
            {[
              { id: 'math', label: 'Mathematics' },
              { id: 'reasoning', label: 'General Intelligence' },
              { id: 'science', label: 'General Science' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCbtActiveTab(tab.id);
                  setCbtSelectedOption(null);
                }}
                className={`px-3 py-1 rounded text-xs font-bold transition-all whitespace-nowrap ${
                  cbtActiveTab === tab.id
                    ? 'bg-railway-blue text-white shadow-sm'
                    : 'text-slate-450 hover:bg-slate-850 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Question & Interactive Selection */}
          <div className="p-6 min-h-[220px] flex flex-col justify-between">
            <div>
              {cbtActiveTab === 'math' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-railway-gold">Q1.</span>
                    <p className="font-medium text-sm sm:text-base leading-relaxed">
                      A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long at the same speed?
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    {[
                      { val: 'A', text: '65 seconds' },
                      { val: 'B', text: '89 seconds (Correct)', correct: true },
                      { val: 'C', text: '72 seconds' },
                      { val: 'D', text: '95 seconds' }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setCbtSelectedOption(opt.val)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left text-xs sm:text-sm font-semibold transition-all ${
                          cbtSelectedOption === opt.val
                            ? opt.correct
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : 'bg-rose-500/20 border-rose-500 text-rose-400'
                            : 'bg-slate-950/50 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <span className={`grid size-6 place-items-center rounded-full text-xs font-extrabold ${
                          cbtSelectedOption === opt.val ? 'bg-current text-slate-950' : 'bg-slate-850'
                        }`}>
                          {opt.val}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {cbtActiveTab === 'reasoning' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-railway-gold">Q1.</span>
                    <p className="font-medium text-sm sm:text-base leading-relaxed">
                      If BENGALURU is coded as 951411232 and CHENNAI is coded as 38551419, then how will KOLKATA be coded in that language?
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    {[
                      { val: 'A', text: '111512111201' },
                      { val: 'B', text: '232145124119' },
                      { val: 'C', text: '111512110120 (Correct)', correct: true },
                      { val: 'D', text: '341254199990' }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setCbtSelectedOption(opt.val)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left text-xs sm:text-sm font-semibold transition-all ${
                          cbtSelectedOption === opt.val
                            ? opt.correct
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : 'bg-rose-500/20 border-rose-500 text-rose-400'
                            : 'bg-slate-950/50 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <span className={`grid size-6 place-items-center rounded-full text-xs font-extrabold ${
                          cbtSelectedOption === opt.val ? 'bg-current text-slate-950' : 'bg-slate-850'
                        }`}>
                          {opt.val}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {cbtActiveTab === 'science' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-railway-gold">Q1.</span>
                    <p className="font-medium text-sm sm:text-base leading-relaxed">
                      Which of the following represents Newton&apos;s Second Law of Motion mathematically under standard assumptions?
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    {[
                      { val: 'A', text: 'F = m * a (Correct)', correct: true },
                      { val: 'B', text: 'P = m * v' },
                      { val: 'C', text: 'W = F * d' },
                      { val: 'D', text: 'v = u + a*t' }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setCbtSelectedOption(opt.val)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left text-xs sm:text-sm font-semibold transition-all ${
                          cbtSelectedOption === opt.val
                            ? opt.correct
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : 'bg-rose-500/20 border-rose-500 text-rose-400'
                            : 'bg-slate-950/50 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <span className={`grid size-6 place-items-center rounded-full text-xs font-extrabold ${
                          cbtSelectedOption === opt.val ? 'bg-current text-slate-950' : 'bg-slate-850'
                        }`}>
                          {opt.val}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Explanatory Feedback banner */}
            {cbtSelectedOption && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm flex items-start gap-3"
              >
                <Lightbulb size={18} className="text-railway-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-200">
                    {cbtSelectedOption === 'B' || (cbtActiveTab === 'science' && cbtSelectedOption === 'A')
                      ? 'Correct Answer chosen!'
                      : 'Incorrect Choice.'}
                  </p>
                  <p className="text-slate-400 leading-relaxed mt-1">
                    {cbtActiveTab === 'math' &&
                      'Speed = Distance / Time = 240 / 24 = 10 m/s. To cross platform of 650m, total distance = Train (240) + Platform (650) = 890 m. Time = 890 / 10 = 89 seconds.'}
                    {cbtActiveTab === 'reasoning' &&
                      'KOLKATA is coded using direct alphabetical index numbers: K=11, O=15, L=12, K=11, A=01, T=20, A=01. Combined: 111512110120.'}
                    {cbtActiveTab === 'science' &&
                      'Newton&apos;s second law states that acceleration is directly proportional to net force and inversely proportional to mass. Force = Mass x Acceleration.'}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Console Footer */}
          <div className="bg-slate-950 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-850">
            <span className="text-slate-400 text-xs">Diagnostic Simulator v1.2</span>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setCbtSelectedOption(null)}
                variant="secondary"
                className="h-8 px-3 rounded text-xs bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800"
              >
                Clear Selection
              </Button>
              <Button
                as={Link}
                to="/register"
                className="h-8 px-4 rounded text-xs bg-railway-blue hover:bg-railway-blue/90 border-none font-bold"
              >
                Enroll For Complete Test Series (120+ Sets)
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PREVIOUS YEAR PAPERS HUB */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <SectionHeading
          eyebrow="Shift archives"
          title="Download PDF Shift Papers with Detailed Answers"
          text="Access fully resolved actual previous year questions formatted into offline shift papers."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pyqPapers.map((paper, i) => (
            <motion.div
              key={paper.code}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between relative group hover:border-railway-red/20 transition-all"
            >
              <div className="absolute top-4 right-4 text-xs font-bold text-railway-red/80 px-2 py-0.5 rounded bg-railway-red/5">
                {paper.year}
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  PDF EXAM KEY
                </span>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                  {paper.exam}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{paper.date}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-semibold">{paper.size}</span>
                <Button
                  onClick={() => handleDownload(paper.code)}
                  disabled={downloadingId !== null}
                  className="h-8 px-3 rounded-lg text-xs font-bold bg-slate-100 hover:bg-railway-blue hover:text-white text-slate-700 dark:bg-slate-850 dark:hover:bg-cyan-500 dark:text-slate-200 border-none flex items-center gap-1.5 transition-all"
                >
                  {downloadingId === paper.code ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-slate-400 border-t-current animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Download size={13} />
                      <span>Download</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 6: AI TUTOR DOUBT-SOLVER WIDGET */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 relative z-10 items-center">
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-railway-blue/10 px-3 py-1.5 text-xs font-semibold text-railway-blue dark:bg-cyan-500/10 dark:text-cyan-300"
          >
            <Bot size={14} className="text-railway-gold animate-bounce" />
            <span>Interactive AI Concept Mentor</span>
          </motion.div>

          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight leading-tight">
            Meet Your 24/7 AI Tutor: Resolve Doubts in Seconds
          </h2>
          <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
            Stuck on complex speed calculations, logical coding-decoding patterns, or physics definitions? Ask our tutor to explain it in easy steps with colored math models.
          </p>

          <div className="space-y-2">
            <p className="text-xs uppercase font-extrabold text-slate-450 tracking-wider">
              SELECT A DOUBT SAMPLE TO TEST:
            </p>
            <div className="flex flex-col gap-2">
              {aiDoubtPrompts.map((doubt, i) => (
                <button
                  key={doubt.question}
                  onClick={() => setActiveDoubtIndex(i)}
                  className={`px-4 py-2.5 rounded-lg border text-left text-xs sm:text-sm font-semibold transition-all ${
                    activeDoubtIndex === i
                      ? 'bg-railway-blue/10 border-railway-blue text-railway-blue dark:bg-cyan-500/10 dark:border-cyan-500 dark:text-cyan-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {doubt.question}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Answer Bubble Container */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur-md relative overflow-hidden min-h-[300px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-railway-gold/10 to-transparent pointer-events-none rounded-bl-full" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded bg-gradient-to-r from-railway-blue to-railway-navy text-white text-xs font-bold font-mono">
                    AI
                  </span>
                  <div>
                    <h4 className="font-bold text-xs">Railway Prep Tutor</h4>
                    <span className="text-[10px] text-emerald-500 flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      online
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">Response Speed: 0.2s</span>
              </div>

              {/* Doubt Question Bubble */}
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg max-w-[85%] self-end ml-auto text-xs sm:text-sm text-slate-850 dark:text-slate-200 font-semibold border border-slate-200/50 dark:border-slate-700">
                {aiDoubtPrompts[activeDoubtIndex].question}
              </div>

              {/* Explaining answer text formatted */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {aiTypingText}
                {isTyping && <span className="inline-block w-1.5 h-4 bg-railway-blue animate-pulse ml-0.5" />}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Brain size={12} className="text-railway-blue" />
                Powered by Llama 3 Railway Reasoning Model
              </span>
              <Button
                as={Link}
                to="/register"
                className="h-8 px-3 rounded text-[11px] font-bold bg-railway-red hover:bg-railway-red/90 border-none text-white shadow-inner"
              >
                Ask a Personal Doubt
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PERFORMANCE ANALYTICS PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 relative z-10 items-center">
        <div className="lg:col-span-7 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-railway-blue/5 to-railway-gold/5 blur-[50px] pointer-events-none rounded-full" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-5 rounded-2xl border border-slate-250 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h4 className="font-bold text-sm sm:text-base">Subject Preparation Metrics</h4>
                <p className="text-xs text-slate-450 font-semibold">Weekly average stats</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold text-railway-blue dark:text-cyan-300">
                Aspirant ID #4819
              </span>
            </div>

            <div className="space-y-4">
              {[
                { subject: 'Quantitative Aptitude (Speed Focus)', pct: 84, color: 'bg-railway-blue', score: '38/45 PYQs' },
                { subject: 'Logical Reasoning (Non-Verbal)', pct: 92, color: 'bg-emerald-500', score: '28/30 PYQs' },
                { subject: 'General Awareness (Current Affairs)', pct: 68, color: 'bg-railway-gold', score: '34/50 PYQs' },
                { subject: 'General Science (Physics & Chemistry)', pct: 75, color: 'bg-railway-red', score: '22/30 PYQs' }
              ].map((sub) => (
                <div key={sub.subject} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-250">{sub.subject}</span>
                    <span className="text-slate-900 dark:text-slate-100">{sub.score} ({sub.pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${sub.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${sub.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-slate-400 font-semibold">Total Time</p>
                <p className="font-extrabold text-base text-slate-900 dark:text-slate-100 mt-0.5">38.4 Hrs</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold">Weekly Growth</p>
                <p className="font-extrabold text-base text-emerald-500 mt-0.5">+14% Score</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold">Focus Factor</p>
                <p className="font-extrabold text-base text-railway-red mt-0.5">High Speed</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <SectionHeading
            eyebrow="AI-driven feedback"
            title="Smarter Reports That Guide Daily Targets"
            text="Skip the confusing numbers. Our performance previews identify exactly which topics hold your overall score back and suggest rapid correction sprints."
          />
          
          <div className="flex gap-4">
            <span className="grid size-11 place-items-center rounded-xl bg-railway-red/10 text-railway-red shrink-0">
              <BarChart3 size={20} />
            </span>
            <div className="space-y-1">
              <h4 className="font-bold text-sm sm:text-base">Targeted Weak Spot Isolator</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                Automatically isolates categories where you are spending over 90 seconds per answer and triggers speed improvement revisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: LIVE LEADERBOARD */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-railway-gold bg-railway-gold/15 px-3 py-1 rounded-full">
            Aspirant Rankings
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Learn with Peers on Top Railway Tiers
          </h2>
          <p className="text-slate-655 dark:text-slate-350 text-sm">
            Earn your badges and rank alongside active students classified by Indian Railway Speed Tiers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 overflow-hidden shadow-md">
          <div className="bg-slate-50 dark:bg-slate-950 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Aspirant Name</span>
            <div className="flex gap-12">
              <span className="hidden sm:inline">Tier Level</span>
              <span>Score Pct</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {[
              { name: 'Amit Pathak', tier: 'Vande Bharat Tier', pct: 99.8, rank: 1, rankColor: 'bg-amber-500' },
              { name: 'Sameer Sen', tier: 'Vande Bharat Tier', pct: 99.2, rank: 2, rankColor: 'bg-slate-400' },
              { name: 'Nikita Kumari', tier: 'Shatabdi Tier', pct: 98.4, rank: 3, rankColor: 'bg-amber-600' },
              { name: 'Vikram Singh', tier: 'Shatabdi Tier', pct: 97.5, rank: 4, rankColor: 'bg-slate-700' },
              { name: 'Megha Dwivedi', tier: 'Rajdhani Tier', pct: 96.1, rank: 5, rankColor: 'bg-slate-700' }
            ].map((usr) => (
              <div key={usr.name} className="px-6 py-4 flex justify-between items-center text-xs sm:text-sm font-semibold">
                <div className="flex items-center gap-3">
                  <span className={`grid size-6 place-items-center rounded-full text-[10px] font-extrabold text-white ${usr.rankColor}`}>
                    {usr.rank}
                  </span>
                  <span className="text-slate-900 dark:text-slate-200">{usr.name}</span>
                </div>

                <div className="flex items-center gap-12">
                  <span className="hidden sm:inline text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-350 px-2 py-0.5 rounded font-bold">
                    {usr.tier}
                  </span>
                  <span className="text-railway-blue font-bold">{usr.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: STUDENT SUCCESS STORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <SectionHeading
          eyebrow="Success Stories"
          title="Designed for Aspirants Who Practice Every Day"
          text="Hear from former students who turned consistent CBT practice runs into actual department postings."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: 'Ankit Kumar',
              role: 'Selected RRB NTPC (Station Master)',
              quote: 'The Mock diagnostics saved my prep. The live timed environments forced me to manage sections faster.',
              rating: 5,
              badge: 'Batch of 2024'
            },
            {
              name: 'Priya Sharma',
              role: 'Selected Group D (Pointsman)',
              quote: 'The mobile revision planner was brilliant. Doing short 10-question practice runs on the go changed everything.',
              rating: 5,
              badge: 'Batch of 2024'
            },
            {
              name: 'Rahul Verma',
              role: 'Selected ALP (Central Railway)',
              quote: 'Solving previous year papers shift-wise is a must. The AI Tutor explains complex electrician math quickly.',
              rating: 5,
              badge: 'Batch of 2023'
            }
          ].map((story, i) => (
            <motion.article
              key={story.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-xl border border-slate-250 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between relative group hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: story.rating }).map((_, idx) => (
                    <Star key={idx} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-railway-blue bg-railway-blue/5 px-2 py-0.5 rounded">
                  {story.badge}
                </span>
              </div>

              <p className="text-slate-650 dark:text-slate-300 text-xs sm:text-sm leading-relaxed italic mb-6">
                &quot;{story.quote}&quot;
              </p>

              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 shrink-0">
                  <Award size={18} className="text-railway-gold" />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {story.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{story.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* SECTION 10: PREMIUM FOOTER */}
      <footer className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 dark:border-slate-850 dark:bg-slate-900/60 shadow-xl backdrop-blur-md space-y-12">
          {/* Main Footer Links */}
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-gradient-to-r from-railway-blue to-railway-navy text-white shadow-inner">
                  <Trophy size={20} />
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-railway-blue to-railway-gold bg-clip-text text-transparent">
                    RAILWAY PREP
                  </span>
                  <span className="text-[9px] font-medium tracking-widest text-slate-400">
                    AI-POWERED PLATFORM
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-350 leading-relaxed max-w-md">
                India&apos;s premium modern examination learning environment. We bridge raw practice archives with custom AI analytics to help students clear railway entrance hurdles securely.
              </p>
              
              {/* Newsletter form */}
              <div className="space-y-2 max-w-xs">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Subscribe to exam alerts
                </p>
                <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter email..."
                    className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-railway-blue text-slate-900 dark:text-white flex-1"
                  />
                  <Button
                    type="submit"
                    className="h-9 px-3 bg-railway-blue hover:bg-railway-blue/90 text-white rounded-lg flex items-center justify-center border-none"
                  >
                    <Mail size={14} />
                  </Button>
                </form>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <FooterLinksColumn
                title="Sprints"
                links={[
                  { name: 'RRB NTPC Mocks', to: '/register' },
                  { name: 'Group D Science', to: '/register' },
                  { name: 'ALP General Aptitude', to: '/register' },
                  { name: 'Railway JE Technical', to: '/register' },
                  { name: 'RPF SI Revision', to: '/register' }
                ]}
              />
              <FooterLinksColumn
                title="Features"
                links={[
                  { name: 'Diagnostic Console', to: '/register' },
                  { name: '24/7 AI Tutor', to: '/register' },
                  { name: 'Shift PDF Archives', to: '/register' },
                  { name: 'Detailed Analytics', to: '/register' },
                  { name: 'Peer Leaderboard', to: '/register' }
                ]}
              />
              <FooterLinksColumn
                title="Aspirants"
                links={[
                  { name: 'Secure Login', to: '/login' },
                  { name: 'Enroll Free', to: '/register' },
                  { name: 'Interactive FAQ', to: '/register' },
                  { name: 'Terms of Use', to: '/register' },
                  { name: 'Support Inbox', to: '/register' }
                ]}
              />
            </div>
          </div>

          {/* Copyright line */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>&copy; 2026 Railway Prep Platform. Authorized learning partner mockup framework.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-railway-blue">Privacy</a>
              <span>&middot;</span>
              <a href="#" className="hover:text-railway-blue">Security Standards</a>
              <span>&middot;</span>
              <a href="#" className="hover:text-railway-blue">Exam Updates</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-xs uppercase font-extrabold tracking-widest text-railway-blue dark:text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight leading-tight">
        {title}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed max-w-2xl">
        {text}
      </p>
    </div>
  );
}

function FooterLinksColumn({ title, links }) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest">
        {title}
      </h4>
      <ul className="space-y-2 text-xs">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.to}
              className="text-slate-500 hover:text-railway-blue dark:text-slate-400 dark:hover:text-cyan-400 transition-colors font-medium"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
