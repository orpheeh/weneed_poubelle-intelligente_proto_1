var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  WeNeed = require('./model');
  bodyParser = require('body-parser');


const  PORT = process.env.PORT || 3000;

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./route'); //importing route
routes(app); //register the route

app.listen(PORT);

console.log("Proto1 - Serveur start at port " + PORT);