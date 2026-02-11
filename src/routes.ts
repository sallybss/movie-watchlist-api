import { Router, Request, Response } from "express";
import moviesRoutes from "./routes/movieRoutes";

const router = Router();

// Base route
router.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Welcome to the movie-watchlist API");
});

// Movies routes
router.post("/movies", moviesRoutes);

export default router;