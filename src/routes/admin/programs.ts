import { Router, Request, Response, NextFunction } from "express";

import { models } from "../../db";
import z from "zod";
import { idParamSchema, validate } from "../../middleware/validation";

const router = Router();

const { Program, Exercise } = models;

const exercisesIdsSchema = z.object({
  exerciseIDs: z.array(z.number()),
});

export default () => {
  router.post(
    "/:id/exercises",
    validate(exercisesIdsSchema, "body"),
    validate(idParamSchema, "params"),
    async (
      _req: Request,
      res: Response,
      _next: NextFunction,
    ): Promise<void> => {
      try {
        const programID = _req.params.id;
        const { exerciseIDs } = _req.body;

        const program = await Program.findByPk(programID);
        if (!program) {
          _next({
            status: 404,
            message: "notFound",
          });
          return;
        }

        const exercises = await Exercise.findAll({
          where: { id: exerciseIDs },
        });

        await program.addExercises(exercises);

        res.json({
          message: "Exercises added to program",
          data: { programID, added: exerciseIDs },
        });
      } catch (error: any) {
        _next({
          status: 500,
          message: "Failed to assign exercise",
          error,
        });
      }
    },
  );

  router.delete(
    "/:id/exercises",
    validate(exercisesIdsSchema, "body"),
    validate(idParamSchema, "params"),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const programID = req.params.id;
        const { exerciseIDs } = req.body;

        const program = await Program.findByPk(programID);
        if (!program) {
          _next({
            status: 404,
            message: "notFound",
          });
          return;
        }

        const exercises = await Exercise.findAll({
          where: { id: exerciseIDs },
        });

        await program.removeExercises(exercises);

        res.json({
          message: "Exercises removed from program",
          data: { programID, removed: exerciseIDs },
        });
      } catch (error: any) {
        _next({
          status: 500,
          message: "Failed to remove exercise",
          error,
        });
      }
    },
  );

  return router;
};
