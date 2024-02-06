const jwt = require('jsonwebtoken');
const UserAuth = require('../models/empmodel'); 
const jwtutils = require('../utils/jwtutils');
const ExcelJS = require('exceljs');
const bcrypt = require('bcrypt');
const register = async(req,res)=>{
    const { name,age,email,username, password,role } = req.body;

    try {
      const newUser = await UserAuth.create({ name,age,email,username, password,role });
      res.status(201).json({ id: newUser.id, username });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error registering user');
    }
  };
  const authenticateUser = async (username, password, role) => {
    try {
      console.log('Input data:', username, password, role);
      const user = await UserAuth.findOne({
        where: {
          username
        },
      });
      console.log('User from database:', user);

      if (user && bcrypt.compareSync(password, user.password)) {
        console.log('Password comparison result:', bcrypt.compareSync(password, user.password));
        const accessToken = jwtutils.generateaccessToken(user);
        const refreshToken = jwtutils.generateRefreshToken();
        jwtutils.refreshTokens[refreshToken] = user;
  
        return { access_token: accessToken, refresh_token: refreshToken };
      } 
      else {
        console.log('Invalid credentials:', user, password, user ? user.password : null);
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error during login');
    }
};
  const upload = async (req, res) => {
    try {
      const filePath = req.body.filePath;
  
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);
  
      await worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
        if (rowNumber > 1) {
          const data = row.values;
          console.log('Row values:', data);
          if (data[1] && data[2] && data[3] && data[4] && data[5] && data[6]) {
            const hashedPassword = bcrypt.hashSync(data[6], 10);
            await UserAuth.create({
              id: data[1],
              name: data[2],
              jobtitle: data[3],
              department: data[4],
              username: data[5],
              password: hashedPassword,
              role: data[7],
            });
          } else {
            console.error('Incomplete data in Excel row:', data);
          }
        }
      });
  
      return res.status(200).json({ message: 'Data imported successfully' });
    } catch (error) {
      console.error('Error importing data:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const login = async (req, res) => {
    const { username, password, role } = req.body;
  
    try {
      const tokens = await authenticateUser(username, password, role);
      res.json(tokens);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error during login');
    }
  };
  const exportsql =async(req,res)=>{
    try {
      const emp = await UserAuth.findAll();
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('sheet 1');
      const headers = Object.keys(UserAuth.rawAttributes);
      worksheet.addRow(headers);
      emp.forEach(employee => {
          const rowData = Object.values(employee.dataValues);
          console.log(rowData);
          worksheet.addRow(rowData);
        });
      const filePath='C:/Users/Asus/Desktop/nodejs_pratice/empexcel.xlsx'
      await workbook.xlsx.writeFile(filePath);
  
      console.log('Data exported to Excel file:', filePath);
      res.status(200).json({ message: 'Data exported to Excel successfully', filePath });
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  }
const refreshToken = (req, res) => {
  const refreshToken = req.body.refresh_token;
  if (!refreshToken || !jwtutils.refreshTokens[refreshToken]) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
const userData = jwtutils.refreshTokens[refreshToken];
  const accessToken = jwtutils.generateaccessToken(userData);
  res.json({ access_token: accessToken });
};
module.exports = {
    register,
    upload,
    login,
    exportsql,
  refreshToken,
};