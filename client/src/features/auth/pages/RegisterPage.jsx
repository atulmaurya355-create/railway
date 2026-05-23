import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { useAuth } from '../AuthProvider.jsx';
import { AuthCard } from '../components/AuthCard.jsx';
import { FormField } from '../components/FormField.jsx';
import { StatusMessage } from '../components/StatusMessage.jsx';

export function RegisterPage() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message ?? 'Unable to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard title="Create account" subtitle="Register as a student and start saving your preparation progress.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <StatusMessage tone="error">{error}</StatusMessage>
        <FormField
          id="name"
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={updateField}
          required
        />
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
          autoComplete="new-password"
          value={form.password}
          onChange={updateField}
          minLength={8}
          required
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-700 dark:text-cyan-300">
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
