const {DataTypes} = require('sequelize');
const sequelize=require('../config/db.config');
const User=sequelize.define('User',{
    username:{type:DataTypes.STRING,unique:true},
    password:{type:DataTypes.STRING},
    role:{type:DataTypes.ARRAY}

})