import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import { testConnection } from "./repository/database";
import routes from "./routes";
import cors from "cors";
import { setupDocs } from "./util/doc";

dotenvFlow.config();

const app: Application = express();

const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://movie-watchlist-api-1.onrender.com", // your frontend
]);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // allow Postman/curl (no Origin header)
    if (!origin) return callback(null, true);

    if (allowedOrigins.has(origin)) return callback(null, true);

    // block unknown origins (no crash)
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "auth-token"],
};

app.use(cors(corsOptions)); // ✅ this is enough (preflight included)

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