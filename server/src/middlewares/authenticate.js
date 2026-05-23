import { User } from '../modules/auth/user.model.js';
import { verifyAccessToken } from '../modules/auth/auth.tokens.js';

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid authentication token' });
      return;
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
  }
}
