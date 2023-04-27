const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const decode_token = jwt.verify(req.params.token, 'segredo')
        req.usuario = decode_token;
        next();
    } catch{
        res.status(401).send({mensagem: 'Falha na autenticação'})
    } 
}