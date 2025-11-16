import { Router, Request, Response, NextFunction } from "express";

import { models } from "../../db";
import { authenticate, authorize } from "../../middleware/auth";
import { USER_ROLE } from "../../utils/enums";
import meRouter from "./me";

const router = Router();
router.use(authenticate, authorize(USER_ROLE.ADMIN, USER_ROLE.ADMIN));

const { User } = models;

export default () => {
  router.get(
    "/",
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

  router.use("/me", meRouter());
  return router;
};
