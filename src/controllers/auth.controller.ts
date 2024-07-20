import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/helpers/token";
import BaseError from "../utils/helpers/base.error";
import { NextFunction, Request, Response } from "express";
import prisma from "../utils/helpers/db";

class AuthController {
   async login(req: Request, res: Response, next: NextFunction) {
      try {
         const user = await prisma.user.findFirst({
            where: {
               username: req.body.username,
            },
         });
         if (!user) {
            throw BaseError.NotFound("The user is not found");
         }

         if (!bcrypt.compareSync(req.body.password, user.password))
            throw BaseError.BadRequest("Password is wrong");

         const token = generateTokens(user.id, user.isAdmin);
         const refresh = await prisma.refresh.upsert({
            where: {
               userId: user.id,
            },
            update: {
               token: token.refreshToken,
            },
            create: {
               userId: user.id,
               token: token.refreshToken,
            },
         });
         if (!refresh) {
            throw Error("Token is not saved");
         }
         res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
            secure: true,
            //sameSite: "none",
         });
         res.status(200).send({
            user: {
               id: user.id,
               username: user.username,
               name: user.name,
            },
            accessToken: token.accessToken,
         });
      } catch (error) {
         next(error);
      }
   }

   async register(req: Request, res: Response, next: NextFunction) {
      try {
         const { name, username, password, rating, age, country } = req?.body;
         if (password.length < 6) {
            throw BaseError.ValidationError({
               password: "Password length must be at least 6 characters",
            });
         }
         const hashedPassword = await bcrypt.hash(password, 12);
         const user = await prisma.user.create({
            data: {
               name,
               username,
               rating,
               age,
               country,
               password: hashedPassword,
            },
         });

         if (!user) {
            throw BaseError.BadRequest("The user is not created");
         }
         const token = generateTokens(user.id, user.isAdmin);
         const refresh = await prisma.refresh.upsert({
            where: {
               userId: user.id,
            },
            update: {
               token: token.refreshToken,
            },
            create: {
               userId: user.id,
               token: token.refreshToken,
            },
         });
         if (!refresh) {
            throw Error("Token is not saved");
         }
         res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
            secure: true,
            //sameSite: "none",
         });
         res.status(200).send({
            user: {
               id: user.id,
               username: user.username,
               name: user.name,
            },
            accessToken: token.accessToken,
         });
      } catch (error) {
         next(error);
      }
   }

   async refresh(req: Request, res: Response, next: NextFunction) {
      try {
         const refreshToken = req.cookies["refreshToken"];
         if (!refreshToken) {
            throw BaseError.NotFound("Refresh token is not found");
         }
         const user = await prisma.refresh.findFirst({
            where: {
               token: refreshToken,
            },
         });
         if (!user) {
            throw BaseError.BadRequest("Refresh token is not valid");
         }
         jwt.verify(
            user.token,
            String(process.env.REFRESH_TOKEN_SECRET),
            function (err: any, decoded: any) {
               if (err) {
                  throw BaseError.BadRequest("Refresh token is not valid", err);
               }
            }
         );
         const payload = jwt.decode(user.token) as {
            id: number;
            isAdmin: boolean;
         };
         if (!payload) {
            throw BaseError.BadRequest("Refresh token is not valid");
         }
         const token = generateTokens(payload.id, payload.isAdmin);
         await prisma.refresh.update({
            where: { userId: user?.userId },
            data: { token: token?.refreshToken },
         });
         res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
            secure: true,
         });
         res.status(200).send({ accessToken: token.accessToken });
      } catch (error) {
         next(error);
      }
   }

   async logout(req: Request, res: Response, next: NextFunction) {
      try {
         const refreshToken: string = req.cookies["refreshToken"];
         if (refreshToken) {
            await prisma.refresh.deleteMany({
               where: {
                  token: refreshToken,
               },
            });
         }
         res.cookie("refreshToken", "", { maxAge: 0 });
         res.status(200).send({
            message: "User successfully logged out",
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new AuthController();
