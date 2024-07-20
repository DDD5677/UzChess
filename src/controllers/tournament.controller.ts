import BaseError from "../utils/helpers/base.error";
import { NextFunction, Request, Response } from "express";
import prisma from "../utils/helpers/db";

class TournamentController {
   async createTournament(req: Request, res: Response, next: NextFunction) {
      try {
         const { name, started, ended } = req?.body;
         const tournament = await prisma.tournament.create({
            data: {
               name,
               started,
               ended,
            },
         });
         if (!tournament) {
            throw BaseError.BadRequest("Tournament is not created");
         }
         res.status(201).send(tournament);
      } catch (error) {
         next(error);
      }
   }

   async getAllTournaments(req: Request, res: Response, next: NextFunction) {
      try {
         const tournaments = await prisma.tournament.findMany({
            include: {
               players: {
                  select: {
                     id: true,
                     score: true,
                     user: {
                        select: {
                           id: true,
                           name: true,
                           age: true,
                           username: true,
                           country: true,
                           rating: true,
                        },
                     },
                  },
               },
               matches: true,
            },
         });

         res.status(200).send(tournaments);
      } catch (error) {
         next(error);
      }
   }
   async getTournament(req: Request, res: Response, next: NextFunction) {
      try {
         const tournament = await prisma.tournament.findFirst({
            where: {
               id: +req.params.id,
            },
            include: {
               players: {
                  select: {
                     id: true,
                     score: true,
                     user: {
                        select: {
                           id: true,
                           name: true,
                           age: true,
                           username: true,
                           country: true,
                           rating: true,
                        },
                     },
                  },
               },
               matches: true,
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
   async updateTournament(req: Request, res: Response, next: NextFunction) {
      try {
         const { name, started, ended } = req.body;
         const tournament = await prisma.tournament.update({
            where: {
               id: +req.params.id,
            },
            data: {
               name,
               started,
               ended,
            },
         });
         if (!tournament) {
            throw BaseError.BadRequest("The tournament is not updated");
         }
         res.status(200).send(tournament);
      } catch (error) {
         next(error);
      }
   }
   async deleteTournament(req: Request, res: Response, next: NextFunction) {
      try {
         const tournament = await prisma.tournament.delete({
            where: {
               id: +req.params.id,
            },
         });

         if (!tournament) {
            throw BaseError.BadRequest(
               "The tournament with given Id is not deleted"
            );
         }
         res.status(200).send(tournament);
      } catch (error) {
         next(error);
      }
   }
}

export default new TournamentController();
