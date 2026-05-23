import { asyncHandler } from '../../utils/asyncHandler.js';
import { searchService } from './search.service.js';

export const globalSearchHandler = asyncHandler(async (req, res) => {
  const data = await searchService.searchAll(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});
