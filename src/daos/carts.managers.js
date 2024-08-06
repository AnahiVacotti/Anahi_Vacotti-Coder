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
}
module.exports = CartsManagerFs