import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import { testConnection } from "./repository/database";
import routes from "./routes";
import cors from "cors";
import { setupDocs } from "./util/doc";

dotenvFlow.config();

const app: Application = express();

/**
 * CORS configuration
 * Allows:
 *  - Local development (Vite)
 *  - Production frontend (Render Static Site)
 *  - Postman (no origin)
 */
const allowedOrigins = [
  "http://localhost:5173",
  "https://movie-watchlist-api-1.onrender.com/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for origin: " + origin));
    },
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: [
      "auth-token",
      "Authorization",
      "Origin",
      "Content-Type",
      "Accept",
    ],
    credentials: false, // we are using JWT headers, NOT cookies
  })
);

app.use(express.json());

app.use("/api", routes);

setupDocs(app);

export async function startServer() {
  await testConnection();

  const PORT: number = parseInt(process.env.PORT as string) || 4000;

  app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
}

export default app;