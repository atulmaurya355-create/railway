import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { authService } from '../authService.js';
import { AuthCard } from '../components/AuthCard.jsx';
import { FormField } from '../components/FormField.jsx';
import { StatusMessage } from '../components/StatusMessage.jsx';

export function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      const response = await authService.resetPassword({ token, password });
      setMessage(response.message);
      setPassword('');
    } catch (requestError) {
      setError(requestError.message ?? 'Unable to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard title="Reset password" subtitle="Choose a new password for your account.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <StatusMessage tone="success">{message}</StatusMessage>
        <StatusMessage tone="error">{error}</StatusMessage>
        <FormField
          id="password"
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        Ready to continue?{' '}
        <Link to="/login" className="font-medium text-brand-700 dark:text-cyan-300">
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
