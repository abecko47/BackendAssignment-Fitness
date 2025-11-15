import { Request, Response, NextFunction } from "express";
import passport from "./passport";
import { RequestHandler } from "express";

import { USER_ROLE } from "../utils/enums";
import { UserModel } from "../db/user";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
    if (err) {
      return res.status(500).json({ error: "Authentication error" });
    }

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const authorize = (...roles: USER_ROLE[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestUser = req.user as UserModel;

    if (!requestUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!roles.includes(requestUser.role)) {
      res.status(403).json({ error: "Forbidden - Insufficient permissions" });
      return;
    }

    next();
  };
};
