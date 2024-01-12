import mongoose from 'mongoose';

//define schema
const customerSchema = new mongoose.Schema({
    id:{
        type:String,
        unique:true,
        index:true,
        required:true
    },
    email: {
        type:String,
        required:true,
        index:true,
        unique:true
    },
    name:{
        type: String,
        required:true
    }
   
});

export default new mongoose.model('Customer',customerSchema);