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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.verifyToken = verifyToken;
exports.validateUserRegistrationInfo = validateUserRegistrationInfo;
exports.validateUserLoginInfo = validateUserLoginInfo;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const userModel_1 = require("../models/userModel");
const database_1 = require("../repository/database");
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = validateUserRegistrationInfo(req.body);
            if (error)
                return res.status(400).json({ error: error.details[0].message });
            yield (0, database_1.connect)();
            const emailExists = yield userModel_1.userModel.findOne({ email: req.body.email });
            if (emailExists)
                return res.status(400).json({ error: "Email already exists." });
            const salt = yield bcrypt_1.default.genSalt(10);
            const passwordHashed = yield bcrypt_1.default.hash(req.body.password, salt);
            const userObject = new userModel_1.userModel({
                name: req.body.name,
                email: req.body.email,
                password: passwordHashed
            });
            const savedUser = yield userObject.save();
            return res.status(201).json({ error: null, data: { userId: savedUser._id } });
        }
        catch (error) {
            return res.status(500).send("Error registering user. Error: " + error);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = validateUserLoginInfo(req.body);
            if (error)
                return res.status(400).json({ error: error.details[0].message });
            yield (0, database_1.connect)();
            const user = yield userModel_1.userModel.findOne({ email: req.body.email });
            if (!user)
                return res.status(400).json({ error: "Password or email is wrong." });
            const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
            if (!validPassword)
                return res.status(400).json({ error: "Password or email is wrong." });
            const TOKEN_SECRET = process.env.TOKEN_SECRET;
            if (!TOKEN_SECRET)
                return res.status(500).json({ error: "Missing TOKEN_SECRET in env." });
            const userId = String(user.id);
            const token = jsonwebtoken_1.default.sign({ id: userId, name: user.name, email: user.email }, TOKEN_SECRET, { expiresIn: "2h" });
            // Return token in body, and also set headers for convenience
            return res
                .status(200)
                .header("auth-token", token)
                .json({ error: null, data: { userId, token } });
        }
        catch (error) {
            return res.status(500).send("Error logging in user. Error: " + error);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * JWT middleware:
 * Accepts either:
 *  - Authorization: Bearer <token>
 *  - auth-token: <token>
 */
function verifyToken(req, res, next) {
    const bearer = req.header("Authorization"); // "Bearer xxx"
    const legacy = req.header("auth-token"); // "xxx"
    const token = (bearer && bearer.startsWith("Bearer ") ? bearer.slice(7).trim() : null) ||
        legacy ||
        null;
    if (!token)
        return res.status(401).json({ error: "Access Denied. Missing token." });
    try {
        const TOKEN_SECRET = process.env.TOKEN_SECRET;
        if (!TOKEN_SECRET)
            return res.status(500).json({ error: "Missing TOKEN_SECRET in env." });
        const decoded = jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
        // Optional: attach to req for later use
        req.user = decoded;
        return next();
    }
    catch (_a) {
        return res.status(401).json({ error: "Invalid Token" });
    }
}
function validateUserRegistrationInfo(data) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(2).max(255).required(),
        email: joi_1.default.string().email().min(6).max(255).required(),
        password: joi_1.default.string().min(6).max(64).required()
    });
    return schema.validate(data);
}
function validateUserLoginInfo(data) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().min(6).max(255).required(),
        password: joi_1.default.string().min(6).max(64).required()
    });
    return schema.validate(data);
}
//# sourceMappingURL=authController.js.map