import BaseError from "../utils/helpers/base.error";
import { NextFunction, Request, Response } from "express";
import prisma from "../utils/helpers/db";

class PlayerController {
   async createPlayer(req: Request, res: Response, next: NextFunction) {
      try {
         const { score, userId, tournamentId } = req.body;
         const player = await prisma.player.create({
            data: {
               score,
               userId,
               tournamentId,
            },
         });

         if (!player) {
            throw BaseError.BadRequest("Player is not created");
         }

         res.status(201).send(player);
      } catch (error) {
         next(error);
      }
   }
   async getAllPlayers(req: Request, res: Response, next: NextFunction) {
      try {
         const players = await prisma.player.findMany();
         res.status(200).send(players);
      } catch (error) {
         next(error);
      }
   }

   async getPlayer(req: Request, res: Response, next: NextFunction) {
      try {
         const player = await prisma.player.findFirst({
            where: {
               id: +req.params.id,
            },
         });
         if (!player) {
            throw BaseError.NotFound("The player with given Id is not found");
         }
         res.status(200).send(player);
      } catch (error) {
         next(error);
      }
   }

   async updatePlayer(req: Request, res: Response, next: NextFunction) {
      try {
         const { score, userId, tournamentId } = req.body;
         const player = await prisma.player.update({
            where: {
               id: +req.params.id,
            },
            data: {
               score,
               userId,
               tournamentId,
            },
         });
         if (!player) {
            throw BaseError.BadRequest("The player is not updated");
         }
         res.status(200).send(player);
      } catch (error) {
         next(error);
      }
   }

   async deletePlayer(req: Request, res: Response, next: NextFunction) {
      try {
         const player = await prisma.player.delete({
            where: {
               id: +req.params.id,
            },
         });
         if (!player) {
            throw BaseError.BadRequest(
               "The player with given Id is not deleted"
            );
         }
         res.status(200).send({
            message: "The player is deleted successfully",
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new PlayerController();
