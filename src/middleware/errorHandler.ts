import { Request, Response, NextFunction } from "express";

export type AppError = {
  status: number;
  message: string;
  error: Error;
};

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("ERROR:", err);

  const status = err.status || 500;
  const messageKey = err.message || "somethingWentWrong";

  const message = req.t ? req.t(messageKey) : "Something went wrong";

  if (err instanceof Error) {
    console.error(err.stack);
  } else if (err.error instanceof Error) {
    console.error(err.error.stack);
  }

  res.status(status).json({
    data: {},
    message,
  });
}
