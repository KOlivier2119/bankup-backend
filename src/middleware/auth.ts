import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";
import prisma from "../lib/prisma";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, jwtSecret, async (err: any, user: any) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    const existUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!existUser) {
      res.sendStatus(401);
      return;
    }
    req.user = existUser;
    next();
  });
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  const adminRole = await prisma.role.findFirst({
    where: {
      name: "admin",
      userRoles: { some: { userId: req?.user.id ?? 0 } },
    },
  });

  if (!adminRole) {
    res.sendStatus(403);
    return;
  }
  next();
};
