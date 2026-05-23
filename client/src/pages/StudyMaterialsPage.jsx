import { useEffect, useState } from 'react';
import {
  BookOpenCheck,
  Download,
  FileText,
  Filter,
  FlaskConical,
  Loader2,
  Search,
  Sigma,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { FormField } from '../features/auth/components/FormField.jsx';
import { StatusMessage } from '../features/auth/components/StatusMessage.jsx';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import {
  buildMaterialAssetUrl,
  materialTypes,
  studyMaterialService,
} from '../features/studyMaterials/studyMaterialService.js';

const initialUploadForm = {
  title: '',
  description: '',
  materialType: 'notes',
  topic: '',
  category: 'RRB NTPC',
  examName: 'Railway Exams',
  material: null,
};

const typeMeta = {
  notes: {
    label: 'Notes',
    icon: BookOpenCheck,
    tone: 'bg-cyan-50 text-brand-700 dark:bg-cyan-950/40 dark:text-cyan-300',
  },
  pdf: {
    label: 'PDF',
    icon: FileText,
    tone: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  },
  formulaSheet: {
    label: 'Formula Sheet',
    icon: Sigma,
    tone: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  },
};

export function StudyMaterialsPage() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    materialType: '',
    topic: '',
    category: '',
  });
  const [uploadForm, setUploadForm] = useState(initialUploadForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadMaterials();
  }, []);

  async function loadMaterials(nextFilters = filters) {
    setIsLoading(true);
    const data = await studyMaterialService.list({
      search: nextFilters.search || undefined,
      materialType: nextFilters.materialType || undefined,
      topic: nextFilters.topic || undefined,
      category: nextFilters.category || undefined,
    });
    setMaterials(data.materials);
    setTopics(data.topics);
    setCategories(data.categories);
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
    await loadMaterials(filters);
  }

  async function clearFilters() {
    const nextFilters = { search: '', materialType: '', topic: '', category: '' };
    setFilters(nextFilters);
    await loadMaterials(nextFilters);
  }

  async function uploadMaterial(event) {
    event.preventDefault();

    if (!uploadForm.material) {
      setStatus({ type: 'error', message: 'Please choose a study material file.' });
      return;
    }

    setStatus({ type: '', message: '' });
    setIsUploading(true);

    try {
      const response = await studyMaterialService.upload(uploadForm);
      setStatus({ type: 'success', message: response.message });
      setUploadForm(initialUploadForm);
      await loadMaterials();
    } catch (error) {
      setStatus({ type: 'error', message: error.message ?? 'Unable to upload study material.' });
    } finally {
      setIsUploading(false);
    }
  }

  async function downloadMaterial(material) {
    if (!material.fileUrl) {
      setStatus({ type: 'error', message: 'This sample material does not have a downloadable file yet.' });
      return;
    }

    try {
      const downloadUrl = material._id?.startsWith('sample-')
        ? material.fileUrl
        : await studyMaterialService.getDownloadUrl(material._id);
      const link = document.createElement('a');
      link.href = buildMaterialAssetUrl(downloadUrl);
      link.download = material.originalName || `${material.title}`;
      link.click();
    } catch (error) {
      setStatus({ type: 'error', message: error.message ?? 'Unable to download material.' });
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-cyan-300">
              Study Materials
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
              Notes, PDFs, and formula sheets
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Browse topic-wise railway materials, filter by category, and download resources for revision.
            </p>
          </div>
          <span className="grid size-12 place-items-center rounded-md bg-cyan-50 text-brand-700 dark:bg-slate-800 dark:text-cyan-300">
            <FlaskConical size={24} aria-hidden="true" />
          </span>
        </div>
      </div>

      <StatusMessage tone={status.type === 'error' ? 'error' : 'success'}>{status.message}</StatusMessage>

      {isAdmin ? (
        <form
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          onSubmit={uploadMaterial}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-brand-600 text-white">
              <Upload size={19} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Upload Material</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Admin-only upload for notes, PDFs, and formula sheets.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FormField id="title" label="Title" name="title" value={uploadForm.title} onChange={updateUploadField} required />
            <FormField id="topic" label="Topic" name="topic" value={uploadForm.topic} onChange={updateUploadField} placeholder="Mathematics" required />
            <FormField id="category" label="Category" name="category" value={uploadForm.category} onChange={updateUploadField} required />
            <label htmlFor="materialType" className="block space-y-2">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Material Type</span>
              <select
                id="materialType"
                name="materialType"
                value={uploadForm.materialType}
                onChange={updateUploadField}
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="notes">Notes</option>
                <option value="pdf">PDF</option>
                <option value="formulaSheet">Formula Sheet</option>
              </select>
            </label>
            <FormField id="examName" label="Exam Name" name="examName" value={uploadForm.examName} onChange={updateUploadField} />
            <label htmlFor="material" className="block space-y-2">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">File</span>
              <input
                id="material"
                name="material"
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={updateUploadField}
                className="block h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 file:mr-3 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                required
              />
            </label>
          </div>

          <label htmlFor="description" className="mt-4 block space-y-2">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Description</span>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={uploadForm.description}
              onChange={updateUploadField}
              className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>

          <Button type="submit" className="mt-5 gap-2" disabled={isUploading}>
            {isUploading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Upload size={16} aria-hidden="true" />}
            Upload Material
          </Button>
        </form>
      ) : null}

      <form
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        onSubmit={applyFilters}
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {materialTypes.map((type) => (
            <button
              key={type.id || 'all'}
              type="button"
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                filters.materialType === type.id
                  ? 'border-brand-600 bg-cyan-50 text-brand-800 dark:border-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-100'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
              onClick={() => {
                const nextFilters = { ...filters, materialType: type.id };
                setFilters(nextFilters);
                loadMaterials(nextFilters);
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_12rem_12rem_auto] md:items-end">
          <FormField
            id="search"
            label="Search Materials"
            name="search"
            value={filters.search}
            onChange={updateFilter}
            placeholder="Search notes, formulas, topics..."
          />
          <SelectField
            id="topic"
            label="Topic"
            name="topic"
            value={filters.topic}
            onChange={updateFilter}
            options={topics}
            placeholder="All topics"
          />
          <SelectField
            id="category"
            label="Category"
            name="category"
            value={filters.category}
            onChange={updateFilter}
            options={categories}
            placeholder="All categories"
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

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-2">
          <Filter size={18} className="text-brand-700 dark:text-cyan-300" aria-hidden="true" />
          <h2 className="font-bold text-slate-950 dark:text-white">Topic Wise Materials</h2>
        </div>

        {isLoading ? (
          <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            Loading study materials...
          </p>
        ) : materials.length === 0 ? (
          <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            No study materials found.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {materials.map((material) => (
              <MaterialCard key={material._id} material={material} onDownload={downloadMaterial} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MaterialCard({ material, onDownload }) {
  const meta = typeMeta[material.materialType] ?? typeMeta.notes;
  const Icon = meta.icon;

  return (
    <article className="rounded-lg border border-slate-200 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className={`grid size-11 place-items-center rounded-md ${meta.tone}`}>
          <Icon size={21} aria-hidden="true" />
        </span>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {meta.label}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-950 dark:text-white">{material.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {material.description || 'Topic-wise railway exam study material.'}
      </p>
      <div className="mt-4 grid gap-2 text-sm text-slate-500 dark:text-slate-400">
        <p>Topic: <span className="font-medium text-slate-800 dark:text-slate-100">{material.topic}</span></p>
        <p>Category: <span className="font-medium text-slate-800 dark:text-slate-100">{material.category}</span></p>
        <p>Downloads: <span className="font-medium text-slate-800 dark:text-slate-100">{material.downloadCount ?? 0}</span></p>
      </div>
      <Button type="button" className="mt-5 w-full gap-2" onClick={() => onDownload(material)}>
        <Download size={16} aria-hidden="true" />
        Download
      </Button>
    </article>
  );
}

function SelectField({ id, label, name, value, onChange, options, placeholder }) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</span>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
