const { Router } = require('express');
const ProductsManager = require('../daos/products.managers'); // Manager que interactúa con la BD

const router = Router();

module.exports = (io) => {
    const productsManager = new ProductsManager(io); // Pasar io al constructor

    // Redirigir a la página 1 por defecto si se accede a /api/products
    router.get('/', (req, res) => {
        res.redirect('/api/products/1');
    });

    // Ruta con paginación
    router.get('/:page', async (req, res) => {
        try {
            const page = req.params.page ? parseInt(req.params.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const sortOrder = req.query.sort ? req.query.sort : null;
            const category = req.query.category ? req.query.category : null;

            // Configurar el orden de clasificación (ascendente o descendente)
            const sortOptions = {};
            if (sortOrder) {
                sortOptions.createdAt = sortOrder === 'desc' ? -1 : 1;
            }

            // Configurar el filtro por categoría si está presente
            let filter = {};
            if (category) {
                filter.category = category; // Asegúrate de que `category` es un string
            }

            // Llamar a la función de productos paginados
            const result = await productsManager.getProducts({
                limit,
                page,
                sort: sortOptions,
                query: filter // Pasar filtro
            });

            // Construir los enlaces de paginación
            result.prevLink = result.hasPrevPage
                ? `/api/products/${result.prevPage}?limit=${limit}&sort=${sortOrder}&category=${category}`
                : "";
            result.nextLink = result.hasNextPage
                ? `/api/products/${result.nextPage}?limit=${limit}&sort=${sortOrder}&category=${category}`
                : "";

            // Renderizar la vista de productos con los datos paginados
            res.render('products', {
                allProducts: result.payload,   // Lista de productos
                result                         // Datos de paginación (enlaces, página actual, etc.)
            });
        } catch (error) {
            console.error('Error al obtener los productos paginados:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener los productos' });
        }
    });

    // Resto de las rutas (obtener, crear, eliminar, actualizar productos)
    router.get('/:pid', async (req, res) => {
        try {
            const productId = req.params.pid;
            const product = await productsManager.getProductById(productId);
            res.send({ status: 'success', data: product });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al obtener el producto' });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { body } = req;
            const response = await productsManager.createProduct(body);
            res.send({ status: 'success', data: response });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al crear el producto' });
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const productId = req.params.id;
            const response = await productsManager.deleteProduct(productId);
            res.send({ status: 'success', message: response.message });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al eliminar el producto' });
        }
    });

    router.put('/:pid', async (req, res) => {
        try {
            const productId = req.params.pid;
            const updatedFields = req.body;

            // Asegurarse de que el ID no se puede actualizar
            if (updatedFields.id) {
                delete updatedFields.id;
            }

            const updatedProduct = await productsManager.updateProduct(productId, updatedFields);
            res.send({ status: 'success', data: updatedProduct });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al actualizar el producto' });
        }
    });

    return router;
};
