const { Router } = require('express');
const CartsManager = require('../daos/carts.managers');

const cartsManager = new CartsManager(); // Usar el nuevo manager con MongoDB

const router = Router();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const { body } = req;
        const response = await cartsManager.createCart(body);
        res.send({ status: 'success', data: response });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', message: 'Error al crear el carrito' });
    }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartsManager.addProductToCart(cartId, productId);
        res.send({ status: 'success', data: updatedCart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', message: 'Error al agregar el producto al carrito' });
    }
});

// Obtener un carrito por su ID
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartsManager.getCart(cartId);
        res.send({ status: 'success', data: cart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', message: 'Error al obtener el carrito' });
    }
});

// Obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cartsManager.getCarts();
        res.render('carts', { data: carts }); // Renderiza la vista 'carts'
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).send('Error al obtener los carritos');
    }
});

module.exports = router;
