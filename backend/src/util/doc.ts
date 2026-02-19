import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Application } from "express";
import path from "path";

export function setupDocs(app: Application) {
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
    apis: [`${process.cwd()}/src/**/*.ts`],
  };

  const swaggerSpec = swaggerJSDoc(options);

  // Pick ONE route. If you use /swagger in browser, mount it here:
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}