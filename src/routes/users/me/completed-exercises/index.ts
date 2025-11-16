import { Router, Request, Response, NextFunction } from "express";

import { models } from "../../../../db";

const router = Router();

const { UserExerciseCompletion, Exercise } = models;

export default () => {
  router.get("/", async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const completed = await UserExerciseCompletion.findAll({
        where: { userID: user.id },
        include: [{ model: Exercise }],
        order: [["completedAt", "DESC"]],
      });

      res.json({ message: "Completed exercises", data: completed });
    } catch (err: any) {
      res.status(500).json({
        error: "Failed to fetch completed exercises",
        details: err.message,
      });
    }
  });

  router.post("/", async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { exerciseID, durationSeconds, completedAt } = req.body;

      if (!exerciseID || !durationSeconds) {
        res
          .status(400)
          .json({ error: "exerciseID and durationSeconds are required" });
        return;
      }

      const exercise = await Exercise.findByPk(exerciseID);
      if (!exercise) res.status(404).json({ error: "Exercise not found" });

      const completion = await UserExerciseCompletion.create({
        userID: user.id,
        exerciseID,
        durationSeconds,
        completedAt: completedAt ? new Date(completedAt) : new Date(),
      });

      res.json({ message: "Exercise tracked", data: completion });
    } catch (err: any) {
      res
        .status(500)
        .json({ error: "Failed to track exercise", details: err.message });
    }
  });

  // DELETE /users/me/completed-exercises/:id
  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id } = req.params;

      const completion = await UserExerciseCompletion.findOne({
        where: { id, userID: user.id },
      });

      if (!completion) {
        res.status(404).json({ error: "Tracked exercise not found" });
        return;
      }

      await completion.destroy();
      res.json({ message: "Tracked exercise removed", data: { id } });
    } catch (err: any) {
      res.status(500).json({
        error: "Failed to remove tracked exercise",
        details: err.message,
      });
    }
  });

  return router;
};
