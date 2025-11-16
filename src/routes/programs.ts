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
      const programs = await Program.findAll();
      return res.json({
        data: programs,
        message: "List of programs",
      });
    },
  );

  router.post(
    "/:id/exercises",
    authenticate,
    authorize(USER_ROLE.ADMIN),
    async (
      _req: Request,
      res: Response,
      _next: NextFunction,
    ): Promise<void> => {
      try {
        const programID = _req.params.id;
        const { exerciseIDs } = _req.body;

        if (!Array.isArray(exerciseIDs)) {
          res.status(400).json({ error: "exerciseIDs must be an array" });
          return;
        }

        const program = await Program.findByPk(programID);
        if (!program) {
          res.status(404).json({ error: "Program not found" });
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
        res.status(500).json({
          error: "Failed to assign exercises",
          details: error.message,
        });
      }
    },
  );

  router.delete(
    "/:id/exercises",
    authenticate,
    authorize(USER_ROLE.ADMIN),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const programID = req.params.id;
        const { exerciseIDs } = req.body;

        if (!Array.isArray(exerciseIDs)) {
          res.status(400).json({ error: "exerciseIDs must be an array" });
          return;
        }

        const program = await Program.findByPk(programID);
        if (!program) {
          res.status(404).json({ error: "Program not found" });
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
        res.status(500).json({
          error: "Failed to remove exercises",
          details: error.message,
        });
      }
    },
  );

  return router;
};
