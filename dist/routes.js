"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET /
router.get("/", (_req, res) => {
    res.status(200).send("Welcome to the movie-watchlist API");
});
exports.default = router;
//# sourceMappingURL=routes.js.map