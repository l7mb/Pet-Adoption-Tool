# Pet Adoption Tool

Pet Adoption Tool is a web application tool that aims to serve as a simple method to find animal shelters nearby a given ZIP code.


## Features
* Enter a ZIP code and find nearby shelters
* Find nearby shelters, veterinary clinics, and pet stores within 5000 meters
* Display locations with
    + Location name
    + Address
    + Distance in miles
* Direct link to location on Google Maps

## Frameworks and Tools
* React + Vite
* JavaScript, HTML, CSS
* OpenStreetMap and Overpass API
* Zippopotam API

## How It Works
* The user enters a ZIP code and a request is sent to Zippopotam API to retrieve latitude and longitude
* Coordinates are used by the Overpass API 
* Overpass queries OpenStreetMap data for 
    + Animal shelters
    + Veterinaries
    + Pet stores
* Results are displayed with closest being shown first
* Distances from the given ZIP code is calculated using the Haversine formula 

## Notes
* Some locations do not return address data due to limitations in OpenStreet Map
* Certain ZIP codes will not return results and require a larger search radius