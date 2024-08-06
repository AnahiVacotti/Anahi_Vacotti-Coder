const express = require ('express');
const productsRouter = require ('./products.router.js')
const cartsRouter = require ('./carts.router.js')
const app = express();
const PORT = 8080;

// para procesar los json del cliente
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//app.use ('/api/products', )

app.listen(PORT, () => {
    console.log('escuchando el puerto ', PORT)
})