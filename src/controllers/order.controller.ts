import {
  CartItem,
  PrismaClient,
  Product,
  ShoppingSession,
} from "@prisma/client";
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import { AddToCartSchemaType } from "../schema/order";
import { JwtPayload } from "jsonwebtoken";
import { Decimal } from "@prisma/client/runtime/library";

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

export interface Orders {
  total: Decimal;
  cartItems: {
    id: string;
    quantity: number;
    cartItem: {
      product: {
        id: string;
        name: string;
        price: Decimal;
      };
    };
  }[];
}

export interface OrderItems {
  quantity: number;
  orderItem: {
    id: string;
  };
}

export const getAllItemsAtCart: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userInfo = (req as UserRequest).user.userInfo;

    const { id: userId } = await prisma.user.findUnique({
      where: { email: userInfo.email },
      select: {
        id: true,
      },
    });

    const { id: shoppingSessionId, total } =
      await prisma.shoppingSession.findUnique({
        where: {
          userId,
        },
        select: {
          total: true,
          id: true,
        },
      });

    const shoppingSessionCartItems =
      await prisma.shoppingSessionCartItem.findMany({
        where: {
          shoppingSessionId,
        },
        select: {
          id: true,
          quantity: true,
          cartItem: {
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });

    const orders: Orders = {
      total,
      cartItems: shoppingSessionCartItems,
    };

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const updateProductAtCart: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const cartItemId = req.params.id;

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

  const shoppingSession = await prisma.shoppingSession.findUnique({
    where: {
      userId: user.id,
    },
  });

  const { quantity: oldQuantity } =
    await prisma.shoppingSessionCartItem.findUnique({
      where: {
        shopSessionCartItemId: {
          shoppingSessionId: shoppingSession.id,
          cartItemId,
        },
      },
    });
  try {
    const cartItem = prisma.shoppingSessionCartItem.update({
      where: {
        shopSessionCartItemId: {
          shoppingSessionId: shoppingSession.id,
          cartItemId,
        },
      },
      data: {
        quantity,
      },
    });

    const shoppingSessionUpdated = prisma.shoppingSession.update({
      where: {
        userId: user.id,
      },
      data: {
        total:
          quantity > oldQuantity
            ? {
                increment: (quantity - oldQuantity) * (product.price as any),
              }
            : {
                decrement: (oldQuantity - quantity) * (product.price as any),
              },
      },
    });

    await prisma.$transaction([cartItem, shoppingSessionUpdated]);

    res.status(200).json({ message: "Product at cart updated!" });
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
) => {
  const userInfo = (req as UserRequest).user.userInfo;

  const { id: userId } = await prisma.user.findUnique({
    where: {
      email: userInfo.email,
    },
    select: {
      id: true,
    },
  });

  const cartItemIds: string[] = req.body.cartItemIds;

  if (!cartItemIds) return res.sendStatus(400);

  // get cart items
  const { id: shoppingSessionId, total } =
    await prisma.shoppingSession.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        total: true,
      },
    });

  const cartItems = await prisma.shoppingSessionCartItem.findMany({
    where: {
      shoppingSessionId,
      cartItemId: {
        in: cartItemIds.map(cartItemId => cartItemId),
      },
    },
    select: {
      quantity: true,
      cartItem: {
        select: {
          productId: true,
        },
      },
    },
  });

  try {
    await prisma.orderItem.createMany({
      data: cartItems.map(cartItem => {
        return {
          productId: cartItem.cartItem.productId,
        };
      }),
      skipDuplicates: true,
    });

    const orderItems = await prisma.product.findMany({
      where: {
        id: {
          in: cartItems.map(cartItem => {
            return cartItem.cartItem.productId;
          }),
        },
      },
      select: {
        orderItem: {
          select: {
            id: true,
          },
        },
      },
    });

    // make order details
    const orderDetails = await prisma.orderDetails.create({
      data: {
        userId,
        total,
      },
    });

    const orderCartItems: OrderItems[] = cartItems.map((item, index) => {
      const { cartItem, ...rest } = item;
      return { ...rest, ...orderItems[index] };
    });

    await prisma.orderDetailsItem.createMany({
      data: orderCartItems.map(({ orderItem, quantity }) => {
        return {
          quantity: quantity,
          orderDetailsId: orderDetails.id,
          orderItemId: orderItem.id,
        };
      }),
    });

    // cleanup session
    const cleanupShoppingSessionCartItem =
      prisma.shoppingSessionCartItem.deleteMany({
        where: {
          shoppingSessionId,
          cartItemId: {
            in: cartItemIds.map((cartItemId: string) => cartItemId),
          },
        },
      });

    const cleanupShoppingSession = prisma.shoppingSession.delete({
      where: {
        userId,
      },
    });

    // create brand new shopping session for next transaction
    const createNewShoppingSession = prisma.shoppingSession.create({
      data: {
        userId,
        total: 0,
      },
    });

    await prisma.$transaction([
      cleanupShoppingSessionCartItem,
      cleanupShoppingSession,
      createNewShoppingSession,
    ]);

    res.status(200).json({ message: "Order created!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
