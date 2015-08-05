var app = {};
app.shelterID = []; // ID will pulled from findShelter function, and used to getPets

app.shelters = [];

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
			for (var i = 0; i < results.petfinder.shelters.shelter.length; i++){ // Take each shelter ID that is returned
                var shelter = {};
                shelter.shelterName = results.petfinder.shelters.shelter[i].name.$t;
                shelter.lat = results.petfinder.shelters.shelter[i].latitude.$t;
                shelter.lon = results.petfinder.shelters.shelter[i].longitude.$t;
                app.shelters.push(shelter);

                app.shelterID.push(results.petfinder.shelters.shelter[i].id.$t); // Push shelterID into empty array
            }
            console.log(app.shelters);
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
				// console.log(results);
			}
		});	
	})
};

// ------------------START OF GOOGLE MAPS -------------------------

$(function($) {
    // Asynchronously Load the map API 
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
    document.body.appendChild(script);
});

function initialize() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };
                    
    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setTilt(45);
        
    // Multiple Markers
    var markers = [];

    


                        
    // Info Window Content
    var infoWindowContent = [
        // ['<div class="info_content">' +
        // '<h3>London Eye</h3>' +
        // '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' +        '</div>'],
        // ['<div class="info_content">' +
        // '<h3>Palace of Westminster</h3>' +
        // '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
        // '</div>']
    ];
        
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        // this.setZoom(9);
        google.maps.event.removeListener(boundsListener);
    });
    
}
// ------------------END OF GOOGLE MAPS -------------------------

app.init = function() {
	app.findShelter();
	
}

$(function() {
  app.init();
});