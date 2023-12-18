const userService = require('../services/userService');
const responseUtil = require('../utils/response');
const bcrypt = require('bcrypt');


const userController = {
  register:async(req,res,next)=>{
    console.log({req,res,next})
    try {
      const { username, password } = req.body;
      console.log({ username, password },req.body)
      const hashedPassword = await bcrypt.hash(password,10);
  
      const reqistedUser = {
        username: username,
        password: hashedPassword,
      };
  
      const newUser = await userService.createUser(reqistedUser);
      responseUtil.sendSuccess(res, newUser, 201);
  
    } catch (error) {
      next(error);
    }
    
    
  },
  getAllUsers: async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();
      responseUtil.sendSuccess(res, users);
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return responseUtil.sendError(res, 'User not found', 404);
      }
      responseUtil.sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const newUser = await userService.createUser(req.body);
      responseUtil.sendSuccess(res, newUser, 201);
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        return responseUtil.sendError(res, 'User not found', 404);
      }
      responseUtil.sendSuccess(res, updatedUser);
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const deletedUser = await userService.deleteUser(req.params.id);
      if (!deletedUser) {
        return responseUtil.sendError(res, 'User not found', 404);
      }
      responseUtil.sendSuccess(res, deletedUser);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
