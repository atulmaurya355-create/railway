import { asyncHandler } from '../../utils/asyncHandler.js';
import { UserLanguagePreference } from './userLanguagePreference.model.js';

export const getLanguagePreferenceHandler = asyncHandler(async (req, res) => {
  let preference = await UserLanguagePreference.findOne({ user: req.user.id });
  
  if (!preference) {
    preference = await UserLanguagePreference.create({
      user: req.user.id,
      language: 'en',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      language: preference.language,
    },
  });
});

export const setLanguagePreferenceHandler = asyncHandler(async (req, res) => {
  const { language } = req.body;

  if (!language || !['en', 'hi'].includes(language)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid language code. Supported: en, hi',
    });
  }

  let preference = await UserLanguagePreference.findOne({ user: req.user.id });

  if (preference) {
    preference.language = language;
    await preference.save();
  } else {
    preference = await UserLanguagePreference.create({
      user: req.user.id,
      language,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Language preference saved successfully',
    data: {
      language: preference.language,
    },
  });
});
