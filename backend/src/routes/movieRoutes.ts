import { Router } from "express";
import { verifyToken } from "../controllers/authController";
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovieById,
  deleteMovieById,
  getMoviesByQuery
} from "../controllers/movieController";

const router = Router();

// Public read routes (optional — you can protect these too)
router.get("/", getAllMovies);
router.get("/query/:field/:value", getMoviesByQuery);
router.get("/:id", getMovieById);

// Protected write routes
router.post("/", verifyToken, createMovie);
router.put("/:id", verifyToken, updateMovieById);
router.delete("/:id", verifyToken, deleteMovieById);

export default router;