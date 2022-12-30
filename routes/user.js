const express = require('express');
const userRouter = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('users');
const bcrypt = require('bcryptjs');
const passport = require('passport');

userRouter.get('/register', (req, res) => {
    res.render('users/register');
});

userRouter.post('/register', (req, res) => {
    var errors = [];

    if(!req.body.name){
        errors.push({text: "Nome inválido!"});
    }
    if(!req.body.email){
        errors.push({text:  "Email inválido!"});
    }
    if(!req.body.password){
        errors.push({text: "Senha inválida"})
    }
    if(req.body.password.length < 4){
        errors.push({text: "Senha muito pequena!"})
    }
    if(req.body.password != req.body.password2){
        errors.push({text: "Senhas diferentes!"});
    }

    if(errors.length > 0){
        res.render('users/register', {errors: errors})
    }else{ 
        User.findOne({email: req.body.email}).then(user => {
            if(user){
                req.flash('error_msg', 'Já existe uma conta com esse email!');
                res.redirect('/users/register');
            }else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err){
                            req.flash('error_msg', 'houve um erro durante o registro de usuário');
                            res.redirect('/');
                        }else{
                            newUser.password = hash;

                            newUser.save().then(() => {
                                req.flash('success_msg', 'Usuário criado com sucesso.');
                                res.redirect('/');
                            }).catch(err => {
                                req.flash('error_msg', 'Houve um erro ao criar o usuário');
                                res.redirect('/users/register');
                            });
                        }
                    });
                });
            }
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro interno');
            res.redirect('/');
        });
    }
});

userRouter.get('/login', (req, res) => {
    res.render('users/login');
});

userRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next)
});

userRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        req.flash('success_msg', 'Usuário desconectado com sucesso!');
        res.redirect('/');
    });
});

module.exports = userRouter;