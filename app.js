const express = require('express');
const cors = require('cors');
const { databaseConnection } = require('./databaseConnection');
const dotenv = require('dotenv');
const { employeeData, leaveApplication, verifyToken } = require('./employeeData');

dotenv.config();

// Database Connection 
databaseConnection();

const app = express();

// adding the cors middleware
app.use(cors());
// adding the middleware json 
app.use(express.json());
// adding the middleware for urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/employeeData', employeeData);
app.post('/leaveapplication', verifyToken, leaveApplication);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server Started Listening at Port ${PORT}`));

module.exports = app;

