const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = require('./app');

const PORT = 7777;

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kvnmaria@12',
    database: 'leave_application'
});


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

        app.post('/loginValidation', (req, res) => {

            const employeeId = req.body.employeeId;
            const password = req.body.password;

            if (!employeeId) {
                return res.status(400).send('Please Enter a EmployeeId')
            } else if (!password) {
                return res.status(400).send('Please Enter a Password')
            }

            const sqlQuery = `SELECT ID, PASSWORD FROM employee WHERE id = '${employeeId}'`;

            con.query(sqlQuery, async (err, dbResult) => {

                if (err) {
                    return res.status(400).send(`Something Went Wrong`)
                }

                console.log(employeeId, dbResult);

                if (dbResult.length > 0) {

                    const employeeDbPassword = await bcrypt.compare(password, dbResult[0].PASSWORD);

                    console.log(employeeDbPassword);

                    if (!employeeDbPassword) {
                        return res.status(400).send('Please Enter a Valid Password')
                    } else if (employeeId == dbResult[0].ID && employeeDbPassword) {
                        return res.status(200).send('Welcome')
                    }

                } else {
                    return res.status(400).send(`Your EmployeeId does not match with the Company's Database`)
                }
            })
        })

        app.listen(PORT, () => console.log(`Server Started listening at port ${PORT}`))

    } catch (error) {

        console.log(error);
    }
}

init();