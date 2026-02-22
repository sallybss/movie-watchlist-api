import { Router, type Request, type Response } from "express";
import moviesRoutes from "./routes/movieRoutes";
import authRoutes from "./routes/authRoutes";

const router: Router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags: [System]
 *     summary: API status
 *     description: Quick check that the Movie Watchlist API is alive.
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             example:
 *               message: Welcome to the movie-watchlist API
 */
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to the movie-watchlist API" });
});

/**
 * AUTH
 * We mount /auth routes here.
 * Actual endpoints live inside authRoutes (ex: /auth/register, /auth/login).
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Create an account
 *     description: Register a new user so you can use protected endpoints (create/update/delete).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *           example:
 *             name: "Sali Bseso"
 *             email: "sali@test.com"
 *             password: "123456"
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error (for example: email already exists)
 */
router.use("/auth", authRoutes);

/**
 * MOVIES
 * We mount /movies routes here.
 * Actual endpoints live inside moviesRoutes.
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     tags: [Movies]
 *     summary: Get all movies
 *     description: Returns all movies in the watchlist.
 *     responses:
 *       200:
 *         description: List of movies
 *
 *   post:
 *     tags: [Movies]
 *     summary: Add a movie
 *     description: Add a new movie to the watchlist (requires login).
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Movie"
 *           example:
 *             title: "Dune"
 *             genre: "Sci-Fi"
 *             releaseYear: 2021
 *             watched: false
 *             rating: 5
 *             owner: "test-user-1"
 *     responses:
 *       201:
 *         description: Movie created
 *       401:
 *         description: Missing/invalid token
 */
router.use("/movies", moviesRoutes);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Get one movie
 *     description: Fetch a single movie by its MongoDB id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie id
 *     responses:
 *       200:
 *         description: Movie found
 *       404:
 *         description: Movie not found
 *
 *   put:
 *     tags: [Movies]
 *     summary: Update a movie
 *     description: Update an existing movie (requires login).
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Movie"
 *     responses:
 *       200:
 *         description: Movie updated
 *       401:
 *         description: Missing/invalid token
 *       404:
 *         description: Movie not found
 *
 *   delete:
 *     tags: [Movies]
 *     summary: Delete a movie
 *     description: Remove a movie from the watchlist (requires login).
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie id
 *     responses:
 *       200:
 *         description: Movie deleted
 *       401:
 *         description: Missing/invalid token
 *       404:
 *         description: Movie not found
 */

/**
 * @swagger
 * /movies/query/{field}/{value}:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Filter movies
 *     description: Filter by a field/value pair.
 *     parameters:
 *       - in: path
 *         name: field
 *         required: true
 *         schema:
 *           type: string
 *         description: Field to filter by (title, genre, owner, etc.)
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: Value to match (case-insensitive).
 *     responses:
 *       200:
 *         description: Matching movies
 */

/**
 * FAVORITES
 * (These routes must exist in moviesRoutes, otherwise swagger will show them but they won’t work.)
 */

/**
 * @swagger
 * /movies/favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Get favorite movies
 *     description: Returns full movie objects that the logged-in user marked as favorite.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Favorite movies
 *       401:
 *         description: Missing/invalid token
 */

/**
 * @swagger
 * /movies/favorites/ids:
 *   get:
 *     tags: [Favorites]
 *     summary: Get favorite ids
 *     description: Returns only movie ids for the logged-in user's favorites.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Favorite movie ids
 *       401:
 *         description: Missing/invalid token
 */

/**
 * @swagger
 * /movies/{id}/favorite:
 *   post:
 *     tags: [Favorites]
 *     summary: Add to favorites
 *     description: Mark a movie as favorite for the logged-in user.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie id
 *     responses:
 *       200:
 *         description: Updated favorites list
 *       401:
 *         description: Missing/invalid token
 *       404:
 *         description: Movie not found
 *
 *   delete:
 *     tags: [Favorites]
 *     summary: Remove from favorites
 *     description: Unfavorite a movie for the logged-in user.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie id
 *     responses:
 *       200:
 *         description: Updated favorites list
 *       401:
 *         description: Missing/invalid token
 */

export default router;