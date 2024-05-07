import express from "express";
import { handleAuth } from "../../../controllers/auth.controller";
import { validateShcema } from "../../../middleware/validationSchema";
import { LoginSchema } from "../../../schema/user";

const router = express.Router();

router.post("/", validateShcema(LoginSchema), handleAuth);

export default router;
