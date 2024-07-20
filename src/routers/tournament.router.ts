import express, { Router } from "express";
import TournamentController from "../controllers/tournament.controller";
import { adminMdw } from "../middlewares/admin.middleware";
const router: Router = express.Router();

router.post("/", adminMdw, TournamentController.createTournament);
router.get("/", TournamentController.getAllTournaments);
router.get("/:id", TournamentController.getTournament);
router.patch("/:id", adminMdw, TournamentController.updateTournament);
router.delete("/:id", adminMdw, TournamentController.deleteTournament);

export default router;
