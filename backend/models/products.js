//initialize the schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create products model
const productsSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: true
    }
});

//pack and export the model
const Product = mongoose.model("Product", productsSchema);
module.exports = Product;