import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import { testConnection } from "./repository/database";
import routes from "./routes";
import cors from 'cors';
import { setupDocs } from "./util/doc";

dotenvFlow.config();

const app: Application = express();

function setupCors() {

  app.use(cors({

    // Allow request from any origin
    origin: "*",

    // allow HTTP methods
    methods: 'GET, PUT, POST, DELETE',

    // allow headers
    allowedHeaders: ['auth-token', 'Origin', 'X-Requested-Width', 'Content-Type', 'Accept'],

    // allow credentials
    credentials:true
  }))
}

app.use(express.json());
app.use("/api", routes);

export async function startServer() {
  setupDocs(app);
  setupCors();
  await testConnection();

  const PORT: number = parseInt(process.env.PORT as string) || 4000;

  app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
}

export default app;