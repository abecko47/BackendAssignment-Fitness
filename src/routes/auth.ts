import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";

import { models } from "../db";
import { generateToken } from "../auth/jwt";
import { USER_ROLE } from "../utils/enums";
import { validate } from "../middleware/validation";

const router = Router();
const { User } = models;

const registerSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  nickName: z.string().min(1),
  email: z.email().min(1),
  age: z.number(),
  password: z.string().min(1),
  role: z.enum(Object.values(USER_ROLE)),
});

const loginSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(1),
});

export default () => {
  router.post(
    "/register",
    validate(registerSchema, "body"),
    async (_req: Request, res: Response, _next: NextFunction) => {
      try {
        const { name, surname, nickName, email, age, password, role } =
          _req.body;

        const user = await User.create({
          name,
          surname,
          nickName,
          email,
          age: parseInt(age),
          password,
          role,
        });

        const token = generateToken({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        const { password: _, ...userWithoutPassword } = user.toJSON();

        res.status(201).json({
          message: "User registered successfully",
          data: {
            user: userWithoutPassword,
            token,
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

  router.post(
    "/login",
    validate(loginSchema, "body"),
    async (_req: Request, res: Response, _next: NextFunction) => {
      try {
        const { email, password } = _req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
          _next({
            status: 401,
            message: "Unauthorized",
          });
          return;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          _next({
            status: 401,
            message: "Unauthorized",
          });
          return;
        }

        const token = generateToken({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        const { password: _, ...userWithoutPassword } = user.toJSON();

        res.json({
          message: "Login successful",
          data: {
            user: userWithoutPassword,
            token,
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
