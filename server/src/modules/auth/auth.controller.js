import { asyncHandler } from '../../utils/asyncHandler.js';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from './auth.cookies.js';
import {
  buildAuthResponse,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} from './auth.service.js';
import { checkAndTriggerDailyReminder } from '../notifications/notification.service.js';

export const register = asyncHandler(async (req, res) => {
  const session = await registerUser(req.body);
  setRefreshTokenCookie(res, session.refreshToken);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    data: buildAuthResponse(session),
  });
});

export const login = asyncHandler(async (req, res) => {
  const session = await loginUser(req.body);
  setRefreshTokenCookie(res, session.refreshToken);

  try {
    if (session?.user?.id) {
      await checkAndTriggerDailyReminder(session.user.id);
    }
  } catch (err) {
    console.error('Error triggering daily reminder on login:', err);
  }

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: buildAuthResponse(session),
  });
});

export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user?.id);
  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const session = await refreshSession(req.cookies.refreshToken);
  setRefreshTokenCookie(res, session.refreshToken);

  res.status(200).json({
    success: true,
    message: 'Session refreshed',
    data: buildAuthResponse(session),
  });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

export const verifyEmailAddress = asyncHandler(async (req, res) => {
  const user = await verifyEmail(req.params.token);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    data: { user },
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await requestPasswordReset(req.body.email);

  res.status(200).json({
    success: true,
    message: 'If an account exists, a password reset link has been sent.',
  });
});

export const updatePasswordFromReset = asyncHandler(async (req, res) => {
  await resetPassword(req.body);
  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Password reset successful. Please log in again.',
  });
});
