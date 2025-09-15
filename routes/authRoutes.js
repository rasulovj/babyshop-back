import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} from "../controllers/authControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//register route
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 4
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *              _id:
 *                 type: string
 *              name:
 *                 type: string
 *              email:
 *                 type: string
 *              role:
 *                 type: string
 *              token:
 *                 type: string
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 4
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *              _id:
 *                 type: string
 *              name:
 *                 type: string
 *              email:
 *                 type: string
 *              role:
 *                 type: string
 *              token:
 *                 type: string
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
//login route
router.post("/login", loginUser);

router.get("/get-me", protect, getUserProfile);
router.post("/logout", protect, logoutUser);

export default router;
