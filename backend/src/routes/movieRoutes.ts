import { Router } from "express";
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovieById,
  deleteMovieById,
  getMoviesByQuery,
  updateMovieRating
} from "../controllers/movieController";

import { verifyToken } from "../controllers/authController";

const router = Router();

// Public read routes
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.get("/search/:key/:val", getMoviesByQuery);

// Protected write routes
router.post("/", verifyToken, createMovie);
router.put("/:id", verifyToken, updateMovieById);
router.put("/:id/rating", updateMovieRating);
router.delete("/:id", verifyToken, deleteMovieById);

export default router;