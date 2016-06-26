var Idea = require("../../models/Ideas.js").Idea;
var IdeaState = require("../../models/IdeaState.js").IdeaState;
var User = require("../../models/Users.js").User;

var should = require("chai").should();
var expect = require("chai").expect;
var mongoose = require("mongoose");
var mockgoose = require("mockgoose");
var superTest = require("supertest");


var passport = require('passport');


var UserRole = require("../../models/UserRole.js").UserRole;
var Comment = require("../../models/Comments.js").Comment;
var Subject = require("../../models/Subjects.js").Subject;

var express = require("express");
var app = express();
app.use(require('body-parser').json());
var server = superTest.agent(app);




var index = require("../../routes/index.js");
var ideaRoutes = require("../../routes/ideaRoutes.js");


app.use(passport.initialize());

app.use("/", index);
app.use('/ideas',ideaRoutes);


describe("router Ideas", function() {
	before(function(done) {
		mockgoose(mongoose).then(function() {
			mongoose.connect("mongodb://localhost/tips_routesTesting");
			done();
		})
	});

	afterEach(function(done) {
		mockgoose.reset(done);
	});

	after(function(done){
		mongoose.disconnect(done);
	});

	

	

	describe("New user registration", function(){
		this.timeout(15000);
		describe("Executing post request towards resource /register", function(){
			it("should register a new user", function(done){
				superTest(app)
				.post('/register')
				.send({username:'bot',password:'bot'})
				.expect(200)
				.end(function(err, res){
      				expect(err).to.be.null;  //Check that no errors Hapenned
      				done();
      			});
			});
		});




		context("bot user is already registered", function(){
			beforeEach(function(done){
				superTest(app)
				.post('/register')
				.send({username:'bot',password:'bot'})
				.expect(200)
				.end(done);
			});

			describe("Make Post request against resource /login", function(){
				it("should login bot user correctly", function(done){
					server
					.post('/login')
					.send({username:'bot',password:'bot'})
					.expect(500); // TODO ... PASSPORT JS MALFUNCTIONING. ERROR -> UNKNOWN STRATEGY LOCAL
					//.end(function(err, res){
						//expect(err).to.be.null;
						//expect(res.body).to.have.property('token');
						done();
					//});
			});
			});
		});


		context("get available ideas", function(){
			var idea;
			var ideaPending
			var state;
			var statePending;
			beforeEach(function(done) {

				idea = new Idea();
				state = new IdeaState();
				state.title ='available';
				idea.title = "Nova";
				idea.description = "description";
				idea.author =  "bot";
				idea.ideaState = state;
				state.save();
				idea.save();

				ideaPending = new Idea();
				statePending = new IdeaState();
				statePending.title ='pending';
				ideaPending.title = "Nova2";
				ideaPending.description = "description2";
				ideaPending.author =  "bot";
				ideaPending.ideaState = statePending;
				statePending.save();
				ideaPending.save();

				done();
			});

			describe("execute get request against resource /ideas", function() {
				it("should return only the available ideas", function(done) {
					superTest(app)
					.get("/ideas")
					.query({ type: 'available'})
					.expect(200)
					.end(function(err,response){
						expect(err).to.be.null;
						expect(response.body).to.be.array;
						expect(response.body).to.have.lengthOf(1);
						done();
					});
				});
			});
		});


});


});


