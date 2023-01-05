function adminAuth(req, res, next) {
    if(req.session.user != undefined) { // se User gerou a sessão
        next()
    }else{
        res.redirect("/login")
    }
}

module.exports = adminAuth