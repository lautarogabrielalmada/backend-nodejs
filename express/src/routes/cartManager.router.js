import { Router, json } from "express";
import {CartManager} from "../dao/index.js";

const cartManagerRouter = Router();
const cart = new CartManager();

cartManagerRouter.post("/", async (req,res) =>{
    await cart.createCart();
    const result = await cart.getCarts();
    await res.send(result);
}) 

cartManagerRouter.get("/", async (req, res) => {
    const{cId} = req.params;
    const carts = await cart.getCarts(cId);
    console.log(carts);
    await res.send(carts);
})

cartManagerRouter.get("/:cId", async (req, res) => {
    const{cId} = req.params;
    const carts = await cart.getCarts(cId);
    console.log(carts);
    await res.send(carts);
})


cartManagerRouter.post("/:cId/product/:pId", async (req,res) =>{
    const cartId = await Number(req.params.cId);
    const prodId = await Number(req.params.pId);
    const result = await cart.addProductToCart(cartId, prodId);
    await res.send(result);
})

export default cartManagerRouter;
