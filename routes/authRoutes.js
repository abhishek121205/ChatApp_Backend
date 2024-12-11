import express from 'express';
import { register, login, getCurrentUser, getMessages, sendMessages } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Inject JSON Server's DB into req
router.use((req, res, next) => {
  req.db = req.app.get('db');
  next();
});

router.post('/register', register);
router.post('/login', login);
router.get('/current-user', verifyToken, getCurrentUser);
router.get('/getMessages',getMessages)
router.post('/sendMessages',sendMessages)

export default router;
