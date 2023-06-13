const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const profiloSchema = mongoose.Schema({
    idUtente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'utente'
      },
      nome: {
        type: String,
        required: true
    },
    cognome: {
        type: String,
        required: true
    },
    descrizione:{
        type: String,
        required: true
    }
}, { timestamps: true});

const ProfiloUtente = mongoose.model('infoUtente', profiloSchema);

module.exports = ProfiloUtente;