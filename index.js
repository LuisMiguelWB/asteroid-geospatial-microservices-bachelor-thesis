/*
Ponto de entrada para a aplicação

Luís Brito
*/
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cookieParser = require('cookie-parser');
const cors = require('cors');


const mongoose = require('mongoose');
const routes = require('./routes/api');

//url para connectar base de dados na cloud
const cloudDB = "test"
const localDB = "mongodb://127.0.0.1:27017/local";
//middleware
const authRoutes = require('./routes/auth');
const {
	requireAuth,
	statusUser
} = require('./middleware/authM');

const app = express();
app.use(express.json());

//Connectar base de dados local


mongoose.connect(localDB, (err) => {
	if (!err) console.log('connection suceeded..');
	else console.log('connection failed ' + JSON.stringify(err, undefined, 2));
});
/*
mongoose.connect(cloudDB, (err) => {
	if (!err) console.log('connection suceeded..');
	else console.log('connection failed ' + JSON.stringify(err, undefined, 2));
});*/

mongoose.Promise = global.Promise;

app.use(express.static('public'));

//Chamar client
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 4000;
//Definições para o Swagger
const options = {
	swaggerDefinition: {
		openapi: "3.0.1",
		info: {
			title: "Asteroides API",
			version: "1.0.0",
		},
		/*servers: [{
			url: "localhost:4000",
		}, ],*/
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [{
			bearerAuth: [],
		}, ],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

app.use(cookieParser());
app.use(routes);

//Executar swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


app.get('*', statusUser);
app.get('/', (req, res) => res.render('main'));
app.get('/asteroides', requireAuth, (req, res) => res.render('asteroides'));
app.get('/asteroidees', requireAuth, (req, res) => res.render('asteroidees'));

//middleware
app.use(authRoutes);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

module.exports = mongoose;