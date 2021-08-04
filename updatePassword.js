const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt');

const PORT = 7777;

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

const init = async () => {

    try {
        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        await databaseConnection();

        // /login
        app.post('/updatePassword', async (req, res) => {

            const employeeId = req.body.employeeId;
            const password = req.body.password;

            if (!employeeId) {
                return res.status(400).send('Please Enter the EmployeeId')
            } else if (!password) {
                return res.status(400).send('Please Enter the Password')
            }

            const saltRounds = 10;

            const updatedPassword = await bcrypt.hash(password, saltRounds);

            const sqlQuery = `UPDATE employee
                              SET password = ${updatedPassword}
                              WHERE id = ${employeeId}`;


            con.query(sqlQuery, (err, result) => {

                if (err) return console.log(err.message);

                return res.status(200).send('Password Update  Successfully')
            })

        })

        app.listen(PORT, () => console.log(`Server started listening at port ${PORT}`));

    } catch (error) {

        if (error) return console.log(error);

    }

}

init();