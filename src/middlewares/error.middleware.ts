import { NextFunction, Request, Response } from "express";
import BaseError from "../utils/helpers/base.error";
import { Prisma } from "@prisma/client";

export default function (
   err: any,
   req: Request,
   res: Response,
   next: NextFunction
) {
   let errors = {} as any;
   if (err instanceof BaseError) {
      return res.status(err.status).json({
         message: err.message,
         errors: err.errors,
      });
   }
   if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
         return res.status(400).json({
            message: "There is a unique constraint violation",
            errors: err,
         });
      }
   }
   return res.status(500).json({
      message: "Server error",
      errors: err,
   });
}
