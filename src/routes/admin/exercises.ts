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
            message: _req.t("exerciseCreated"),
            data: exerciseWithPrograms,
          });
          return;
        }

        // status 200, because I return resource straight away
        res.status(200).json({
          message: _req.t("exerciseCreated"),
          data: {
            ...exercise.dataValues,
          },
        });
      } catch (error) {
        _next({
          status: 500,
          message: "Failed to create exercise",
          error,
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
          _next({
            status: 404,
            message: "notFound",
          });
          return;
        }

        res.json({
          data: {
            ...rows[0].dataValues,
          },
          message: "Exercise updated successfully",
        });
      } catch (error: any) {
        _next({
          status: 500,
          message: "Failed to update exercise",
          error,
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
          _next({
            status: 404,
            message: "notFound",
          });
          return;
        }

        res.json({
          message: "Exercise deleted successfully",
        });
      } catch (error: any) {
        _next({
          status: 500,
          message: "Failed to delete exercise",
          error,
        });
      }
    },
  );

  return router;
};
