import express from "express";
import {
  getAllOrders,
  getOrder,
  createOrder,
  addProductToCart,
} from "../../controllers/order.controller";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrder);
router.post("/cart", addProductToCart);
router.post("/", createOrder);

export default router;
