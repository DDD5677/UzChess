import express, { Router } from "express";
import LiderboardController from "../controllers/liderboard.controller";
const router: Router = express.Router();

router.get("/tournament/:id", LiderboardController.getTournamentLiderboard);
router.get("/users", LiderboardController.getUsersLiderboard);

export default router;
