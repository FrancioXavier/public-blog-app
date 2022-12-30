if(process.env.NODE_ENV == "production"){
    module.exports = {
        mongoURI: "Link do seu banco de dados no atlas"
    }
} else{
    module.exports = {
        mongoURI: "mongodb://127.0.0.1:27017/blogapp"
    }

}