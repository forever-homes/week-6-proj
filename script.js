var app = {};

app.shelterPets = []; // pets that return from getPets when you pass in the shelter ID
app.shelterID = []; // ID will pulled from findShelter function, and used to getPets..

app.findShelter = function() {
	$.ajax({
		url: 'http://api.petfinder.com/shelter.find',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			key: 'ee6a7449eb1fb9231bb59d7b88510600',
			location: app.postalCode,
			format: 'json'
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
				key: 'ee6a7449eb1fb9231bb59d7b88510600',
				id: item.shelterId,
				count: 35,
				format: 'json'
			}
		});
	});
	// We then have to use this .apply method to say, Hey take all these arguments and apply them to this method
	$.when.apply(null, calls).always(function() {
		//arguments is a special keyword that lists all the arguments that are passed into a function
		//that way we don't have to know how many calls there were, but we can still get all the info back
		app.shelterPets = $.map(arguments, function(item, i) {
			var item = item[0].petfinder;
			return { shelterId: app.shelterID[i].shelterId, shelterName: app.shelterID[i].shelterName, pet: item.pets.pet };
		});
		app.showPets(app.shelterPets);
	});
};

app.showPets = function(index) {
	$('#resultsContainer').empty();

	$.each(index, function(index,item){
		var $petContainer = $('<div>').addClass('shelter'); // Container for each shelter
		var $pets = $('<div>').addClass('petInfo clearfix'); // Information for every pet

		if (Array.isArray(item.pet)){ // If there is more than one pet at the shelter (pets are in an array)
			$.each(item.pet, function(index, pet){ // Loop through indexed pet names
				if(pet.animal !== undefined && pet.media.photos.photo[2]['$t'] !== undefined) { // If there is a pet name listed
					app.displayPetPhotos($petContainer, $pets, pet);
				}
			});
		} else {
			if(item.pet !== undefined && item.pet.media.photos.photo[2]['$t'] !== undefined) {
				app.displayPetPhotos($petContainer, $pets, item.pet);
			}
		}
		var $shelterName = $('<h3>');
		$shelterName.text(item.shelterName).addClass('shelterTitle');
		// var $breed = $('<h4>');
		// $breed.text(item.pet.breeds.breed);
		$petContainer.append($shelterName, $pets);
		$('#resultsContainer').append($petContainer); // Append all pet information to existing div
	});
	$('html,body').animate({
		scrollTop: $('#results').offset().top
	}, 1000);

};

app.displayPetPhotos = function($petContainer, $pets, petData) {

	var $indiPet = $('<div>').addClass('indiPet');
	var $petOverlay = $('<div>').addClass('overlay');
	var $petName = $('<h4>').addClass('petName'); 
	var $petAge = $('<h5>').addClass('petAge');
	var $petSex = $('<h5>').addClass('petSex');
	var $imgContainer = $('<div>').addClass('imgContainer');
	var $petPic = $('<img>');
	var $petDesc = $('<p>').addClass('petDesc');
	var $petLink = $('<a>');
	var $petHref = "http://www.petfinder.com/petdetail/" + petData.id['$t'];
	$indiPet.data('type', petData.animal['$t']).data('age',petData.age['$t']); // Add animal type/age data to the animal object
	$petLink.attr('href', $petHref);
	$petName.text(petData.name['$t']); 
	$petAge.text(petData.age['$t'] + ' ');
	// $petSex.text(pet.sex['$t']);
	var petSex = petData.sex['$t'];
	    if (petSex === 'F') {
	        $petSex.text('Female');
	    } else if (petSex === 'M') {
	        $petSex.text('Male');
	} else {
		$petSex.text('');
	}
	$petPic.attr('src', petData.media.photos.photo[2]['$t']);
	var petBriefDesc = petData.description['$t'];
	if (petBriefDesc && petBriefDesc.length > 150){
		petBriefDesc = petBriefDesc.substring(0,149)+"...";
	}
	$petDesc.text(petBriefDesc);
	//Append pet name, age and sex to overlay
	$petOverlay.append($petName, $petAge, $petSex);
	//Append overlay to a link
	$petLink.append($petOverlay);
	//Append link to image container
	$imgContainer.append($petPic, $petLink);
	//Append image container and description to individual pet container
	$indiPet.append($imgContainer, $petDesc);
	//Append individual pet container to container that holds all pets at a shelter
	$pets.append($indiPet);

};
app.petfilter = function(petType) {
	var pets = $('.indiPet');
	pets.removeClass('hide');
	for(var i = 0; i < pets.length; i++) {
		// If the data type selected does not equal user selection, hide div marked with that data type
		if (pets.eq(i).data('type').toLowerCase() !== petType) {
			pets.eq(i).addClass('hide');
			$('.shelterTitle').each(function(){
				if( $(this).siblings().children(':not(.hide):not(.hideAge)').length === 0 ) {
					$(this).parent().addClass('hide');
				} else {
					$(this).parent().removeClass('hide');
				}
			});
		}
	}
};
app.agefilter = function(age) {
	var pets = $('.indiPet');
	pets.removeClass('hideAge');
	for(var i = 0; i < pets.length; i++) {
		// If the data type selected does not equal user selection, hide div marked with that data type
		if (pets.eq(i).data('age').toLowerCase() !== age ) {
			pets.eq(i).addClass('hideAge');
			$('.shelterTitle').each(function(){
				if( $(this).siblings().children(':not(.hideAge):not(.hide)').length === 0 ) {
					$(this).parent().addClass('hideAge');
				} else {
					$(this).parent().removeClass('hideAge');
				}
			});
		}
	}
};





app.init = function() {
	$('form').on('submit',function(e){
		e.preventDefault();
		app.postalCode = $('#postalCode').val();
		$('#resultsContainer').empty();
		app.shelterPets = [];
		app.shelterID = [];
		$('.selections').removeClass('hide');
		app.findShelter(); // Find all animals available at nearby shelters

		// Scroll down to results section

	
	});

	$('#animalType').on('change',function(e) {
		var type = $(this).val();
		app.petfilter(type); // call filter pets function
	});
	$('#age').on('change',function(e) {
		var age = $(this).val();
		app.agefilter(age);
	});
};

$(function() {
  app.init();
});