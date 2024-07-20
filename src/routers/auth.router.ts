import express, { Router } from "express";
import AuthController from "../controllers/auth.controller";
const router: Router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export default router;

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: login to page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: 'OK'
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 user:
 *                   type: 'object'
 *                   properties:
 *                     id:
 *                       type: 'number'
 *                     username:
 *                       type: 'string'
 *                     name:
 *                       type: 'string'
 *                 accessToken:
 *                   type: 'string'
 *       400:
 *         $ref: '#/components/responses/400'
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: 'OK'
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 user:
 *                   type: 'object'
 *                   properties:
 *                     id:
 *                       type: 'number'
 *                     username:
 *                       type: 'string'
 *                     name:
 *                       type: 'string'
 *                 accessToken:
 *                   type: 'string'
 *       400:
 *         $ref: '#/components/responses/400'
 * /api/v1/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: 'refresh access token'
 *     responses:
 *       200:
 *         description: 'OK'
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 accessToken:
 *                   type: 'string'
 *       400:
 *         $ref: '#/components/responses/400'
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: 'logout user'
 *     responses:
 *       200:
 *         description: 'OK'
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 message:
 *                   type: 'string'
 *       400:
 *         $ref: '#/components/responses/400'
 */
