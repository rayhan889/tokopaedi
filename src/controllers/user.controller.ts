require("dotenv").config();

import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserAddressSchemaType } from "../schema/user";

const prisma = new PrismaClient();

export interface UserRequest extends Request {
  user: {
    userInfo:
      | JwtPayload
      | {
          email: string;
          username: string;
          iat: number;
          exp: number;
        };
  };
}

export const getUsers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        email: true,
        username: true,
      },
    });

    if (users.length === 0)
      return res.status(404).json({ message: "No users data!" });

    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser: RequestHandler = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        orderDetails: {
          select: {
            total: true,
            orderDetailsItem: {
              select: {
                quantity: true,
                orderItem: {
                  include: {
                    product: {
                      select: {
                        name: true,
                        price: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    res.json({ user: foundUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userInfo = (req as UserRequest).user.userInfo;

  if (!userInfo) return res.sendStatus(401);

  if (!req.body) return res.sendStatus(400);

  // TODO: invalidate token if user change email or password

  try {
    await prisma.user.update({
      where: {
        email: userInfo.email,
      },
      data: {
        ...req.body,
        password: req.body.password
          ? await bcrypt.hash(req.body.password, 10)
          : undefined,
      },
    });
    res.json({ message: "Data user updated!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUserAddress: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userInfo = (req as UserRequest).user.userInfo;

  if (!userInfo) return res.sendStatus(401);

  const { id: userId } = await prisma.user.findUnique({
    where: { email: userInfo.email },
    select: {
      id: true,
    },
  });

  const {
    addressLine1,
    addressLine2,
    city,
    country,
    postalCode,
  }: UserAddressSchemaType = req.body;

  try {
    await prisma.userAddress.create({
      data: {
        addressLine1,
        addressLine2,
        city,
        country,
        postalCode,
        userId,
      },
    });
    res.json({ message: "Address updated!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
