import express from "express";
import {
  getAllOrders,
  getOrder,
  createOrder,
  addProductToCart,
} from "../../controllers/order.controller";
import { verifyToken } from "../../middleware/verifyToken";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrder);
router.post("/cart", verifyToken, addProductToCart);
router.post("/", createOrder);

export default router;
