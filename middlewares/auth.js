const { JWT_SECRET = 'dev-secret' } = process.env;
const jwt = require('jsonwebtoken');
const AuthorizedError = require('../utils/errors/AuthorizedError');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthorizedError('Необходима авторизация.'));
  }
  req.user = payload;
  next();
};
