const { UnAuthorizedError } = require('../errors');

const checkPermisions = (reqUser, resourceUserId) => {
  if (reqUser.role !== 'admin' && reqUser.id !== resourceUserId.toString())
    throw new UnAuthorizedError('UnAuthorized to this route');
};

module.exports = { checkPermisions };
