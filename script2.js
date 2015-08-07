var app = {};

app.shelters = []; // shelter names that return from findShelter
app.shelterPets = []; // pets that return from getPets when you pass in the shelter ID

app.shelterID = []; // ID will pulled from findShelter function, and used to getPets



app.findShelter = function() {
	$.ajax({
		url: 'http://api.petfinder.com/shelter.find',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			key: 'bdb306e78ac3127c515483ecdef0c671',
			location: app.postalCode,
			format: 'json' // Defined by the API
		},
		success: function(results) {
			for (var i = 0; i < 25; i++){ // Take each shelter ID that is returned
                // var shelter = {};
                shelter = results.petfinder.shelters.shelter[i].name.$t;
                shelterNum = results.petfinder.shelters.shelter[i].id.$t;
                var both = {
                	name: shelter,
                	id: shelterNum
                }
                app.shelters.push(both);
                // app.shelterID.push(results.petfinder.shelters.shelter[i].id.$t); // Push shelterID into empty array
            }
            return app.shelters;
			app.getPets(); // Call getPets function after findShelter has run
			// console.log(results);

			// for (var i = 0; i < 25; i++) {
			// 	console.log(app.shelters[i].id);
			// }

		}
	});
};

app.getPets = function() {
	$.each(app.shelter, function(index, item){ // For each item in the shelterID array, make a call, replacing the ID each time
		// console.log(index, item);

		$.ajax({
			url: 'http://api.petfinder.com/shelter.getPets',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				key: 'bdb306e78ac3127c515483ecdef0c671',
				id: item.id,
				format: 'json',
				animal: app.animalType,
				age: app.age
			},
			success: function(results) {
				// console.log(results);
				app.shelterPets.push(results.petfinder.pets.pet);
				app.showPets(results.petfinder.pets.pet);
			}
		});	
	})
};

$('form').on('submit',function(e){
	e.preventDefault();
	app.postalCode = $('#postalCode').val();
	app.animalType = $('#animalType').val();
	app.age = $('#age').val();
	// app.household= $('#household').val();
	app.findShelter();
});


app.showPets = function(index) {
	// $('.resultsContainer').empty();

	$.each(index, function(index,item){
		var $petContainer = $('<div>');
		$petContainer.addClass('petItem');
		var $petName = $('<h3>');
		$petName.text(item.name.$t);
		var $shelterName = $('<h4>');
		$shelterName.text(app.shelters[i].name);
		var $breed = $('<h4>');
		$breed.text(item.breeds.breed[0].$t + ", " + item.breeds.breed[1].$t);
		$petContainer.append($petName, $breed);
		$('#resultsContainer').append($petContainer);
		// console.log(item.name.$t);
	});


};

app.init = function() {
	
	
}

$(function() {
  app.init();
});










////////////


var app = {};

app.shelters = []; // shelter names that return from findShelter
app.shelterPets = []; // pets that return from getPets when you pass in the shelter ID
app.shelterID = []; // ID will pulled from findShelter function, and used to getPets

app.shelterBoth = []; //stores the ids and shelter names together


app.findShelter = function() {
	$.ajax({
		url: 'http://api.petfinder.com/shelter.find',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			key: 'bdb306e78ac3127c515483ecdef0c671',
			location: app.postalCode,
			format: 'json' // Defined by the API
		},
		success: function(results) {
			for (var i = 0; i < 25; i++){ // Take each shelter ID that is returned
                var shelter = {};
                shelter = results.petfinder.shelters.shelter[i].name.$t;
                app.shelters.push(shelter);
                app.shelterID.push(results.petfinder.shelters.shelter[i].id.$t); // Push shelterID into empty array
                shelter = results.petfinder.shelters.shelter[i].name.$t;
                shelterNum = results.petfinder.shelters.shelter[i].id.$t;
                var both = {
                	name: shelter,
                	id: shelterNum
                }
                app.shelterBoth.push(both);
            }
			app.getPets(); // Call getPets function after findShelter has run
			console.log(results);

		}
	});
};
