const express = require('express');
const mysql = require('mysql');


const app = express();

app.use(express.json());

app.post('/leave', (req, res) => {

    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'kvnmaria@12',
        database: 'leave_application'
    })


    let employeeId = req.body.employeeId;
    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;

    if (!employeeId || !fromDate || !toDate) {
        return res.status(400).send('Please Fill all the Details')
    }

    con.connect((err) => {
        if (err) throw err;

        console.log('connected');

        const sqlQuery = `UPDATE employee 
                          SET status = 'Approved' 
                          WHERE ID = '43232' `;

        if (req.body.employeeId === '43232') {

            con.query(sqlQuery, (err) => {

                if (err) throw err;

                return res.send('Your leave has been approved');
            })

        } else {
            return res.send('Please enter the appropriate employeeId')
        }
    })

}).listen(5000, () => console.log('Server started at port 5000'));
