/* Página do controlador de autenticação

-----------------Métodos---------------
Controlar os erros 
GET- Sign up do utilizador
GET- Login do utilizador
POST- Sign up do utilizador (Cria e guarda os dados o utilizador na base dados tal como a token usada para autenticação)
POST- Login do utilizador (Verifica os dados do utilizador na base dados tal como a token usada para autenticação para confirmar o login) 
GET- Logout do utilizador (Remove a token no ato de logout)

*/

const User = require("../models/User");
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Controlar erros
const controlErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };


  
  // Mail incorreto
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // Password incorreta
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // Erro de email duplicado no registo
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validar os erros
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// cria json web token
const maxAge = 24 * 60 * 60;
const createToken = (id) => { 

  //Assinatura jwt
  return jwt.sign({ id }, 'ast', {

    expiresIn: maxAge
  });
};



// Serviços do controlador

//GET- Sign up do utilizador
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

// GET- Login do utilizador
module.exports.login_get = (req, res) => {
  res.render('login');
}

// POST- Sign up do utilizador (Cria e guarda os dados o utilizador na base dados tal como a token usada para autenticação)
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {

    //Cria utilizador na base de dados
    const user = await User.create({ email, password });

    //Cria token com o ID do utilizador
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge});
    res.status(201).json({ user: user._id, token });
  }
  catch(err) {
    const errors = controlErrors(err);
    res.status(400).json({ errors });
  }
 
}

//POST- Login do utilizador (Verifica os dados do utilizador na base dados tal como a token usada para autenticação para confirmar o login) 
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge});
    res.status(200).json({ user: user._id, token });
  } catch (err) {
    const errors = controlErrors(err);

    res.status(400).json({ errors });
  }

  //res.send('user login');
}

//GET- Logout do utilizador (Remove a token no ato de logout)
module.exports.logout_get = (req, res) => {

  //Remove a token do utilizador
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}