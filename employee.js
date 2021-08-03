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

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    await databaseConnection();

    // /login
    app.post('/login', async (req, res) => {

        const employeeId = req.body.employeeId;
        const password = req.body.password;

        const saltRounds = 10;
        const userPassword = password;

        const encryptedPassword = await bcrypt.hash(userPassword, saltRounds);

        const sqlQuery = 'INSERT INTO employee_credentials(ID, Password) VALUES ?';

        const values = [
            [employeeId, encryptedPassword]
        ]

        con.query(sqlQuery, [values], (err, result) => {

            if (err) return res.status(400).send('Could not Save the Data')

            return res.status(200).send('Data Entered Successfully')
        })

    })

    app.listen(PORT, () => console.log(`Server started listening at port ${PORT}`));

}

init();