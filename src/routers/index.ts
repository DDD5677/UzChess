import express, { Router } from "express";
import auth from "./auth.router";
import user from "./user.router";
import tournament from "./tournament.router";
import player from "./player.router";
import match from "./match.router";
import liderboard from "./liderboard.router";
import { authJwtMdw } from "../middlewares/auth.middleware";
import { adminMdw } from "../middlewares/admin.middleware";

const router: Router = express.Router();

router.use("/auth", auth);
router.use("/user", authJwtMdw, user);
router.use("/tournament", authJwtMdw, tournament);
router.use("/player", authJwtMdw, adminMdw, player);
router.use("/match", authJwtMdw, match);
router.use("/liderboard", liderboard);

export default router;
