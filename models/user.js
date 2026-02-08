/**
 Página de criação do modelo do utilizador
 -----------------Métodos---------------
Analisa password e cria um hash na mesma antes de ser guardada na base de dados

Login do utilizador
 */
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  }
});


// Executa função antes de o user ser guardado na base de dados

//Analisa password e cria um hash na mesma antes de ser guardada na base de dados
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
// Metodo para login do user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      
      //Comparação das passwords 
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };





const User = mongoose.model('user', userSchema);



module.exports = User;