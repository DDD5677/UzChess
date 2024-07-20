import express, { Router } from "express";
import PlayerController from "../controllers/player.controller";
import { adminMdw } from "../middlewares/admin.middleware";
const router: Router = express.Router();

router.post("/", PlayerController.createPlayer);
router.get("/", PlayerController.getAllPlayers);
router.get("/:id", PlayerController.getPlayer);
router.patch("/:id", PlayerController.updatePlayer);
router.delete("/:id", PlayerController.deletePlayer);

export default router;
