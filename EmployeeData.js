const express = require('express');
const mysql = require('mysql');
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

    app.post('/employee', async (req, res) => {

        const id = req.body.id;
        const name = req.body.name;
        const mail = req.body.mail;
        const mobile = req.body.mobile;
        const role = req.body.role;
        const password = req.body.password;
        const total_leave = req.body.total_leave;


        if (!id) {
            return res.status(400).send('Please enter the EmployeeId');
        } else if (!name) {
            return res.status(400).send('Please enter the Name');
        } else if (!mail) {
            return res.status(400).send('Please enter the Email');
        } else if (!mobile) {
            return res.status(400).send('Please enter the Mobile No');
        } else if (!role) {
            return res.status(400).send('Please enter the Role ');
        } else if (!password) {
            return res.status(400).send('Please enter the Password');
        } else if (!total_leave) {
            return res.status(400).send('Please enter the Total_Leave');
        }

        const saltRounds = 10;

        const userPassword = await bcrypt.hash(password, saltRounds);

        const sqlQuery = 'INSERT INTO employee(ID, Name, Mail, Mobile, Role, Password, Total_Leave) VALUES ?';

        const values = [
            [id, name, mail, mobile, role, userPassword, total_leave]
        ]

        con.query(sqlQuery, [values], (err, result) => {

            if (err) return res.status(500).send('There is Some Database Error')

            return res.send('Data has been entered Successfully')
        });
    });

    app.listen(PORT, () => console.log(`Server started listening at ${PORT}`));

}

init();