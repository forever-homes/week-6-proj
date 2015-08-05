var app = {};
app.shelterID = []; // ID will pulled from findShelter function, and used to getPets

app.findShelter = function() {
	$.ajax({
		url: 'http://api.petfinder.com/shelter.find',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			key: 'bdb306e78ac3127c515483ecdef0c671',
			location: 'M6P1H9',
			format: 'json' // Defined by the API
		},
		success: function(results) {
			for (i = 0; i < results.petfinder.shelters.shelter.length; i++){ // Take each shelter ID that is returned
				app.shelterID.push(results.petfinder.shelters.shelter[i].id.$t); // Push shelterID into empty array
			}
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
				id: item,
				format: 'json'
			},
			success: function(results) {
				console.log(results);
			}
		});	
	})
};
app.init = function() {
	app.findShelter();
	
}

$(function() {
  app.init();
});