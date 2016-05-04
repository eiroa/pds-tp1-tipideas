var router = require("../../../routes/index.js");

var express = require("express");

var mongoose = require("mongoose");
var mockgoose = require("mockgoose");

var app = express();

app.use("/",router);

describe ("router Posts", function(){
	
	before(function(done){
	mockgoose(mongoose).then(function(){
		mongoose.connect("mongodb://localhost/fruta");
		done();
		})
		
	});
	afterEach(function(){
		mockgoose.reset(done);	
	});

	beforeEach(function(post){
		post = new Post();
		post.title = "Dummy Post";
		post.author = "pepe";
		post.upvotes = 12;
                posr.save();	
	});
	describe("POST /posts/<id>/upvote",function(){
		it("should increment counter by one",function(done){
			request(app)
			.put("/posts" + post._id + "/upvote")
			.expect(200)
			.end(function(err,response){
				//the magic
				// should.not.exist(err);
				// response.body.should.have.property("upvotes")
			});
		});
	});
});
