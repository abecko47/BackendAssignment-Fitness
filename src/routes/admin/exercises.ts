import { Router, Request, Response, NextFunction } from "express";

import { models } from "../../db";
import z from "zod";
import { idParamSchema, validate } from "../../middleware/validation";

const router = Router();

const { Exercise, Program } = models;

const createExerciseSchema = z.object({
  name: z.string().min(1),
  difficulty: z.string().min(1),
  programID: z.number().optional(),
});

const updateExerciseSchema = z.object({
  name: z.string().min(1).optional(),
  difficulty: z.string().min(1).optional(),
  programID: z.number().optional(),
});

export default () => {
  router.post(
    "/",
    validate(createExerciseSchema, "body"),
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
        });

        if (programID) {
          await exercise.addPrograms(programID);

          const exerciseWithPrograms = await Exercise.findByPk(exercise.id, {
            include: [Program],
          });

          res.status(200).json({
            message: "Successfully created exercise",
            data: exerciseWithPrograms,
          });
          return;
        }

        // status 200, because I return resource straight away
        res.status(200).json({
          message: "Successfully created exercise",
          data: {
            ...exercise.dataValues,
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

  router.put(
    "/:id",
    validate(updateExerciseSchema, "body"),
    validate(idParamSchema, "params"),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const { id } = req.params;
        const { name, difficulty } = req.body;

        const [affectedRows, rows] = await Exercise.update(
          {
            ...(name && { name }),
            ...(difficulty && { difficulty }),
          },
          { where: { id }, returning: true },
        );

        if (!affectedRows) {
          res.status(404).json({ error: "Exercise not found" });
          return;
        }

        res.json({
          data: {
            ...rows[0].dataValues,
          },
          message: "Exercise updated successfully",
        });
      } catch (error: any) {
        console.error("Update exercise error:", error);
        res.status(500).json({
          error: "Failed to update exercise",
          details: error.message,
        });
      }
    },
  );

  router.delete(
    "/:id",
    validate(idParamSchema, "params"),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const { id } = req.params;

        const exercise = await Exercise.destroy({
          where: { id },
        });

        if (!exercise) {
          res.status(404).json({ error: "Exercise not found" });
          return;
        }

        res.json({
          message: "Exercise deleted successfully",
        });
      } catch (error: any) {
        console.error("Delete exercise error:", error);
        res.status(500).json({
          error: "Failed to delete exercise",
          details: error.message,
        });
      }
    },
  );

  return router;
};
