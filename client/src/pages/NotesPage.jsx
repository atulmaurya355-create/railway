import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  Download,
  Save,
  Tag,
  Clock,
  Check,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  BookOpenCheck,
  BookMarked,
  TrendingUp,
  Compass,
  Calendar,
  Sparkles,
  BarChart3,
  Trophy,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { useLanguage } from '../providers/LanguageProvider.jsx';
import { httpClient } from '../services/httpClient.js';
import { NotificationDropdown } from '../components/NotificationDropdown.jsx';
import { RailwayLogo } from '../components/layout/Header.jsx';

const noteCategories = [
  'Reasoning',
  'Maths',
  'Science',
  'GK',
  'Current Affairs',
  'Formula',
  'Short Tricks',
];

export function NotesPage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Notes state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pinnedOnly, setPinnedOnly] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GK');
  const [tagsText, setTagsText] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'Saving...', 'Saved!'

  const autoSaveTimeout = useRef(null);

  const initials = getInitials(user?.name);
  const navigationItems = [
    { label: t('dashboard'), icon: LayoutDashboard, href: '/dashboard' },
    { label: t('mockTests'), icon: ClipboardList, href: '/mock-tests' },
    { label: t('notes'), icon: BookOpenCheck, active: true, href: '/notes' },
    { label: t('bookmarks'), icon: BookMarked, href: '/bookmarks' },
    { label: t('recommendations'), icon: TrendingUp, href: '/recommendations' },
    { label: t('weakTopics'), icon: Compass, href: '/weak-topics' },
    { label: t('revisions'), icon: Calendar, href: '/revisions' },
    { label: t('aiTutor'), icon: Sparkles, href: '/ai-tutor' },
    { label: t('analytics'), icon: BarChart3, href: '/analytics' },
    { label: t('achievements'), icon: Trophy, href: '/achievements' },
  ];

  useEffect(() => {
    fetchNotes();
  }, [selectedCategory, pinnedOnly]);

  // Debounced search query trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function fetchNotes() {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (pinnedOnly) params.pinnedOnly = true;

      const response = await httpClient.get('/notes', { params });
      if (response.data?.data?.notes) {
        setNotes(response.data.data.notes);
      }
    } catch (_err) {
      // Recovery silent
    } finally {
      setLoading(false);
    }
  }

  // Handle Note Save / Update
  async function handleSaveNote(e) {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    setSaveStatus('Saving...');
    const tags = tagsText.split(',').map(t => t.trim()).filter(Boolean);

    try {
      if (activeNote) {
        // Edit Mode
        const response = await httpClient.put(`/notes/${activeNote._id}`, {
          title,
          content,
          category,
          tags,
          isPinned,
          isAutoSaved: false
        });
        
        if (response.data?.data?.note) {
          setNotes(prev => prev.map(n => n._id === activeNote._id ? response.data.data.note : n));
          setActiveNote(response.data.data.note);
        }
      } else {
        // Create Mode
        const response = await httpClient.post('/notes', {
          title,
          content,
          category,
          tags,
          isPinned,
          isAutoSaved: false
        });

        if (response.data?.data?.note) {
          setNotes(prev => [response.data.data.note, ...prev]);
          setActiveNote(response.data.data.note);
        }
      }
      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus(''), 2000);
      fetchNotes();
    } catch (_err) {
      setSaveStatus('Error saving note.');
    }
  }

  // Debounced Auto-save Trigger
  function handleAutoSaveChange() {
    if (!activeNote || !title.trim()) return;

    setSaveStatus('Saving...');
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);

    autoSaveTimeout.current = setTimeout(async () => {
      try {
        const tags = tagsText.split(',').map(t => t.trim()).filter(Boolean);
        const response = await httpClient.put(`/notes/${activeNote._id}`, {
          title,
          content,
          category,
          tags,
          isPinned,
          isAutoSaved: true
        });

        if (response.data?.data?.note) {
          setSaveStatus('Saved (Auto)!');
          setTimeout(() => setSaveStatus(''), 1500);
        }
      } catch (_err) {
        // Silent error recovery
      }
    }, 3000);
  }

  function startCreateNote() {
    setActiveNote(null);
    setTitle('');
    setContent('');
    setCategory('GK');
    setTagsText('');
    setIsPinned(false);
    setIsFormOpen(true);
  }

  function startEditNote(note) {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setTagsText(note.tags?.join(', ') || '');
    setIsPinned(note.isPinned);
    setIsFormOpen(true);
  }

  async function handleDeleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this study note?')) return;
    try {
      await httpClient.delete(`/notes/${noteId}`);
      setNotes(prev => prev.filter(n => n._id !== noteId));
      if (activeNote?._id === noteId) {
        setIsFormOpen(false);
        setActiveNote(null);
      }
    } catch (_err) {
      // recovery
    }
  }

  // PDF print window exporter
  function handleDownloadNotePdf(note) {
    const printWindow = window.open('', '_blank');
    const contentHtml = `
      <html>
        <head>
          <title>${note.title} - Railway Notes</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 2px solid #005bac; padding-bottom: 12px; margin-bottom: 24px; }
            .category { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #005bac; background: #e0f2fe; padding: 3px 8px; border-radius: 4px; width: fit-content; }
            h1 { margin-top: 10px; font-size: 24px; color: #0f172a; }
            .meta { font-size: 11px; color: #64748b; margin-top: 4px; }
            .content { white-space: pre-wrap; margin-top: 20px; font-size: 14px; }
            .tags { margin-top: 40px; font-size: 11px; font-weight: bold; border-top: 1px solid #e2e8f0; padding-top: 10px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="category">${note.category}</span>
            <h1>${note.title}</h1>
            <div class="meta">Created on: ${new Date(note.createdAt).toLocaleDateString()} | Railway Prep Engine</div>
          </div>
          <div class="content">${note.content}</div>
          <div class="tags">Tags: ${note.tags?.join(', ') || 'None'}</div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(contentHtml);
    printWindow.document.close();
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
                      {t('notes')}
                    </p>
                    <h1 className="truncate text-base font-extrabold text-slate-950 dark:text-white sm:text-lg -mt-0.5">
                      {t('smartNotesSub')}
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
              
              {/* Note Creator Form Dialog Block */}
              <AnimatePresence>
                {isFormOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText size={16} className="text-railway-blue" />
                        <span>{activeNote ? t('smartNotesTitle') : t('newNote')}</span>
                      </h3>
                      
                      <div className="flex items-center gap-2.5">
                        {saveStatus && (
                          <span className="text-[10px] font-extrabold text-cyan-500 flex items-center gap-1">
                            <Clock size={10} className="animate-spin" />
                            <span>{saveStatus}</span>
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setIsFormOpen(false);
                            setActiveNote(null);
                          }}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-450"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleSaveNote} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            handleAutoSaveChange();
                          }}
                          placeholder={t('noteTitlePlaceholder')}
                          className="sm:col-span-2 rounded-lg border border-slate-250 bg-white px-3 py-2 text-xs outline-none focus:border-railway-blue dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />
                        
                        <div className="flex gap-2">
                          <select
                            value={category}
                            onChange={(e) => {
                              setCategory(e.target.value);
                              handleAutoSaveChange();
                            }}
                            className="w-full rounded-lg border border-slate-250 bg-white px-2 py-2 text-xs font-bold outline-none focus:border-railway-blue dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                          >
                            {noteCategories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              setIsPinned(!isPinned);
                              handleAutoSaveChange();
                            }}
                            className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-center ${
                              isPinned
                                ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                                : 'border-slate-250 text-slate-450 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950'
                            }`}
                            title={t('pinNote')}
                          >
                            <Pin size={14} className={isPinned ? 'fill-current' : ''} />
                          </button>
                        </div>
                      </div>

                      <textarea
                        value={content}
                        onChange={(e) => {
                          setContent(e.target.value);
                          handleAutoSaveChange();
                        }}
                        rows={6}
                        required
                        placeholder={t('noteContentPlaceholder')}
                        className="w-full resize-y rounded-lg border border-slate-250 bg-white px-3 py-2 text-xs outline-none focus:border-railway-blue dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />

                      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                        <div className="relative flex items-center">
                          <Tag size={12} className="absolute left-2.5 text-slate-400" />
                          <input
                            type="text"
                            value={tagsText}
                            onChange={(e) => {
                              setTagsText(e.target.value);
                              handleAutoSaveChange();
                            }}
                            placeholder={t('tagsPlaceholder')}
                            className="w-full rounded-lg border border-slate-250 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-railway-blue dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                          />
                        </div>

                        <div className="flex gap-2">
                          {activeNote && (
                            <button
                              type="button"
                              onClick={() => handleDownloadNotePdf(activeNote)}
                              className="px-3.5 py-2 rounded-lg border border-slate-250 hover:bg-slate-50 text-xs font-bold text-slate-700 dark:border-slate-800 dark:hover:bg-slate-950 dark:text-slate-350 flex items-center gap-1.5"
                            >
                              <Download size={13} />
                              <span>{t('downloadPdf')}</span>
                            </button>
                          )}
                          
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-railway-blue hover:brightness-110 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
                          >
                            <Save size={13} />
                            <span>{t('saveNote')}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toolbar search & filters */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 dark:bg-slate-950/20">
                <div className="flex flex-1 max-w-md items-center relative">
                  <Search size={14} className="absolute left-3 text-slate-450" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchNotes')}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs outline-none focus:border-railway-blue dark:border-slate-850 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="">{t('allNotes')}</option>
                    {noteCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setPinnedOnly(!pinnedOnly)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold flex items-center gap-1 ${
                      pinnedOnly
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                        : 'border-slate-200 bg-white text-slate-700 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-350'
                    }`}
                  >
                    <Pin size={12} />
                    <span>{t('pinnedNotes')}</span>
                  </button>

                  {!isFormOpen && (
                    <button
                      onClick={startCreateNote}
                      className="px-3.5 py-1.5 rounded-lg bg-railway-blue hover:brightness-110 text-white text-xs font-extrabold flex items-center gap-1 shadow-sm"
                    >
                      <Plus size={14} />
                      <span>{t('newNote')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notes Grid Display */}
              {loading ? (
                <div className="grid h-48 place-items-center text-slate-450 font-bold text-xs">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="animate-spin text-railway-blue" size={14} />
                    <span>Analyzing Notes Cabinets...</span>
                  </span>
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-450">{t('noNotes')}</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {notes.map(note => (
                    <motion.div
                      key={note._id}
                      whileHover={{ y: -2 }}
                      className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-850 dark:bg-slate-900/30 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group"
                    >
                      {note.isPinned && (
                        <span className="absolute top-2.5 right-2.5 text-amber-500">
                          <Pin size={13} className="fill-current" />
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between pr-4">
                          <span className="rounded-md bg-sky-500/10 text-sky-600 dark:bg-sky-500/5 dark:text-sky-400 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                            {note.category}
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold">
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="text-xs font-extrabold text-slate-855 dark:text-white line-clamp-1 pr-4">{note.title}</h4>
                        <p className="text-[11px] text-slate-450 leading-relaxed line-clamp-3 font-medium">{note.content}</p>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex gap-1 overflow-hidden max-w-36">
                          {note.tags?.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="rounded px-1.5 py-0.2 bg-slate-50 text-[9px] text-slate-450 border border-slate-150 font-bold max-w-16 truncate">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleDownloadNotePdf(note)}
                            className="p-1 rounded-md text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950 transition"
                            title={t('downloadPdf')}
                          >
                            <Download size={12} />
                          </button>
                          
                          <button
                            onClick={() => startEditNote(note)}
                            className="p-1 rounded-md text-railway-blue hover:bg-slate-50 dark:hover:bg-slate-950 transition"
                            title={t('editNote')}
                          >
                            <Edit3 size={12} />
                          </button>

                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            className="p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                            title={t('delete')}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
