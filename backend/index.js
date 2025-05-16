import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./Utils/db.js";
import AuthRouter from "./Routes/Auth.Routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 1919;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URL2];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api", AuthRouter);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server is live on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect DB:", error.message);
  }
};

startServer();
