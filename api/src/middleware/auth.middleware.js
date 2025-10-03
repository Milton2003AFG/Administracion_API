const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ ok: false, error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ ok: false, error: 'Invalid token' });

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { idAdmin, email }
    next();
  } catch (err) {
    return res.status(403).json({ ok: false, error: 'Unauthorized' });
  }
}

module.exports = authMiddleware;
