import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  addAddress,
  createUsers,
  deleteAddress,
  deleteUser,
  getUserById,
  getUsers,
  updateAddresses,
  updateUser,
} from "../controllers/usersController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getUsers)
  .post(protect, admin, createUsers);

router
  .route("/:id")
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, admin, deleteUser);

router
  .route("/:id/:addressId")
  .post(protect, addAddress)
  .put(protect, updateAddresses)
  .delete(protect, deleteAddress);

export default router;
