
export const getLocationFromZip = async (zip) => {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) {
      throw new Error("Invalid ZIP code");
    }

    const data = await res.json();
    const place = data.places[0];

    return {
      city: place["place name"], state: place["state abbreviation"], lat: place["latitude"], lon: place["longitude"],
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};


export const getSheltersFromCoords = async (lat, lon) => {
  try {
    const query = `[out:json];    //this controls the distance that the overpass api will search for shelters, 5000 represents 5000 meters
      ( node["amenity"="animal_shelter"](around:5000, ${lat}, ${lon});
        node["amenity"="veterinary"](around:5000, ${lat}, ${lon});
        node["shop"="pet"](around:5000, ${lat}, ${lon});
      );
    out;`;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "data=" + encodeURIComponent(query),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch shelters");
    }

    const data = await res.json();

    return data.elements.map((el) => ({ //This controls the information that is returned for each shelter
      id: el.id,
      name: el.tags?.name || "Missing Name",
      lat: parseFloat(el.lat),
      lon: parseFloat(el.lon),
      address:  
      [
        el.tags?.["addr:housenumber"],
        el.tags?.["addr:street"],
      ]
        .filter(Boolean)
        .join(" ") || "Address not available"

    }));

  } catch (err) {
    console.error(err);
    return [];
  }
};