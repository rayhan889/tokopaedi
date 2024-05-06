import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const handleAuth: RequestHandler = async (
  req: Request,
  res: Response
) => {};
