import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import MessRoutes from "./routes/message.route.js";
import { connectDb } from "./lib/db.js";
import cors from "cors";
import { app, server } from "./lib/socket.js"; // use this app
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "5mb", extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use("/api/auth", authRoutes);
app.use("/api/messages", MessRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get('/:path(*)', (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

connectDb().then(() => {
  server.listen(PORT, () => {
    console.log("server started on port: " + PORT);
  });
});
