"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movieController_1 = require("../controllers/movieController");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Public read routes
router.get("/", movieController_1.getAllMovies);
router.get("/:id", movieController_1.getMovieById);
router.get("/search/:key/:val", movieController_1.getMoviesByQuery);
// Protected write routes
router.post("/", authController_1.verifyToken, movieController_1.createMovie);
router.put("/:id", authController_1.verifyToken, movieController_1.updateMovieById);
router.put("/:id/rating", movieController_1.updateMovieRating);
router.delete("/:id", authController_1.verifyToken, movieController_1.deleteMovieById);
exports.default = router;
//# sourceMappingURL=movieRoutes.js.map