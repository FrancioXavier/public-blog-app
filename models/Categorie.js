const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating categorie model

const Categorie = new Schema({
    name: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("categories", Categorie)