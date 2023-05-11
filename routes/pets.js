const express = require('express');
const rota = express.Router();
const mysql = require('../conections/conect_db').connection
const Login = require('../middleware/login')
const multer = require('multer');

const Flickr = require('flickr-sdk');
const flickr_key = '44c85ca6294965dc7039188492ab3c8b';
const flickr_secret = '79ae6216da1b70e5';
const usage_token = '72157720881860167-2db920473aee8c1c';
const usage_secret = '5a078579adb6648a';

const fs = require('fs');
let filename = ''

const obj_storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './img');
    },
    filename: (req, file, cb) => {
        filename = file.originalname;
        cb(null, file.originalname);
    }
})

const upload = multer({storage: obj_storage});

let auth = Flickr.OAuth.createPlugin(
    flickr_key,
    flickr_secret,
    usage_token,
    usage_secret
);



rota.post('/', upload.single('img_animal'), Login, (req, res) => {
    let upload = new Flickr.Upload(auth, './img/' + filename);

    upload.then((response) => {
        let url  =  `https://www.flickr.com/photos/198359414@N08/` + response.body.photoid._content;
        
        fs.unlink( __dirname + '/img/' + filename, (err)=>{
            if (err) throw err;
            console.log('imagem deletada');
        });

        mysql.getConnection((error,cnx)=>{
            if(error){  return  res.status(500).send({  error:error }) }
            cnx.query(
                'Insert into post(nome, raca, crt, visto, img) values(?, ?, ?, ?, ?)',
                [req.body.nome, req.body.raca, req.body.crt, req.body.visto, url],
                
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
                        img: url,
                        nome: req.body.nome,
                        raca: req.body.raca,
                        crt: req.body.crt,
                        visto: req.body.visto
                    }
    
                    res.status(201).send(response)
                }
            )
        })
        
    }).catch(function (err) {
        console.log(err)
    }); 
    


    // mysql.getConnection((error,cnx)=>{
    //     if(error){  return  res.status(500).send({  error:error }) }
    //     cnx.query(
    //         'Insert into post(nome, raca, crt, visto, img) values(?, ?, ?, ?)',
    //         [req.body.nome, req.body.raca, req.body.crt, req.body.visto, url],
            
    //         (error, resultado, field) => {
    //             cnx.release()

    //             if(error){
    //                 return res.status(500).send({
    //                     error: error,
    //                     response: null
    //                 })
    //             }

    //             const response = {
    //                 mensagem: 'Post Criado!',
    //                 id_post: resultado.insertId,
    //                 nome: req.body.nome,
    //                 raca: req.body.raca,
    //                 crt: req.body.ctr,
    //                 visto: req.body.visto
    //             }

    //             res.status(201).send(response)
    //         }
    //     )
    // })
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
                            img: post.img,
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