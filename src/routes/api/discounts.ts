import express from "express";
import {
  getAllDiscounts,
  getDiscount,
  deleteDiscount,
  updateDiscount,
  createDiscount,
} from "../../controllers/discounts";

const router = express.Router();

router.get("/", getAllDiscounts);
router.get("/:id", getDiscount);
router.post("/", createDiscount);
router.patch("/:id", updateDiscount);
router.delete("/:id", deleteDiscount);

export default router;
