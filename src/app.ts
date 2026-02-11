import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import { testConnection } from "./repository/database";
import routes from "./routes";

dotenvFlow.config();

// create express application
const app: Application = express();

// middleware
app.use(express.json());


export async function startServer() {

    app.use("/api", routes);


  await testConnection(); // ensure DB connects before server starts

  const PORT: number = parseInt(process.env.PORT as string) || 4000;

  app.listen(PORT, () => {
    console.log(" Server is running on port: " + PORT);
  });
}

export default app;