import { Router, Request, Response, NextFunction } from "express";

import { models } from "../db";
import { authenticate, authorize } from "../middleware/auth";
import { USER_ROLE } from "../utils/enums";

const router = Router();

const { Program, Exercise } = models;

export default () => {
  router.get(
    "/",
    async (_req: Request, res: Response, _next: NextFunction): Promise<any> => {
      const programs = await Program.findAll({
        include: [
          {
            model: Exercise,
          },
        ],
      });
      return res.json({
        data: programs,
        message: "List of programs",
      });
    },
  );

  return router;
};
