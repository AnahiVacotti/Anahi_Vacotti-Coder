const mongoose = require('mongoose');
const Cart = require('./model/Cart');  // Modelo de carrito
const Product = require('./model/Product');  // Modelo de producto

// Conexión a la base de datos
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://avacotti:OwFoBf4w6cOlftj4@cluster0.eko90.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB', error);
        process.exit(1);
    }
};

const populateCarts = async () => {
    try {
        // Obtener algunos productos de la base de datos
        const product1 = await Product.findOne({ title: 'Producto 1' });
        const product2 = await Product.findOne({ title: 'Producto 2' });

        // Crear un carrito con productos por defecto
        const newCart = new Cart({
            products: [
                { product: product1._id, quantity: 2 }, // 2 unidades de Producto 1
                { product: product2._id, quantity: 1 }, // 1 unidad de Producto 2
            ],
        });

        // Guardar el carrito en la base de datos
        await newCart.save();
        console.log('Carrito agregado exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al crear carrito', error);
        process.exit(1);
    }
};

// Ejecutar la función
connectDB().then(populateCarts);
