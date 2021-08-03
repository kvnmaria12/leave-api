const express = require('express');
const mysql = require('mysql');

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


    app.post('/employee', (req, res) => {

        const id = req.body.id;
        const name = req.body.name;
        const mail = req.body.mail;
        const role = req.body.role;
        const mobile = req.body.mobile;


        if (!id) {
            return res.status(400).send('Please enter the EmployeeId');
        } else if (!name) {
            return res.status(400).send('Please enter the Name');
        } else if (!mail) {
            return res.status(400).send('Please enter the Email');
        } else if (!role) {
            return res.status(400).send('Please enter the Role ');
        } else if (!mobile) {
            return res.status(400).send('Please enter the Mobile No');
        }


        const sqlQuery = 'INSERT INTO employee(ID, Name, Mail, Role, Mobile) VALUES ?';

        const values = [
            [id, name, mail, role, mobile]
        ]

        con.query(sqlQuery, [values], (err, result) => {

            if (err) return res.status(500).send('There is Some Database Error')

            return res.send('Data has been entered Successfully')
        });
    });

    app.listen(PORT, () => console.log(`Server started listening at ${PORT}`));

}

init();