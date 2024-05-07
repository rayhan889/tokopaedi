import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import { AddToCartSchemaType } from "../schema/order";
import { Product } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllOrders: RequestHandler = async (
  req: Request,
  res: Response
) => {};

export const getOrder: RequestHandler = async (
  req: Request,
  res: Response
) => {};

// ADD PRODUCT TO CART
// assign product data
// input product data as cart item
// input products as cart items into shopping session
export const addProductToCart: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { productId, quantity }: AddToCartSchemaType = req.body;

  const foundProduct: Product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (foundProduct != null) {
    try {
      await prisma.cartItem.create({
        data: {
          product: {
            connect: { id: foundProduct.id },
          },
          shoppingSession: {
            connect: {
              id: "asd",
            },
          },
          quantity,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// CHECKOUT (ORDER) PROCESS
// assign products that includes in cart item as temporary into order items
// input summary of products from order items into order details
// show payment details
export const createOrder: RequestHandler = async (
  req: Request,
  res: Response
) => {};
