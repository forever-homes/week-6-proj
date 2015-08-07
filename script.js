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
				format: 'json'
			}
		});
	});

	// We then have to use this .apply method to say, Hey take all these arguments and apply them to this method
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

app.showPets = function(index) {
	$('#resultsContainer').empty();

	$.each(index, function(index,item){
		var $petContainer = $('<div>').addClass('shelter'); // Container for each shelter
		var $pets = $('<div>').addClass('petInfo'); // Information for every pet
		var $indiPet = $('<div>').addClass('indiPet'); // Seperate div for individual pets
		if (Array.isArray(item.pet)){
			$.each(item.pet, function(index, pet){
				if(pet.animal !== undefined) {
					var $petName = $('<h4>').addClass('petName');
					$petName.data('type', pet.animal['$t']).data('age',pet.age['$t']);
					$petName.text(pet.name['$t']);
					$indiPet.append($petName);
					$pets.append($indiPet);
				}

			})
		} else {
			if(item.pet !== undefined) {
				var $petName = $('<h4>').addClass('petName');
				$petName.text(item.pet.name['$t']);
				$petName.data('type',item.pet.animal['$t']).data('age',item.pet.age['$t']);
				$pets.append($petName);
			}
		};
		var $shelterName = $('<h3>');
		$shelterName.text(item.shelterName);
		// var $breed = $('<h4>');
		// $breed.text(item.pet.breeds.breed);
		$petContainer.append($shelterName, $pets);
		$('#resultsContainer').append($petContainer); // Append all pet information to existing div
		console.log(item.pet);
	});


};
app.petfilter = function(petType) {
	// If the data type selected does not equal user selection, hide div marked with that data type
	//Get all the animals
	var pets = $('.petName');
	pets.removeClass('hide');
	for(var i = 0; i < pets.length; i++) {

		console.log(pets.eq(i).data('type').toLowerCase() !== petType) 
		if (pets.eq(i).data('type').toLowerCase() !== petType) {
			pets.eq(i).addClass('hide');
		}
	}
}
app.agefilter = function(age) {
	var pets = $('.petName');
	pets.removeClass('hideAge');
	for (var i = 0; i < pets.length; i++) {
		if (pets.eq(i).data('age').toLowerCase() !== age) {
			pets.eq(i).addClass('hideAge');
		}
	}
}

app.init = function() {
	$('form').on('submit',function(e){
		e.preventDefault();
		app.postalCode = $('#postalCode').val();
		app.findShelter(); // Find all animals available at nearby shelters
	});	
	$('#animalType').on('change',function(e) {
		console.log($(this).val());
		var type = $(this).val();
		// call filter pets function
		app.petfilter(type);
	});
	$('#age').on('change',function(e) {
		var age = $(this).val();
		app.agefilter(age);
	})
}

$(function() {
  app.init();
});
