import express from "express";
import { admin, protect } from "../middlewares/authMiddleware.js";
import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from "../controllers/bannersController.js";

const router = express.Router();

router.route("/").get(getBrands).post(protect, admin, createBrand);

router
  .route("/:id")
  .put(getBrandById)
  .post(protect, admin, updateBrand)
  .delete(protect, admin, deleteBrand);

export default router;
