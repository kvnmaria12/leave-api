const bcrypt = require('bcrypt');
const { app } = require('./app');
const { con } = require('./databaseConnection');

// /login
app.post('/updatePassword', async (req, res) => {

    try {
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

        const sqlQuery = `UPDATE employee
                                  SET password = '${updatedPassword}'
                                  WHERE id = '${employeeId}'`;


        con.query(sqlQuery, (err) => {

            if (err) return res.status(500).send({
                Message: 'Some DataBase Error'
            })

            return res.status(200).send({
                Message: 'Password Update Successfully'
            })
        })
    } catch (error) {
        return res.status(500).send({
            Message: 'Some Server Error'
        })
    }
})



