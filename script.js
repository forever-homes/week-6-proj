var app = {};

// app.shelters = []; // shelter names that return from findShelter
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
			console.log(results);
			for (var i = 0; i < results.petfinder.shelters.shelter.length; i++){ // Take each shelter ID that is returned
                // var shelter = {};
                // shelter = results.petfinder.shelters.shelter[i].name.$t;
                // app.shelters.push(shelter);
                app.shelterID.push({ shelterId: results.petfinder.shelters.shelter[i].id.$t, shelterName: results.petfinder.shelters.shelter[i].name.$t}); // Push shelterID into empty array
            }
            // console.log(app.shelterID);
			app.getPets(); // Call getPets function after findShelter has run

		}
	});
};

app.getPets = function() {
	$.each(app.shelterID, function(index, item){ // For each item in the shelterID array, make a call, replacing the ID each time
		$.ajax({
			url: 'http://api.petfinder.com/shelter.getPets',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				key: 'bdb306e78ac3127c515483ecdef0c671',
				id: item.shelterId,
				format: 'json',
				animal: app.animalType,
				age: app.age
			},
			success: function(results) {
				// console.log(results);
				app.shelterPets.push({ shelterId: item.shelterId, shelterName: item.shelterName, pet: results.petfinder.pets.pet});
				app.showPets(app.shelterPets);
			}

		});	

	});
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

		$petName.text(item.pet.name.$t);
		// var $breed = $('<h4>');
		// $breed.text(item.breeds.breed[0].$t + ", " + item.breeds.breed[1].$t);
		$petContainer.append($petName);
		$('#resultsContainer').append($petContainer);
		// console.log(item.name.$t);
	});


};

app.init = function() {
	
	
}

$(function() {
  app.init();
});