import express from "express";
import {
  getAllDiscounts,
  getDiscount,
  deleteDiscount,
  updateDiscount,
  createDiscount,
} from "../../controllers/discount.controller";
import { validateShcema } from "../../middleware/validationSchema";
import { CreateDiscountSchema } from "../../schema/discount";

const router = express.Router();

router.get("/", getAllDiscounts);
router.get("/:id", getDiscount);
router.post("/", validateShcema(CreateDiscountSchema), createDiscount);
router.patch("/:id", updateDiscount);
router.delete("/:id", deleteDiscount);

export default router;
