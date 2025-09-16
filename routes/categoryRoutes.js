import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoriesController.js";

const router = express.Router();

router.route("/").post(protect, admin, createCategory).get(getCategories);
router
  .route("/:id")
  .get(protect, getCategoryById)
  .post(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;
