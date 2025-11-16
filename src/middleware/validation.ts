import { Request, Response, NextFunction } from "express";
import z, { ZodObject } from "zod";

export const validate =
  (schema: ZodObject, property: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[property]);
      next();
    } catch (error: any) {
      res.status(400).json({
        error: "Invalid request",
        details: error.errors || error.message,
      });
    }
  };

export const idParamSchema = z.object({
  id: z.coerce.number().min(1),
});
