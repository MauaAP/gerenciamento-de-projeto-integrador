import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { routes } from "./routes/routes";
import { errorHandlerMiddleware } from "./shared/middleware/error_middleware";
import swaggerUi from "swagger-ui-express";
import { openApiDoc } from "./shared/helpers/swagger";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

console.log("🚀 Server is starting...");
console.log(`📡 Listening on port ${PORT}`);

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
});

routes(app);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT} 🚀`);
});

export default app;
