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
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const dotenv_flow_1 = __importDefault(require("dotenv-flow"));
const database_1 = require("./repository/database");
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const doc_1 = require("./util/doc");
dotenv_flow_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["auth-token", "Authorization", "Origin", "Content-Type", "Accept"],
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api", routes_1.default);
(0, doc_1.setupDocs)(app);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, database_1.testConnection)();
        const PORT = parseInt(process.env.PORT) || 4000;
        app.listen(PORT, () => {
            console.log("Server is running on port: " + PORT);
        });
    });
}
exports.default = app;
//# sourceMappingURL=app.js.map