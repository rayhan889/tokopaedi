import express from "express";

import products from "./api/products";
import discounts from "./api/discounts";
import orders from "./api/orders";
import auth from "./api/auth";
import users from "./api/user";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.use("/auth", auth);
router.use("/products", products);
router.use("/discounts", verifyToken, discounts);
router.use("/orders", orders);
router.use("/users", users);

export default router;
