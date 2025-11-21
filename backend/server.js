//Intializing server
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose");// import mongoose
require("dotenv").config(); // import dotenv
const {DB_URL} = process.env;// grab var from the .env file
const cors = require("cors"); //disable default browser security
const Product = require("./models/products");//importing the model

//middle ware
server.use(express.json());// unsures data is in json format
server.use(express.urlencoded({extended: true}));//encodes and decodes data
server.use(cors());//security

//database connect
mongoose.connect(DB_URL).then(()=>{
    server.listen(port, ()=>{
        console.log(`Database is connect\nServer is listing on ${port}`);
    });
}).catch((error)=> console.log(error.message));

//routes
server.get("/", (request,response)=>{
    response.send("fuck");
});
//gats all products from the database
server.get("/products", async(request,response)=>{
    try{
        const productResults = await Product.find();
        response.send(productResults);
    } catch(error){
        server.status(500).send({message:error.message});
    }
})
//creates a new product in the database
server.post("/products", async (request,response)=>{
    const {productName, brand, image, price} = request.body;
    console.log("request.body");
    const newProduct = new Product({
        id: Math.floor(Math.random() * 9999999999999).toString(),
        productName,
        brand,
        image,
        price,
    });
    try{
        await newProduct.save();
        response.status(200).send({message: "Product added successfully"});
    } catch(error){
        response.status(400).send({message:error.message});
    }
});
//delete a product based on an id
server.delete("/products/:id", async (request,response)=>{
    const {id} = request.params;
    try{
        await Product.findByIdAndDelete(id);
        response.send({message: "product deleted."});
    }catch(error){
        response.status(400).send({message:error.message});
    }
});
//gets a single product from the database for editing
server.get("/products/:id", async (request,response)=>{
    const {id}  = request.params;
    try{
        const contactToEdit = await Product.findById(id);
        response.send(contactToEdit);
    }catch(error){
        response.status(500).send({message:error.message});
    }
});

//patches a product in the database by id
server.patch("/products/:_id", async (request,response)=>{
    const {_id} = request.params;
    const {id, productName, brand, image, price} = request.body;
    try{
        const contactToEdit = await Product.findByIdAndUpdate(_id, {
            id,
            productName,
            brand,
            image,
            price
        });
        response.send({message: `Product with id ${_id} updated successfully`});
    }catch(error){
        response.status(500).send({message:error.message});
    }
})