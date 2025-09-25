import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import MessRoutes from "./routes/message.route.js";
import { connectDb } from "./lib/db.js";
import cors from "cors";
import {app,server} from "./lib/socket.js"
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5001;
const ___dirname = path.resolve();
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "5mb", extended: true }));

if(process.env.NODE_ENV !== "production"){
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
}

app.use("/api/auth",authRoutes);
app.use("/api/messages",MessRoutes);

if(process.env.NODE_ENV === "production"){
app.use(express.static(path.join(___dirname,"../frontend/dist")))
app.get("/*",(req,res)=>{
    res.sendFile(path.join(___dirname,"../frontend","dist","index.html"))
})}

connectDb().then(() => {
  server.listen(PORT, () => {
    console.log("server started on port: " + PORT);
  });
});