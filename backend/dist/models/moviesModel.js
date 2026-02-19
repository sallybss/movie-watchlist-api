"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieModel = void 0;
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
    title: { type: String, required: true, min: 1, max: 255 },
    posterUrl: { type: String, required: false, max: 2048 },
    genre: { type: String, required: false, min: 1, max: 100 },
    releaseYear: { type: Number, required: false, min: 1888, max: 2100 },
    watched: { type: Boolean, required: true, default: false },
    rating: { type: Number, required: false, min: 1, max: 5 },
    owner: { type: String, ref: "User", required: true }
});
movieSchema.pre("findOneAndUpdate", function () {
    const update = this.getUpdate();
    if (update.__v != null) {
        delete update.__v;
    }
    const keys = ["$set", "$setOnInsert"];
    for (const key of keys) {
        if (update[key] != null && update[key].__v != null) {
            delete update[key].__v;
            if (Object.keys(update[key]).length === 0) {
                delete update[key];
            }
        }
    }
    update.$inc = update.$inc || {};
    update.$inc.__v = 1;
});
exports.movieModel = (0, mongoose_1.model)("Movie", movieSchema);
//# sourceMappingURL=moviesModel.js.map