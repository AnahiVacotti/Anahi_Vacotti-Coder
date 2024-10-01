const mongoose = require('mongoose');
const Product = require('./model/Product'); // Asegúrate de la ruta correcta a tu modelo de producto

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

const populateProducts = async () => {
    try {
        // Productos a agregar
        const products = [
            { title: 'Producto 1', price: 100, stock: 50 },
            { title: 'Producto 2', price: 200, stock: 30 },
            { title: 'Producto 3', price: 300, stock: 20 },
            { title: 'Producto 4', price: 400, stock: 10 },
        ];

        // Insertar productos en la base de datos
        await Product.insertMany(products);
        console.log('Productos agregados exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al poblar productos', error);
        process.exit(1);
    }
};

// Ejecutar la función
connectDB().then(populateProducts);