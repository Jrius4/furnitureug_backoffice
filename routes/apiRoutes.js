const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const currencyController = require('../controllers/currencyController');

const router = express.Router();
router.post('/post', (req,res)=>{
    res.send(req.body);
});



// Public routes
router.post('/register', userController.register);
router.post('/login', authController.login);
router.get('/dollar-rates', currencyController.getCurrencyRates);
router.post('/dollar-rates', currencyController.computeRates);
router.get('/vat-rates', currencyController.getVat);


// Protected routes
router.use(authMiddleware.authenticateToken); // Example authentication middleware
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
