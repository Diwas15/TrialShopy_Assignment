import mongoose from 'mongoose';

//define schema
const sellerSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    name:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    }
   
});

export default new mongoose.model('Seller',sellerSchema);