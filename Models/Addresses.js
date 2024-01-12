import mongoose, { Schema } from 'mongoose';

const addressSchema = new mongoose.Schema({
    City:{
        type:String,
        required:true,
    },
    State:{
        type:String,
        required:true
    },
    Country:{
        type:String,
        required:true
    },
    Type:String
   
});

export default new mongoose.model('Address',addressSchema);