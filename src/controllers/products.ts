import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import { Product } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProducts: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const products: Product[] = await prisma.product.findMany({
      include: { categories: { select: { name: true } } },
    });
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
    const product: Product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { categories: { select: { name: true } } },
    });
    res.send(product);
    if (product === null || !product) {
      res.status(404).json({ message: "Cannot find product" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await prisma.product.create({
      data: {
        ...req.body,
        categories: {
          connectOrCreate: req.body.categories.map((category: string) => {
            return {
              where: { name: category },
              create: { name: category },
            };
          }),
        },
      },
    });

    res.send({ message: "Product created!", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        categories: {
          connect: req.body.categories.map((category: string) => ({
            name: category,
          })),
        },
      },
    });

    res.send({ message: "Product updated!", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
