import express from "express";
import { signin, register } from "../../controllers/auth.controller";
import { validateShcema } from "../../middleware/validationSchema";
import { LoginSchema, RegisterSchema } from "../../schema/user";

const router = express.Router();

router.post("/signin", validateShcema(LoginSchema), signin);
router.post("/register", validateShcema(RegisterSchema), register);

export default router;
