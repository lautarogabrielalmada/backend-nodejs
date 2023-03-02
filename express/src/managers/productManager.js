import fs from "fs";

class ProductManager {
  #path;
  #nextId = 0;

  constructor(path) {
    this.#path = path;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const products = await this.getProducts();

    const existingProduct = products.find((p) => p.code === code);
    if (existingProduct) {
      throw new Error(`Product with code ${code} already exists`);
    }

    const newProduct = {
      id: this.#nextId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    const updatedProducts = [...products, newProduct];

    await fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts));

    this.#nextId++;

    return newProduct;
  }

  async getProducts() {
    try {
      const productsJson = await fs.promises.readFile(this.#path);
      return JSON.parse(productsJson);
    } catch (err) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return product;
  }

  async updateProduct(id, data) {
    const products = await this.getProducts();

    const updatedProducts = products.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...data,
          id,
        };
      }

      return p;
    });

    await fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts));
  }

  async deleteProduct(id) {
    const products = await this.getProducts();

    const updatedProducts = products.filter((p) => {
    return p.id !== id;
    });

    await fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts));
  }
}

async function main() {}

main()

export default ProductManager;