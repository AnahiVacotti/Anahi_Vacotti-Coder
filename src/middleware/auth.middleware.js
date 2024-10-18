const authentication = (req, res, next) => {
    if (req.session.username === 'ani' || !req.session.admin) {
        return res.status(401).send ('Error de autenticacion')
    }
    next ()

}
module.exports = authentication;