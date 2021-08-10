const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = require('./app');

const PORT = 7775;

const con = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'kvnmaria@12',
    database: 'leave_application'

})

function databaseConnection() {

    return new Promise((resolve, reject) => {

        con.connect((err) => {

            if (!err) {
                resolve(true)
            } else {
                reject(err)
            }
        })

    })
}

// adding the cors middleware
app.use(cors());

const init = async () => {

    try {

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        await databaseConnection();

        // /login
        app.post('/updatePassword', async (req, res) => {

            const employeeId = req.body.employeeId;
            const password = req.body.password;

            if (!employeeId && !password) {
                return res.status(400).send({
                    Message: 'Please Enter the EmployeeId and Password'
                })
            } else if (!employeeId) {
                return res.status(400).send({
                    Message: 'Please Enter the EmployeeId'
                })
            } else if (!password) {
                return res.status(400).send({
                    Message: 'Please Enter the Password'
                })
            }

            const saltRounds = 10;

            const updatedPassword = await bcrypt.hash(password, saltRounds);

            console.log(updatedPassword);

            const sqlQuery = `UPDATE employee
                              SET password = '${updatedPassword}'
                              WHERE id = '${employeeId}'`;


            con.query(sqlQuery, (err) => {

                if (err) return console.log(err.message);

                return res.status(200).send({
                    Message: 'Password Update  Successfully'
                })
            })

        })

        app.listen(PORT, () => console.log(`Server started listening at port ${PORT}`));

    } catch (error) {

        if (error) return console.log(error);
    }
}

init();