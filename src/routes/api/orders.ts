import express from "express";
import {
  getAllItemsAtCart,
  getOrder,
  createOrder,
  addProductToCart,
  updateProductAtCart,
} from "../../controllers/order.controller";
import { verifyToken } from "../../middleware/verifyToken";

const router = express.Router();

router.get("/cart", verifyToken, getAllItemsAtCart);
router.get("/:id", getOrder);
router.post("/cart", verifyToken, addProductToCart);
router.post("/", verifyToken, createOrder);
router.patch("/cart/:id", verifyToken, updateProductAtCart);

export default router;
