const express = require('express');
const mysql = require('mysql');

const PORT = 7777;


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kvnmaria@12',
    database: 'leave_application'
})


function connectDatabase() {
    return new Promise((resolve, reject) => {
        con.connect((err) => {
            if (!err) {
                resolve(true)
            } else {
                reject(err)
            }
        });
    })
}

const init = async () => {

    const app = express();

    app.use(express.json());

    await connectDatabase();

    app.post('/leave', (req, res) => {

        let employeeId = req.body.employeeId;
        let fromDate = req.body.fromDate;
        let toDate = req.body.toDate;

        if (!employeeId) {
            return res.status(400).send('Please enter your EmployeeId')
        } else if (!fromDate) {
            return res.status(400).send('Please enter the From Date')
        } else if (!toDate) {
            return res.status(400).send('Please enter the To Date')
        }

        const sqlQueryEmployeeId = `SELECT ID FROM employee WHERE ID = ${req.body.employeeId} `;

        con.query(sqlQueryEmployeeId, (err, data) => {

            if (err) {
                return res.status(500).send(`Your EmployeeId does not match with the Company's Database`)
            }

            const sqlQuery = `UPDATE employee
                              SET status = 'Approved'
                              WHERE ID = ${req.body.employeeId}`;


            if (req.body.employeeId === data) {

                con.query(sqlQuery, err => {

                    if (err) return res.status(500).send('Some Database Error');

                    return res.status(200).send('Your Leave has been approved')
                })
            } else {
                res.status(400).send(`Your EmployeeId Does not Match with Company's Record`)
            }

        })

    })

    app.listen(PORT, () => console.log(`Server Started listening at port ${PORT}`))
}

init();
