import express from "express";
import { Signin,Signup,Logout,UpdateProfile,checkAuth } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup",Signup);
router.post("/login",Signin);
router.post("/logout",Logout);
router.put("/update-profile",protectRoute,UpdateProfile);
router.get("/check",protectRoute,checkAuth);

export default router;