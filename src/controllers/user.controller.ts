import BaseError from "../utils/helpers/base.error";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import prisma from "../utils/helpers/db";

class UserController {
   async getAllUsers(req: Request, res: Response, next: NextFunction) {
      try {
         const users = await prisma.user.findMany({
            select: {
               id: true,
               name: true,
               username: true,
               age: true,
               country: true,
               rating: true,
            },
         });
         res.status(200).send(users);
      } catch (error) {
         next(error);
      }
   }

   async getUser(req: Request, res: Response, next: NextFunction) {
      try {
         const user = await prisma.user.findFirst({
            where: {
               id: +req.params.id,
            },
            select: {
               id: true,
               name: true,
               username: true,
               age: true,
               country: true,
               rating: true,
               player: {
                  select: {
                     id: true,
                     score: true,
                     tournamentId: true,
                  },
               },
            },
         });
         if (!user) {
            throw BaseError.NotFound("The user with given Id is not found");
         }
         res.status(200).send(user);
      } catch (error) {
         next(error);
      }
   }

   async updateUser(req: Request, res: Response, next: NextFunction) {
      try {
         const { name, username, newPassword, age, country } = req.body;

         let password = req.body.password;
         //Validate username
         if (username) {
            const existedUser = await prisma.user.findFirst({
               where: {
                  username,
               },
            });
            if (existedUser) {
               throw BaseError.ValidationError({
                  username: "The username is already registered",
               });
            }
         }
         //check password and validate new one
         if (password) {
            if (!bcrypt.compareSync(password, req.body.user.password))
               throw BaseError.BadRequest("Password is wrong");
            if (newPassword.length < 6)
               throw BaseError.ValidationError({
                  newPassword: "Password length must be at least 6 characters",
               });

            password = newPassword;
         }

         const user = await prisma.user.update({
            where: {
               id: +req.params.id,
            },
            data: {
               name,
               username,
               password,
               age,
               country,
            },
            select: {
               id: true,
               name: true,
               username: true,
               age: true,
               country: true,
               rating: true,
            },
         });
         if (!user) {
            throw BaseError.BadRequest("The player is not updated");
         }
         res.status(200).send(user);
      } catch (error) {
         next(error);
      }
   }

   async deleteUser(req: Request, res: Response, next: NextFunction) {
      try {
         const user = await prisma.user.delete({
            where: {
               id: +req.params.id,
            },
         });
         if (!user) {
            throw BaseError.BadRequest("The user with given Id is not deleted");
         }
         res.status(200).send({
            message: "The user is deleted successfully",
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new UserController();
