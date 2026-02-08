/**
 Página de criação do middleware para ajudar na autenticação da aplicação por JWT 
 
 -----------------Métodos---------------
Vê se existe a json web token e valida

Verifica qual o user que fez login
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Vê se existe a json web token e valida
  if (token) {
    jwt.verify(token, 'ast', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};


// Verifica qual o user que fez login
const statusUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'ast', async (err, decodedToken) => {

        if (err) {
          res.locals.user = null;
          next();
        } else {

          //Verifica user que fez login buscando os dados à DB e o seu ID
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };

module.exports = { requireAuth, statusUser };