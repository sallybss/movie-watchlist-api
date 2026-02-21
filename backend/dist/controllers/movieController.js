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
exports.getFavoriteMovieIds = getFavoriteMovieIds;
exports.getFavoriteMovies = getFavoriteMovies;
exports.addFavoriteMovie = addFavoriteMovie;
exports.removeFavoriteMovie = removeFavoriteMovie;
const moviesModel_1 = require("../models/moviesModel");
const userModel_1 = require("../models/userModel");
const database_1 = require("../repository/database");
function isValidUrl(value) {
    if (typeof value !== "string")
        return false;
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    }
    catch (_a) {
        return false;
    }
}
function pickMovieBody(body) {
    const movie = {};
    if (typeof body.title === "string")
        movie.title = body.title;
    if (typeof body.genre === "string")
        movie.genre = body.genre;
    if (typeof body.releaseYear === "number")
        movie.releaseYear = body.releaseYear;
    if (typeof body.watched === "boolean")
        movie.watched = body.watched;
    if (typeof body.owner === "string")
        movie.owner = body.owner;
    // ✅ posterUrl (optional)
    if (body.posterUrl !== undefined) {
        if (!isValidUrl(body.posterUrl)) {
            throw new Error("posterUrl must be a valid http/https URL");
        }
        movie.posterUrl = body.posterUrl;
    }
    // ✅ rating (optional, allow 0-5)
    if (body.rating !== undefined) {
        const r = Number(body.rating);
        if (!Number.isFinite(r) || r < 0 || r > 5) {
            throw new Error("rating must be a number between 0 and 5");
        }
        movie.rating = r;
    }
    return movie;
}
function getAuthUserId(req) {
    const user = req.user;
    return typeof (user === null || user === void 0 ? void 0 : user.id) === "string" ? user.id : null;
}
function createMovie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const data = pickMovieBody(req.body); // ✅ only allowed fields
            const movie = new moviesModel_1.movieModel(data);
            const result = yield movie.save();
            res.status(201).send(result);
        }
        catch (err) {
            const msg = String((err === null || err === void 0 ? void 0 : err.message) || err);
            res.status(msg.includes("posterUrl") || msg.includes("rating") ? 400 : 500).send(msg);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
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
            if (watched !== undefined)
                filter.watched = String(watched) === "true";
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
function getMoviesByQuery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = String(req.params.key);
        const val = req.params.val;
        try {
            yield (0, database_1.connect)();
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
function updateMovieById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            yield (0, database_1.connect)();
            const update = pickMovieBody(req.body); // ✅ validate + pick
            const result = yield moviesModel_1.movieModel.findByIdAndUpdate(id, update, { new: true });
            if (!result)
                res.status(404).send("Cannot update movie with id=" + id);
            else
                res.status(200).send(result);
        }
        catch (err) {
            const msg = String((err === null || err === void 0 ? void 0 : err.message) || err);
            res.status(msg.includes("posterUrl") || msg.includes("rating") ? 400 : 500).send(msg);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
function deleteMovieById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            yield (0, database_1.connect)();
            const result = yield moviesModel_1.movieModel.findByIdAndDelete(id);
            if (!result)
                res.status(404).send("Cannot delete movie with id=" + id);
            else
                res.status(200).send("Movie was succesfully deleted.");
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
        // ✅ allow 0-5
        if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
            res.status(400).send("Rating must be a number between 0 and 5.");
            return;
        }
        try {
            yield (0, database_1.connect)();
            const result = yield moviesModel_1.movieModel.findByIdAndUpdate(id, { rating }, { new: true });
            if (!result)
                res.status(404).send("Cannot update rating for movie with id=" + id);
            else
                res.status(200).send(result);
        }
        catch (err) {
            res.status(500).send("Error updating rating. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
function getFavoriteMovieIds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const userId = getAuthUserId(req);
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const user = yield userModel_1.userModel.findById(userId).select("favorites");
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            const favorites = Array.isArray(user.favorites) ? user.favorites.map((id) => String(id)) : [];
            res.status(200).json({ error: null, data: favorites });
        }
        catch (err) {
            res.status(500).send("Error retrieving favorite movies. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
function getFavoriteMovies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const userId = getAuthUserId(req);
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const user = yield userModel_1.userModel.findById(userId).select("favorites");
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            const favorites = Array.isArray(user.favorites) ? user.favorites : [];
            const movies = yield moviesModel_1.movieModel.find({ _id: { $in: favorites } }).sort({ createdAt: -1 });
            res.status(200).json({ error: null, data: movies });
        }
        catch (err) {
            res.status(500).send("Error retrieving favorite movies. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
function addFavoriteMovie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const userId = getAuthUserId(req);
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const movieId = req.params.id;
            const movie = yield moviesModel_1.movieModel.findById(movieId).select("_id");
            if (!movie) {
                res.status(404).json({ error: "Movie not found" });
                return;
            }
            const updated = yield userModel_1.userModel
                .findByIdAndUpdate(userId, { $addToSet: { favorites: movieId } }, { new: true })
                .select("favorites");
            if (!updated) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            const favorites = Array.isArray(updated.favorites)
                ? updated.favorites.map((id) => String(id))
                : [];
            res.status(200).json({ error: null, data: favorites });
        }
        catch (err) {
            res.status(500).send("Error adding favorite movie. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
function removeFavoriteMovie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const userId = getAuthUserId(req);
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const movieId = req.params.id;
            const updated = yield userModel_1.userModel
                .findByIdAndUpdate(userId, { $pull: { favorites: movieId } }, { new: true })
                .select("favorites");
            if (!updated) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            const favorites = Array.isArray(updated.favorites)
                ? updated.favorites.map((id) => String(id))
                : [];
            res.status(200).json({ error: null, data: favorites });
        }
        catch (err) {
            res.status(500).send("Error removing favorite movie. Error: " + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
//# sourceMappingURL=movieController.js.map