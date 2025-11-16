import { Router, Request, Response, NextFunction } from "express";

import { models } from "../../db";
import { authenticate, authorize } from "../../middleware/auth";
import { USER_ROLE } from "../../utils/enums";

const router = Router();

const { User } = models;

export default () => {
  router.get("/", async (_req: Request, res: Response): Promise<void> => {
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
      res.status(500).json({
        error: "Failed to fetch users",
        details: error.message,
      });
    }
  });

  router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
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
      res.status(500).json({
        error: "Failed to fetch user",
        details: error.message,
      });
    }
  });

  router.put("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, surname, nickName, age, role } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
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
          ...user,
          password: undefined,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to update user",
        details: error.message,
      });
    }
  });

  return router;
};
