import express from "express";
import dotenv from "dotenv";
import authRoutes from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import problemRoutes from "./Routes/problem.routes.js";
import submissionRoutes from "./Routes/submission.routes.js";
import executionRoute from "./Routes/executeCode.routes.js";
import playlistRoutes from "./Routes/playlist.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("server is ready");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes); //check the routes before running
app.use("/api/v1", executionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App is Listening on port : ${PORT}`);
});
