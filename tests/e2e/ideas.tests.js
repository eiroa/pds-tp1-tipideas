var should = require("chai").should();
var expect = require("chai").expect;


describe("ideas",function(){



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

		it("create an idea, erase it, and verify log added",function(){
				//por que empezamos con las actividades? porque primero queremos saber cuantas hay para luego determinar si se agrega uno
				element.all(by.repeater('activity in activities')).then(function(activities){

					var lengthActivities = activities.length;

					element(by.model("title")).sendKeys("ideaToEnroll");
					element(by.id("saveIdea")).click();
					// a ver.. a ver,  protractorcito querido...
					//veamos que hace el siguiente codigo ...

					//primero, obtiene todos los elementos del repetidor, con la misma expresion angular en el html,  o sea idea in ideas
					element.all(by.repeater('idea in ideas')).then(function(ideas){

					//obtengo el primer elemento de los generados por el repetidor (la primer idea, en este caso va a ser la unica), 
					//de ese elemento obtengo el elemento html bindeado a la expresion 'idea.title'	
					var spanTitle = ideas[0].element(by.binding('idea.title'));
		  			    // en este caso es un span
		  			    //luego, a ese span le hago un get Text, y luego le pongo un promise,
		  			    // ¿ porque promise? por que todo es asincronico aca, asi que jodete 
		  			    spanTitle.getText().then(function(text){  
					    	//ahora adentro del promise, hacemos el expect, y esperamos que ese text sea la palabra "text"
					    	
					    	expect(text).to.be.equal("ideaToEnroll");
					    });

					    // bueno ahora a borrar la idea que creamos

					    //Clickeamos el boton de dropdown

					    //ideas[0].element(by.id('dropdownMenu')).click();  

					    //ahora verificar que efectivamente se registro la actividad de crear una idea
					    element.all(by.repeater('activity in activities')).then(function(acts){
					    	expect(acts.length).to.be.equal(lengthActivities+1); //verificamos que se genero un log adicional
					    	lengthActivities = acts.length;
					    	//clickeamos el link de borrado
					    	/*
					   		ideas[0].element(by.id('destroyIdea')).click();  // esto genera otro log

					   		element.all(by.repeater('activity in activities')).then(function(acts2){
					    		expect(acts2.length).to.be.equal(lengthActivities+1); //verificamos que se genero otro log por el borrado

					    	});
*/
					   	});
					});

				});


			});

		it("create an idea, set it as deleted, and verify logged",function(){
			element.all(by.repeater('activity in activities')).then(function(activities){

					var lengthActivities = activities.length;

					 //save idea
					element(by.model("title")).sendKeys("ideaToBeDeleted");
					element(by.id("saveIdea")).click();

					//select available ideas
					element.all(by.options('type as type.name for type in types')).filter(function(elem, index) {
  							return elem.getText().then(function(text) {
    						return text === 'Available ideas';
							  });
					}).first().click().then(function(){ //once selected, get the last element, it should be this one
						element.all(by.repeater('idea in ideas')).then(function(ideas){
							console.log(" idea slength " +ideas.length);
							ideas[ideas.length -1].element(by.id('dropdownMenu')).click();
							ideas[ideas.length -1].element(by.id('deleteIdea')).click(); 
							// set the idea as deleted
							element.all(by.options('type as type.name for type in types')).filter(function(elem, index) {
									return elem.getText().then(function(text) {
    								return text === 'Deleted ideas';
							  		}); // select deleted ideas
							}).first().click().then(function(){
								//once in deleted ideas check the last idea
									element.all(by.repeater('idea in ideas')).then(function(ideas){
										ideas[ideas.length -1].element(by.binding("idea.title")).getText().then(function(text){
											//verify the same title
											expect(text).to.be.equal("ideaToBeDeleted");

											element.all(by.repeater('activity in activities')).then(function(acts){
					    						expect(acts.length).to.be.equal(lengthActivities+2); // 2=> creation and deletion log
					    					});
											//finally removeIdea
											ideas[0].element(by.id('dropdownMenu')).click();
											ideas[0].element(by.id('destroyIdea')).click();  
										});
									});
							   });
						});
					});
			});
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

		it("enroll to idea",function(){
			element.all(by.options('type as type.name for type in types')).filter(function(elem, index) {
									return elem.getText().then(function(text) {
    								return text === 'Available ideas';
							  		}); // select deleted ideas
							}).first().click().then(function(){
								//once in deleted ideas check the last idea
									element.all(by.repeater('idea in ideas')).then(function(ideas){
										var ind = 0;
										element.all(by.repeater('idea in ideas')).filter(function(elem, index) {
											return elem.element(by.binding('idea.title')).getText().then(function(text) {
		    								if (text === 'ideaToEnroll'){
		    									ind = index;
		    									return true
		    								}else{
		    									return false;
		    								};
									  		}); // select deleted ideas
										}).first().isDisplayed().then(function(){
											ideas[ind].element(by.id('dropdownMenu')).click();
											ideas[ind].element(by.id('enrollIdea')).click();  
										});

											
											//finally removeIdea
											
							   });
						});
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
