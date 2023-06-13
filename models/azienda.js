const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const aziendaSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    codiceAzienda: {
        type: String,
        required: true
    },
}, { timestamps: true});

const Azienda = mongoose.model('aziendas', aziendaSchema);

module.exports = Azienda;