import { PrismaClient, Product, ShoppingSession } from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import { AddToCartSchemaType } from "../schema/order";
import { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

export interface UserRequest extends Request {
  user: {
    userInfo:
      | JwtPayload
      | {
          email: string;
          username: string;
          iat: number;
          exp: number;
        };
  };
}

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

  const userInfo = (req as UserRequest).user.userInfo;

  const user = await prisma.user.findUnique({
    where: { email: userInfo.email },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      quantity: true,
    },
  });

  if (!product) return res.sendStatus(404);

  if (product.quantity.quantity < quantity) return res.sendStatus(400);

  const shoppingSession: ShoppingSession =
    await prisma.shoppingSession.findUnique({
      where: {
        userId: user.id,
      },
    });
  try {
    const cartItem = await prisma.cartItem.upsert({
      create: {
        productId,
      },
      where: {
        productId,
      },
      update: {},
    });

    await prisma.shoppingSession.update({
      where: {
        userId: user.id,
      },
      data: {
        shoppingSessionCartItems: {
          connectOrCreate: {
            where: {
              shopSessionCartItemId: {
                shoppingSessionId: shoppingSession.id,
                cartItemId: cartItem.id,
              },
            },
            create: {
              quantity,
              cartItemId: cartItem.id,
            },
          },
        },
        total: {
          increment: quantity * (product.price as any),
        },
      },
    });

    res.status(200).json({ message: "Product added to cart!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
