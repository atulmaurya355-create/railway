import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { authService } from '../authService.js';
import { AuthCard } from '../components/AuthCard.jsx';
import { StatusMessage } from '../components/StatusMessage.jsx';

export function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState({ loading: true, message: '', error: '' });

  useEffect(() => {
    async function verify() {
      try {
        const response = await authService.verifyEmail(token);
        setStatus({ loading: false, message: response.message, error: '' });
      } catch (requestError) {
        setStatus({
          loading: false,
          message: '',
          error: requestError.message ?? 'Unable to verify email.',
        });
      }
    }

    verify();
  }, [token]);

  return (
    <AuthCard title="Email verification" subtitle="We are confirming your account email.">
      {status.loading ? <StatusMessage>Verifying your email...</StatusMessage> : null}
      <StatusMessage tone="success">{status.message}</StatusMessage>
      <StatusMessage tone="error">{status.error}</StatusMessage>
      <Button as={Link} to="/dashboard" className="mt-6 w-full">
        Continue
      </Button>
    </AuthCard>
  );
}
