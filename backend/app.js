const express = require('express');
const bodyparser = require('body-parser');
//Following package is to construct paths
const path = require('path');

const pg = require('pg');

console.log(process.cwd());
const PsqlRouters = require('../backend/routes/psql-routers.js');

const app = express();

app.use(bodyparser.json())
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
)

app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});




app.use('/api/psql', PsqlRouters);


module.exports = app;
