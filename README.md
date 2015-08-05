#Plan for Forever Pets
##Wire Frame
First page:
	Video Background
	User inputs:
		Postal Code
		Animal type
		Age (baby, young, adult, senior)
		Sex (male, female, don't care)
		Submit button
	When submit button is clicked
		Full page becomes search bar with inputs/submit and results are displayed below

Results displayed:
	Nearby shelters are displayed as pins on a map
	Nearest shelter results are displayed
		Gallery style list of animals are displayed beneath shelter
			Name, breed, age, sex, description, link to Petfinder page
	Other shelters are listed below, when clicked they display animal results


##Pseudo Code
User enters information (postal code, animal type, sex, age)
	1. Postal code is saved to a variable and is used as location parameter in shelter.find call
	2. Shelter.find lat and long are saved into variables and used as location parameter in Google Maps call
	3. Shelter ID's are saved into an array and then used as shelter ID parameter in shelter.getPets call
		3a. Type, Age and Sex inputs are saved as variables and used in shelter.getPets call
	4. shelter.getPets call is repeated for each shelter ID in the array (API call is inside a for loop that runs for each shelter ID in the array)
	5. Animal type is saved to a variable and is used as animal parameter in each shelter.getPets call

Data is displayed on page
	1. Shelter names, city, and lat/long are returned from shelter.find call and stored into an array
	2. Google Maps loops through each item in the array and if the shelter has pets available it places a marker the map
		2a. When you click on marker, shelter info is displayed in a box overlay on map
		2b. Marker on map links to corresponding shelter on page
	3. Shelter names are displayed on page as headings
		3a. Pets available at each shelter are displayed underneath appropriate shelter
		3b. For each pet we display name, breed, age, sex, image, and description
		3c. Pet container is a link to the pet's petfinder page



##Questions for client:
Who is your audience? City?
What animal types would you like included?



		



