import { Router, Request, Response, NextFunction } from "express";

import { models } from "../db";
import { authenticate, authorize } from "../middleware/auth";
import { USER_ROLE } from "../utils/enums";
import { UserModel } from "../db/user";

const router = Router();

const { User } = models;

export default () => {
  router.get(
    "/",
    authenticate,
    authorize(USER_ROLE.ADMIN, USER_ROLE.USER),
    async (_req: Request, res: Response): Promise<void> => {
      try {
        const users = await User.findAll();

        res.json({
          message: "List of all users",
          data: users.map((user) => ({
            id: user.dataValues.id,
            nickName: user.dataValues.nickName,
          })),
        });
      } catch (error: any) {
        res.status(500).json({
          error: "Failed to fetch users",
          details: error.message,
        });
      }
    },
  );

  router.get(
    "/me",
    authenticate,
    authorize(USER_ROLE.ADMIN, USER_ROLE.USER),
    async (_req: Request, res: Response): Promise<void> => {
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
    },
  );

  return router;
};
