const express = require('express')
require('dotenv').config();
const cors = require('cors')
const { sequelize, connectDatabase } = require('./src/config/dbConfig')
const intRoutes = require('./src/routes')
const app = express()
const cronJobMailSale = require('./src/helpers/flashsaleNotification')
const updateFlashSaleStatus = require('./src/helpers/updateFlashSaleStatus')
//CRUD
app.use(express.json())
//client gui len la mang thi cai nay chuyen sang json
app.use(express.urlencoded({extended : true}))

intRoutes(app)

cronJobMailSale.runJob()
// updateFlashSaleStatus.runStatusUpdateJobMailStatus()




const PORT = process.env.PORT || 5555

// connectDatabase();
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        app.listen(PORT , () => {
            console.log('Server is running on port '+PORT);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
