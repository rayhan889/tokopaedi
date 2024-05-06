import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import { Discount } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllDiscounts: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const discounts: Discount[] = await prisma.discount.findMany({
      include: {
        products: {
          select: {
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });
    res.status(200).json({ count: discounts.length, data: discounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiscount: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const discount: Discount = await prisma.discount.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.send(discount);
    if (discount == null || !discount) {
      res.status(404).json({ message: "Cannot find data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDiscount: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.discount.create({
      data: {
        ...req.body,
      },
    });

    res.send({ message: "Discount created!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDiscount: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.discount.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...req.body,
      },
    });

    res.send({ message: "Discount updated!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDiscount: RequestHandler = async (
  req: Request,
  res: Response
) => {};
