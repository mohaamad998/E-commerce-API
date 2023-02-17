const { UnauthenticatedError } = require('../errors');
const { isTokenValid } = require('../utils');

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) throw new UnauthenticatedError('Authintication invalid');

  try {
    const payload = isTokenValid(token);
    req.user = { ...payload };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authintication invalid');
  }
};

module.exports = { userAuth };


