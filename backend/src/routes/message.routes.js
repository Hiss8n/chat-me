import Router from "express";
import { getMessages, sendMessage } from "../controllers/message.js";
import protectedRoute from "../utils/middleware.js";

const router = Router();
router.use(protectedRoute);

router.post("/send/:id", sendMessage);
router.get("/:id", getMessages);
export default router;
