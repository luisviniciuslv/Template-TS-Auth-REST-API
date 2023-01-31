import jwt from 'jsonwebtoken';
import SECRET from './../constants/jwt';
export type GenerateJwtCallback = (
  error: Error | null,
  encoded: string | undefined
) => void;

export const generate = (email: string, callback: GenerateJwtCallback) => {
  const payload = { email };
  jwt.sign(payload, SECRET, callback);
};

export const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token)
    return res.status(401).json({ auth: false, message: 'No token provided.' });
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).end();
    req.userId = decoded.id;
    next();
  });
};
