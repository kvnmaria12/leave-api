const bcrypt = require('bcrypt');
const { con } = require('./databaseConnection');
const jwt = require('jsonwebtoken');


// Route for adding an new Employee
const employeeData = (async (req, res) => {

    try {
        const id = req.body.id;
        const name = req.body.name;
        const mail = req.body.mail;
        const mobile = req.body.mobile;
        const role = req.body.role;
        const password = req.body.password;
        const total_leave = req.body.total_leave;

        if (!id) {
            return res.status(400).send({
                Message: 'Please enter your EmployeeId'
            });
        } else if (!name) {
            return res.status(400).send({
                Message: 'Please enter your Name'
            });
        } else if (!mail) {
            return res.status(400).send({
                Message: 'Please enter your Email'
            });
        } else if (!mobile) {
            return res.status(400).send({
                Message: 'Please enter your Mobile No'
            });
        } else if (!role) {
            return res.status(400).send({
                Message: 'Please enter your Role '
            });
        } else if (!password) {
            return res.status(400).send({
                Message: 'Please enter your Password'
            });
        } else if (!total_leave) {
            return res.status(400).send({
                Message: 'Please enter the Total_Leave'
            });
        }

        const saltRounds = 10;

        const userPassword = await bcrypt.hash(password, saltRounds);

        const sqlQuery = 'INSERT INTO employee(ID, Name, Mail, Mobile, Role, Password, Total_Leave) VALUES ?';

        const values = [
            [id, name, mail, mobile, role, userPassword, total_leave]
        ]

        con.query(sqlQuery, [values], (err) => {

            if (err) {
                console.log(err);
            } else {
                return res.send({
                    Message: 'Data has been entered Successfully'
                })
            }
        });


    } catch (error) {
        return res.status(500).send({
            Message: 'Some Server Side Error'
        })
    }

})


// Route for LeaveApplications(/leaveapplication)
const leaveApplication = (verifyToken, async (req, res) => {

    try {

        let employeeId = req.body.employeeId;

        const employeeIdQuery = `SELECT * FROM employee WHERE ID= ${employeeId}`;

        con.query(employeeIdQuery, (err, data) => {

            if (err) return res.status(500).send({
                Message: 'Some DataBase Error'
            });

            if (data.length > 0) {

                let fromDate = req.body.fromDate;
                let toDate = req.body.toDate;
                let reason = req.body.reason;

                if (!employeeId && !fromDate && !toDate && !reason) {
                    return res.status(400).send({
                        Message: 'Please enter your EmployeeId, fromDate, toDate and reason'
                    });
                } else if (!employeeId) {
                    return res.status(400).send({
                        Message: 'Please Enter the EmployeeId'
                    });
                } else if (!toDate) {
                    return res.status(400).send({
                        Message: 'Please Enter the toDate'
                    });
                } else if (!fromDate) {
                    return res.status(400).send({
                        Message: 'Please Enter the fromDate'
                    });
                } else if (!reason) {
                    return res.status(400).send({
                        Message: 'Please Enter the Reason'
                    });
                }

                const sqlQuery = 'INSERT INTO employeeLeave(fromDate, toDate, reason, employeeId) VALUES ?';

                const values = [
                    [fromDate, toDate, reason, employeeId]
                ]

                con.query(sqlQuery, [values], (err) => {

                    if (err) return console.log(err);

                    console.log('Data Entered Successfully');

                })

            } else {
                return res.status(400).send({
                    Message: 'Please Enter a Valid EmployeeId'
                });
            }

        })

        const sqlQueryEmployeeId = `SELECT * FROM employee WHERE ID = '${employeeId}' `;

        con.query(sqlQueryEmployeeId, (err, dbResult) => {

            if (err) return console.log(err)

            if (dbResult.length > 0) {

                if (employeeId == dbResult[0].ID) {

                    const sqlQuery = `UPDATE employeeLeave
                                      SET status = 'Approved'
                                      WHERE employeeId = ${req.body.employeeId}`;

                    con.query(sqlQuery, err => {

                        if (err) {
                            return res.status(500).send({
                                Message: 'Database Error'
                            })
                        } else {
                            jwt.verify(req.token, 'avemaria@12', (err, authData) => {

                                if (err) return console.log(err);

                                return res.status(200).send({
                                    Message: 'Your Leave has been approved'
                                })

                            })
                        }


                    })
                }
            } else {
                res.status(400).send({
                    Message: `Your EmployeeId Does not Match with Company's Record`
                });
            }

        })
    } catch (error) {
        return res.status(500).send({
            Message: "Some Server Side Error"
        });
    }

})



// Middleware to Verify the Token
function verifyToken(req, res, next) {

    // Get the toke 
    const bearerHeader = req.headers['authorization'];
    // to check if the token is undefined or not
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(401)
    }
}

module.exports = {
    employeeData,
    leaveApplication
}