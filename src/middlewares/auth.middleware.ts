import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import BaseError from "../utils/helpers/base.error";

export const authJwtMdw = (req: Request, res: Response, next: NextFunction) => {
   if (
      req.headers["authorization"] &&
      (req.headers["authorization"] as string).split(" ")[0] === "Bearer"
   ) {
      const token = (req.headers["authorization"] as string).split(" ")[1];
      if (!token) {
         throw BaseError.UnauthorizedError();
      }

      jwt.verify(
         token,
         String(process.env.ACCESS_TOKEN_SECRET),
         (err, user) => {
            if (err) throw BaseError.UnauthorizedError();
            req.body.user = user;
         }
      );
      next();
   } else {
      console.log(req.headers["authorization"]);
      next(BaseError.NotFound("Token is not found"));
   }
};
