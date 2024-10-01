const Product = require('../model/Product'); // Usar el modelo de productos de MongoDB

class ProductsManager {
    constructor(io) {
        this.io = io; // Socket.io para actualizaciones en tiempo real
    }

    // Crear un nuevo producto en MongoDB
    createProduct = async (newProduct) => {
        try {
            const mongoProduct = new Product(newProduct);
            await mongoProduct.save();

            // Emitir actualizaciones en tiempo real si está conectado con socket.io
            if (this.io) {
                const products = await Product.find().lean(); // Obtener todos los productos y emitir
                this.io.emit('productUpdated', products);
            }

            return mongoProduct;
        } catch (error) {
            console.error('Error al crear el producto:', error);
            throw error;
        }
    };

    // Obtener un producto por su ID desde MongoDB
    getProductById = async (productId) => {
        try {
            const product = await Product.findById(productId).lean(); // Usar MongoDB para obtener el producto
            if (!product) throw new Error(`Producto con ID ${productId} no encontrado`);
            return product;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // Eliminar un producto en MongoDB
    deleteProduct = async (productId) => {
        try {
            await Product.findByIdAndDelete(productId); // Eliminar desde MongoDB

            // Emitir actualizaciones a través de socket.io
            if (this.io) {
                const products = await Product.find().lean(); // Obtener todos los productos y emitir
                this.io.emit('productUpdated', products);
            }

            return { message: `Producto con ID ${productId} eliminado` };
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    };

    // Actualizar un producto en MongoDB
    updateProduct = async (productId, updatedFields) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                updatedFields,
                { new: true }
            ).lean();

            // Emitir actualizaciones a través de socket.io
            if (this.io) {
                const products = await Product.find().lean(); // Obtener todos los productos y emitir
                this.io.emit('productUpdated', products);
            }

            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }
    };

    getProducts = async ({ limit = 10, page = 1, sort, query } = {}) => {
        try {
            let filter = {};
            
            // Solo agregar el filtro de categoría si `query` es un string válido
            if (query && typeof query === 'string') {
                filter.category = query; 
            }
    
            // Configuración de la consulta de productos con paginación
            let productsQuery = Product.find(filter)
                .skip((page - 1) * limit)   // Saltar productos de las páginas anteriores
                .limit(limit)               // Limitar el número de productos
                .lean();                    // Convertir a objetos simples de JavaScript
    
            // Ordenar si se proporciona el campo sort
            if (sort === 'asc') {
                productsQuery = productsQuery.sort({ price: 1 });
            } else if (sort === 'desc') {
                productsQuery = productsQuery.sort({ price: -1 });
            }
    
            // Ejecutar la consulta
            const products = await productsQuery;
    
            // Obtener el número total de productos para la paginación
            const totalProducts = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);
    
            return {
                status: 'success',
                payload: products,
                totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                page,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevLink: page > 1 ? `/realtimeproducts?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: page < totalPages ? `/realtimeproducts?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log('Error al obtener productos:', error);
            return { status: 'error', message: 'Error al obtener productos' };
        }
    };
    
}

module.exports = ProductsManager;
