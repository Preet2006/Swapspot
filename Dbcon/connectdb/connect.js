// let mongoose= require("mongoose")
let con_string = "mongodb+srv://preetjhagekar:O1B3MnUD7vqTn0Rd@swapspotcluster0.iagir.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true";

const mongoose = require('mongoose');

mongoose.set('strictQuery', true); // Enforces strict querying
mongoose.connect('mongodb+srv://preetjhagekar:O1B3MnUD7vqTn0Rd@swapspotcluster0.iagir.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true', { useNewUrlParser: true, useUnifiedTopology: true });

let dbconnect=()=>{
    try{mongoose.connect(con_string, {})
    console.log("database is connected")
}
    catch(err)
    {
        console.log(err)
    }
}
module.exports=dbconnect;