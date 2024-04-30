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

export const getSingleProduct: RequestHandler = (
  req: Request,
  res: Response
) => {
  res.send(res.product);
};

export const createProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { name, price, description, image, categories } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        image,
        categories: {
          connectOrCreate: categories.map((category: string) => {
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
  const { name, price, description, image, categories } = req.body;
  if (name ?? price ?? description ?? image ?? categories) {
    res.product = {
      ...res.product,
      name,
      price,
      description,
      image,
      categories,
    };
  }
  res.send(res.product);
};
