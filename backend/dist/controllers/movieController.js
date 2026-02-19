"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMovie = createMovie;
exports.getAllMovies = getAllMovies;
exports.getMovieById = getMovieById;
exports.getMoviesByQuery = getMoviesByQuery;
exports.updateMovieById = updateMovieById;
exports.deleteMovieById = deleteMovieById;
exports.updateMovieRating = updateMovieRating;
const moviesModel_1 = require("../models/moviesModel");
const database_1 = require("../repository/database");
// CRUD - create, read/get, update, delete
/**
 * Creates a new movie in the data source based on the request body
 * @param req
 * @param res
 */
function createMovie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            yield (0, database_1.connect)();
            const movie = new moviesModel_1.movieModel(data);
            const result = yield movie.save();
            res.status(201).send(result);
        }
        catch (err) {
            res.status(500).send("Error creating movie. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Retrieves all movies from the data sources
 * @param req
 * @param res
 */
function getAllMovies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const { title, genre, watched, owner, minRating } = req.query;
            const filter = {};
            if (title)
                filter.title = { $regex: String(title), $options: "i" };
            if (genre)
                filter.genre = { $regex: String(genre), $options: "i" };
            if (watched !== undefined) {
                filter.watched = String(watched) === "true";
            }
            if (owner)
                filter.owner = String(owner);
            if (minRating !== undefined) {
                const r = Number(minRating);
                if (!Number.isNaN(r))
                    filter.rating = { $gte: r };
            }
            const result = yield moviesModel_1.movieModel.find(filter).sort({ createdAt: -1 });
            res.status(200).send(result);
        }
        catch (err) {
            res.status(500).send("Error retrieving movies. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Retrieves a movie by its id from the data sources
 * @param req
 * @param res
 */
function getMovieById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const id = req.params.id;
            const result = yield moviesModel_1.movieModel.findById(id);
            res.status(200).send(result);
        }
        catch (err) {
            res.status(500).send("Error retrieving movie by id. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Retrieves movies by query from the data sources
 * Example: /api/movies/search/title/Dune
 * @param req
 * @param res
 */
function getMoviesByQuery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = String(req.params.key);
        const val = req.params.val;
        try {
            yield (0, database_1.connect)();
            // NOTE:
            // TypeScript might complain about [key] - casting to any keeps it identical to teacher style
            const result = yield moviesModel_1.movieModel.find({
                [key]: { $regex: val, $options: "i" }
            });
            res.status(200).send(result);
        }
        catch (err) {
            res.status(500).send("Error retrieving movies. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Updates the movie by id
 * @param req
 * @param res
 */
function updateMovieById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            yield (0, database_1.connect)();
            const result = yield moviesModel_1.movieModel.findByIdAndUpdate(id, req.body);
            if (!result) {
                res.status(404).send("Cannot update movie with id=" + id);
            }
            else {
                res.status(200).send("Movie was succesfully updated.");
            }
        }
        catch (err) {
            res.status(500).send("Error updating movie by id. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Deletes the movie by its id from the data sources
 * @param req
 * @param res
 */
function deleteMovieById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            yield (0, database_1.connect)();
            const result = yield moviesModel_1.movieModel.findByIdAndDelete(id);
            if (!result) {
                res.status(404).send("Cannot delete movie with id=" + id);
            }
            else {
                res.status(200).send("Movie was succesfully deleted.");
            }
        }
        catch (err) {
            res.status(500).send("Error deleting movie by id. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
function updateMovieRating(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const rating = Number(req.body.rating);
        if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
            res.status(400).send("Rating must be a number between 1 and 5.");
            return;
        }
        try {
            yield (0, database_1.connect)();
            const result = yield moviesModel_1.movieModel.findByIdAndUpdate(id, { rating }, { new: true });
            if (!result) {
                res.status(404).send("Cannot update rating for movie with id=" + id);
            }
            else {
                res.status(200).send(result);
            }
        }
        catch (err) {
            res.status(500).send("Error updating rating. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
//# sourceMappingURL=movieController.js.map