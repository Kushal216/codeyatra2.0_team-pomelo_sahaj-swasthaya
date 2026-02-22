import jwt from 'jsonwebtoken';

export function verifyToken(req, requiredRole) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (requiredRole && decoded.role !== requiredRole && decoded.role !== 'admin') return null;
    return decoded;
  } catch (error) {
    return null;
  }
}