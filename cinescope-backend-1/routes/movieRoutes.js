import express from 'express';
import { fetchPopularMovies, getMovieDetails, searchMovies } from '../controllers/movieController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to fetch popular movies
router.get('/popular', fetchPopularMovies);

// Route to get movie details by ID
router.get('/:id', getMovieDetails);

// Route to search for movies
router.get('/search', searchMovies);

export default router;