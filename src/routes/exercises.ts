import { Router, Request, Response, NextFunction } from "express";

import { models } from "../db";
import { authenticate, authorize } from "../middleware/auth";
import { USER_ROLE } from "../utils/enums";

const router = Router();

const { Exercise, Program } = models;

export default () => {
  router.get(
    "/",
    async (_req: Request, res: Response, _next: NextFunction): Promise<any> => {
      const exercises = await Exercise.findAll({
        include: [
          {
            model: Program,
          },
        ],
      });

      return res.json({
        data: exercises,
        message: "List of exercises",
      });
    },
  );

  router.post(
    "/",
    authenticate,
    authorize(USER_ROLE.ADMIN),
    async (
      _req: Request,
      res: Response,
      _next: NextFunction,
    ): Promise<void> => {
      try {
        const { name, difficulty, programID } = _req.body;

        const exercise = await Exercise.create({
          name,
          difficulty,
          programID,
        });

        res.status(200).json({
          message: "Successfully created exercise",
          data: {
            ...exercise.dataValues
          },
        });
      } catch (error) {
        res.status(500).json({
          error: "Failed to create exercise",
          details: error.message,
        });
      }
    },
  );

  return router;
};
