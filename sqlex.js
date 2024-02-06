const express = require('express');
const ExcelJS = require('exceljs');
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3004;
const sequelize = new Sequelize('sakila', 'root', 'root555', {
  host: 'localhost',
  dialect: 'mysql',
});
const Customer = sequelize.define('customer', {
  customer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  store_id: DataTypes.INTEGER,
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: DataTypes.STRING,
  address_id: DataTypes.INTEGER,
  active: DataTypes.INTEGER,
  create_date: DataTypes.DATE,
  last_update: DataTypes.DATE,
},{
    tableName:'customer',
    timestamps:false,
});
app.get('/export', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('customer');
    const headers = Object.keys(Customer.rawAttributes);
    worksheet.addRow(headers);
    customers.forEach(customer => {
        const rowData = Object.values(customer.dataValues);
        console.log(rowData);
        worksheet.addRow(rowData);
      });
    const filePath='C:/Users/Asus/Desktop/nodejs_pratice/employees.xlsx'
    await workbook.xlsx.writeFile(filePath);

    console.log('Data exported to Excel file:', filePath);
    res.status(200).json({ message: 'Data exported to Excel successfully', filePath });
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});