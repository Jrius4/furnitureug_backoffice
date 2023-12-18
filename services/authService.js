const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');

const authService = {
  login: async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;

    const token = jwt.sign({ sub: user._id }, config.secretKey, { expiresIn: '1h' });
    return token;
  },
};

module.exports = authService;
