import { Router, Request, Response, NextFunction } from "express";

import { models } from "../../db";
import { authenticate, authorize } from "../../middleware/auth";
import { USER_ROLE } from "../../utils/enums";
import meRouter from "./me";

const router = Router();
router.use(authenticate, authorize(USER_ROLE.ADMIN, USER_ROLE.USER));

const { User } = models;

export default () => {
  router.get(
    "/",
    async (
      _req: Request,
      res: Response,
      _next: NextFunction,
    ): Promise<void> => {
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
        _next({
          status: 500,
          error,
        });
      }
    },
  );

  router.use("/me", meRouter());
  return router;
};
