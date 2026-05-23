import bcrypt from 'bcryptjs';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/apiError.js';
import { sendEmail } from '../../utils/email.js';
import { User } from './user.model.js';
import {
  createSecureToken,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './auth.tokens.js';

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    examTarget: user.examTarget,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    lastLoginAt: user.lastLoginAt,
  };
}

async function issueSession(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: publicUser(user),
    accessToken,
    refreshToken,
  };
}

export async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const { token, tokenHash } = createSecureToken();
  const user = await User.create({
    name,
    email,
    password,
    emailVerificationToken: tokenHash,
    emailVerificationExpiresAt: new Date(
      Date.now() + env.EMAIL_VERIFICATION_EXPIRES_MINUTES * 60 * 1000,
    ),
  });

  await sendEmail({
    to: user.email,
    subject: 'Verify your Railway Prep account',
    text: `Verify your email by opening: ${env.CLIENT_URL}/verify-email/${token}`,
  });

  return issueSession(user);
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password +refreshTokenHash');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return issueSession(user);
}

export async function refreshSession(refreshToken) {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.sub).select('+refreshTokenHash');

  if (!user?.refreshTokenHash || !(await bcrypt.compare(refreshToken, user.refreshTokenHash))) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  return issueSession(user);
}

export async function logoutUser(userId) {
  if (!userId) {
    return;
  }

  await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
}

export async function verifyEmail(token) {
  const tokenHash = hashToken(token);
  const user = await User.findOne({
    emailVerificationToken: tokenHash,
    emailVerificationExpiresAt: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpiresAt');

  if (!user) {
    throw new ApiError(400, 'Verification link is invalid or expired');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiresAt = undefined;
  await user.save();

  return publicUser(user);
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpiresAt');

  if (!user) {
    return;
  }

  const { token, tokenHash } = createSecureToken();
  user.passwordResetToken = tokenHash;
  user.passwordResetExpiresAt = new Date(Date.now() + env.PASSWORD_RESET_EXPIRES_MINUTES * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: 'Reset your Railway Prep password',
    text: `Reset your password by opening: ${env.CLIENT_URL}/reset-password/${token}`,
  });
}

export async function resetPassword({ token, password }) {
  const tokenHash = hashToken(token);
  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select('+password +passwordResetToken +passwordResetExpiresAt +refreshTokenHash');

  if (!user) {
    throw new ApiError(400, 'Password reset link is invalid or expired');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;
  user.refreshTokenHash = undefined;
  await user.save();
}

export function buildAuthResponse(session) {
  return {
    user: session.user,
    accessToken: session.accessToken,
  };
}
