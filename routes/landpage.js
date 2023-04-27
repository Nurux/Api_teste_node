const express = require('express');
const rota = express.Router();
const mysql = require('../conections/conect_db').connection

rota.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Usando GET rota principal'
    });
});


rota.post('/login/:email/:senha', (req, res) => {
    const email = req.params.email
    const senha = req.params.senha

    mysql.getConnection((error, cnx) => {
        cnx.query(
            'Insert into usuario(email, senha) values(?,?)',
            [email, senha],
            (error, resultado, field) => {
                cnx.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                    
                }

                res.status(201).send({
                    mensagem: 'Usuario cadastrado!',
                    id_user: resultado.insertId
                })
            }
        )
    })
})

//o post pelo plugin não pega depois olhar o postman 
rota.post('/', (req, res, next) =>{
    const animal = {
        nome: req.body.name,
        idade: req.body.age
    }
    console.log(animal)
    res.status(201).send({
        mensagem: 'O animal foi criado',
        animalCriado: animal
    });
});

rota.get('/:id', (req, res, next) =>{
    const id = req.params.id

    if(id === 'especial'){
        res.status(200).send({
            mensagem: 'Vc é top fião',
            id: id
        })
    }else{
        res.status(200).send({
            mensagem : 'Restornei algo pra tu',
            id: id
        })
    }
})

rota.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Salve fião aqui é o PATCH'
    })
});

rota.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Delete aqui patrão'
    })
})

module.exports = rota;