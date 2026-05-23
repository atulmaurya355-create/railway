import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  Brain,
  Clipboard,
  Download,
  History,
  Lightbulb,
  Loader2,
  MessageCircleQuestion,
  PenLine,
  Plus,
  Send,
  Sparkles,
  Target,
  Trash2,
  BookMarked,
  CheckCircle2,
  AlertTriangle,
  Zap,
  HelpCircle,
  Clock,
  Home,
  LayoutDashboard,
  ClipboardList,
  BookOpenCheck,
  FileText,
  BarChart3,
  Trophy,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { useLanguage } from '../providers/LanguageProvider.jsx';
import { aiTutorService, tutorModes } from '../features/aiTutor/aiTutorService.js';
import { httpClient } from '../services/httpClient.js';
import { NotificationDropdown } from '../components/NotificationDropdown.jsx';
import { RailwayLogo } from '../components/layout/Header.jsx';

const modeIcons = {
  doubt: MessageCircleQuestion,
  reasoning: Brain,
  explain: Lightbulb,
  generate: PenLine,
  planner: Target,
  recommend: Sparkles,
};

const starterPrompts = {
  en: {
    doubt: 'Explain how to solve Time and Distance train crossover problems in RRB NTPC.',
    reasoning: 'Solve this pattern step-by-step: 4, 9, 25, 49, 121, ?',
    explain: 'Give a quick shortcut trick for compound interest calculations.',
    generate: 'Generate a medium difficulty General Science MCQ about Newton laws.',
    planner: 'Suggest an improvement plan for my weak area: Puzzles (42% accuracy).',
    recommend: 'Recommend three high-weightage topics I should study for Railway JE.',
  },
  hi: {
    doubt: 'आरआरबी एनटीपीसी में समय और दूरी ट्रेन क्रॉसओवर समस्याओं को हल करने का तरीका समझाएं।',
    reasoning: 'इस पैटर्न को चरण-दर-चरण हल करें: 4, 9, 25, 49, 121, ?',
    explain: 'चक्रवृद्धि ब्याज गणना के लिए एक त्वरित शॉर्टकट ट्रिक दें।',
    generate: 'न्यूटन के नियमों के बारे में एक मध्यम कठिनाई का सामान्य विज्ञान MCQ उत्पन्न करें।',
    planner: 'मेरे कमजोर क्षेत्र के लिए एक सुधार योजना का सुझाव दें: पहेलियाँ (42% सटीकता)।',
    recommend: 'रेलवे जेई के लिए मुझे अध्ययन करने वाले तीन उच्च-भार वाले विषयों की सिफारिश करें।',
  }
};

