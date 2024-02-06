const express = require('express');
const authController = require('../controllers/authcontroller');
const authenticateToken = require('../middlewares/authenticatetoken');
const JWTUtils = require('../utils/jwtutils')
const router = express.Router();
router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/protected', authenticateToken('admin'), (req, res) => {
  const user = req.user;
  res.json({ message: 'This is a protected route', user });
});
router.post('/upload',authController.upload);
router.get('/export',authController.exportsql);
module.exports = router;