import { Router, Request, Response, NextFunction } from "express";
import completedExercisesRouter from "./completed-exercises";

const router = Router();

export default () => {
  router.get(
    "/",
    async (
      _req: Request,
      res: Response,
      _next: NextFunction,
    ): Promise<void> => {
      try {
        const user = _req.user;

        if (!user) {
          _next({
            status: 401,
            message: "Unauthorized",
          });
          return;
        }

        res.json({
          message: "Me",
          data: user,
        });
      } catch (error: any) {
        _next({
          status: 500,
          error,
        });
      }
    },
  );

  router.use("/completed-exercises", completedExercisesRouter());

  return router;
};
