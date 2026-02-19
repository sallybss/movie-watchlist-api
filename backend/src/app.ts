import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import { testConnection } from "./repository/database";
import routes from "./routes";
import cors from "cors";
import { setupDocs } from "./util/doc";

dotenvFlow.config();

const app: Application = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["auth-token", "Authorization", "Origin", "Content-Type", "Accept"],
  credentials: true
}));

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