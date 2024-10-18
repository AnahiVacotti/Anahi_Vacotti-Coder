const {Router} = require ('express');

const router = Router()

// router.get('/setcookie', (req, res ) => {
//     res.cookie('coderCookie', 'Cookie poderosa', {maxAge: 10000000}).send ('set cookie')
// })

router.get('/setcookiesigned', (req, res ) => {
    res.cookie('coderCookie', 'Cookie poderosa', {maxAge: 10000000, signed: true}).send ('set cookie')
})

router.get('/getcookie', (req,res ) => {
    console.log(req.cookies)
    res.send(req.cookies)
})

router.get('/deletecookie', (req,res ) => {
    //console.log(req.cookies)
    res.clearCookie('coderCookie').send('cookie borrada')
})

//PROBANDO SESSION
router.get('/sessions', (req, res)=> {
    if (req.session.counter){
    req.session.counter++
    res.send (`se ha visitado el sitio ${req.session.counter} veces`)
    }else {
        req.session.counter = 1
        res.send ('bienvenidos')
    }
})



module.exports = router;
