import { Router, json } from "express";
import {ProductManager} from "../dao/index.js";

const item = new ProductManager();

const viewer = Router();

viewer.get("/", async (req,res) =>{
    const prods = await item.getProducts();
    console.log(prods);
    res.render("index", {prods});
})

viewer.get('/real-time-products', (req, res) => {
    res.render('real_time_products');
});

viewer.get(`/chat`, (req,res) => {
    res.render(`chat`);
})


export default viewer;