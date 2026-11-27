import { Router } from "express";
import { listUsers, removeUser } from "../controllers/users.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireAdmin);
router.get("/", listUsers);
router.delete("/:id", removeUser);

export default router;
