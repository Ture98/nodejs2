const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const userSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
}, { timestamps: true});

const Utente = mongoose.model('users', userSchema);

module.exports = Utente;