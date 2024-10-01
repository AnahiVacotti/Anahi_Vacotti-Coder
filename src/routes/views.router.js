const { Router } = require('express');
const ProductsManager = require('../daos/products.managers'); // Usar el manager de productos
const CartsManager = require('../daos/carts.managers');

const router = Router();
const cartsManager = new CartsManager();

router.get('/realtimeproducts', async (req, res) => {
    try {
        // Obtener todos los productos sin paginación
        const productManager = new ProductsManager();
        const result = await productManager.getProducts({
            limit: 0, // Sin límite, traer todos los productos
        });

        // Renderizar la vista con todos los productos
        res.render('realtimeProducts', {
            products: result.payload, // Mostrar todos los productos
        });
    } catch (error) {
        console.error('Error al leer los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

router.get('/api/carts', async (req, res) => {
    try {
        const carts = await cartsManager.getCarts();
        res.render('carts', { data: carts }); // Renderiza la vista 'carts'
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).send('Error al obtener los carritos');
    }
});


module.exports = router;
