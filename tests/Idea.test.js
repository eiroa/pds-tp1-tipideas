var expect = require("chai").expect
var should = require("chai").should

describe("The galaxy",function(){
      beforeEach(function(done){
      	//doYourMagic();
      });
      context("This is a context",function(){
		it("esto es un test que no fallara",function(){
		//codigo
		});
      });
      context("This is another context",function(){
		it.skip("esto es un test que que no se corre",function(){
		//codigo
		});
	});

	context("contexto re copado",function(){
		it("esto es un test copado",function(done){
		//codigo
                
                // hackeada para null, should se agrega hackerosamente a protobject
                //should.not.exist(err);
                // postSaved.should.be.equal(13);
                //expect(postSaved.upvotes).to.be.equal(13);  <--- metodo "is"  "to"  "be"  no dan nada mas que el "expectation", permiten fluidez
                done(); //  <---  con el done obligamos a ejecutar si o si el test, y sortear el asincronismo
		});
	});
    
	
});





