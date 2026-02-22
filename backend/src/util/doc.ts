import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import type { Application } from "express";
import path from "path";

export function setupDocs(app: Application) {
  const isProd = process.env.NODE_ENV === "production";

  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Movie Watchlist API",
      version: "1.0.0",
      description:
        "MongoDB + Express + TypeScript REST API for managing a movie watchlist",
    },
    servers: [
      {
        url: isProd
          ? "https://movie-watchlist-api-7fxk.onrender.com/api"
          : "http://localhost:4000/api",
        description: isProd ? "Production server" : "Local development server",
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
            posterUrl: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
  };

  const options = {
    swaggerDefinition,
    // In Render (prod) you're running the compiled JS in /dist
    apis: [
      isProd
        ? path.join(process.cwd(), "dist", "**", "*.js")
        : path.join(process.cwd(), "src", "**", "*.ts"),
    ],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}