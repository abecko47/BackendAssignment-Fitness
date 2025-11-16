import { Router, Request, Response, NextFunction } from "express";

import { models } from "../../../../db";
import z from "zod";
import { idParamSchema, validate } from "../../../../middleware/validation";

const router = Router();

const { UserExerciseCompletion, Exercise } = models;

const completedExerciseSchema = z.object({
  exerciseID: z.number().min(1),
  durationSeconds: z.number().min(1),
  completedAt: z.date().optional(),
});

export default () => {
  router.get("/", async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      const user = _req.user!;
      const completed = await UserExerciseCompletion.findAll({
        where: { userID: user.id },
        include: [{ model: Exercise }],
        order: [["completedAt", "DESC"]],
      });

      res.json({ message: "Completed exercises", data: completed });
    } catch (error: any) {
      _next({
        status: 500,
        error,
      });
    }
  });

  router.post(
    "/",
    validate(completedExerciseSchema, "body"),
    async (_req: Request, res: Response, _next: NextFunction) => {
      try {
        const user = _req.user!;
        const { exerciseID, durationSeconds, completedAt } = _req.body;

        const exercise = await Exercise.findByPk(exerciseID);
        if (!exercise) {
          _next({
            status: 404,
            message: "notFound",
          });
          return;
        }

        const completion = await UserExerciseCompletion.create({
          userID: user.id,
          exerciseID,
          durationSeconds,
          completedAt: completedAt ? new Date(completedAt) : new Date(),
        });

        res.json({ message: "Exercise tracked", data: completion });
      } catch (error: any) {
        _next({
          status: 500,
          error,
        });
      }
    },
  );

  router.delete(
    "/:id",
    validate(idParamSchema, "params"),
    async (_req: Request, res: Response, _next: NextFunction) => {
      try {
        const user = _req.user!;
        const { id } = _req.params;

        const completion = await UserExerciseCompletion.findOne({
          where: { id, userID: user.id },
        });

        if (!completion) {
          _next({
            status: 404,
            message: "notFound",
          });
          return;
        }

        await completion.destroy();
        res.json({ message: "Tracked exercise removed", data: { id } });
      } catch (error: any) {
        _next({
          status: 500,
          error,
        });
      }
    },
  );

  return router;
};
