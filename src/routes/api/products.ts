import express from "express";
import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
} from "../../controllers/products";
import { validateShcema } from "../../middleware/validationSchema";
import { CreateProductSchema } from "../../schema/product";

export default (router: express.Router) => {
  router.get("/", getAllProducts);
  router.get("/:id", getProduct);
  router.post("/", validateShcema(CreateProductSchema), createProduct);
  router.patch("/:id", validateShcema(CreateProductSchema), updateProduct);
};
