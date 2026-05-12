import Router from "express";
import {
  register,
  login,
  getUsersForSideBar,
  getSingleUser,
  uploadProfile,
} from "../controllers/userAuth.js";
import protectedRoute from "../utils/middleware.js";
const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/", protectedRoute, getUsersForSideBar);

router.put("/profile", protectedRoute, uploadProfile);

router.get("/:id", getSingleUser);
export default router;
