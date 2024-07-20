import BaseError from "../utils/helpers/base.error";
import { NextFunction, Request, Response } from "express";
import prisma from "../utils/helpers/db";

class LiderboardController {
   async getTournamentLiderboard(
      req: Request,
      res: Response,
      next: NextFunction
   ) {
      try {
         const tournament = await prisma.tournament.findFirst({
            where: {
               id: +req.params.id,
            },
            include: {
               players: {
                  orderBy: [
                     {
                        score: "desc",
                     },
                  ],
                  select: {
                     id: true,
                     score: true,
                     user: {
                        select: {
                           id: true,
                           name: true,
                           username: true,
                           age: true,
                           country: true,
                           rating: true,
                        },
                     },
                  },
               },
            },
         });
         if (!tournament) {
            throw BaseError.NotFound(
               "The tournament with given Id is not found"
            );
         }
         res.status(200).send(tournament);
      } catch (error) {
         next(error);
      }
   }
   async getUsersLiderboard(req: Request, res: Response, next: NextFunction) {
      try {
         const users = await prisma.user.findMany({
            select: {
               id: true,
               name: true,
               username: true,
               age: true,
               rating: true,
               country: true,
            },
            orderBy: [
               {
                  rating: "desc",
               },
            ],
            take: 10,
         });
         res.status(200).send(users);
      } catch (error) {
         next(error);
      }
   }
}

export default new LiderboardController();
