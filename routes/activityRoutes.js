var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');

var Logger = mongoose.model('Logger');



router.get('/', function(req, res, next) {

  var cutoff = new Date();  
  cutoff.setDate(cutoff.getDate()-7);  // seteamos un corte de fecha que sea una semana previa al dia que se ejecute la ruta

  Logger.find({date: {$gte: cutoff}},function(err, ideas){
    if(err){ 
	return next(err);
    }


    res.json(ideas);
  });

});


module.exports = router;
