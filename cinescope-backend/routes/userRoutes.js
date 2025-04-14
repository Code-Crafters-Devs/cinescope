import express from 'express';
import { getUserProfile, updateUserProfile, getUserWatchHistory } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Removed { authenticate }

const router = express.Router();

// Route to get user profile
router.get('/profile', authMiddleware, getUserProfile);

// Route to update user profile
router.put('/profile', authMiddleware, updateUserProfile);

// Route to get user watch history
router.get('/watch-history', authMiddleware, getUserWatchHistory);

// Example route using authMiddleware
router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'This is a protected route' });
});

export default router;