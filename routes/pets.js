const express = require('express');
const rota = express.Router();
const mysql = require('../conections/conect_db').connection
const Login = require('../middleware/login')

rota.post('/:nome/:raca/:cacter/:visto/:token', Login, (req, res) => {
    mysql.getConnection((error,cnx)=>{
        if(error){  return  res.status(500).send({  error:error }) }
        cnx.query(
            'Insert into post(nome, raca, crt, visto) values(?, ?, ?, ?)',
            [req.params.nome, req.params.raca, req.params.cacter, req.params.visto],
            
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
                    nome: req.params.nome,
                    raca: req.params.raca,
                    crt: req.params.cacter,
                    visto: req.params.visto
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

rota.patch('/:nome/:raca/:crt/:visto/:id/:token', Login, (req, res) => {
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
                req.params.nome,
                req.params.raca,
                req.params.crt,
                req.params.visto,
                req.params.id
            ],
            (error, resultado, field) => {
                cnx.release()
                if(error){  return res.status(500).send({   error: error  })}
                
                res.status(202).send({
                    mensagem: "Post atualizado"
                })
            }
        )
    })
})

rota.delete('/:id/:token', Login, (req, res) => {
    mysql.getConnection((error, cnx) => {
        if(error){  return res.status(500).send({ error: error })  }
        cnx.query(
            'Delete from post where id_post = ?',
            [req.params.id],
            (error, resultado, field) => {
                cnx.release()
                if(error){  return res.status(500).send({ error: error })  }

                res.status(202).send({
                    mensagem: 'Post deletado!'
                })
            }
        )
    })
})

module.exports = rota