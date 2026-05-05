import { useState } from 'react'
import { getLocationFromZip } from "/src/services/api.js";
import { getSheltersFromCoords } from "/src/services/api.js";



    
function App() {
    const [zip, setZip] = useState("");
    const [location, setLocation] = useState(null);
    const [shelters, setShelters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [modal, setModal] = useState(false);

const getDistance = (lat1, lon1, lat2, lon2) => { {/*coordinates of the given zip code and the shelter*/}
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 3958.8;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  {/*the distance between the two sets of coordinates*/}

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2; 
  {/*Applies the Haversine formula in order to calculate the distance between the two locations*/}
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
  {/*converts results to miles by multiplying by radius of the Earth*/}
};

const handleSearch = async () => {
      setLoading(true);
      setLocation(null);
      setShelters([]);
      setMessage("");

    const loc = await getLocationFromZip(zip);
      if (!loc) { {/*if no location found, set loading to false and set error message*/}
          setLoading(false);
          setMessage("Invalid ZIP code. Try again.");
          return;
      }

    setLocation(loc); {/*set found location from zippopotam API function*/}

    const results = await getSheltersFromCoords(loc.lat, loc.lon);
    if (results.length === 0) {
      setMessage("No shelters found nearby. Try a different ZIP or widen your search area.");
    }

  const resultsDistance = results.map((s) => ({ ...s, /* maps the distance of each location*/
    distance: getDistance(
      loc.lat, loc.lon, s.lat, s.lon
    )
    
}));
    resultsDistance.sort((a, b) => a.distance - b.distance); {/*sort results by closest first*/}
    setShelters(resultsDistance);
    setLoading(false);
};

return (
<div className="outerBody">
    <h1 id="header">Pet Adoption Tool</h1>

        <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Enter ZIP code" maxLength={5}/> {/*only 5 digit zipcodes are supported*/}
        <button onClick={handleSearch} disabled={loading} className="search">{loading ? "Searching..." : "Find Shelters near me"}</button>

      <div className="learnMore">
        <button onClick={() => setModal(true)} className="cornerButton">Learn More</button>
          {modal && (
          <div className="modal">
            <div className="modalBox">
              <h2>What is this?</h2>
              <p>The purpose of this tool is to provide a method for people who are interested in adopting pets or caring for animals to find locations near them.</p>
              <p>Many shelters are often overcrowded and underfunded. Animals which live in these shelters do not recieve proper care either due to the sheer number of animals or a lack of resources to do so.</p>
            <button onClick={() => setModal(false)}>Close</button>
            </div>
          </div>
          )}
      </div>

        {location && !loading && (
            <p>{shelters.length} results found in <strong>{location.city}, {location.state}</strong></p>
        )}
                
{shelters.length > 0 && (
  <div className="resultsTotal">
    {shelters.map((s) => {
      const parts = [s.name, s.address !== "Address not available" ? s.address : null, location?.city, location?.state].filter(Boolean); 
      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(parts.join(" "))}`;
      {/*google maps url that uses the information from the overpass API function */}  
      return (

        <div key={s.id} className="locationResults">
          {/*Location name */}
          <p className="locationName">
            <strong>{s.name}</strong>{" "}
          </p>

          {/*Location address */}
          <p className="locationAddress">{s.address} {" "} 
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                View on Maps
            </a>
          </p>
          <p className="distanceAway">{s.distance.toFixed(1)} miles away</p>
        </div>
      );
    })}
  </div>
)}

  {message && (
    <div>
      <p>{message}</p> {/*Error message that is displayed when either no shelters are found, or the zip code is invalid*/}
    </div>
  )}



</div>
    );
}

export default App