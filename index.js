const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const session = require("express-session")

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const userController = require("./users/UsersController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")


// View engine
app.set('view engine', 'ejs')

// Sessions

app.use(session({
    secret: "naosei", cookie: { maxAge: 300000 }
}))

// static
app.use(express.static('public'))

// Body parser
app.use(bodyParser.urlencoded({extend: false}))
app.use(bodyParser.json())

// Database

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!")
    }).catch((error) => {
        console.log(error)
    })

app.use("/",categoriesController)
app.use("/",articlesController)
app.use("/",userController)




app.get("/", (req,res) => {
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories})
        })

        
    })
    
})

app.get("/:slug", (req,res) => {
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories})
            })
        }else {
            res.redirect("/")
        }
    }).catch(erro => {
        res.redirect("/")
    })
})

app.get("/category/:slug", (req,res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}] // Relacionamento de banco de dados
    }).then( category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles, categories: categories})
            })
        } else {
            res.redirect("/")
        }
    }).catch( erro => {
        res.redirect("/")
    })
})

app.listen(8080, () => {
    console.log("Servidor rodando!")
})