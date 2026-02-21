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
exports.testConnection = testConnection;
exports.connect = connect;
exports.disconnect = disconnect;
const mongoose_1 = __importDefault(require("mongoose"));
let connectPromise = null;
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connect();
            console.log("Database connection test completed");
        }
        catch (error) {
            console.log("Error testing database connection. Error: " + error);
            throw error;
        }
    });
}
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!process.env.DBHOST) {
                throw new Error("DBHOST environment variable is not defined");
            }
            // 1 = connected, 2 = connecting
            if (mongoose_1.default.connection.readyState === 1)
                return;
            if (mongoose_1.default.connection.readyState === 2 && connectPromise) {
                yield connectPromise;
                return;
            }
            connectPromise = mongoose_1.default.connect(process.env.DBHOST);
            yield connectPromise;
            if (mongoose_1.default.connection.db) {
                yield mongoose_1.default.connection.db.admin().command({ ping: 1 });
            }
            else {
                throw new Error("Database connection is not established");
            }
        }
        catch (error) {
            console.log("Error connecting to the database. Error: " + error);
            throw error;
        }
        finally {
            connectPromise = null;
        }
    });
}
function disconnect() {
    return __awaiter(this, arguments, void 0, function* (force = false) {
        // Keep one shared connection alive for request handlers.
        if (!force)
            return;
        try {
            yield mongoose_1.default.disconnect();
            console.log("Connection closed");
        }
        catch (error) {
            console.log("Error closing database connection. Error: " + error);
            throw error;
        }
    });
}
//# sourceMappingURL=database.js.map