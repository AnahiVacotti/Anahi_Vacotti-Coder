const fs = require('fs'); 
const express = require ('express');
const path = './dbjson/cartsDb.json'

class CartsManagerFs {
    constructor(){
        this.path = path;
    }

    readCarts = async () => {
            if (fs.existsSync(path)){
                const cartsJson = await fs.promises.readFile(path, 'utf-8')
                const cartsJs = JSON.parse(cartsJson)
                return cartsJs
            }
            return [];
    }

    createCart = async (newCart) => {
        try{
            const carts = await this.readCarts();

            if (!newCart.products) {
                newCart.products = []; 
            }
            if(carts.length === 0){
                newCart.id = 1;
            }
            else{
                newCart.id = carts[carts.length-1].id + 1;
            }
            carts.push(newCart);
            await fs.promises.writeFile(path, JSON.stringify(carts, null, '\t'))
            return newCart, 'Se ha agregado el carrito'
        }
        catch(error){
            console.log(error);
        }
    }

    getCart = async (cartId) => {
        try{
            const carts = await this.readCarts();
            const cart = carts.find(carro => carro.id === cartId)
            if(!cart){
                throw new Error(`Carrito con ID ${cartId} no encontrado`)
            }
            return cart;
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }

    addProductToCart = async (cartId, productId) => {
        try {
            let carts = await this.readCarts(); //leo los carritos del fs
            const cartIndex = carts.findIndex(carro => carro.id === cartId); //busca el indice del carrito (cartId) en el array
            if (cartIndex === -1) { // si no encuentro el indice arrojo error
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }

            const cart = carts[cartIndex]; //asigno el carrito buscado a la variable carts
            const productIndex = cart.products.findIndex(producto => producto.productId === productId); //busco indice del producto en el array

            if (productIndex === -1) { //si no existe el producto en el carrito lo agrego
                cart.products.push({ productId: productId, quantity: 1 });
            } else { //si el producto existe aumento su cantidad en 1
                cart.products[productIndex].quantity += 1;
            }

            carts[cartIndex] = cart; //actualizo la lista de carritos con el nuevo carrito modificado.
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return cart;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
module.exports = CartsManagerFs