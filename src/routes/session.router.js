const { Router } = require ('express')

const router = Router()
router.post ('/register', (req, res) => {
    res.send('register')
})

router.post ('/login', (req, res ) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.send('Faltan datos ')
        
    }
    req.session.username = username
    req.session.admin = true
    res.send('login')

})

module.exports = router