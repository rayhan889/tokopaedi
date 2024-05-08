require("dotenv").config();

import express from "express";
import cookieParser from "cookie-parser";

import router from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
