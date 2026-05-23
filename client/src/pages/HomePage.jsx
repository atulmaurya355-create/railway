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
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TimerReset,
  Trophy,
  Users,
  Zap,
  Download,
  Award,
  TrendingUp,
  Lightbulb,
  Check
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { ThreeDScene } from '../components/3d/ThreeDScene.jsx';

const examTracks = [
  {
    id: 'ntpc',
    title: 'RRB NTPC',
    subtitle: 'Non-Technical Popular Categories',
    description: 'Graduate & Undergraduate level posts (Clerk, Guard, Station Master).',
    color: 'from-blue-600 to-cyan-500',
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
    color: 'from-emerald-500 to-teal-500',
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
    color: 'from-purple-600 to-pink-500',
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
    color: 'from-rose-500 to-red-650',
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

const testimonials = [
  {
    name: 'Amit Sharma',
    post: 'Station Master, RRB NTPC 2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    quote: 'The CBT interface of this platform is identical to the actual exam. Doing mock sets here kept my anxiety under control on the big day. Highly recommended!',
    badge: '100% CBT Accuracy'
  },
  {
    name: 'Priyanka Verma',
    post: 'Assistant Loco Pilot, ALP 2023',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    quote: 'The AI Tutor doubts solver cleared my speed-time formulas instantly. I completed the entire course target and achieved score increases within 2 weeks.',
    badge: 'Loco Master Gold'
  },
  {
    name: 'Rahul Maurya',
    post: 'Junior Engineer, Civil 2024',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    quote: 'Beautiful preparation dashboard! Detailed charts pointed out my weak areas in concrete tech, and the gold toppers lists kept me extremely motivated.',
    badge: 'Bullet Speedster'
  }
];

export function HomePage() {
  const [cbtActiveTab, setCbtActiveTab] = useState('math');
  const [cbtSelectedOption, setCbtSelectedOption] = useState(null);
  const [cbtTimeLeft, setCbtTimeLeft] = useState(120); 
  const [activeDoubtIndex, setActiveDoubtIndex] = useState(0);
  const [aiTypingText, setAiTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
    }, 10); 

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
      {/* Background neon tracking grids */}
      <div className="absolute inset-0 pointer-events-none railway-grid-neon opacity-75 z-0" />
      <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-[130px] pointer-events-none" />

      {/* HERO SECTION WITH 3D CANVAS */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-14 grid lg:grid-cols-12 gap-12 items-center min-h-[90vh]">
        <div className="lg:col-span-7 space-y-8">
          
          {/* Animated Sparkle Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs sm:text-sm font-black text-cyan-700 dark:border-cyan-400/30 dark:bg-[#0a1128]/80 dark:text-cyan-300 shadow-lg animate-neon-pulse"
          >
            <Sparkles size={15} className="text-railway-gold animate-bounce" />
            <span>EXAM TARGET RADAR V2.0 ENGINE LIVE</span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl leading-tight"
            >
              Master RRB Exams in Our{' '}
              <span className="bg-gradient-to-r from-railway-blue via-railway-red to-railway-gold bg-clip-text text-transparent font-black">
                Interactive 3D
              </span>{' '}
              Study Cockpit
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl text-base sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300 font-medium"
            >
              Practice mock tests inside exact digital CBT console setups. Access shift-wise unsolved pdf papers, inspect subject analytics gauges, and clear technical doubts with our active AI Mentor.
            </motion.p>
          </div>

          {/* Primary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              as={Link}
              to="/register"
              className="h-13 px-8 rounded-xl font-black bg-gradient-to-r from-railway-blue to-railway-red text-white shadow-xl hover:shadow-cyan-500/20 flex items-center justify-center gap-2 border-none transform transition hover:scale-[1.03]"
            >
              Start Free Preparation
              <ArrowRight size={18} />
            </Button>
            
            <Button
              as={Link}
              to="/login"
              variant="secondary"
              className="h-13 px-8 rounded-xl font-bold border-slate-200/80 bg-white/95 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 shadow-md flex items-center justify-center gap-2"
            >
              <PlayCircle size={18} className="text-railway-red animate-pulse" />
              Take Free Mock Test
            </Button>
          </motion.div>

          {/* Trust Counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60"
          >
            <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 mb-4">
              EDTECH BRAND OF TRUSTED EXCELLENCE
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Active Aspirants', val: '50,000+' },
                { label: 'Practice Sets', val: '10,000+' },
                { label: 'AI Doubt Support', val: '24/7 Live' },
                { label: 'Exam Console', val: '100% CBT' }
              ].map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-2xl font-black bg-gradient-to-r from-railway-blue to-railway-gold bg-clip-text text-transparent">
                    {item.val}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* 3D Train Visual Canvas Frame */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[400px]">
          {/* Glass-plate panel background underneath */}
          <div className="absolute inset-0 bg-gradient-to-tr from-railway-blue/10 to-railway-red/10 rounded-3xl blur-[50px] animate-pulse-slow pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative w-full h-[450px] rounded-3xl border border-white/20 bg-slate-950/60 p-1 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 overflow-hidden"
          >
            {/* The Asynchronous 3D Scene */}
            <ThreeDScene />

            {/* Float HUD overlay badges */}
            <div className="absolute top-4 left-4 z-10 p-3 rounded-2xl glass-panel-futuristic text-xs flex items-center gap-2 border-none">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-extrabold text-white">Vande Bharat 3D Engine Active</span>
            </div>

            <div className="absolute bottom-4 right-4 z-10 p-3.5 rounded-2xl glass-panel-futuristic border-none max-w-[200px]">
              <p className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider">Streak Reward</p>
              <p className="text-xs text-white font-bold mt-0.5">Maintain 15-day streak to claim multiplier bonus</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: EXAM CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-railway-red bg-railway-red/10 px-3.5 py-1 rounded-full">
            Target career routes
          </span>
          <h2 className="text-3xl font-extrabold sm:text-5xl tracking-tight leading-tight">
            Choose Your Railway Exam Track
          </h2>
          <p className="text-slate-600 dark:text-slate-350 text-sm font-semibold">
            Choose a dedicated mock track configured directly from the latest RRB exam notifications.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {examTracks.map((track, i) => (
            <motion.article
              key={track.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl p-6 glass-card-neon group flex flex-col justify-between"
            >
              {/* Top border bar */}
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${track.color}`} />
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                    {track.difficulty}
                  </span>
                  <span className="text-xs bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/5 dark:text-cyan-300 px-2 py-0.5 rounded font-black border border-cyan-500/15">
                    {track.pyqCount}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white leading-tight mb-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-350 transition-colors">
                  {track.title}
                </h3>
                <p className="text-[10px] text-slate-550 dark:text-slate-400 font-bold mb-3">{track.subtitle}</p>
                <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-semibold">
                  {track.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-extrabold">
                <span className="text-railway-red">{track.stats}</span>
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
          <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-600 bg-cyan-500/10 px-3 py-1 rounded-full">
            Trending runs
          </span>
          <h2 className="text-3xl font-extrabold sm:text-5xl leading-tight">
            Popular Mock Mocks Searched by Candidates
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed">
            Accelerate your mock velocities. These specific exam mock tests are producing the largest score improvements among students this week.
          </p>
          
          <div className="p-5 rounded-2xl border border-cyan-500/15 bg-cyan-500/5 dark:bg-[#0a1128]/40 space-y-4 shadow-sm">
            <div className="flex gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-tr from-railway-blue to-cyan-500 text-white shrink-0 shadow-md">
                <TrendingUp size={18} />
              </span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Active Contestant Tracker</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5 font-medium">
                  Over 12,400 students are running NTPC practice drills right now. Challenge your speeds today!
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
              className="flex items-center justify-between p-4.5 rounded-2xl border border-slate-200 bg-white hover:border-cyan-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-cyan-500/30 transition-all group"
            >
              <div className="space-y-1.5 pr-4">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-all">
                  {exam.title}
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-550 dark:text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-slate-400" />
                    {exam.attempts}
                  </span>
                  <span className="flex items-center gap-1 font-extrabold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={12} />
                    {exam.successRate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-railway-gold text-xs font-black">
                  <Star size={12} fill="currentColor" />
                  {exam.rating}
                </div>
                <Button
                  as={Link}
                  to="/register"
                  className="h-9 w-9 p-0 rounded-xl bg-slate-100 hover:bg-railway-blue hover:text-white dark:bg-slate-800 dark:hover:bg-cyan-500 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm"
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
          <span className="text-xs uppercase font-extrabold tracking-widest text-railway-red bg-railway-red/10 px-3.5 py-1 rounded-full">
            CBT Mock Simulator
          </span>
          <h2 className="text-3xl font-extrabold sm:text-5xl tracking-tight leading-tight">
            Immersive CBT Cockpit Simulator
          </h2>
          <p className="text-slate-600 dark:text-slate-350 text-sm font-semibold">
            Evaluate your quick response. Click options to inspect real-time explanatory math models.
          </p>
        </div>

        {/* Mock CBT Console Container */}
        <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-[#0a1128] text-slate-100 shadow-2xl overflow-hidden max-w-4xl mx-auto glass-panel-futuristic">
          
          {/* Console Header */}
          <div className="bg-[#030712] px-4 py-3 flex flex-wrap items-center justify-between border-b border-slate-800/80 text-xs gap-3">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-railway-blue text-white font-black tracking-wider text-[10px]">
                RRB-CBT STAGE-1
              </span>
              <span className="text-slate-400 font-extrabold hidden sm:inline">Mock diagnostic test runs</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono font-black">
                <TimerReset size={14} className="animate-spin-slow" />
                <span>Time Left: {formatTime(cbtTimeLeft)}</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="font-bold text-slate-300">Aspirant: RRB-PREP-DECK</span>
            </div>
          </div>

          {/* Subject Navigation Tabs */}
          <div className="bg-[#030712]/40 px-4 py-2 border-b border-slate-800/50 flex overflow-x-auto gap-2">
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
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all whitespace-nowrap ${
                  cbtActiveTab === tab.id
                    ? 'bg-gradient-to-r from-railway-blue to-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
                    <span className="font-black text-railway-gold">Q1.</span>
                    <p className="font-bold text-sm sm:text-base leading-relaxed text-slate-200">
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
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm font-bold transition-all ${
                          cbtSelectedOption === opt.val
                            ? opt.correct
                              ? 'bg-emerald-550/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                              : 'bg-rose-550/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/10'
                            : 'bg-slate-950/40 border-slate-850 hover:bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <span className={`grid size-6 place-items-center rounded-full text-xs font-black ${
                          cbtSelectedOption === opt.val ? 'bg-current text-slate-950' : 'bg-slate-800 text-slate-300'
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
                    <span className="font-black text-railway-gold">Q1.</span>
                    <p className="font-bold text-sm sm:text-base leading-relaxed text-slate-200">
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
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm font-bold transition-all ${
                          cbtSelectedOption === opt.val
                            ? opt.correct
                              ? 'bg-emerald-550/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                              : 'bg-rose-550/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/10'
                            : 'bg-slate-950/40 border-slate-850 hover:bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <span className={`grid size-6 place-items-center rounded-full text-xs font-black ${
                          cbtSelectedOption === opt.val ? 'bg-current text-slate-950' : 'bg-slate-800 text-slate-300'
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
                    <span className="font-black text-railway-gold">Q1.</span>
                    <p className="font-bold text-sm sm:text-base leading-relaxed text-slate-200">
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
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm font-bold transition-all ${
                          cbtSelectedOption === opt.val
                            ? opt.correct
                              ? 'bg-emerald-550/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                              : 'bg-rose-550/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/10'
                            : 'bg-slate-950/40 border-slate-850 hover:bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <span className={`grid size-6 place-items-center rounded-full text-xs font-black ${
                          cbtSelectedOption === opt.val ? 'bg-current text-slate-950' : 'bg-slate-800 text-slate-300'
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

            {/* Explanatory banner */}
            {cbtSelectedOption && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm flex items-start gap-3"
              >
                <Lightbulb size={18} className="text-railway-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-slate-100">
                    {cbtSelectedOption === 'B' || (cbtActiveTab === 'science' && cbtSelectedOption === 'A')
                      ? 'Correct Choice selected!'
                      : 'Incorrect Choice.'}
                  </p>
                  <p className="text-slate-450 leading-relaxed mt-1 font-medium">
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
          <div className="bg-[#030712] px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-850">
            <span className="text-slate-500 text-xs font-bold">Simulator Engine v2.0</span>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setCbtSelectedOption(null)}
                variant="secondary"
                className="h-8.5 px-4 rounded-lg text-xs bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 font-bold"
              >
                Clear Selection
              </Button>
              
              <Button
                as={Link}
                to="/register"
                className="h-8.5 px-4 rounded-lg text-xs bg-gradient-to-r from-railway-blue to-cyan-500 border-none font-extrabold text-white"
              >
                Enroll in CBT series (120+ Sets)
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: PREVIOUS YEAR SHIFT PAPERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-600 bg-cyan-500/10 px-3.5 py-1 rounded-full">
            Solved papers
          </span>
          <h2 className="text-3xl font-extrabold sm:text-5xl tracking-tight leading-tight">
            Download Shift PDFs with Solved Answers
          </h2>
          <p className="text-slate-600 dark:text-slate-350 text-sm font-semibold">
            Access fully resolved actual previous year questions formatted into offline shift papers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pyqPapers.map((paper, i) => (
            <motion.div
              key={paper.code}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-2xl glass-card-neon flex flex-col justify-between relative group"
            >
              <div className="absolute top-4 right-4 text-xs font-black text-railway-red/90 px-2 py-0.5 rounded-md bg-railway-red/10 border border-railway-red/15">
                {paper.year}
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[8px] font-black tracking-widest text-slate-400 uppercase">
                  PDF OFFLINE SET
                </span>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  {paper.exam}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{paper.date}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-black">{paper.size}</span>
                <Button
                  onClick={() => handleDownload(paper.code)}
                  disabled={downloadingId !== null}
                  className="h-8 px-3 rounded-lg text-xs font-extrabold bg-slate-100 hover:bg-railway-blue hover:text-white text-slate-700 dark:bg-slate-800 dark:hover:bg-cyan-500 dark:text-slate-200 border-none flex items-center gap-1.5 transition-all shadow-sm"
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

      {/* SECTION 6: TESTIMONIALS CAROUSEL */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-railway-gold bg-amber-500/10 px-3.5 py-1 rounded-full">
            Success journals
          </span>
          <h2 className="text-3xl font-extrabold sm:text-5xl tracking-tight leading-tight">
            Aspirants Who Made It To Indian Railways
          </h2>
          <p className="text-slate-600 dark:text-slate-350 text-sm font-semibold">
            See how candidates upgraded their speeds and scores to land dream technical posts.
          </p>
        </div>

        {/* Carousel slide card */}
        <div className="relative overflow-hidden rounded-2xl glass-panel-futuristic p-8 sm:p-10 border border-white/10 dark:border-slate-800/60 max-w-3xl mx-auto">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-railway-gold/5 to-transparent pointer-events-none rounded-bl-full" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <img
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-railway-gold shadow-md shrink-0"
                />
                
                <div className="text-center sm:text-left">
                  <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                    {testimonials[activeTestimonial].post}
                  </p>
                  <span className="mt-1.5 inline-block text-[9px] font-black text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/15 uppercase tracking-wide">
                    {testimonials[activeTestimonial].badge}
                  </span>
                </div>
              </div>

              <blockquote className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-200 italic font-medium">
                &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
              </blockquote>
            </motion.div>
          </AnimatePresence>

          {/* Carousel dots indicators */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-3.5 h-1.5 rounded-full transition-all ${
                  activeTestimonial === idx 
                    ? 'bg-gradient-to-r from-railway-blue to-cyan-500 w-6' 
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label={`Testimonial slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: CALL TO ACTION SECTION */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-[#0a1128] via-[#050917] to-slate-950 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl glass-panel-futuristic">
          <div className="absolute inset-0 glowing-gradient-border opacity-5 pointer-events-none" />
          <div className="absolute top-0 left-0 w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[100px] pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <h2 className="text-3xl font-extrabold sm:text-5xl tracking-tight leading-tight text-white">
              Claim Your Seat on the Success Express
            </h2>
            
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-bold">
              Join 50,000+ candidates who upgraded their quantitative reasoning speeds and CBT confidence indices. Get dynamic level-up rewards today.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                as={Link}
                to="/register"
                className="h-12 px-8 rounded-xl font-black bg-gradient-to-r from-railway-blue to-railway-red text-white border-none shadow-lg transform transition hover:scale-[1.03]"
              >
                Enroll Free & Unlock 3D Cockpit
              </Button>
              
              <Button
                as={Link}
                to="/login"
                variant="secondary"
                className="h-12 px-8 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white border-slate-800"
              >
                Access My Student Deck
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="space-y-2">
      <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-600 bg-cyan-500/10 px-3 py-1 rounded-full">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
        {title}
      </h2>
      <p className="text-sm text-slate-550 dark:text-slate-400 font-semibold leading-relaxed">
        {text}
      </p>
    </div>
  );
}
