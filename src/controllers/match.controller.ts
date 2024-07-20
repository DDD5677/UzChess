import BaseError from "../utils/helpers/base.error";
import { NextFunction, Request, Response } from "express";
import prisma from "../utils/helpers/db";

class MatchController {
   async createMatch(req: Request, res: Response, next: NextFunction) {
      try {
         const { tournamentId, round, started } = req.body;
         const players = await prisma.player.findMany({
            where: {
               tournamentId,
            },
            orderBy: [
               {
                  score: "desc",
               },
            ],
            select: {
               id: true,
            },
         });
         const countMatches = Math.floor(players.length / 2);
         for (let i = 0; i < countMatches; i++) {
            const match = await prisma.match.create({
               data: {
                  whiteId: players[i].id,
                  blackId: players[i + countMatches].id,
                  round,
                  started,
                  tournamentId,
               },
            });
            if (!match) {
               throw BaseError.BadRequest("Player is not created");
            }
         }

         res.status(201).send({ message: "Matches are created successfully" });
      } catch (error) {
         next(error);
      }
   }
   async getMatchesByTournament(
      req: Request,
      res: Response,
      next: NextFunction
   ) {
      try {
         const matches = await prisma.match.findMany({
            where: {
               tournamentId: +req.params.tournamentId,
            },
            select: {
               id: true,
               won: true,
               started: true,
               round: true,
               ended: true,
               white: {
                  select: {
                     id: true,
                     score: true,
                     user: {
                        select: {
                           id: true,
                           name: true,
                           age: true,
                           country: true,
                           rating: true,
                        },
                     },
                  },
               },
               black: {
                  select: {
                     id: true,
                     score: true,
                     user: {
                        select: {
                           id: true,
                           name: true,
                           age: true,
                           country: true,
                           rating: true,
                        },
                     },
                  },
               },
            },
         });

         res.status(200).send(matches);
      } catch (error) {
         next(error);
      }
   }

   async getMatchesByUser(req: Request, res: Response, next: NextFunction) {
      try {
         const whiteMatches = await prisma.match.findMany({
            where: {
               whiteId: +req.params.userId,
            },
         });
         const blackMatches = await prisma.match.findMany({
            where: {
               blackId: +req.params.userId,
            },
         });
         res.status(200).send({ whiteMatches, blackMatches });
      } catch (error) {
         next(error);
      }
   }
   async getMatch(req: Request, res: Response, next: NextFunction) {
      try {
         const match = await prisma.match.findFirst({
            where: {
               id: +req.params.id,
            },
            select: {
               id: true,
               won: true,
               started: true,
               round: true,
               ended: true,
               white: {
                  select: {
                     id: true,
                     score: true,
                     user: {
                        select: {
                           id: true,
                           name: true,
                           age: true,
                           country: true,
                           rating: true,
                        },
                     },
                  },
               },
               black: {
                  select: {
                     id: true,
                     score: true,
                     user: {
                        select: {
                           id: true,
                           name: true,
                           age: true,
                           country: true,
                           rating: true,
                        },
                     },
                  },
               },
            },
         });
         if (!match) {
            throw BaseError.NotFound("The match with given Id is not found");
         }
         res.status(200).send(match);
      } catch (error) {
         next(error);
      }
   }

   async updateMatch(req: Request, res: Response, next: NextFunction) {
      try {
         const { won, started, ended } = req.body;
         const match = await prisma.match.update({
            where: {
               id: +req.params.id,
            },
            data: {
               won,
               started,
               ended,
            },
         });
         if (!match) {
            throw BaseError.BadRequest("The match is not updated");
         }
         res.status(200).send(match);
      } catch (error) {
         next(error);
      }
   }

   async deleteMatch(req: Request, res: Response, next: NextFunction) {
      try {
         const match = await prisma.match.delete({
            where: {
               id: +req.params.id,
            },
         });
         if (!match) {
            throw BaseError.BadRequest(
               "The match with given Id is not deleted"
            );
         }
         res.status(200).send({
            message: "The match is deleted successfully",
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new MatchController();
