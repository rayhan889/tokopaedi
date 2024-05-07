require("dotenv").config();

import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginSchemaType } from "../schema/user";

const prisma = new PrismaClient();

export const handleAuth: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email, password }: LoginSchemaType = req.body;

  const foundUser = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      username: true,
      password: true,
    },
  });

  if (!foundUser) return res.sendStatus(409);

  const matchPassword = await bcrypt.compare(password, foundUser.password);

  if (matchPassword) {
    const accessToken = await jwt.sign(
      {
        userInfo: {
          username: foundUser.username,
          email: foundUser.email,
        },
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "30s",
      }
    );
    const refreshToken = await jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "1d",
      }
    );
  }
};
