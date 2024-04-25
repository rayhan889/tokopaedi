import express from "express";
import {
  getAllProducts,
  getProduct,
} from "../../controllers/productController";

export default (router: express.Router) => {
  router.get("/", getAllProducts);
  router.get("/:id", getProduct);
};
