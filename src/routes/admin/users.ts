import { Router, Request, Response, NextFunction } from "express";

import { models } from "../../db";
import z from "zod";
import { USER_ROLE } from "../../utils/enums";
import { idParamSchema, validate } from "../../middleware/validation";

const router = Router();

const { User } = models;

const updateUserSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  nickName: z.string().min(1),
  email: z.email().min(1),
  age: z.number(),
  role: z.enum(Object.values(USER_ROLE)),
});

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
            ...user.dataValues,
            password: undefined,
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

  router.get(
    "/:id",
    validate(idParamSchema, "params"),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
          _next({
            status: 404,
            message: "notFound",
          });
          return;
        }

        res.json({
          message: "User details",
          data: {
            ...user.dataValues,
            password: undefined,
          },
        });
      } catch (error: any) {
        _next({
          status: 500,
          error,
        });
      }
    },
  );

  router.put(
    "/:id",
    validate(idParamSchema, "params"),
    validate(updateUserSchema, "body"),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const { id } = req.params;
        const { name, surname, nickName, age, role } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
          _next({
            status: 404,
            message: "notFound",
          });
          return;
          return;
        }

        await user.update({
          ...(name && { name }),
          ...(surname && { surname }),
          ...(nickName && { nickName }),
          ...(age && { age }),
          ...(role && { role }),
        });

        res.json({
          message: "User updated successfully",
          data: {
            ...user.dataValues,
            password: undefined,
          },
        });
      } catch (error: any) {
        _next({
          status: 500,
          error,
        });
      }
    },
  );

  return router;
};
