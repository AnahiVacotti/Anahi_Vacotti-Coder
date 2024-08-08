const {Router} = require ('express')
const CartsManagerFs = require('../daos/carts.managers');

const cartsManager = new CartsManagerFs();

const router = Router();

router.post('/', async(req,res) =>{
    try{
        const {body} = req;
        console.log(body);
        const response = await cartsManager.createCart(body);
        res.send ({status: 'success', data: response});
    }
    catch(error){
        console.log(error);
        res.status(500).send({ status: 'error', message: 'Error al crear el producto' });
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid, 10);
        const productId = parseInt(req.params.pid, 10);

        const updatedCart = await cartsManager.addProductToCart(cartId, productId);
        res.send({ status: 'success', data: updatedCart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', message: 'Error al agregar el producto al carrito' });
    }
});

router.get('/:cid', async (req, res) =>{
    try{
        const cartId = parseInt(req.params.cid, 10);
        const cart = await cartsManager.getCart(cartId);
        res.send({status: 'success', data: cart})
    }
    catch(error){
        console.log (error)
        res.status(500).send({ status: 'error', message: 'Error al obtener el carrito' });
    }
})

module.exports = router; 