require("dotenv").config();

import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

const prisma = new PrismaClient();

export const refreshtoken: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(401);

  const refreshToken = cookie.jwt;

  const user = await prisma.user.findFirst({
    where: { refreshToken },
  });
  if (!user) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN,
    (error: VerifyErrors, decoded: JwtPayload) => {
      if (error) return res.status(403).json({ message: "Invalid token!" });
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: decoded.username,
            email: decoded.email,
          },
        },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "30s",
        }
      );
      res.json({ accessToken });
    }
  );
};
