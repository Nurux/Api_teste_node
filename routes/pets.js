const express = require('express');
const rota = express.Router();
const mysql = require('../conections/conect_db').connection
const Login = require('../middleware/login')

rota.post('/', Login, (req, res) => {
    mysql.getConnection((error,cnx)=>{
        if(error){  return  res.status(500).send({  error:error }) }
        cnx.query(
            'Insert into post(nome, raca, crt, visto) values(?, ?, ?, ?)',
            [req.body.nome, req.body.raca, req.body.crt, req.body.visto],
            
            (error, resultado, field) => {
                cnx.release()

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                const response = {
                    mensagem: 'Post Criado!',
                    id_post: resultado.insertId,
                    nome: req.body.nome,
                    raca: req.body.raca,
                    crt: req.body.ctr,
                    visto: req.body.visto
                }

                res.status(201).send(response)
            }
        )
    })
})

rota.get('/', (req, res) => {
    mysql.getConnection((error, cnx) => {
        if(error){  return  res.status(500).send({  error:error }) }
        cnx.query(
            'Select * from post',
            (error, resultado, field) => {
                cnx.release()

                if(error){
                    return res.status(500).send({
                        error: error
                    })
                }

                const response = {
                    mensagem: 'Lista de pets',
                    quantidade: resultado.length,
                    posts: resultado.map(post => {
                        return {
                            id_post: post.id_post,
                            nome: post.nome,
                            raca: post.raca,
                            crt: post.crt,
                            visto: post.visto,
                        }
                    })
                }

                res.status(200).send(response)
            }
        )
    })
})

rota.patch('/', Login, (req, res) => {
    mysql.getConnection((error, cnx) => {
        if(error){  return res.status(500).send({   error: error  })  }

        cnx.query(
            `Update post
                set nome = ?,
                    raca = ?,
                    crt = ?,
                    visto = ?
             Where id_post = ?`,
            [
                req.body.nome,
                req.body.raca,
                req.body.crt,
                req.body.visto,
                req.body.id
            ],
            (error, resultado, field) => {
                cnx.release()
                if(error){  return res.status(500).send({   error: error  })}
                
                res.status(202).send({
                    mensagem: "Post do animal atualizado"
                })
            }
        )
    })
})

rota.delete('/', Login, (req, res) => {
    mysql.getConnection((error, cnx) => {
        if(error){  return res.status(500).send({ error: error })  }
        cnx.query(
            'Delete from post where id_post = ?',
            [req.body.id],
            (error, resultado, field) => {
                cnx.release()
                if(error){  return res.status(500).send({ error: error })  }

                res.status(202).send({
                    mensagem: 'Post do animal deletado!'
                })
            }
        )
    })
})

module.exports = rota