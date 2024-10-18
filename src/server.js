const express = require('express');
const app = express();
const PORT = 8080;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const ProductsManager = require('./daos/products.managers'); // Cambiado a ProductsManager
const productsRouter = require('./routes/products.router.js')(io);
const cartsRouter = require('./routes/carts.router.js');
const handlebars = require('express-handlebars');
const viewsRouter = require('./routes/views.router.js');
const sessionRouter = require ('./routes/sessions.router.js');
const { connectDB } = require('./config/index.js');
const session = require('express-session');
const pruebasRouter = require ('./routes/pruebas.router.js')
const cookieParser = require ('cookie-parser')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//palabra secreta debe estar en el .env
app.use (cookieParser('clavesecreta'))
app.use (session({
    secret:'clavesecreta', 
    resave: true,
    saveUninitialized:true
}))

// Configuración del motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Conectar a MongoDB
connectDB();

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use ('/', pruebasRouter);
app.use ('/api/sessions', sessionRouter);
// Socket.io para la lista de productos en tiempo real
const productsManager = new ProductsManager(io);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // Emitir lista de productos al conectar
    const products = await productsManager.getProducts({ limit: 10 });
    socket.emit('productList', products.payload);
});

server.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});
