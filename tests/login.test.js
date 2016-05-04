var should = require("chai").should();


describe("login",function(){

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
});
