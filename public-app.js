//aplication modules
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment');
require('./models/Post');
const Post = mongoose.model('posts');
require('./models/Categorie');
const Categorie = mongoose.model('categories');
const users = require('./routes/user');
const passport = require('passport');
require('./config/auth')(passport);
const db = require('./config/db')

//Settings

//Session
    app.use(session({
        secret: 'SenhaDaSession',
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(flash());

//Midleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next();
    })
//Body Parser
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

//Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main',
        helpers: {
            formatDate: (date) => {
                return moment(date).format('DD/MM/YYYY')
            }
        }
    }));
    app.set('view engine', 'handlebars');

//Mongoose
    mongoose.connect(db.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true

    }).then(() => {
        console.log('Database connected!');
    }).catch(err => {
        console.log(`ERROR: ${err}`);
    });

//public
    app.use(express.static(path.join(__dirname, 'public')));
//Routes
app.get('/', (req, res) => {
    Post.find().lean().populate({path: 'category', model: Categorie, select: 'name', strictPopulate:false}).sort({date: 'desc'}).then(post => {
        res.render('index', {post: post});
    }).catch(err => {
        console.log(err);
        req.flash('error_msg', 'Houve um erro interno');
        res.redirect('/404');
    });
});

app.get('/posts/:slug', (req, res) => {
    Post.findOne({slug: req.params.slug}).lean().then(post => {
        if(post) {
            res.render('post/index', {post: post});
        } else{
            req.flash('error_msg', 'Postagem não existe!');
            res.redirect('/');
        }
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro interno');
        res.redirect('/');
    });
});

app.get('/categories', (req, res) => {
    Categorie.find().lean().then((category) => {
        res.render('category/index', {category: category});
    }).catch(err => {
        req.flash('error_msg', 'Erro ao listar as categorias');
        res.redirect('/');
    });
});

app.get('/categories/:slug', (req, res) => {
    Categorie.findOne({slug: req.params.slug}).lean().then(category => {
        if(category){

            Post.find({category: category._id}).lean().populate({path: 'category', model: Categorie, select: 'name', strictPopulate:false}).sort({date: 'desc'}).then(posts => {

                res.render('category/posts', {category: category, posts: posts});

            }).catch(err => {
                req.flash('error_msg', 'Houve um erro ao listar os posts');
                res.redirect('/categories');
                console.log(err);
            });

        }else{
            req.flash('error_msg', 'Categoria não existe');
            res.redirect('/categories');
        }
    }).catch(err => {
        console.log(err);
        req.flash('error_msg', 'Houve um erro interno');
        res.redirect('/')
    });
});

app.get('/404', (req, res) => {
    res.send('ERRO 404!');
});

app.use('/admin', admin);

app.use('/users', users);

//Outros
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>{
    console.log('Server ON!')
});