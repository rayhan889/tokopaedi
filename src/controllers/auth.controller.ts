require("dotenv").config();

import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginSchemaType } from "../schema/user";
import { RegisterSchemaType } from "../schema/user";

const prisma = new PrismaClient();

export const register: RequestHandler = async (req: Request, res: Response) => {
  const {
    username,
    firstName,
    lastName,
    password,
    phone,
    email,
  }: RegisterSchemaType = req.body;

  const isEmailDuplicate = await prisma.user.findUnique({
    where: {
      email,
    },
    select: { email: true },
  });

  if (isEmailDuplicate)
    return res.status(409).json({ message: "Email already exist!" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
      },
    });
    res.status(201).send(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin: RequestHandler = async (req: Request, res: Response) => {
  const { email, password }: LoginSchemaType = req.body;

  const foundUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
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
          email,
        },
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "30s",
      }
    );
    const refreshToken = await jwt.sign(
      { username: foundUser.username, email },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    try {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          email,
          refreshToken,
          shoppingSession: {
            connectOrCreate: {
              where: {
                userId: foundUser.id,
              },
              create: {
                total: 0,
              },
            },
          },
        },
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const signout: RequestHandler = async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(204);

  const refreshToken = cookie.jwt;

  const { refreshToken: refreshTokenUser, email } = await prisma.user.findFirst(
    {
      where: { refreshToken },
      select: { refreshToken: true, email: true },
    }
  );
  if (!refreshTokenUser) {
    res.clearCookie("jwt", refreshToken);
  }

  try {
    await prisma.user.update({
      where: { email },
      data: {
        refreshToken: null,
      },
    });
    res.clearCookie("jwt", refreshToken);
    res.json({ message: "Logged out!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
