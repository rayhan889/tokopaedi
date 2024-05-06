import express from "express";
import { getAllOrders, getOrder, createOrder } from "../../controllers/orders";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);

export default router;
