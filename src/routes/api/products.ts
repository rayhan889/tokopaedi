import express from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
} from "../../controllers/productController";

export default (router: express.Router) => {
  router.get("/", getAllProducts);
  router.get("/:id", getProduct);
  router.post("/", createProduct);
};
