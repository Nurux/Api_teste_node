const express = require('express');
const app = express();


//importa um rota 
const rotaPets = require('./routes/pets');
const rotaUsers = require('./routes/users');

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use(express.static(__dirname + '/tmp'));
app.use('./tmp', express.static('tmp'));

//coloca a rota importada dentro do app passando o endpoint de acesso
app.use('/pets', rotaPets);
app.use('/user', rotaUsers);


//Tratamento quando não encontra a rota, retorna mensagem de erro
app.use((req, res, next) =>{
    const erro = new Error('Rota não encontrada');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

//exporta o app para o server
module.exports = app;