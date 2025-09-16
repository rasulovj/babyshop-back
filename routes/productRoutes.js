import express from "express";
import { admin, protect } from "../middlewares/authMiddleware.js";
import { createProduct } from "../controllers/productsController.js";

const router = express.Router();

router.route("/").post(protect, admin, createProduct);

export default router;
