const Cart = require('../model/Cart'); // Modelo de Mongoose para los carritos

class CartsManager {
    constructor(io) {
        this.io = io; // Socket.io si lo usas para tiempo real
    }

    // Crear un nuevo carrito en MongoDB
    createCart = async (cartData) => {
        try {
            const newCart = new Cart(cartData);
            await newCart.save();

            // Emitir actualización en tiempo real
            if (this.io) {
                const carts = await Cart.find().lean(); // Obtener todos los carritos
                this.io.emit('cartUpdated', carts);
            }

            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw error;
        }
    };

    // Obtener un carrito por su ID desde MongoDB
    getCart = async (cartId) => {
        try {
            const cart = await Cart.findById(cartId).populate('products.product').lean();
            if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);
            return cart;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // Agregar un producto al carrito en MongoDB
    addProductToCart = async (cartId, productId) => {
        try {
            const cart = await Cart.findById(cartId);

            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }

            // Verificar si el producto ya está en el carrito
            const productInCart = cart.products.find(p => p.product.toString() === productId.toString());

            if (productInCart) {
                // Incrementar la cantidad si ya existe
                productInCart.quantity += 1;
            } else {
                // Agregar el nuevo producto al carrito
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();

            // Emitir actualización en tiempo real
            if (this.io) {
                const carts = await Cart.find().lean(); // Obtener todos los carritos
                this.io.emit('cartUpdated', carts);
            }

            return cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    };

    // Obtener todos los carritos
    getCarts = async () => {
        try {
            const carts = await Cart.find().lean();
            return carts;
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            throw error;
        }
    };
}

module.exports = CartsManager;
