const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const UserAuth = sequelize.define('employeedetails', {
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
  },
  name:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  jobtitle: {
    type: DataTypes.STRING,
    allowNull:false,
  },
  department: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role:{
    type: DataTypes.STRING,
  }
}, {
  timestamps: false,
  tableName:'employeedetails',
});

module.exports = UserAuth;