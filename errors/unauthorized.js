const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class UnAuthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnAuthorizedError;
