import { Router, Request, Response, NextFunction } from "express";

import { models } from "../../../../db";

const router = Router();

const {UserExerciseCompletion, Exercise} = models;

export default () => {
    router.get(
        "/",
        async (req: Request, res: Response) => {
          try {
            const user = req.user!;
            const completed = await UserExerciseCompletion.findAll({
              where: { userID: user.id },
              include: [{ model: Exercise }],
              order: [["completedAt", "DESC"]],
            });
      
            res.json({ message: "Completed exercises", data: completed });
          } catch (err: any) {
            res.status(500).json({ error: "Failed to fetch completed exercises", details: err.message });
          }
        }
      );
      
  return router;
};
