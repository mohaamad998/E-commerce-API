const { UnauthenticatedError, UnAuthorizedError } = require('../errors');
const { isTokenValid } = require('../utils');

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) throw new UnauthenticatedError('Authintication invalid');

  try {
    const payload = isTokenValid(token);

    req.user = { name: payload.name, id: payload.id, role: payload.role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authintication invalid');
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!roles.includes(role))
      throw new UnAuthorizedError('unauthorized to access to this route');

    next();
  };
};

module.exports = { userAuth, authorizePermission };
