const Sequelize = require("sequelize")

const connection = new Sequelize('blogpress','root','123456', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection