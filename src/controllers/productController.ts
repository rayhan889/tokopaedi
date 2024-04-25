import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getAllProducts: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (product === null || !product) {
      res.status(404).json({ message: "Cannot find product" });
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { name, price, description, image, categories } = req.body;

  const foundCategories = await prisma.category.findMany({
    where: {
      name: { in: [...categories] },
    },
  });

  const data = {
    name,
    price,
    description,
    image,
    categories,
  };

  try {
  } catch (error) {}
};
