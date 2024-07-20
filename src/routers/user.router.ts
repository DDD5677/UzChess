import express, { Router } from "express";
import UserController from "../controllers/user.controller";
import { adminMdw } from "../middlewares/admin.middleware";
import { userselfMdw } from "../middlewares/userself.middleware";
const router: Router = express.Router();

router.get("/", adminMdw, UserController.getAllUsers);
router.get("/:id", userselfMdw, UserController.getUser);
router.patch("/:id", userselfMdw, UserController.updateUser);
router.delete("/:id", adminMdw, UserController.deleteUser);

export default router;