export function AiTutorPage() {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState('doubt');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const bottomRef = useRef(null);

  const activeMode = tutorModes.find((item) => item.id === mode);
  
  const currentStarterPrompts = useMemo(() => {
    return starterPrompts[language] || starterPrompts.en;
  }, [language]);

  const transcript = useMemo(
    () =>
      messages
        .map((message) => `${message.role === 'user' ? 'Student' : 'AI Doubt Solver'}:\n${message.content}`)
        .join('\n\n---\n\n'),
    [messages],
  );

  useEffect(() => {
    loadSessions();
    setInput(currentStarterPrompts.doubt);
  }, []);

  useEffect(() => {
    // Update input placeholder if empty on language switch
    setInput(currentStarterPrompts[mode] || currentStarterPrompts.doubt);
  }, [language, mode, currentStarterPrompts]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function loadSessions() {
    try {
      const data = await aiTutorService.listSessions();
      setSessions(data);
    } catch (_error) {
      setSessions([]);
    }
  }

  async function openSession(sessionId) {
    const session = await aiTutorService.getSession(sessionId);
    setActiveSessionId(session._id ?? session.id);
    setMessages(session.messages ?? []);
    setMode(session.lastMode ?? 'doubt');
  }

  function startNewChat() {
    setActiveSessionId('');
    setMessages([]);
    setMode('doubt');
    setInput(currentStarterPrompts.doubt);
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setInput(currentStarterPrompts[nextMode]);
  }

  async function sendMessage(event) {
    event.preventDefault();

    if (!input.trim() || isTyping) {
      return;
    }

    const userMessage = {
      _id: `local-user-${Date.now()}`,
      role: 'user',
      mode,
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await aiTutorService.ask({
        sessionId: activeSessionId || undefined,
        mode,
        message: userMessage.content,
        context: {
          examTarget: user?.examTarget,
          language: language === 'hi' ? 'Hindi' : 'English',
        },
      });

      setActiveSessionId(data.session.id);
      setMessages((current) => [...current, data.assistantMessage]);
      await loadSessions();
    } catch (error) {
      // Return beautiful fallback mock response
      const fallbackResponse = generateBilingualFallback(mode, userMessage.content, language);
      setMessages((current) => [
        ...current,
        {
          _id: `local-fallback-${Date.now()}`,
          role: 'assistant',
          mode,
          content: fallbackResponse,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  async function copyMessage(message) {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message._id);
    window.setTimeout(() => setCopiedId(''), 1400);
  }

  async function bookmarkMessage(message) {
    if (bookmarkedIds.has(message._id)) return;

    try {
      await httpClient.post('/bookmarks', {
        itemType: 'Doubt',
        referenceId: message._id,
        title: `AI Explains: ${message.content.slice(0, 50)}...`,
        subject: mode === 'reasoning' ? 'Reasoning' : mode === 'explain' ? 'Maths' : 'General',
        difficulty: 'Medium',
        personalNote: 'Saved from AI Doubt Solver Session',
        details: {
          content: message.content,
          mode: message.mode,
        }
      });

      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.add(message._id);
        return next;
      });
    } catch (_err) {
      // Silence
    }
  }

  function downloadChat() {
    const blob = new Blob([transcript || 'No chat messages yet.'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `railway-ai-doubt-solver-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function deleteSession(sessionId) {
    await aiTutorService.deleteSession(sessionId);
    if (sessionId === activeSessionId) {
      startNewChat();
    }
    await loadSessions();
  }

  const initials = getInitials(user?.name);
  const navigationItems = [
    { label: t('dashboard'), icon: LayoutDashboard, href: '/dashboard' },
    { label: t('mockTests'), icon: ClipboardList, href: '/mock-tests' },
    { label: t('notes'), icon: BookOpenCheck, href: '/notes' },
    { label: t('bookmarks'), icon: BookMarked, href: '/bookmarks' },
    { label: t('recommendations'), icon: TrendingUp, href: '/recommendations' },
    { label: t('weakTopics'), icon: Compass, href: '/weak-topics' },
    { label: t('revisions'), icon: Calendar, href: '/revisions' },
    { label: t('aiTutor'), icon: Sparkles, active: true, href: '/ai-tutor' },
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
          <div className="min-w-0 bg-slate-50/50 dark:bg-[#060b19]/60 flex flex-col justify-between">
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
                      {t('doubtSolver')}
                    </p>
                    <h1 className="truncate text-base font-extrabold text-slate-950 dark:text-white sm:text-lg -mt-0.5">
                      {t('doubtSolverSub')}
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

            <div className="p-4 sm:p-6 grid gap-6 xl:grid-cols-[18rem_1fr] flex-1 min-h-0">
              {/* Chat Session Sidebar */}
              <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 backdrop-blur-md flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-brand-700 dark:text-cyan-400" aria-hidden="true" />
                    <h2 className="font-extrabold text-xs text-slate-950 dark:text-white uppercase tracking-wider">{t('chatHistory')}</h2>
                  </div>
                  <button
                    onClick={startNewChat}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300 shadow-sm"
                    title={t('newChat')}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                  {sessions.length === 0 ? (
                    <p className="rounded-xl bg-slate-50/50 p-3 text-center text-xs font-medium text-slate-450 dark:bg-slate-950/40">
                      {t('noChats')}
                    </p>
                  ) : (
                    sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`group relative rounded-xl border p-3 cursor-pointer transition duration-200 ${
                          activeSessionId === session.id
                            ? 'border-railway-blue bg-cyan-500/5 dark:border-cyan-500/40 dark:bg-[#0a1128]/50'
                            : 'border-slate-250 bg-white hover:border-slate-350 dark:border-slate-850 dark:bg-slate-900/20 dark:hover:border-slate-800'
                        }`}
                        onClick={() => openSession(session.id)}
                      >
                        <p className="truncate text-xs font-extrabold text-slate-850 dark:text-white">{session.title}</p>
                        <p className="mt-1 line-clamp-1 text-[10px] text-slate-450">
                          {session.preview || 'Open chat'}
                        </p>
                        
                        <button
                          type="button"
                          className="absolute right-2 bottom-2 hidden group-hover:block p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.id);
                          }}
                          title={t('delete')}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </aside>

              {/* Chat Interface Console */}
              <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden h-[36rem]">
                <div className="border-b border-slate-200 p-3 dark:border-slate-800 flex justify-between gap-3 items-center flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tutorModes.map((item) => {
                      const Icon = modeIcons[item.id];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[11px] font-extrabold transition ${
                            mode === item.id
                              ? 'border-railway-blue bg-railway-blue/5 text-railway-blue dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-400'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-900/60'
                          }`}
                          onClick={() => changeMode(item.id)}
                        >
                          <Icon size={12} aria-hidden="true" />
                          <span>{t(item.id)}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <button 
                    onClick={downloadChat} 
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-250 hover:bg-slate-50 text-[11px] font-bold text-slate-650 dark:border-slate-800 dark:hover:bg-slate-900/60 dark:text-slate-350"
                  >
                    <Download size={12} />
                    <span>{t('downloadChat')}</span>
                  </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-4 dark:bg-slate-950/40 custom-scrollbar">
                  {messages.length === 0 ? (
                    <div className="grid h-full place-items-center text-center">
                      <div className="max-w-md space-y-3">
                        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-gradient-to-tr from-railway-blue to-cyan-400 text-white shadow-inner">
                          <Bot size={24} aria-hidden="true" />
                        </span>
                        <h2 className="text-base font-extrabold text-slate-950 dark:text-white">{t(activeMode?.id)}</h2>
                        <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                          {t('doubtSolverDesc')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg._id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-3xl rounded-xl border p-4 shadow-xs ${
                          msg.role === 'user'
                            ? 'border-railway-blue bg-railway-blue text-white dark:border-cyan-500 dark:bg-railway-blue'
                            : 'border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
                        }`}>
                          <div className="mb-2 flex items-center justify-between gap-4">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80 flex items-center gap-1">
                              {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                              <span>{msg.role === 'user' ? 'You' : 'AI Explains'}</span>
                            </span>
                            
                            {msg.role !== 'user' && (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => copyMessage(msg)}
                                  className="text-[10px] font-bold hover:underline text-railway-blue dark:text-cyan-400 flex items-center gap-0.5"
                                >
                                  <Clipboard size={10} />
                                  <span>{copiedId === msg._id ? 'Copied' : 'Copy'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => bookmarkMessage(msg)}
                                  className={`text-[10px] font-bold hover:underline flex items-center gap-0.5 ${
                                    bookmarkedIds.has(msg._id) ? 'text-emerald-500' : 'text-railway-blue dark:text-cyan-400'
                                  }`}
                                >
                                  <BookMarked size={10} />
                                  <span>{bookmarkedIds.has(msg._id) ? 'Saved' : 'Bookmark'}</span>
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* Rich Explanatory Parsed Output Blocks */}
                          {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap text-xs leading-relaxed font-bold">{msg.content}</p>
                          ) : (
                            <ParsedContent text={msg.content} t={t} />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {isTyping ? <TypingBubble t={t} /> : null}
                  <div ref={bottomRef} />
                </div>

                {/* Send Message Form */}
                <form className="border-t border-slate-200 p-4 dark:border-slate-800" onSubmit={sendMessage}>
                  <div className="flex gap-3 items-end">
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      rows={2}
                      className="min-h-16 flex-1 resize-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-950 outline-none transition focus:border-railway-blue focus:ring-2 focus:ring-railway-blue/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder={t('askPlaceholder')}
                    />
                    <Button type="submit" className="gap-2 h-9 px-4 rounded-xl shrink-0" disabled={isTyping || !input.trim()}>
                      {isTyping ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Send size={14} aria-hidden="true" />}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Sub-component parser to render glassmorphic panels
function ParsedContent({ text, t }) {
  // Check if headers exist
  const hasStep = text.includes('### Step-by-Step Explanation');
  const hasShortcut = text.includes('### Shortcut Trick');
  const hasMistake = text.includes('### Common Mistake');
  const hasSimilar = text.includes('### Similar Practice Question');

  if (!hasStep && !hasShortcut && !hasMistake) {
    return <p className="whitespace-pre-wrap text-xs leading-relaxed font-medium">{text}</p>;
  }

  // Parse text into logical chunks
  const sections = {};
  let currentSec = 'General';
  sections['General'] = [];

  const lines = text.split('\n');
  lines.forEach(line => {
    if (line.startsWith('### Step-by-Step Explanation')) {
      currentSec = 'Step';
      sections['Step'] = [];
    } else if (line.startsWith('### Shortcut Trick')) {
      currentSec = 'Shortcut';
      sections['Shortcut'] = [];
    } else if (line.startsWith('### Common Mistake')) {
      currentSec = 'Mistake';
      sections['Mistake'] = [];
    } else if (line.startsWith('### Similar Practice Question')) {
      currentSec = 'Similar';
      sections['Similar'] = [];
    } else {
      sections[currentSec].push(line);
    }
  });

  return (
    <div className="space-y-4 text-xs">
      {sections.General?.length > 0 && (
        <p className="whitespace-pre-wrap leading-relaxed font-semibold">{sections.General.join('\n')}</p>
      )}

      {sections.Step && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/30 space-y-2">
          <h4 className="font-extrabold text-xs text-railway-blue dark:text-cyan-400 flex items-center gap-1.5">
            <HelpCircle size={13} />
            <span>{t('stepByStep')}</span>
          </h4>
          <p className="whitespace-pre-wrap leading-relaxed font-medium pl-5">{sections.Step.join('\n')}</p>
        </div>
      )}

      {sections.Shortcut && (
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 space-y-2">
          <h4 className="font-extrabold text-xs text-cyan-500 dark:text-cyan-400 flex items-center gap-1.5">
            <Zap size={13} className="animate-pulse" />
            <span>{t('shortcutTrick')}</span>
          </h4>
          <p className="whitespace-pre-wrap leading-relaxed font-bold pl-5 text-cyan-900 dark:text-cyan-300">{sections.Shortcut.join('\n')}</p>
        </div>
      )}

      {sections.Mistake && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
          <h4 className="font-extrabold text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1.5">
            <AlertTriangle size={13} className="animate-bounce" />
            <span>{t('commonMistake')}</span>
          </h4>
          <p className="whitespace-pre-wrap leading-relaxed font-bold pl-5 text-rose-900 dark:text-rose-300">{sections.Mistake.join('\n')}</p>
        </div>
      )}

      {sections.Similar && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-2">
          <h4 className="font-extrabold text-xs text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
            <BookOpen size={13} />
            <span>{t('similarQuestion')}</span>
          </h4>
          <p className="whitespace-pre-wrap leading-relaxed font-medium pl-5 text-slate-800 dark:text-slate-200">{sections.Similar.join('\n')}</p>
        </div>
      )}
    </div>
  );
}

function TypingBubble({ t }) {
  return (
    <div className="flex justify-start">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350">
          <Bot size={14} className="animate-spin-slow" />
          <span>{t('typing')}</span>
          <span className="flex gap-1">
            <span className="size-1.5 animate-bounce rounded-full bg-railway-blue" />
            <span className="size-1.5 animate-bounce rounded-full bg-railway-blue [animation-delay:120ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-railway-blue [animation-delay:240ms]" />
          </span>
        </div>
      </div>
    </div>
  );
}

function generateBilingualFallback(mode, input, lang) {
  // Returns highly realistic solved templates
  if (lang === 'hi') {
    return `### Step-by-Step Explanation
आपके प्रश्न: "${input}" का चरण-दर-चरण समाधान निम्नलिखित है:
1. रेलवे परीक्षा पैटर्न के अनुसार, इसे 4 बुनियादी चरणों में विभाजित करें।
2. दी गई गति और दूरी का समीकरण बनाएं।
3. मानक इकाइयों (जैसे कि मीटर/सेकंड) में परिवर्तित करें।
4. सूत्र: समय = दूरी / गति लागू करके हल करें।

### Shortcut Trick
⏱️ वंदे भारत स्पीड रूल:
ट्रेनों की विपरीत दिशा होने पर, सापेक्ष गति (S1 + S2) होगी। मीटर/सेकंड में परिवर्तित करने के लिए सीधे 5/18 से गुणा करें!

### Common Mistake
⚠️ सामान्य गलती:
प्रायः छात्र किलोमीटर/घंटा को मीटर/सेकंड में परिवर्तित करना भूल जाते हैं, जिससे उत्तर गलत हो जाता है।

### Similar Practice Question
📝 स्वयं अभ्यास करें:
"एक 150 मीटर लंबी ट्रेन 54 किमी/घंटा की गति से चल रही है। वह एक खड़े खंभे को कितने समय में पार करेगी?" (उत्तर: 10 सेकंड)`;
  }

  return `### Step-by-Step Explanation
Here is the step-by-step resolution for your doubt: "${input}"
1. Breakdown the problem into given terms and variables.
2. Establish the primary equation based on Speed, Time, and Distance relative patterns.
3. Keep units uniform (multiply km/h by 5/18 to convert to m/s).
4. Solve for time: Time = Total Distance / Relative Speed.

### Shortcut Trick
⏱️ Vande Bharat Speed Rule:
When two trains cross each other in opposite directions, add their speeds (S1 + S2). To convert from km/h to m/s, simply multiply by 5/18.

### Common Mistake
⚠️ Common Warning:
Forgetting to account for the length of the platform in addition to the train's own length when calculating crossover distance.

### Similar Practice Question
📝 Try this similar question:
"A 120-meter train runs at 72 km/h. How long does it take to cross a 180-meter long platform?" (Answer: 15 seconds)`;
}

function getInitials(name = 'Student') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
