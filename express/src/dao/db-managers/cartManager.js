import cartModel from "../models/carts.model.js";
import ProductManager from "./productManager.js";

const item = new ProductManager();

class CartManager {
  idAcum = 0;

  constructor() {
  }
  //creamos carrito
  async createCart() {
    const newCart = {
      cId: await this.idOrganizer(),
      products: [],
    };
    const result = await cartModel.create(newCart);
    return result
  }
  //organizador de ids
  async idOrganizer() {
    const carts = await this.getCarts();
    let chkCartNum = await carts.map((cart) => cart.cId);
    let highId = await Math.max(...chkCartNum);
    if (highId === -Infinity) {
      return 1;
    } else {
      console.log("pasa por adicion");
      return highId + 1;
    }
  }

  async getCarts(cId) {
    try {
      if (cId) {
        const cartsfiltered = await cartModel.find({"cId": `${cId}`}).lean();
        return cartsfiltered;
      } else {
        const prodsInCart = await cartModel.find().lean();
        return prodsInCart;
      }
    } catch (error) {
      return [];
    }
  }

  async chkCartById(arr, cId) {
    const chkCartId = await arr.some((cart) => cart.cId === cId);
    return chkCartId;
  }

  async addProductToCart(cId, pId) {
    //revisar que el cId exista
    const carts = await this.getCarts();
    const chkcId = await this.chkCartById(carts, cId);
    if (chkcId) {
      //buscar en db el carrito
      const cartToWork = await cartModel.findOne({"cId": `${cId}`});
      //revisar si el producto ya existe en la lista
      let prodInCart = cartToWork.products.some((p) => p.pId === pId);
      if (prodInCart) {
        console.log("si existe el producto");
        let updateQuanti = cartToWork.products.map((p) => {
          if (p.pId === pId) {
            return {
              ...p,
              quantity: p.quantity+1,
            }
          }
          return p;
        });
        console.log(updateQuanti);
        cartToWork.products = updateQuanti;
        console.log(cartToWork.products);
        return cartToWork.save();
        
      } else {
        //se agrega el producto NUEVO al carrito
        console.log("no existe el producto");
        let addProd = [...cartToWork.products,
          { pId: pId, quantity: 1 }];
        cartToWork.products = addProd;
        console.log(cartToWork.products);
        return cartToWork.save();
      }
    } else {
      return console.log(`el carrito con el id ${cId} no existe`);
    }
  }
}

export default CartManager;
