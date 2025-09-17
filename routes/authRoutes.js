import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} from "../controllers/authController.js";

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
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 4
 *               role:
 *                 type: string
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

// login route
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

router.post("/login", loginUser);

//get me route
/**
 * @swagger
 * /api/auth/get-me:
 *   get:
 *     summary: Get logged-in user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized - No token provided or invalid
 *       500:
 *         description: Server error
 */

router.get("/get-me", protect, getUserProfile);

//logout route
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged out successfully
 *       401:
 *         description: Unauthorized - No token provided or invalid
 *       500:
 *         description: Server error
 */

router.post("/logout", protect, logoutUser);

export default router;
