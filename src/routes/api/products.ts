import express from "express";
import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/product.controller";
import { validateShcema } from "../../middleware/validationSchema";
import { CreateProductSchema } from "../../schema/product";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/", validateShcema(CreateProductSchema), createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
