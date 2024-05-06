import express from "express";

import products from "./api/products";
import discounts from "./api/discounts";
import orders from "./api/orders";
import auth from "./api/auth";

const router = express.Router();

router.use("/products", products);
router.use("/discounts", discounts);
router.use("/orders", orders);
router.use("/auth", auth);

export default router;
