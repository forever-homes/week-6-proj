var app = {};

app.shelterPets = []; // pets that return from getPets when you pass in the shelter ID
app.shelterID = []; // ID will pulled from findShelter function, and used to getPets..


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
			// console.log(results);
			for (var i = 0; i < results.petfinder.shelters.shelter.length; i++){ // Take each shelter ID that is returned
                app.shelterID.push({ shelterId: results.petfinder.shelters.shelter[i].id.$t, shelterName: results.petfinder.shelters.shelter[i].name.$t}); // Push shelterID into empty array
            }
			app.getPets(); // Call getPets function after findShelter has run
		}
	});
};

app.getPets = function() {

	//We use the map function to create a new array of ajax calls
	//based on the app.shelterID objects, so that we can use this newly created
	//array for our $.when call
	var calls = $.map(app.shelterID, function( item, index ) {
		return $.ajax({
			url: 'http://api.petfinder.com/shelter.getPets',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				key: 'bdb306e78ac3127c515483ecdef0c671',
				id: item.shelterId,
				format: 'json',
				animal: app.animalType,
				age: app.age
			}
		});
	});

	//We then have to use this .apply method to say, Hey take all these arguments and apply them to this method
	$.when.apply(null, calls).then(function() {
		//arguments is a special keyword that lists all the arguments that are passed into a function
		//that way we don't have to know how many calls there were, but we can still get all the info back
		app.shelterPets = $.map(arguments, function(item, i) {
			var item = item[0].petfinder;
			return { shelterId: app.shelterID[i].shelterId, shelterName: app.shelterID[i].shelterName, pet: item.pets.pet }
		});

		app.showPets(app.shelterPets);
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
		var $pets = $('<div>').addClass('petNames');
		if (Array.isArray(item.pet)){
			$.each(item.pet, function(index, pet){
				console.log(pet);
				var $petName = $('<h4>');
				$petName.text(pet.name['$t']);
				$pets.append($petName)
			})
		} else {
			var $petName = $('<h4>');
			$petName.text(item.pet.name['$t']);
			$pets.append($petName)
		};
		var $shelterName = $('<h3>');
		$shelterName.text(item.shelterName);
		// var $breed = $('<h4>');
		// $breed.text(item.breeds.breed[0].$t + ", " + item.breeds.breed[1].$t);
		$petContainer.append($shelterName, $pets);
		$('#resultsContainer').append($petContainer);
		console.log(item.pet);
	});


};

app.init = function() {
	
	
}

$(function() {
  app.init();
});