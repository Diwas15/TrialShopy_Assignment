import { Int32 } from 'bson';
import mongoose from 'mongoose';

//define schema
const offerSchema = new mongoose.Schema({
    id:String,
    productType:String,
    discount:Number
});

export default new mongoose.model('Offer',offerSchema);