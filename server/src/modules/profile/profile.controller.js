import { clearRefreshTokenCookie } from '../auth/auth.cookies.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  changePassword,
  deleteAccount,
  updateAvatar,
  updateProfile,
} from './profile.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

export const updateProfileDetails = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});

export const updatePassword = asyncHandler(async (req, res) => {
  await changePassword(req.user.id, req.body);
  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully. Please log in again.',
  });
});

export const uploadProfileAvatar = asyncHandler(async (req, res) => {
  const user = await updateAvatar(req.user.id, req.file);

  res.status(200).json({
    success: true,
    message: 'Profile picture updated successfully',
    data: { user },
  });
});

export const removeAccount = asyncHandler(async (req, res) => {
  await deleteAccount(req.user.id, req.body.password);
  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
});
