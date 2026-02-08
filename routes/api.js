/**
Página da API da aplicação

-----------------Métodos---------------
GET- Procura todos os asteroides em um dia
GET- Procura o asteroide de acordo com a data
POST- Criar um novo asteroide
PUT- Atualiza o asteroide de acordo com o ID
DELETE- Remove o asteroide de acordo com o ID

 */

const {
    json
} = require("express");
const express = require("express");
const router = express.Router();
const Asteroide = require("../models/asteroid");
const fetch = (...args) =>
    import("node-fetch").then(({
        default: fetch
    }) => fetch(...args));
const mongoObjectId = require('mongoose').Types.ObjectId;

//Para uso de mensagens de output
var respond;

/**
 * @swagger
 * components:
 *   schemas:
 *     Asteroide:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do asteroide
 *         id:
 *           type: string
 *           description: ID do asteroide
 *         date:
 *           type: string
 *           description: Data do asteroide
 *         distancia_Terra:
 *           type: string
 *           description: Distancia da terra do asteroide
 *         velocidade:
 *           type: string
 *           description: Velocidade do asteroide
 *       example:
 *         nome: SMDF (1237)
 *         id: 234234234234
 *         date: 2022-08-05
 *         distancia_Terra: 234234234
 *         velocidade: 123123123
 */

 /**
  * @swagger
  * tags:
  *   name: Asteroides
  *   description: API que gere os asteroides em orbita do planeta Terra
  */

  /**
 * @swagger
 * /api/Encontrar_asteroides_hoje/:
 *   get:
 *     summary: Procura todos os asteroides hoje
 *     security:             
 *       - bearerAuth: []     
 *     tags: [Asteroides]
 *     responses:
 *       200:
 *         description: Lista dos asteroides foi encontrada com sucesso 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asteroide'
 */

 router.get("/api/Encontrar_asteroides_hoje/", async (req, res) => {
    
    const date = "2024-09-01";
    let datasd;
    const currentDate = new Date();

    let xd
    xd = currentDate.toDateString();
    //Converte a data para o formato 'YYY'-'MMM-'DDD'
    datasd = new  Date(date).toISOString().slice(0, 10);
    //Converte a data para ser corretamente lida ao ser inserida no URL
    const encodedDate = encodeURIComponent(datasd);
    //console.log(datasd);
    console.log("teste",xd);

    //Chamar a API
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${encodedDate}&end_date=${encodedDate}&api_key=${API_KEY}`;

    const options = {
        method: "GET",

        headers: {
            "Content-type": "application/json",
        },
    };

    const response = await fetch(url, options)
        .then((res) => res.json())
        .catch((e) => {
            console.error({
                message: "error",
                error: e,
            });
        });

    res.json(response);

   let dist = 9999999999999999999999999; 

   let asteroideMaisProximo;

    for(let md of response.near_earth_objects[datasd]){
        if(md.close_approach_data[0].miss_distance["kilometers"] < dist)
            {
                dist = md.close_approach_data[0].miss_distance["kilometers"];
                asteroideMaisProximo = md;
            }
    }
    console.log(asteroideMaisProximo);
});

 /**
 * @swagger
 * /api/asteroides:
 *   get:
 *     summary: Procura todos os asteroides em um dia
 *     security:             
 *       - bearerAuth: []     
 *     tags: [Asteroides]
 *     responses:
 *       200:
 *         description: Lista dos asteroides foi encontrada com sucesso 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asteroide'
 */




const API_KEY = "Wpqfi63OTDQZbdPfv1W2So0rYSkgfPGJlUohjhy6";
const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=`;


//Criação de mensagens usadas para debug
let msg1 = "A api esta a ser chamada corretamente";

//Procura todos os asteroides em 1 dia
router.get("/api/asteroides", async (req, res) => {

    console.log(msg1);

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-08&end_date=2015-09-08&api_key=${API_KEY}`;

    const options = {
        method: "GET",

        headers: {
            "Content-type": "application/json",
        },
    };

    const response = await fetch(url, options)
        .then((res) => res.json())
        .catch((e) => {
            console.error({
                message: "error",
                error: e,
            });
        });

    console.log("RESPONSE: ", response.near_earth_objects);
    res.json(response);
});

/**
 * @swagger
 * /api/Encontrar_asteroides/:{date}:
 *   get:
 *     summary: Procura o asteroide de acordo com a data 
 *     tags: [Asteroides]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: Data a procurar o asteroide
 *     responses:
 *       200:
 *         description: O asteroide foi encontrado com sucesso
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asteroide'
 *       404:
 *         description: O asteroide não foi encontrado
 */

//Procura e guarda um asteroide em uma certa data
router.get("/api/Encontrar_asteroides/:date", async (req, res) => {
    
    const date = req.params.date;
    let datasd;

    //Converte a data para o formato 'YYY'-'MMM-'DDD'
    datasd = new  Date(date).toISOString().slice(0, 10);
    //Converte a data para ser corretamente lida ao ser inserida no URL
    const encodedDate = encodeURIComponent(datasd);
    console.log(datasd);
    

    //Chamar a API
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${encodedDate}&end_date=${encodedDate}&api_key=${API_KEY}`;

    const options = {
        method: "GET",

        headers: {
            "Content-type": "application/json",
        },
    };

    const response = await fetch(url, options)
        .then((res) => res.json())
        .catch((e) => {
            console.error({
                message: "error",
                error: e,
            });
        });

    res.json(response);

    // Guarda o asteroide na base de dados
    const asteroide = new Asteroide({
        nome: response.near_earth_objects[datasd][0]["name"],
        id: response.near_earth_objects[datasd][0]["id"],
        date: date,
        distancia_Terra: response.near_earth_objects[datasd][0].close_approach_data[0].miss_distance["kilometers"],
        velocidade: response.near_earth_objects[datasd][0].close_approach_data[0]
            .relative_velocity["kilometers_per_hour"],
    });

    await asteroide.save();

    console.log(`O asteroide ${asteroide.nome} foi guardado com sucesso`);
});

/**
 * @swagger
 * /api/Criar_Asteroide:
 *   post:
 *     summary: Criar um novo asteroide
 *     tags: [Asteroides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asteroide'
 *     responses:
 *       200:
 *         description: O asteroide foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asteroide'
 *       500:
 *         description: Erro do servidor
 */

//Criar asteroide
router.post("/api/Criar_Asteroide", async (req, res) => {
    try {
        var date = new Date().toISOString();

        //criação de um novo modelo asteroide
        const data = new Asteroide({
            nome: req.body.nome,
            id: req.body.id,
            date: req.body.date,
            distancia_Terra: req.body.distancia_Terra,
            velocidade: req.body.velocidade
        });

        const val = await data.save();

        res.json(val);

        console.log("Resposta : ", val);
    } catch (error) {
        return res.status(500).send(error);
    }

});

/**
 * @swagger
 * /api/AlterarAsteroide/{id}:
 *  put:
 *    summary: Atualiza o asteroide de acordo com o ID
 *    tags: [Asteroides]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do asteroide
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Asteroide'
 *    responses:
 *      200:
 *        description: O asteroide foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Asteroide'
 *      404:
 *        description: O asteroide não foi encontrado
 *      500:
 *        description: Erro do servidor
 */

//Alterar asteroide de acordo com o id 
router.put("/api/AlterarAsteroide/:id", async (req, res) => {

    try {
        var date = new Date().toISOString();
        console.log(req.params.id);

        //Procura de erro no ID pedido
        if (!mongoObjectId.isValid(req.params.id))
            return res.status(404).send('nao encontra registo do ID pedido');

        var asteroide = {
            nome: req.body.nome,
            id: req.body.id,
            date: req.body.date,
            distancia_Terra: req.body.distancia_Terra,
            velocidade: req.body.velocidade
        };

        //Atualiza o asteroide 
        Asteroide.findByIdAndUpdate(req.params.id, { $set: asteroide }, { new: true }, (err, doc) => {
            if (!err) {
                respond = {
                    respondId: 0,
                    description: "Asteroide atualizado com sucesso",
                    messageClass: "alert alert-success"
                }
                res.send(respond);
            }
            else {
                respond = {
                    respondId: 1,
                    description: "Erro ao atualizar asteroide " + err,
                    messageClass: "alert alert-danger"
                }
                res.send(respond);
            }
        })

    } catch (error) {
        return res.status(500).send(error);
    }
});


/**
 * @swagger
 * /api/ApagarAsteroide/{id}:
 *   delete:
 *     summary: Remove o asteroide de acordo com o ID 
 *     tags: [Asteroides]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do asteroide
 * 
 *     responses:
 *       200:
 *         description: O asteroide foi removido com sucesso
 *       404:
 *         description: O asteroide não foi encontrado
 */

//Apagar asteroide de acordo com o ID
router.delete("/api/ApagarAsteroide/:id", async (req, res) => {

    try {

        if (!mongoObjectId.isValid(req.params.id))
        return res.status(404).send('nao encontra registo do ID pedido');

       Asteroide.findByIdAndRemove(req.params.id, { new: true }, (err, doc) => {
            if (!err) {
                respond = {
                    respondId: 0,
                    description: "Asteroide removido com sucesso",
                    messageClass: "alert alert-success"
                }
                res.send(respond);
            }
            else {
                respond = {
                    respondId: 1,
                    description: "Erro ao remover asteroide " + err,
                    messageClass: "alert alert-danger"
                }
                res.send(respond);
            }
        })

    } catch (error) {
        return res.status(500).send(error);
    }

});

module.exports = router;