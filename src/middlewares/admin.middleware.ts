import { Request, Response, NextFunction } from "express";
import BaseError from "../utils/helpers/base.error";

export const adminMdw = (req: Request, res: Response, next: NextFunction) => {
   if (req.body.user.isAdmin) {
      next();
   } else {
      next(BaseError.BadRequest("You are not admin."));
   }
};
