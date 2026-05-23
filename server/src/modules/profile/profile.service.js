import bcrypt from 'bcryptjs';
import { ApiError } from '../../utils/apiError.js';
import { User } from '../auth/user.model.js';

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

export async function updateProfile(userId, payload) {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (payload.email !== user.email) {
    const emailExists = await User.exists({ email: payload.email, _id: { $ne: userId } });

    if (emailExists) {
      throw new ApiError(409, 'This email is already in use');
    }

    user.isEmailVerified = false;
  }

  user.name = payload.name;
  user.email = payload.email;
  user.phone = payload.phone ?? '';
  user.bio = payload.bio ?? '';
  user.examTarget = payload.examTarget ?? '';
  await user.save();

  return publicUser(user);
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select('+password +refreshTokenHash');

  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  user.refreshTokenHash = undefined;
  await user.save();
}

export async function updateAvatar(userId, file) {
  if (!file) {
    throw new ApiError(400, 'Profile picture is required');
  }

  const avatarUrl = `/uploads/avatars/${file.filename}`;
  const user = await User.findByIdAndUpdate(userId, { avatarUrl }, { new: true });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return publicUser(user);
}

export async function deleteAccount(userId, password) {
  const user = await User.findById(userId).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(400, 'Password is incorrect');
  }

  await User.findByIdAndDelete(userId);
}
