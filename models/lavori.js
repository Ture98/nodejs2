const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const lavoriSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    paga:{
        type: String,
        required: true
    }
}, { timestamps: true});

const Lavori = mongoose.model('lavorioffertas', lavoriSchema);

module.exports = Lavori;