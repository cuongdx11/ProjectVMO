const express = require('express')
require('dotenv').config();
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')
const session = require('express-session');
const file  = fs.readFileSync('./vmo.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)
const { sequelize, connectDatabase } = require('./src/config/dbConfig')
const intRoutes = require('./src/routes')
const app = express()
const cronJobMailSale = require('./src/helpers/flashsaleNotification')
const updateFlashSaleStatus = require('./src/helpers/updateFlashSaleStatus')
require('./src/config/redisConfig')
require('./src/helpers/emailWoker')
require('./src/helpers/flashSaleWoker')
//CRUD
app.use(express.json())
//client gui len la mang thi cai nay chuyen sang json
app.use(express.urlencoded({extended : true}))
//session
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
// app.use(cors());
intRoutes(app)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
cronJobMailSale.runJob()
updateFlashSaleStatus.runStatusUpdateJob()




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
