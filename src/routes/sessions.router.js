const { Router } = require ('express')
const authentication = require('../middleware/auth.middleware')
const router = Router()

router.post('/register', (req, res) =>{
    res.send ('register')
})

router.post('/login', (req, res) =>{ 
    const {username, password} = req.body
    if (username === 'ani' &&  password === 'vacotti' ) {
        req.session.username = username
        req.session.admin = false
        return res.send ('logueado')
    }
    res.send('login fallo')
})

router.get('/current', authentication, (req, res) => {
    res.send ('Datos sensibles')
})


router.get ('/logout', (req, res )=>{
    req.session.destroy(error => {
        if(error) return res.send ({status: 'error', error})
    })
    res.send('logout')
})















module.exports = router;