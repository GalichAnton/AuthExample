const jsonwebtoken = require('jsonwebtoken');
const tokenModel = require('../models/token-model');
class TokenService {
  generateToken(payload) {
    const accessToken = jsonwebtoken.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15s' },
    );

    const refreshToken = jsonwebtoken.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30s' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    const token = await tokenModel.deleteOne({ refreshToken });
    return token;
  }

  valiateAccessToken(token) {
    try {
      const userData = jsonwebtoken.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
      );
      return userData;
    } catch (e) {
      return null;
    }
  }

  valiateRefreshToken(token) {
    try {
      const userData = jsonwebtoken.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
      );
      return userData;
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken) {
    const token = await tokenModel.findOne({ refreshToken });
    return token;
  }
}

module.exports = new TokenService();
