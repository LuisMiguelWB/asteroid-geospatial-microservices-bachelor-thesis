/*
Página da autenticação da aplicação usada para chamar e usar o controlador de autenticação 

-----------------Métodos---------------
GET- Sign up do utilizador
GET- Login do utilizador
POST- Sign up do utilizador
POST- Login do utilizador
GET- Logout do utilizador
*/

const {
    json
} = require("express");
const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const User = require("../models/User");


router.get('/signup', authController.signup_get);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email do utilizador
 *         Password:
 *           type: string
 *           description: Password do utilizador
 *       example:
 *         email: test@gmail.com
 *         password: 123123
 */

 /**
  * @swagger
  * tags:
  *   name: Auth
  *   description: Autenticação da aplicação
  */


 /**
 * @swagger
 * /signup:
 *   post:
 *     summary: Registo do utilizador
 *     security:             
 *       - bearerAuth: []     
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilizador registado com sucesso 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Houve um erro no registo do utilizador
 */
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);

 /**
 * @swagger
 * /login:
 *   post:
 *     summary: Login do utilizador
 *     security:             
 *       - bearerAuth: []     
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login do utlizador executado com sucesso 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

module.exports = router;