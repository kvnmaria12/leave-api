const express = require('express');
const mysql = require('mysql');

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


const init = async () => {

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    await databaseConnection();

    app.post('/validate', (req, res) => {


        const employeeId = req.body.employeeId;

        const password = req.body.password;

        const sqlQuery = 'SELECT ID, PASSWORD FROM employee_credentials';

        con.query(sqlQuery, (err, result) => {

            if (err) return res.status(500).send('There is some Error in Fetching your data. Please Bear with Us');

            if (employeeId === result[0].ID && password === result[0].PASSWORD) {

                return res.status(200).send('Successfully Logged In')

            } else {
                return res.status(400).send('Please Enter Appropriated Details')
            }

        })

    })

    app.listen(PORT, () => console.log(`Server started listening at port ${PORT}`))

}

init();