import { Router } from "express";
import { verifyToken } from "../controllers/authController";
import {
  createMovie,
  getAllMovies,
  getFavoriteMovieIds,
  getFavoriteMovies,
  getMovieById,
  addFavoriteMovie,
  removeFavoriteMovie,
  updateMovieById,
  deleteMovieById,
  getMoviesByQuery
} from "../controllers/movieController";

const router = Router();

// Public read routes (optional — you can protect these too)
router.get("/", getAllMovies);
router.get("/query/:field/:value", getMoviesByQuery);
router.get("/favorites", verifyToken, getFavoriteMovies);
router.get("/favorites/ids", verifyToken, getFavoriteMovieIds);
router.get("/:id", getMovieById);

// Protected write routes
router.post("/", verifyToken, createMovie);
router.post("/:id/favorite", verifyToken, addFavoriteMovie);
router.put("/:id", verifyToken, updateMovieById);
router.delete("/:id", verifyToken, deleteMovieById);
router.delete("/:id/favorite", verifyToken, removeFavoriteMovie);

export default router;
