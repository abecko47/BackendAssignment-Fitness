import { Router, Request, Response, NextFunction } from "express";
import completedExercisesRouter from "./completed-exercises";

const router = Router();

export default () => {
  router.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
      const user = _req.user;

      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
      }

      res.json({
        message: "Me",
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch users",
        details: error.message,
      });
    }
  });

  router.use("/completed-exercises", completedExercisesRouter());

  return router;
};
