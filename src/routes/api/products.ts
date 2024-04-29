import express from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
} from "../../controllers/products";
import { validateShcema } from "../../middleware/validationSchema";
import { ProductSchema } from "../../schema/product";

export default (router: express.Router) => {
  router.get("/", getAllProducts);
  router.get("/:id", getProduct);
  router.post("/", validateShcema(ProductSchema), createProduct);
};
