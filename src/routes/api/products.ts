import express from "express";
import {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
} from "../../controllers/products";
import { validateShcema } from "../../middleware/validationSchema";
import { getProduct } from "../../middleware/getProduct";
import { CreateProductSchema } from "../../schema/product";

export default (router: express.Router) => {
  router.get("/", getAllProducts);
  router.get("/:id", getProduct, getSingleProduct);
  router.post("/", validateShcema(CreateProductSchema), createProduct);
  router.patch(
    "/:id",
    getProduct,
    validateShcema(CreateProductSchema),
    updateProduct
  );
};
