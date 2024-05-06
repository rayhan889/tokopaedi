import express from "express";

import products from "./api/products";
import discounts from "./api/discounts";
import orders from "./api/orders";

const router = express.Router();

router.use("/products", products);
router.use("/discounts", discounts);
router.use("/orders", orders);

export default router;
