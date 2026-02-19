"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movieRoutes_1 = __importDefault(require("./routes/movieRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - App Routes
 *     summary: Health check
 *     description: Basic route to check if the API is running
 *     responses:
 *       200:
 *         description: Server up and running.
 */
router.get("/", (_req, res) => {
    res.status(200).send({ message: "Welcome to the movie-watchlist API" });
});
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth Routes
 *     summary: Register a new user
 *     description: Creates a new user account
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
 *         description: User created successfully
 */
router.use("/auth", authRoutes_1.default);
/**
 * @swagger
 * /movies:
 *   post:
 *     tags:
 *       - Movie Routes
 *     summary: Create a new movie
 *     description: Adds a movie to the watchlist
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
 *         description: Movie created successfully
 *
 *   get:
 *     tags:
 *       - Movie Routes
 *     summary: Get all movies
 *     description: Retrieves all movies in the database
 *     responses:
 *       200:
 *         description: A list of movies
 */
router.use("/movies", movieRoutes_1.default);
/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     tags:
 *       - Movie Routes
 *     summary: Get movie by id
 *     description: Retrieves a specific movie by MongoDB id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie object
 *
 *   put:
 *     tags:
 *       - Movie Routes
 *     summary: Update movie by id
 *     description: Updates a specific movie
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Movie"
 *     responses:
 *       200:
 *         description: Movie updated
 *
 *   delete:
 *     tags:
 *       - Movie Routes
 *     summary: Delete movie by id
 *     description: Deletes a specific movie
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted
 */
/**
 * @swagger
 * /movies/query/{field}/{value}:
 *   get:
 *     tags:
 *       - Movie Routes
 *     summary: Search movies by field/value
 *     description: "Example: /api/movies/search/title/Dune"
 *     parameters:
 *       - in: path
 *         name: field
 *         required: true
 *         schema:
 *           type: string
 *         description: Field to search by (title, genre, owner, etc.)
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: Value to match (case-insensitive)
 *     responses:
 *       200:
 *         description: List of movies
 */
exports.default = router;
//# sourceMappingURL=routes.js.map