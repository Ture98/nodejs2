const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const cvSchema = mongoose.Schema({
   idUtente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'utente'
    },
    filePath: {
        type: String,
        required: true
    },
}, { timestamps: true});

const Cv = mongoose.model('curriculums', cvSchema);

module.exports = Cv;