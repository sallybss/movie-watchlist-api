"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const movieController_1 = require("../controllers/movieController");
const router = (0, express_1.Router)();
// Public read routes (optional — you can protect these too)
router.get("/", movieController_1.getAllMovies);
router.get("/query/:field/:value", movieController_1.getMoviesByQuery);
router.get("/favorites", authController_1.verifyToken, movieController_1.getFavoriteMovies);
router.get("/favorites/ids", authController_1.verifyToken, movieController_1.getFavoriteMovieIds);
router.get("/:id", movieController_1.getMovieById);
// Protected write routes
router.post("/", authController_1.verifyToken, movieController_1.createMovie);
router.post("/:id/favorite", authController_1.verifyToken, movieController_1.addFavoriteMovie);
router.put("/:id", authController_1.verifyToken, movieController_1.updateMovieById);
router.delete("/:id", authController_1.verifyToken, movieController_1.deleteMovieById);
router.delete("/:id/favorite", authController_1.verifyToken, movieController_1.removeFavoriteMovie);
exports.default = router;
//# sourceMappingURL=movieRoutes.js.map