"use strict"
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Idea = mongoose.model('Idea');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var UserRole = mongoose.model('UserRole');
var IdeaState = mongoose.model('IdeaState');
var Logger = mongoose.model('Logger');
var Subject = mongoose.model('Subject');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var self = module.exports = {
	validateRole: function(filter,roles,req,res,next){
		User.findOne(filter).populate('userRole').exec( function (err, user) {
			if (err) { return next(err); }
			var i;
			for (i = 0; i < roles.length; i++) {
				if (roles[i] == user.userRole.title){
					return next();
				}
			}
			res.sendStatus(403);
		});
	},
	validateDirector: function(req,res,next){
		self.validateRole({ username: req.payload.username },['director'],req,res,next);  
	},

	validateProfessor: function(req,res,next){
		self.validateRole({ username: req.payload.username },['professor','director'],req,res,next);
	},
	validateStudent: function(req,res,next){
		self.validateRole({ username: req.payload.username },['student'],req,res,next);
	}
};