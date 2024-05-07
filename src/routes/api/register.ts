import express from "express";
import { handleRegister } from "../../controllers/register";
import { validateShcema } from "../../middleware/validationSchema";
import { RegisterSchema } from "../../schema/user";

const router = express.Router();

router.post("/", validateShcema(RegisterSchema), handleRegister);

export default router;
