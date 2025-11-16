import { Router, Request, Response, NextFunction } from "express";

import { models } from "../db";

const router = Router();

const { Exercise, Program } = models;

export default () => {
  router.get(
    "/",
    async (_req: Request, res: Response, _next: NextFunction): Promise<any> => {
      const page = parseInt(_req.query.page as string) || 1;
      const limit = parseInt(_req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const programID = _req.query.programID
        ? parseInt(_req.query.programID as string)
        : undefined;

      const whereClause: any = {};
      if (programID) {
        whereClause.id = programID;
      }

      const { rows: exercises, count } = await Exercise.findAndCountAll({
        include: [
          {
            model: Program,
            where: whereClause,
            through: { attributes: [] },
            required: !!programID,
          },
        ],
        limit,
        offset,
        order: [["createdAt", "ASC"]],
        distinct: true,
      });

      return res.json({
        data: exercises,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
        message: "List of exercises",
      });
    },
  );

  return router;
};
