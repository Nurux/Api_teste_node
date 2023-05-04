const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rota = express.Router();
const mysql = require('../conections/conect_db').connection

rota.post('/cadastro', (req, res) => {
    mysql.getConnection((err, cnx) => {
        if(err){
            return res.status(500).send({
                error: err
            })
        }

        cnx.query('Select * From usuario Where email = ?', [req.body.email], (err, results) => {
            if(err){
                return res.status(500).send({error: err})
            }

            if(results.length > 0){
                res.status(409).send({ mensagem: 'Usuario já cadastrado' })
            }else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if(errBcrypt){
                        return res.status(500).send({error: errBcrypt})
                    }
        
                    cnx.query(
                        'Insert into usuario(email, senha) Values(?,?)',
                        [req.body.email, hash],
            
                        (error, resultado, field) =>{
                            cnx.release()
            
                            if(error){
                                return res.status(500).send({
                                    error: error,
                                    response: null
                                })
                            }
        
                            const response = {
                                mensagem: 'Usuario criado com sucesso',
                                id_usuario: resultado.insertId,
                                email: req.body.email
                            }
        
                            res.status(201).send(response)
                        }
                    )
                })
            }
        })
    })
})

rota.post('/login', (req, res) => {
    mysql.getConnection((err, cnx) => {
        if(err){ return res.status(500).send({ error: err }) }

        const query = 'Select * From usuario Where email = ?';

        cnx.query(query,[req.body.email], (err, results) => {
            cnx.release();

            if(err){
                return res.status(500).send({ error: err})
            }

            if(results.length < 1){
                return res.status(401).send({ mensagem: 'falha na autenticação'})
            }

            bcrypt.compare(req.body.senha, results[0].senha, (err, result) =>{
                if(err){
                    return res.status(401).send({mensagem: 'Falha na autenticação'})
                }

                if(result){
                    const token = jwt.sign({
                        id_usuario: results[0].id_user,
                        email: results[0].email
                    }, 'segredo',{
                        expiresIn: '1h'
                    })

                    return res.status(200).send({
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    })
                }

                return res.status(401).send({mensagem: 'Falha na autenticação'})
            })
        })
        
    })
})

module.exports = rota