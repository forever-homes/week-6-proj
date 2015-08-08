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

		if (Array.isArray(item.pet)){ // If there is more than one pet at the shelter (pets are in an array)
			$.each(item.pet, function(index, pet){ // Loop through indexed pet names
				if(pet.animal !== undefined && pet.media.photos.photo[2]['$t'] !== undefined) { // If there is a pet name listed
					var $indiPet = $('<div>').addClass('indiPet');
					var $petName = $('<h4>').addClass('petName'); 
					var $petAge = $('<h5>').addClass('petAge');
					var $petSex = $('<h5>').addClass('petSex');
					var $imgContainer = $('<div>').addClass('imgContainer');
					var $petPic = $('<img>');
					var $petDesc = $('<p>').addClass('petDesc');
					var $petLink = $('<a>');
					var $petHref = "http://www.petfinder.com/petdetail/" + pet.id['$t'];
					$indiPet.data('type', pet.animal['$t']).data('age',pet.age['$t']); // Add animal type/age data to the animal object
					$petLink.attr('href', $petHref);
					$petName.text(pet.name['$t']); 
					$petAge.text(pet.age['$t'] + ' ');
					$petSex.text(pet.sex['$t']);
					$petPic.attr('src', pet.media.photos.photo[2]['$t']);
					var petBriefDesc = pet.description['$t'];
					if (petBriefDesc.length > 400){
						petBriefDesc = petBriefDesc.substring(0,399)+"...";
					}
					$petDesc.text(petBriefDesc);
					$pets.append($petLink);
					$imgContainer.append($petPic);
					$indiPet.append($petName, $petAge, $petSex, $imgContainer, $petDesc);
					$petLink.append($indiPet);
				}
			})
		} else {
			if(item.pet !== undefined && item.pet.media.photos.photo[2]['$t'] !== undefined) {
				var $indiPet = $('<div>').addClass('indiPet'); 
				var $petName = $('<h4>').addClass('petName');
				var $petAge = $('<h5>').addClass('petAge');
				var $petSex = $('<h5>').addClass('petSex');
				var $imgContainer = $('<div>').addClass('imgContainer');
				var $petPic = $('<img>');
				var $petDesc = $('<p>').addClass('petDesc');
				var $petLink = $('<a>');
				var $petHref = "http://www.petfinder.com/petdetail/" + item.pet.id['$t'];
				$indiPet.data('type',item.pet.animal['$t']).data('age',item.pet.age['$t']);
				$petName.text(item.pet.name['$t']);
				$petAge.text(item.pet.age['$t'] + ' ');
				$petSex.text(item.pet.sex['$t']);
				$petPic.attr('src', item.pet.media.photos.photo[2]['$t']);
				var petBriefDesc = item.pet.description['$t'];
				if (petBriefDesc.length > 200){
					petBriefDesc = petBriefDesc.substring(0,199)+"...";
				}
				$petDesc.text(petBriefDesc);
				$pets.append($petLink);
				$imgContainer.append($petPic);
				$indiPet.append($petName, $petAge, $petSex, $imgContainer, $petDesc);
				$petLink.append($indiPet);
			}
		};
		var $shelterName = $('<h3>');
		$shelterName.text(item.shelterName).addClass('shelterTitle');
		// var $breed = $('<h4>');
		// $breed.text(item.pet.breeds.breed);
		$petContainer.append($shelterName, $pets);
		$('#resultsContainer').append($petContainer); // Append all pet information to existing div
		// console.log(item.pet);
	});


};
app.petfilter = function(petType) {
	var pets = $('.indiPet');
	pets.removeClass('hide');
	for(var i = 0; i < pets.length; i++) {
		// If the data type selected does not equal user selection, hide div marked with that data type
		if (pets.eq(i).data('type').toLowerCase() !== petType) {
			pets.eq(i).addClass('hide');
			$('.shelterTitle').each(function(){
				if( $(this).siblings().children().children(':not(.hide)').length == 0 ) {
					$(this).addClass('hide');
				} else {
					$(this).removeClass('hide');
				}
			});
		}
	}
}
app.agefilter = function(age) {
	var pets = $('.indiPet');
	pets.removeClass('hideAge');
	for(var i = 0; i < pets.length; i++) {
		// If the data type selected does not equal user selection, hide div marked with that data type
		if (pets.eq(i).data('age').toLowerCase() !== age ) {
			pets.eq(i).addClass('hideAge');
			$('.shelterTitle').each(function(){
				if( $(this).siblings().children().children(':not(.hideAge)').length == 0 ) {
					$(this).addClass('hideAge');
				} else {
					$(this).removeClass('hideAge');
				}
			});
		}
	}
}

app.init = function() {
	$('form').on('submit',function(e){
		e.preventDefault();
		app.postalCode = $('#postalCode').val();
		$('.selections').removeClass('hide');
		app.findShelter(); // Find all animals available at nearby shelters
	});	
	$('#animalType').on('change',function(e) {
		console.log($(this).val());
		var type = $(this).val();
		app.petfilter(type); // call filter pets function
	});
	$('#age').on('change',function(e) {
		var age = $(this).val();
		app.agefilter(age);
	})
}

$(function() {
  app.init();
});