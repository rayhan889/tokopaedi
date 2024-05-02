import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import { Product } from "@prisma/client";
import { CategorySchema } from "../schema/category";

const prisma = new PrismaClient();

export const getAllProducts: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const products: Product[] = await prisma.product.findMany({
      include: {
        categories: { select: { name: true } },
        quantity: { select: { quantity: true } },
        discount: {
          select: {
            name: true,
            active: true,
            description: true,
            discountPercent: true,
          },
        },
      },
      orderBy: { price: "asc" },
    });
    res.status(200).json({ count: products.length, data: products });
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
      include: {
        categories: { select: { name: true } },
        quantity: { select: { quantity: true } },
        discount: true,
      },
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
    await prisma.product.create({
      data: {
        ...req.body,
        quantity: {
          create: {
            quantity: 1,
          },
        },
        categories: {
          connectOrCreate: req.body.categories.map(
            (category: CategorySchema) => {
              return {
                where: { name: category.name },
                create: {
                  name: category.name,
                  description: category.description,
                },
              };
            }
          ),
        },
      },
    });

    res.send({ message: "Product created!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const quantity = req.body.quantity;
    const discount = req.body.discount;

    const date = new Date();
    const formattedDate = date.toISOString();

    await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        quantity: {
          update: {
            data: {
              quantity,
            },
          },
        },
        discount: discount
          ? {
              connect: {
                name: discount,
              },
            }
          : undefined,
        categories: {
          connectOrCreate: req.body.categories.map(
            (category: CategorySchema) => {
              return {
                where: { name: category.name },
                create: {
                  name: category.name,
                  description: category.description,
                },
              };
            }
          ),
        },
        updatedAt: formattedDate,
      },
    });

    res.send({ message: "Product updated!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const deleteProductInventory = prisma.productInventory.delete({
      where: {
        productId: req.params.id,
      },
    });

    const deleteProduct = prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    await prisma.$transaction([deleteProductInventory, deleteProduct]);

    res.send({ message: "Successfully deleted product!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
