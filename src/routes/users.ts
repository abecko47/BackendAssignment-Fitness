import { Router, Request, Response, NextFunction } from "express";

import { models } from "../db";
import { authenticate, authorize } from "../middleware/auth";
import { USER_ROLE } from "../utils/enums";

const router = Router();

const { User } = models;

export default () => {
  router.get(
    "/",
    authenticate,
    authorize(USER_ROLE.ADMIN),
    async (_req: Request, res: Response): Promise<void> => {
      try {
        const users = await User.findAll();

        res.json({
          message: "List of all users",
          data: users,
        });
      } catch (error: any) {
        res.status(500).json({
          error: "Failed to fetch users",
          details: error.message,
        });
      }
    },
  );

  return router;
};
