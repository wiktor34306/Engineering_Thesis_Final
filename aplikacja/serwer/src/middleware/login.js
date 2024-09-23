import jwt from "jsonwebtoken";
import config from "../config";

const login = (req, res, next) => {
  // 401 Unauthorized
  // 403 Forbidden

  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    req.user = jwt.verify(token, config.JwtSecret);
    if (!req.user.isLogin) {
      return res.status(403).send('Access denied.');
    }
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

export default login;
