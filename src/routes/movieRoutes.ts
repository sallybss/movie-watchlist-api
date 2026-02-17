import { Router } from "express";
import {
  createMovie,
  getAllMovies,
  getMovieById,
  getMoviesByQuery,
  updateMovieById,
  deleteMovieById
} from "../controllers/movieController";

const router = Router();

// CRUD routes
router.post("/", createMovie);
router.get("/", getAllMovies);

// ✅ Search route MUST be before "/:id"
router.get("/search/:key/:val", getMoviesByQuery);

router.get("/:id", getMovieById);
router.put("/:id", updateMovieById);
router.delete("/:id", deleteMovieById);

export default router;