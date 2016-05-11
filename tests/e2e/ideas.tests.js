var should = require("chai").should();
var expect = require("chai").expect;


describe("ideas",function(){
	
	context("student logged",function(){

	

		it("check if  is possible to create idea as student",function(){
			browser.get("http://localhost:3000/#/login");
			element(by.model("user.username")).sendKeys("elpibe");
			element(by.model("user.password")).sendKeys("elpibe");
			element(by.id("login-btn")).click();
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

	

		it("check if  is possible to create idea as director",function(done){
			browser.get("http://localhost:3000/#/login");
			element(by.model("user.username")).sendKeys("director");
			element(by.model("user.password")).sendKeys("1234");
			element(by.id("login-btn")).click();
			console.log("logged as director")
			
			expect(element(by.id("panelNewIdea")).isPresent()).to.be.truthy;
			var botonSalir = element(by.id("logout"));
			
                	console.log("attempting to log out...");
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
