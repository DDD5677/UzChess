import { Request, Response, NextFunction } from "express";
import BaseError from "../utils/helpers/base.error";

export const userselfMdw = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   if (!req.body.user.isAdmin || req.body.user.id !== +req.params.id)
      next(BaseError.BadRequest("Not allowed"));
   next();
};
