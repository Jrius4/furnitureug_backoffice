const authService = require('../services/authService');
const responseUtil = require('../utils/response');

const authController = {
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const token = await authService.login(username, password);
      if (!token) {
        return responseUtil.sendError(res, 'Invalid credentials', 401);
      }
      responseUtil.sendSuccess(res, { token });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
