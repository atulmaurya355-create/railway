import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { useAuth } from '../AuthProvider.jsx';
import { AuthCard } from '../components/AuthCard.jsx';
import { FormField } from '../components/FormField.jsx';
import { StatusMessage } from '../components/StatusMessage.jsx';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const redirectTo = location.state?.from?.pathname ?? '/dashboard';

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.message ?? 'Unable to log in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard title="Login" subtitle="Access your Railway Prep dashboard and saved progress.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <StatusMessage tone="error">{error}</StatusMessage>
        <FormField
          id="email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={updateField}
          required
        />
        <FormField
          id="password"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={updateField}
          required
        />
        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="font-medium text-brand-700 dark:text-cyan-300">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        New here?{' '}
        <Link to="/register" className="font-medium text-brand-700 dark:text-cyan-300">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
