const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')

router.get("/admin/users", (req, res) => {

    User.findAll().then(users => {
        res.render("admin/users/index", { users: users })
    })

})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})

router.post("/users/create", (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) { // Se email de "user" for nulo/undefined, então crie usuario

            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users")
            }).catch((erro) => {
                res.redirect("/")
            })

        } else {
            res.redirect("/admin/users/create")
        }
    })
})

router.post("/users/delete", (req,res) => {
    var id = req.body.id
    

    if(isNaN(id)) {
        res.redirect("/admin/users")
    }

    if(id != undefined) {
        User.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/admin/users")
        }).catch((erro) => {
            res.redirect("/admin/users")
        })
    }
    
})

router.get("/admin/users/edit/:id", (req,res) => {
    var id = req.params.id

    if(isNaN(id)) {
        res.redirect("/admin/users")
    }
    User.findByPk(id).then((user) => {
        if(user != undefined) {
            res.render("admin/users/edit",{user: user})
        }
    })
})

router.post("/users/update", (req,res) => {
    var email = req.body.email
    var password = req.body.password
    var id = req.body.id
    
    User.findOne({ where: { email: email }}).then(user => {
        if(user == undefined) {            
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)
            
            User.update({email: email, password: hash}, {
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/users")
            })
        }
    })     
})

module.exports = router