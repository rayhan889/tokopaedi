import express from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getUsers,
  createUserAddress,
  getUser,
  updateUser,
} from "../../controllers/user.controller";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUser);
router.post("/address", verifyToken, createUserAddress);
router.patch("/", verifyToken, updateUser);

export default router;
