const ApiError = require('../exceptinos/api-error');
const TokenService = require('../services/token-service');
module.exports = function (req, res, next) {
  try {
    const auhorizationHeader = req.headers.authorization;
    if (!auhorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const [, accessToken] = auhorizationHeader.split(' ');
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = TokenService.valiateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};
