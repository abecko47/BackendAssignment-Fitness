import { Router, Request, Response, NextFunction } from "express";
import { Op, literal, fn, col } from "sequelize";

import { models, sequelize } from "../db";

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

      const programWhereClause: any = {};
      const whereClause: any = {};
      if (programID) {
        programWhereClause.id = programID;
      }

      const searchString = _req.query.search as string | undefined;

      if (searchString) {
        // Full-text search using Postgres tsquery
        whereClause[Op.and] = sequelize.where(
          // Use `col` to reference the column in the main table
          col("searchVector"),
          "@@",
          sequelize.fn("to_tsquery", "english", `${searchString}:*`),
        );
      }

      const { rows: exercises, count } = await Exercise.findAndCountAll({
        include: [
          {
            model: Program,
            where: programWhereClause,
            through: { attributes: [] },
            required: !!programID,
          },
        ],
        limit,
        offset,
        where: whereClause,
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
