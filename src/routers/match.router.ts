import express, { Router } from "express";
import MatchController from "../controllers/match.controller";
import { userselfMdw } from "../middlewares/userself.middleware";
import { adminMdw } from "../middlewares/admin.middleware";
const router: Router = express.Router();

router.post("/", adminMdw, MatchController.createMatch);
router.get("/tournament/:tournamentId", MatchController.getMatchesByTournament);
router.get("/user/:userId", userselfMdw, MatchController.getMatchesByUser);
router.get("/:id", MatchController.getMatch);
router.patch("/:id", adminMdw, MatchController.updateMatch);
router.delete("/:id", adminMdw, MatchController.deleteMatch);

export default router;
