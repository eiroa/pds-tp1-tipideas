var should = require("chai").should();


describe("login page ",function(){

	context("valid user",function(){

	it("debe loguearse con usuario valido",function(done){
		browser.get("http://localhost:3000/#/login");

		element(by.model("user.username")).sendKeys("director");
		element(by.model("user.password")).sendKeys("1234");
		element(by.id("login-btn")).click();
		element(by.binding('currentUser()')).getText().then(function(usuarioLogueado){
	        console.log("log user is..."+usuarioLogueado);
		usuarioLogueado.should.be.equal("director");
	        done();
		});

	});

	afterEach(function(done) {
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
