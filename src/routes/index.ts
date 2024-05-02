import express from "express";

import products from "./api/products";
import discounts from "./api/discounts";

const router = express.Router();

router.use("/products", products);
router.use("/discounts", discounts);

export default router;
