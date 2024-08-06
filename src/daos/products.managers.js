const fs = require ('fs');
const path = './dbjson/productsDb.json';


class ProductsManagerFs {
constructor(){
this.path = path
}

readProducts = async () => {
    if (fs.existsSync(path)){
        const productsJson = await fs.promises.readFile(path, 'utf-8')
        const productsJs = JSON.parse(productsJson)
        return productsJs
    }
    return [];
}

getProducts = async () => {
    const products = await this.readProducts()
    return products;
}

getProductById = async (productId) => {
    try {
      let products = await this.readProducts();
      const product = products.find(prod => prod.id === productId);
      if (!product) {
        throw new Error(`Producto con ID ${productId} no encontrado`);
      }
      return product;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

createProduct = async  (newProduct) => {
    try {
        const products = await this.readProducts()
        
        if(products.length === 0){
            newProduct.id = 1
        }else{
            newProduct.id = products[products.length-1].id + 1
        }
        products.push(newProduct);
        await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'))
        return newProduct,'se ha agregado el producto';

    } catch (error) {
        console.log(error)
    }
}

deleteProduct = async (productId) => {
    try {
        let products = await this.readProducts();
        const productIndex = products.findIndex(product => product.id === productId);

        if (productIndex === -1) {
            throw new Error(`Producto con ID ${productId} no encontrado`);
        }

        products.splice(productIndex,1)
        ;
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return console.log (`El producto con el ID ${productId} ha sido eliminado`), { message: `Producto con ID ${productId} eliminado`,
    };
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

updateProduct = async (productId, updatedFields) => {
    try {
      let products = await this.readProducts();
      const productIndex = products.findIndex(prod => prod.id === productId);

      if (productIndex === -1) {
        throw new Error(`Producto con ID ${productId} no encontrado`);
      }

      // Mantener el id original y actualizar otros campos
      const updatedProduct = { ...products[productIndex], ...updatedFields, id: productId };
      products[productIndex] = updatedProduct;

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
      return updatedProduct;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}

module.exports = ProductsManagerFs;