import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { RegisterSchemaType } from "../schema/user";

const prisma = new PrismaClient();

export const handleRegister: RequestHandler = async (
  req: Request,
  res: Response
) => {
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

  if (isEmailDuplicate) {
    return res.status(409).json({ message: "Email already exist!" });
  }

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
