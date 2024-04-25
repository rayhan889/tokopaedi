require("dotenv").config();

import express from "express";

import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/products", routes());

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
