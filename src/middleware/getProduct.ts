import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import { Product } from "@prisma/client";
const prisma = new PrismaClient();

export const getProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let product: Product;
  try {
    product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { categories: { select: { name: true } } },
    });
    if (product === null || !product) {
      res.status(404).json({ message: "Cannot find product" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.product = product;
  next();
};
