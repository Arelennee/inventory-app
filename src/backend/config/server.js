import express, { json } from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import productsRoutes from "../routes/products.routes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(json());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", productsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0' ,() => {
  console.log("Server runnig on port", PORT);
});
