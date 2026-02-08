/**
 Página de criação do modelo do asteroide
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var Ex_asteroide = (exports.asteroide = {});

//Criar o modelo do asteroide
const AsteroidSchema = new Schema({
  nome: {
    type: String,
    // required: [true, 'Nome do asteroide e necessario']
  },
  id: {
    type: Number,
    //required: [true, 'ID do asteroide e necessario']
  },

  date: {
    type: Date,
  },
  distancia_Terra: {
    type: Number,
  },
  velocidade: {
    type: Number,
  },
});

const Asteroide = mongoose.model("asteroide", AsteroidSchema);

module.exports = Asteroide;
