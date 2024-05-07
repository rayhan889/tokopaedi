import express from "express";
import { register } from "../../controllers/user.controller";
import { validateShcema } from "../../middleware/validationSchema";
import { RegisterSchema } from "../../schema/user";

const router = express.Router();

router.post("/", validateShcema(RegisterSchema), register);

export default router;
