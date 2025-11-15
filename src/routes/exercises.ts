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
        });

        if (programID) {
          const programToAssign = await Program.findByPk(programID);
          await exercise.addPrograms(programID);

          const exerciseWithPrograms = await Exercise.findByPk(exercise.id, {
            include: [Program],
          });

          res.status(200).json({
            message: "Successfully created exercise",
            data: exerciseWithPrograms,
          });
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
    authenticate,
    authorize(USER_ROLE.ADMIN),
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
    authenticate,
    authorize(USER_ROLE.ADMIN),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const { id } = req.params;

        const exercise = await Exercise.destroy({
          where: { id },
        });

        if (!exercise) {
          res.status(404).json({ error: "Exercise not found" });
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
