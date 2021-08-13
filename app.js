const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { databaseConnection } = require('./databaseConnection');

dotenv.config();

const app = express();

// adding the cors middleware
app.use(cors());
// adding the middleware json 
app.use(express.json());
// adding the middleware for urlencoded
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server Started Listening at Port ${PORT}`));

databaseConnection();

module.exports = {
    app
};