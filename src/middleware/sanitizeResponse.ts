import { Request, Response, NextFunction } from "express";
import { USER_ROLE } from "../utils/enums";
import { UserModel } from "../db/user";

export function sanitizeResponse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const oldJson = res.json.bind(res);

  res.json = (body: any) => {
    if (!req.user) return oldJson(body);

    if (req.user.role === USER_ROLE.USER) {
      body = sanitizeUserResponse(body);
    }

    return oldJson(body);
  };

  next();
}

function sanitizeUserResponse(body: any) {
  if (!body || !body.data) return body;

  if (Array.isArray(body.data)) {
    return {
      ...body,
      data: body.data.map((item: any) =>
        isUserModel(item) ? sanitizeUser(item) : item,
      ),
    };
  }

  if (isUserModel(body.data)) {
    return {
      ...body,
      data: sanitizeUser(body.data),
    };
  }

  return body;
}

function sanitizeUser(user: UserModel) {
  return {
    id: user.id,
    nickName: user.nickName,
  };
}

// Type guard
function isUserModel(obj: any): obj is UserModel {
  return obj && "id" in obj && "nickName" in obj && "email" in obj;
}
