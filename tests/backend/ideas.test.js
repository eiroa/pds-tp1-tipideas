var chai = require('chai');
var expect = require('chai').expect;
var should = require("chai").should();
var mongoose = require("mongoose");
var mockgoose = require("mockgoose");
var Idea = require("../../models/Ideas.js");
var IdeaState = require("../../models/IdeaState.js");


/*

var IdeaSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  author: String,
  ideaState: { type: mongoose.Schema.Types.ObjectId, ref: 'IdeaState'},
  upvotes: {type: Number, default: 0},
  downvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  links: [String],
  tags:[String],
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  student: {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


*/

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
		idea.title = "Nova idea";
  		idea.descripcion = "this is a description";
  		idea.author =  "bot";
  		idea.ideaState = state;
  		idea.save(done);
	});

	afterEach(function(done) {
		mockgoose.reset(done);
	})

	after(function(done){
		mongoose.disconnect(done);
	});

	describe('Verifying delete', function(){
		it('should have an state with title delete', function(done){
			idea.delet(function(err, target){
				expect(target).to.have.property("estado").equal("deleted");
				done();
			});
		});
	});

	/**

	describe('el metodo postularse a una idea', function(){
		it('setea el estado de una idea a REVISION', function(done){
			idea.postular("alumno1",function(err, ideaPostulada){
				expect(ideaPostulada).to.have.property("estado").equal("REVISION");
				done();
			});
		});

		it('setea el nombre del postulante de una idea', function(done){
			idea.postular("alumno1",function(err, ideaPostulada){
				expect(ideaPostulada).to.have.property("postulante").equal("alumno1");
				done();
			});
		});
	});
	describe('el metodo eliminar de una idea', function(){
		it('setea el estado de una idea a ELIMINADA', function(done){
			idea.eliminar(function(err, ideaEliminada){
				expect(ideaEliminada).to.have.property("estado").equal("ELIMINADA");
				done();
			});
		});
	});
	describe('el metodo aceptar postulacion de una idea', function(){
		it('setea el estado de una idea a ACEPTADA', function(done){
			idea.aceptarPostulacion(function(err, ideaAceptada){
				expect(ideaAceptada).to.have.property("estado").equal("ACEPTADA");
				done();
			});
		});
	});

	describe('el metodo rechazar postulacion a una idea', function(){
		it('setea el estado de una idea a DISPONIBLE', function(done){
			idea.rechazarPostulacion(function(err, ideaRechazada){
				expect(ideaRechazada).to.have.property("estado").equal("DISPONIBLE");
				done();
			});
		});

		it('setea NULL al nombre del postulante de la idea', function(done){
			idea.rechazarPostulacion(function(err, ideaPostulada){
				ideaPostulada.should.have.property("postulante").to.be.null;
				done();
			});
		});
	});

	*/

});
