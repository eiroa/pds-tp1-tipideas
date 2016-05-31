var chai = require('chai');
var expect = require('chai').expect;
var should = require("chai").should();
var mongoose = require("mongoose");
var mockgoose = require("mockgoose");
var Idea = require("../../models/Ideas.js").Idea;
var IdeaState = require("../../models/IdeaState.js").IdeaState;
var Logger = require("../../models/Logger.js").Logger;


describe('Testing idea functionality - ', function(){

	before(function(done){
		mockgoose(mongoose).then(function(){
			mongoose.connect("mongodb://localhost/tips-ideas-test");
			done();
		})
	});

	//define a global idea to use
	var idea;

	beforeEach(function(done){
		idea = new Idea();
		state = new IdeaState();
		state.title = "available";
		idea.title = "new";
		idea.description = "this is a description";
		idea.author =  "bot";
		idea.ideaState = state;
		state.save(function(err) {
			if (err) next(err);
		});
		idea.save(done);
	});

	afterEach(function(done) {
		mockgoose.reset(done);
	})

	after(function(done){
		mongoose.disconnect(done);
	});

	describe('Verifying idea properties', function(){
		it('verify title', function(done){
			expect(idea).to.have.property("title").equal("new");
			done();
		});

		it('verify author', function(done){
			expect(idea).to.have.property("author").equal("bot");
			done();
		});

		it('verify description', function(done){
			expect(idea).to.have.property("description").equal("this is a description");
			done();
		});

		it('verify ideaState available', function(done){
			expect(idea.ideaState).to.have.property("title").equal("available");
			done();
		});
		
	});


	describe("verify method enroll",function(){
		it('should have an state with title pending, plus one log must have beed created', function(done){
			idea.enroll("bot",function(err){if(err) return next(err);})
			expect(idea.ideaState).to.have.property("title").equal("pending");
			Logger.find({},function(err, ls){
				if(err){ 
					return next(err);
				}
				expect(ls[0].description).to.equal("bot desires to enroll to an idea ");
			});

			done();
		});
	});

	describe("verify method delete",function(){
		it('should have an state with title deleted, plus one log must have beed created', function(done){
			idea.delet("bot",function(err){if(err) return next(err);})
			expect(idea.ideaState).to.have.property("title").equal("deleted");
			Logger.find({},function(err, ls){
				if(err){ 
					return next(err);
				}
				expect(ls[0].description).to.equal("bot deleted an idea ");
			});
			done();
		});
	});

	describe("verify method accept",function(){
		it('should have an state with title accepted, plus one log must have beed created', function(done){
			idea.accept("bot",function(err){if(err) return next(err);})
			expect(idea.ideaState).to.have.property("title").equal("accepted");
			Logger.find({},function(err, ls){
				if(err){ 
					return next(err);
				}
				expect(ls[0].description).to.equal("bot accepted an enrollment ");
			});
			done();
		});
	});

	describe("verify method reject",function(){
		it('should have an state with title available, plus one log must have beed created', function(done){
			idea.reject("bot",function(err){if(err) return next(err);})
			expect(idea.ideaState).to.have.property("title").equal("available");
			Logger.find({},function(err, ls){
				if(err){ 
					return next(err);
				}
				expect(ls[0].description).to.equal("bot rejected an enrollment ");
			});
			done();
		});
	});


});
