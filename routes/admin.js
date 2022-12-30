const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categorie');
require('../models/Post');
const Categorie = mongoose.model('categories');
const Post = mongoose.model('posts');
const {isAdmin} = require('../helpers/isAdmin');

router.get('/', isAdmin, (req, res) =>{
    res.render('admin/index');
});

//CATEGORIES ROUTES
    router.get('/categories', isAdmin, (req, res) => {
        Categorie.find().lean().sort({date: 'desc'}).then(categories => {
            res.render('admin/categories', {categories: categories});
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro ao listar categorias');
            res.redirect('/admin')
        });
    });

    router.get('/categories/add', isAdmin, (req, res) => {
        res.render('admin/addcategories');
    });

    router.post('/categories/new', isAdmin, (req, res) =>{
        var errors = [];

        if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
            errors.push({text: "Nome inválido!"});
        };

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            errors.push({text: "Slug inválido!"});
        };

        if(req.body.name.length < 2){
            errors.push({text: "Nome da categoria muito pequeno"});
        };

        if(errors.length > 0){
            res.render("admin/addcategories", {
                errors: errors
            })
        } else{
            const NewCategorie = {
                name: req.body.name,
                slug: req.body.slug
            }
        
            new Categorie(NewCategorie).save().then(() => {
                req.flash('success_msg', 'Categoria criada com sucesso!');
                res.redirect("/admin/categories");
            }).catch(err => {
                req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente!');
                res.redirect("/admin");
            })
        }
    });

    router.get('/categories/edit/:id', isAdmin, (req, res) => {
        Categorie.findOne({_id: req.params.id}).lean().then(categorie => {
            res.render('admin/editcategories', {categorie:categorie});
        }).catch(err => {
            console.log(`Error: ${err}`);
            res.redirect('/admin/categories')
        });
    });

    router.post('/categories/edit', isAdmin, (req, res) => {
        const edit_id = req.body.id;
        const update = {name: req.body.name, slug: req.body.slug};
        Categorie.findByIdAndUpdate(edit_id, update).then(() => {
            req.flash('success_msg', 'Categoria atualizada com sucesso');
            res.redirect('/admin/categories');
        }).catch(err => {
            req.flash('error_msg', 'Erro ao atualizar categoria');
            res.redirect('/admin/categories');
        });
    })

    router.post('/categories/delete', isAdmin, (req, res) => {
        const del_id = req.body.id;
        Categorie.findByIdAndRemove(del_id).then(() => {
            req.flash('success_msg', 'Categoria removida com sucesso');
            res.redirect('/admin/categories')
        }).catch(err => {
            req.flash('error_msg', 'Erro ao deletar categoria');
            res.redirect('/admin/categories')
        })
    });

//POSTS ROUTES
    router.get('/posts', isAdmin, (req, res) =>{

        Post.find().lean().populate({path: 'category', model: Categorie, select: 'name', strictPopulate:false}).sort({date: "desc"}).then((posts) => {
            res.render('admin/posts', {posts: posts});
        }).catch(err => {
            req.flash('error_msg', 'houve um erro ao listar as postagens');
            console.log(err)
            res.redirect('/admin/posts')
        });
    });

    router.get('/posts/add', isAdmin, (req, res) => {
        Categorie.find().lean().then((categories) => {
            res.render('admin/addpost', {categories: categories});
        }).catch(err => {
            req.flash('error_msg', 'Erro ao criar postagem');
            res.redirect('/admin/posts');
        })
    });

    router.post('/posts/new', isAdmin, (req, res) => {
        var post_error = []
        if(req.body.category == 0){
            post_error.push({text: 'Categoria inválida, registre uma categoria.'})
        }
        if(!req.body.title){
            post_error.push({text: 'Título inválido'})
        }
        if(!req.body.description){
            post_error.push({text: 'descrição inválida'})
        }
        if(!req.body.content){
            post_error.push({text: 'Conteúdo inválido'})
        }
        if(req.body.content.length > 150){
            post_error.push({text: 'Conteúdo muito grande!'})
        }
        if(!req.body.slug){
            post_error.push({text: 'Slug inválido!'})
        };
        if(post_error.length > 0){
            res.render("admin/addpost", {
                post_error: post_error
            })
        } else{
            const newPost = {
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                slug: req.body.slug,
                category: req.body.category, 
            }

            new Post(newPost).save().then(() => {
                req.flash('success_msg', 'Postagem criada com sucesso!');
                res.redirect("/admin/posts");
            }).catch(err => {
                req.flash('error_msg', 'Houve um erro ao salvar a postagem, tente novamente!');
                console.log(err);
                res.redirect("/admin/posts");
            })
        }
    });

    router.get('/posts/edit/:id', isAdmin, (req, res) => {
        Post.findOne({_id: req.params.id}).lean().then(post => {
            Categorie.find().lean().then((categories) => {
                res.render('admin/editpost', {post: post, categories: categories});
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(`ERROR: ${err}`);
            res.redirect('/admin/posts');
        });
    });

    router.post('/posts/edit', isAdmin, (req, res) => {
        const post_id = req.body.id;
        const update = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category
        };
        Post.findByIdAndUpdate(post_id, update).then(() => {
            req.flash('success_msg', 'Postagem atualizada com sucesso!');
            res.redirect('/admin/posts');
        }).catch(err => {
            req.flash('error_msg', 'Erro ao atualizar postagem');
            res.redirect('/admin/posts')
            console.log(err);
        });
    });

    router.post('/posts/delete/', isAdmin, (req, res) => {
        const del_post_id = req.body.id;
        Post.findByIdAndRemove(del_post_id).then(() => {
            req.flash('success_msg', 'Postagem removida com sucesso');
            res.redirect('/admin/posts');
        }).catch(err => {
            req.flash('error_msg', 'Erro ao deletar postagem');
            console.log(err)
            res.redirect('/admin/posts');
        })
    });


module.exports = router;