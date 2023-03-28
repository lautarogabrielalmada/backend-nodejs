import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    code:{
        type:Number,
        required: true
    },
    title:String,
    description:String,
    price:Number,
    thumbnail:{
        type:Array,
        default:[],
    },
    stock:Number,
    status:Boolean,
    category:String
});

const productModel = mongoose.model("products", productsSchema);
export default productModel;