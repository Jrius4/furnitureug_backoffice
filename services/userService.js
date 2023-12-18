const User = require('../models/userModel');

const userService = {
  getAllUsers: async () => {
    return await User.find();
  },

  getUserById: async (userId) => {
    return await User.findById(userId);
  },

  createUser: async (userData) => {
    return await User.create(userData);
  },

  updateUser: async (userId, userData) => {
    return await User.findByIdAndUpdate(userId, userData, { new: true });
  },

  deleteUser: async (userId) => {
    return await User.findByIdAndDelete(userId);
  },
};

module.exports = userService;
