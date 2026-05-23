import { useEffect, useMemo, useState } from 'react';
import {
  Download,
  FileText,
  Filter,
  Loader2,
  Search,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { FormField } from '../features/auth/components/FormField.jsx';
import { StatusMessage } from '../features/auth/components/StatusMessage.jsx';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import {
  buildPaperAssetUrl,
  previousPaperService,
} from '../features/previousPapers/previousPaperService.js';

const initialUploadForm = {
  title: '',
  examName: 'RRB NTPC',
  year: new Date().getFullYear(),
  shift: '',
  language: 'English',
  pdf: null,
};

export function PreviousPapersPage() {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [years, setYears] = useState([]);
  const [filters, setFilters] = useState({ search: '', year: '', examName: '' });
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [uploadForm, setUploadForm] = useState(initialUploadForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const isAdmin = user?.role === 'admin';

  const selectedPaperUrl = useMemo(
    () => buildPaperAssetUrl(selectedPaper?.fileUrl),
    [selectedPaper],
  );

  useEffect(() => {
    loadPapers();
  }, []);

  async function loadPapers(nextFilters = filters) {
    setIsLoading(true);
    const data = await previousPaperService.list({
      search: nextFilters.search || undefined,
      year: nextFilters.year || undefined,
      examName: nextFilters.examName || undefined,
    });
    setPapers(data.papers);
    setYears(data.years);
    setSelectedPaper((current) => current ?? data.papers[0] ?? null);
    setIsLoading(false);
  }

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateUploadField(event) {
    const { name, value, files } = event.target;
    setUploadForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  }

  async function applyFilters(event) {
    event.preventDefault();
    await loadPapers(filters);
  }

  async function clearFilters() {
    const nextFilters = { search: '', year: '', examName: '' };
    setFilters(nextFilters);
    await loadPapers(nextFilters);
  }

  async function uploadPaper(event) {
    event.preventDefault();

    if (!uploadForm.pdf) {
      setStatus({ type: 'error', message: 'Please choose a PDF file.' });
      return;
    }

    setStatus({ type: '', message: '' });
    setIsUploading(true);

    try {
      const response = await previousPaperService.upload(uploadForm);
      setStatus({ type: 'success', message: response.message });
      setUploadForm(initialUploadForm);
      await loadPapers();
    } catch (error) {
      setStatus({ type: 'error', message: error.message ?? 'Unable to upload PDF.' });
    } finally {
      setIsUploading(false);
    }
  }

  async function downloadPaper(paper) {
    if (!paper.fileUrl) {
      setStatus({ type: 'error', message: 'This sample paper does not have a PDF file attached yet.' });
      return;
    }

    try {
      const downloadUrl = paper._id?.startsWith('sample-')
        ? paper.fileUrl
        : await previousPaperService.getDownloadUrl(paper._id);
      const link = document.createElement('a');
      link.href = buildPaperAssetUrl(downloadUrl);
      link.download = paper.originalName || `${paper.title}.pdf`;
      link.click();
    } catch (error) {
      setStatus({ type: 'error', message: error.message ?? 'Unable to download PDF.' });
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-cyan-300">
              Previous Year Papers
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
              Railway paper library
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Upload PDFs, search papers, filter by year, preview inside the app, and download for offline practice.
            </p>
          </div>
          <span className="grid size-12 place-items-center rounded-md bg-cyan-50 text-brand-700 dark:bg-slate-800 dark:text-cyan-300">
            <FileText size={24} aria-hidden="true" />
          </span>
        </div>
      </div>

      <StatusMessage tone={status.type === 'error' ? 'error' : 'success'}>{status.message}</StatusMessage>

      {isAdmin ? (
        <form
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          onSubmit={uploadPaper}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-brand-600 text-white">
              <Upload size={19} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Upload PDF</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Admin-only upload for previous year papers.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FormField id="title" label="Title" name="title" value={uploadForm.title} onChange={updateUploadField} required />
            <FormField id="examName" label="Exam Name" name="examName" value={uploadForm.examName} onChange={updateUploadField} required />
            <FormField id="year" label="Year" name="year" type="number" value={uploadForm.year} onChange={updateUploadField} required />
            <FormField id="shift" label="Shift" name="shift" value={uploadForm.shift} onChange={updateUploadField} placeholder="Shift 1, Morning..." />
            <FormField id="language" label="Language" name="language" value={uploadForm.language} onChange={updateUploadField} />
            <label htmlFor="pdf" className="block space-y-2">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">PDF File</span>
              <input
                id="pdf"
                name="pdf"
                type="file"
                accept="application/pdf"
                onChange={updateUploadField}
                className="block h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 file:mr-3 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                required
              />
            </label>
          </div>

          <Button type="submit" className="mt-5 gap-2" disabled={isUploading}>
            {isUploading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Upload size={16} aria-hidden="true" />}
            Upload PDF
          </Button>
        </form>
      ) : null}

      <form
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        onSubmit={applyFilters}
      >
        <div className="grid gap-4 md:grid-cols-[1fr_12rem_14rem_auto] md:items-end">
          <FormField
            id="search"
            label="Search Papers"
            name="search"
            value={filters.search}
            onChange={updateFilter}
            placeholder="Search by title, exam, shift..."
          />
          <label htmlFor="year" className="block space-y-2">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Year</span>
            <select
              id="year"
              name="year"
              value={filters.year}
              onChange={updateFilter}
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">All years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <FormField
            id="examNameFilter"
            label="Exam"
            name="examName"
            value={filters.examName}
            onChange={updateFilter}
            placeholder="RRB NTPC"
          />
          <div className="flex gap-2">
            <Button type="submit" className="gap-2">
              <Search size={16} aria-hidden="true" />
              Search
            </Button>
            <Button type="button" variant="secondary" className="gap-2" onClick={clearFilters}>
              <X size={16} aria-hidden="true" />
              Clear
            </Button>
          </div>
        </div>
      </form>

      <div className="grid gap-6 xl:grid-cols-[24rem_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={18} className="text-brand-700 dark:text-cyan-300" aria-hidden="true" />
            <h2 className="font-bold text-slate-950 dark:text-white">Papers</h2>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                Loading papers...
              </p>
            ) : papers.length === 0 ? (
              <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                No papers found.
              </p>
            ) : (
              papers.map((paper) => (
                <button
                  key={paper._id}
                  type="button"
                  className={`w-full rounded-md border p-4 text-left transition ${
                    selectedPaper?._id === paper._id
                      ? 'border-brand-600 bg-cyan-50 dark:border-cyan-500 dark:bg-cyan-950/40'
                      : 'border-slate-200 hover:border-cyan-300 dark:border-slate-800 dark:hover:border-cyan-800'
                  }`}
                  onClick={() => setSelectedPaper(paper)}
                >
                  <p className="font-semibold text-slate-950 dark:text-white">{paper.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {paper.examName} | {paper.year} {paper.shift ? `| ${paper.shift}` : ''}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {paper.language || 'English'} | {formatFileSize(paper.fileSize)}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {selectedPaper ? (
            <>
              <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 dark:text-white">{selectedPaper.title}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {selectedPaper.examName} | {selectedPaper.year} {selectedPaper.shift ? `| ${selectedPaper.shift}` : ''}
                  </p>
                </div>
                <Button type="button" className="gap-2" onClick={() => downloadPaper(selectedPaper)}>
                  <Download size={16} aria-hidden="true" />
                  Download PDF
                </Button>
              </div>
              <div className="h-[36rem] bg-slate-100 dark:bg-slate-950">
                {selectedPaperUrl ? (
                  <iframe
                    title={selectedPaper.title}
                    src={selectedPaperUrl}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="grid h-full place-items-center p-6 text-center">
                    <div className="max-w-md">
                      <FileText className="mx-auto mb-4 text-slate-400" size={48} aria-hidden="true" />
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white">PDF preview unavailable</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        This sample item shows how the viewer behaves. Upload a real PDF as an admin to preview it here.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="grid h-[36rem] place-items-center p-6 text-center">
              <div>
                <FileText className="mx-auto mb-4 text-slate-400" size={48} aria-hidden="true" />
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">Select a paper</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Choose a previous year paper from the list to open the PDF viewer.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function formatFileSize(size = 0) {
  if (!size) {
    return 'PDF';
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
