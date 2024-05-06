import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllOrders: RequestHandler = async (
  req: Request,
  res: Response
) => {};

export const getOrder: RequestHandler = async (
  req: Request,
  res: Response
) => {};

export const createOrder: RequestHandler = async (
  req: Request,
  res: Response
) => {};
