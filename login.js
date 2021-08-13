const bcrypt = require('bcrypt');
const { app, databaseConnection, con } = require('./app');


const init = async () => {

    try {

        await databaseConnection();

        app.post('/loginValidation', (req, res) => {

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
                        Message: 'Please Enter the Password '
                    })
                }

                const sqlQuery = `SELECT ID, PASSWORD FROM employee WHERE id = '${employeeId}'`;

                con.query(sqlQuery, async (err, dbResult) => {

                    if (err) {
                        return res.status(500).send({
                            Message: 'Something Went Wrong'
                        })
                    }

                    console.log(employeeId, dbResult);

                    if (dbResult.length > 0) {

                        const employeeDbPassword = await bcrypt.compare(password, dbResult[0].PASSWORD);

                        console.log(employeeDbPassword);

                        if (!employeeDbPassword) {
                            return res.status(400).send({
                                Message: 'Please Enter a Valid Password'
                            })
                        } else if (employeeId == dbResult[0].ID && employeeDbPassword) {
                            return res.status(200).send({
                                Message: 'Welcome'
                            })
                        }

                    } else {
                        return res.status(400).send({
                            Message: `Your EmployeeId does not match with the Company's Database`
                        })
                    }
                })
            } catch (error) {
                return res.status(500).send('Some Server Side Error')
            }
        })

    } catch (error) {
        throw error;
    }
}

init();