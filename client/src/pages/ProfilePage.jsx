import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  KeyRound,
  Loader2,
  Save,
  ShieldAlert,
  Trash2,
  Upload,
  UserRound,
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { FormField } from '../features/auth/components/FormField.jsx';
import { StatusMessage } from '../features/auth/components/StatusMessage.jsx';
import { profileService } from '../features/profile/profileService.js';

const emptyProfile = {
  name: '',
  email: '',
  phone: '',
  bio: '',
  examTarget: '',
  avatarUrl: '',
};

export function ProfilePage() {
  const navigate = useNavigate();
  const { clearSession, updateUser, user } = useAuth();
  const [profile, setProfile] = useState(() => ({ ...emptyProfile, ...user }));
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [deletePassword, setDeletePassword] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const avatarPreview = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }

    return buildAssetUrl(profile.avatarUrl);
  }, [avatarFile, profile.avatarUrl]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const currentProfile = await profileService.getProfile();
        setProfile({ ...emptyProfile, ...currentProfile });
        updateUser(currentProfile);
      } catch (error) {
        setStatus({ type: 'error', message: error.message ?? 'Unable to load profile.' });
      }
    }

    loadProfile();
  }, [updateUser]);

  useEffect(() => {
    return () => {
      if (avatarFile) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarFile, avatarPreview]);

  function updateProfileField(event) {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updatePasswordField(event) {
    setPasswords((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSavingProfile(true);

    try {
      const response = await profileService.updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        examTarget: profile.examTarget,
      });
      setProfile({ ...emptyProfile, ...response.data.user });
      updateUser(response.data.user);
      setStatus({ type: 'success', message: response.message });
    } catch (error) {
      setStatus({ type: 'error', message: error.message ?? 'Unable to update profile.' });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleAvatarSubmit(event) {
    event.preventDefault();

    if (!avatarFile) {
      setStatus({ type: 'error', message: 'Choose a profile picture first.' });
      return;
    }

    setStatus({ type: '', message: '' });
    setIsUploadingAvatar(true);

    try {
      const response = await profileService.uploadAvatar(avatarFile);
      setProfile({ ...emptyProfile, ...response.data.user });
      updateUser(response.data.user);
      setAvatarFile(null);
      setStatus({ type: 'success', message: response.message });
    } catch (error) {
      setStatus({ type: 'error', message: error.message ?? 'Unable to upload avatar.' });
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setIsChangingPassword(true);

    try {
      const response = await profileService.changePassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      clearSession();
      setStatus({ type: 'success', message: response.message });
      navigate('/login', { replace: true });
    } catch (error) {
      setStatus({ type: 'error', message: error.message ?? 'Unable to change password.' });
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleDeleteAccount(event) {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setIsDeleting(true);

    try {
      await profileService.deleteAccount(deletePassword);
      clearSession();
      navigate('/register', { replace: true });
    } catch (error) {
      setStatus({ type: 'error', message: error.message ?? 'Unable to delete account.' });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-cyan-300">
              Profile management
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Manage your account</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Update personal details, exam target, profile picture, password, and account access.
            </p>
          </div>
          <span className="grid size-12 place-items-center rounded-md bg-cyan-50 text-brand-700 dark:bg-slate-800 dark:text-cyan-300">
            <UserRound size={24} aria-hidden="true" />
          </span>
        </div>
      </div>

      <StatusMessage tone={status.type === 'error' ? 'error' : 'success'}>{status.message}</StatusMessage>

      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <form
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            onSubmit={handleProfileSubmit}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-cyan-50 text-brand-700 dark:bg-slate-800 dark:text-cyan-300">
                <Save size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">Profile details</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Keep your learner profile current.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField id="name" label="Name" name="name" value={profile.name} onChange={updateProfileField} required />
              <FormField id="email" label="Email" name="email" type="email" value={profile.email} onChange={updateProfileField} required />
              <FormField id="phone" label="Phone" name="phone" value={profile.phone} onChange={updateProfileField} />
              <FormField id="examTarget" label="Exam Target" name="examTarget" value={profile.examTarget} onChange={updateProfileField} placeholder="RRB NTPC, Group D, ALP..." />
            </div>

            <label htmlFor="bio" className="mt-4 block space-y-2">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Bio</span>
              <textarea
                id="bio"
                name="bio"
                rows={5}
                value={profile.bio}
                onChange={updateProfileField}
                className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="Write a short note about your preparation journey."
              />
            </label>

            <Button type="submit" className="mt-5 gap-2" disabled={isSavingProfile}>
              {isSavingProfile ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
              Update Profile
            </Button>
          </form>

          <form
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            onSubmit={handlePasswordSubmit}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <KeyRound size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">Change password</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">You will be asked to log in again after changing it.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="currentPassword"
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={updatePasswordField}
                required
              />
              <FormField
                id="newPassword"
                label="New Password"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={updatePasswordField}
                minLength={8}
                required
              />
            </div>

            <Button type="submit" className="mt-5 gap-2" disabled={isChangingPassword}>
              {isChangingPassword ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <KeyRound size={16} aria-hidden="true" />}
              Change Password
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <form
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            onSubmit={handleAvatarSubmit}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-cyan-50 text-brand-700 dark:bg-slate-800 dark:text-cyan-300">
                <Camera size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">Profile picture</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload a JPG, PNG, or WebP image.</p>
              </div>
            </div>

            <div className="flex flex-col items-center rounded-lg border border-dashed border-slate-300 p-5 text-center dark:border-slate-700">
              <div className="grid size-28 place-items-center overflow-hidden rounded-lg bg-slate-100 text-3xl font-bold text-slate-500 dark:bg-slate-950 dark:text-slate-300">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile preview" className="size-full object-cover" />
                ) : (
                  getInitials(profile.name)
                )}
              </div>
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800">
                <Upload size={16} aria-hidden="true" />
                Choose Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <Button type="submit" className="mt-5 w-full gap-2" disabled={isUploadingAvatar}>
              {isUploadingAvatar ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Upload size={16} aria-hidden="true" />}
              Upload Avatar
            </Button>
          </form>

          <form
            className="rounded-lg border border-red-200 bg-red-50 p-5 shadow-sm dark:border-red-900/60 dark:bg-red-950/20"
            onSubmit={handleDeleteAccount}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                <ShieldAlert size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-red-950 dark:text-red-100">Delete account</h2>
                <p className="text-sm text-red-700 dark:text-red-300">This permanently removes your account.</p>
              </div>
            </div>

            <FormField
              id="deletePassword"
              label="Confirm Password"
              name="deletePassword"
              type="password"
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
              required
            />

            <Button type="submit" className="mt-5 w-full gap-2 bg-red-600 hover:bg-red-700 focus:ring-red-500" disabled={isDeleting}>
              {isDeleting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Trash2 size={16} aria-hidden="true" />}
              Delete Account
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function buildAssetUrl(path) {
  if (!path) {
    return '';
  }

  if (path.startsWith('http')) {
    return path;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
  const serverBaseUrl = apiBaseUrl.replace(/\/api\/v\d+\/?$/, '');
  return `${serverBaseUrl}${path}`;
}

function getInitials(name = 'Student') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
