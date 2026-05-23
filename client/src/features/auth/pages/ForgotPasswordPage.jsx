import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { authService } from '../authService.js';
import { AuthCard } from '../components/AuthCard.jsx';
import { FormField } from '../components/FormField.jsx';
import { StatusMessage } from '../components/StatusMessage.jsx';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
    } catch (requestError) {
      setError(requestError.message ?? 'Unable to send password reset link.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard title="Forgot password" subtitle="Enter your email and we will send a reset link if an account exists.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <StatusMessage tone="success">{message}</StatusMessage>
        <StatusMessage tone="error">{error}</StatusMessage>
        <FormField
          id="email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        Remembered it?{' '}
        <Link to="/login" className="font-medium text-brand-700 dark:text-cyan-300">
          Back to login
        </Link>
      </p>
    </AuthCard>
  );
}
