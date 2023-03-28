import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";

class ProductManager {
  idAcum = 0;
  constructor() {
  }

  async idOrganizer() {
    const products = await this.getProducts();
    let chkIdNum = await products.map((prods) => prods.id);
    let highId = await Math.max(...chkIdNum);
    console.log(highId);
    if (highId === -Infinity) {
      this.idAcum = 0;
      return this.idAcum;
    } else {
      console.log("pasa por adicion");
      return highId + 1;
    }
  }

  async getProducts() {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch (error) {
      return [];
    }
  }

  async chkProdsById(arr, id) {
let check = await productModel.findById(id);
    // let check = await arr.find((prod) => prod.id === id);
    console.log(check);
    return check;
  }

  async chkProdsByCode(arr, code) {
    let check = await arr.some((prod) => prod.code === code);
    return check;
  }

  async addProduct(
    code,
    title,
    description,
    price,
    thumbnail,
    stock,
    status,
    category
  ) {
    //revisar que si esten todos los datos
    if (code && title && description && price && stock && category) {
      console.log("info completa gracias");
    } else {
      console.log(
        `falta informacion para este item, 
          recuerde agregar todos los campos:
          code || title || description || price || thumbnail || stock`
      );
    }
    //revisar que no existe codigo
    let products = await this.getProducts();
    const chk = await this.chkProdsByCode(products, code);
    if (!chk) {
      console.log(`no existe codigo: ${code} ===> SE CREARA NUEVO PRODUCTO`);
      const product = {
        code,
    title,
    description,
    price,
    thumbnail,
    stock,
    status,
    category
      };
      const result = await productModel.create(product);
      return result;
    } else {
      console.log(`Ya existe el codigo ${code} y NO SE CREARA PRODUCTO`);
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const chkProductId = await this.chkProdsById(products, id);
    
    if (chkProductId) {
      console.log(
        `producto con el id ${id} encontrado, se mostrara a continuacion`
      );
      console.log(chkProductId);
      return chkProductId;
    } else {
      console.log(`el id ${id} solicitado no existe`);
      return `el id ${id} solicitado no existe`
    }
  }

  async getProductByCode(code) {
    const products = await this.getProducts();
    const chkProductId = await this.chkProdsById(products, code);
    if (chkProductId) {
      const codeFound = await products.find((prod) => prod.code === code);
      console.log(
        `producto con el id ${code} encontrado, se mostrara a continuacion`
      );
      console.log(codeFound);
      return codeFound;
    } else {
      console.log(`el codigo ${code} solicitado no existe`);
    }
  }

  async deleteProdById(id) {
    try {
      let del =await productModel.deleteOne({"_id": `${id}` });
      return del
    } catch (error) {
      console.log("error al borrar");
      return error;
    }
  }

async updateProdById(id, keyToUpdate, dataUpdate){
  if (!id || !keyToUpdate || !dataUpdate) {
        console.log("falta Información");
      } else {
        let update = await productModel.updateOne(
          {_id: id},
          [
            {$set: {[keyToUpdate]: `${dataUpdate}`}}
          ]
        )
        return update;
      }
}

}

export default ProductManager;
