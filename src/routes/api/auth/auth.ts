import express from "express";
import { handleAuth } from "../../../controllers/auth.controller";
import { validateShcema } from "../../../middleware/validationSchema";

const router = express.Router();

router.post("/", handleAuth);

export default router;
