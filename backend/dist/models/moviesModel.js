"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieModel = void 0;
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
    title: { type: String, required: true, minlength: 1, maxlength: 255 },
    // ✅ Online poster image URL
    posterUrl: { type: String, required: false, maxlength: 2048 },
    genre: { type: String, required: false, minlength: 1, maxlength: 100 },
    releaseYear: { type: Number, required: false, min: 1888, max: 2100 },
    watched: { type: Boolean, required: true, default: false },
    // ✅ allow 0 = "not rated yet"
    rating: { type: Number, required: false, min: 0, max: 5 },
    owner: { type: String, ref: "User", required: true }
}, { timestamps: true } // ✅ so your sort({ createdAt: -1 }) actually works
);
movieSchema.pre("findOneAndUpdate", function () {
    const update = this.getUpdate();
    if (update.__v != null)
        delete update.__v;
    const keys = ["$set", "$setOnInsert"];
    for (const key of keys) {
        if (update[key] != null && update[key].__v != null) {
            delete update[key].__v;
            if (Object.keys(update[key]).length === 0)
                delete update[key];
        }
    }
    update.$inc = update.$inc || {};
    update.$inc.__v = 1;
});
exports.movieModel = (0, mongoose_1.model)("Movie", movieSchema);
//# sourceMappingURL=moviesModel.js.map