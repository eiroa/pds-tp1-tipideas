var should = require("chai").should();
var expect = require("chai").expect;


describe("ideas",function(){
	
	context("student logged",function(){


		beforeEach(function(){
		browser.get("http://localhost:3000/#/login");
			element(by.model("user.username")).sendKeys("elpibe");
			element(by.model("user.password")).sendKeys("elpibe");
			element(by.id("login-btn")).click();
	});

	

		it("check if  is possible to create idea as student",function(){
			
			expect(element(by.id("panelNewIdea")).isPresent()).to.be.falsy;
		
               
		});

	afterEach(function(done){
		var botonSalir = element(by.id("logout"));
		element(by.id("logout")).isPresent().then(function(value) {
			if (value) {
				console.log("bye ");
				botonSalir.click().then(done);
				
			} else {
				console.log("logout not found");
				done();
			}
		});
	});


});

		context("director logged",function(){

	    beforeEach(function(){
		browser.get("http://localhost:3000/#/login");
			element(by.model("user.username")).sendKeys("director");
			element(by.model("user.password")).sendKeys("1234");
			element(by.id("login-btn")).click();
	});


		it("check if  is possible to create idea as director",function(){
			
			expect(element(by.id("panelNewIdea")).isPresent()).to.be.truthy;
			
                

		});

		it("create idea",function(){
			
			element(by.model("title")).sendKeys("test");
			element(by.id("saveIdea")).click();
			//expect(element(by.id("saveIdea")).isPresent()).to.be.truthy;
			
                

		});

		afterEach(function(done){
		var botonSalir = element(by.id("logout"));
		element(by.id("logout")).isPresent().then(function(value) {
			if (value) {
				console.log("bye ");
				botonSalir.click().then(done);
				
			} else {
				console.log("logout not found");
				done();
			}
		});
	});


});

	

	
});
