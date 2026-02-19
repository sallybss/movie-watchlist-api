"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDocs = setupDocs;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
function setupDocs(app) {
    const swaggerDefinition = {
        openapi: "3.0.0",
        info: {
            title: "Movie Watchlist API",
            version: "1.0.0",
            description: "MongoDB + Express + TypeScript REST API for managing a movie watchlist",
        },
        servers: [
            {
                url: "http://localhost:4000/api",
                description: "Local development server",
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "auth-token",
                },
            },
            schemas: {
                Movie: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        genre: { type: "string" },
                        releaseYear: { type: "number" },
                        watched: { type: "boolean" },
                        rating: { type: "number" },
                        owner: { type: "string" },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        password: { type: "string" },
                        registerDate: { type: "string" },
                    },
                },
            },
        },
    };
    const options = {
        swaggerDefinition,
        apis: [path_1.default.join(__dirname, "..", "**", "*.ts")],
    };
    const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
    // Pick ONE route. If you use /swagger in browser, mount it here:
    app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
}
//# sourceMappingURL=doc.js.map