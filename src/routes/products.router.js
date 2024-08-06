const { Router } = require ('express');
const ProductsManagerFs = require('../daos/products.managers');
//import {Router} from 'express
const productsManager = new ProductsManagerFs();

const router = Router();

//configuracion
// const {
//     getProducts
// } = new ProductsManagerFs()

router.get('/', async (req, res)=> {
    try {
        const productsDb = await productsManager.getProducts()
        res.send({status: 'success', data: productsDb})
    } catch (error) {
        console.log (error)
        res.status(500).send({ status: 'error', message: 'Error al obtener los productos' });
    }
})


router.get('/:pid', async (req, res) =>{
    try{
        const productId = parseInt(req.params.pid, 10);
        const product = await productsManager.getProductById(productId);
        res.send({status: 'success', data: product})
    }
    catch(error){
        console.log (error)
        res.status(500).send({ status: 'error', message: 'Error al obtener el producto' });
    }
})

router.post ('/', async(req, res)=>{
    try {
        const { body } = req
        console.log(body)
        const response = await productsManager.createProduct(body)
        res.send ({status:'success', data: response})
    } catch (error) {
        console.log (error)
        res.status(500).send({ status: 'error', message: 'Error al crear el producto' });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        const response = await productsManager.deleteProduct(productId);
        res.send({ status: 'success', message: response.message });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', message: 'Error al eliminar el producto' });
    }
})

router.put('/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid, 10);
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

module.exports = router; 