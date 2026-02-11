import { Router } from "express";
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovieById,
  deleteMovieById
} from "../controllers/movieController";

const router = Router();

// CRUD routes
router.post("/", createMovie);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.put("/:id", updateMovieById);
router.delete("/:id", deleteMovieById);

export default router;