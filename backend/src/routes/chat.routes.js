import Router from "express";
import getChatsForSideBar from "../controllers/chats.js";
import protectedRoute from "../utils/middleware.js";

const router = Router();

router.get("/", protectedRoute, getChatsForSideBar);

export default router;
