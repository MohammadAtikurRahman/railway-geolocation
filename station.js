// const axios = require("axios");
// const geolib = require("geolib");

// // Overpass API URL
// const overpassApiUrl = "http://overpass-api.de/api/interpreter";

// // Queries for Overpass API
// const fetchRailwayStationsQuery = `
// [out:json];
// area["ISO3166-1"="BD"][admin_level=2];
// node["railway"="station"](area);
// out body;
// `;

// const fetchCitiesQuery = `
// [out:json];
// area["ISO3166-1"="BD"][admin_level=2];
// node["place"="city"](area);
// out body;
// `;

// const fetchThanasQuery = `
// [out:json];
// area["ISO3166-1"="BD"][admin_level=2];
// node["place"="town"](area);
// out body;
// `;

// const fetchVillagesQuery = `
// [out:json];
// area["ISO3166-1"="BD"][admin_level=2];
// node["place"="village"](area);
// out body;
// `;

// // Function to fetch data from Overpass API
// const fetchDataFromOverpass = async (query) => {
//   try {
//     const response = await axios.post(overpassApiUrl, `data=${encodeURIComponent(query)}`, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     return response.data.elements;
//   } catch (error) {
//     console.error("Error fetching data from Overpass API:", error.message);
//     return [];
//   }
// };

// // Fetch railway stations
// const fetchStations = async () => {
//   return await fetchDataFromOverpass(fetchRailwayStationsQuery);
// };

// // Fetch cities
// const fetchCities = async () => {
//   return await fetchDataFromOverpass(fetchCitiesQuery);
// };

// // Fetch thanas
// const fetchThanas = async () => {
//   return await fetchDataFromOverpass(fetchThanasQuery);
// };

// // Fetch villages
// const fetchVillages = async () => {
//   return await fetchDataFromOverpass(fetchVillagesQuery);
// };

// // Get stations with nearby details (city, thana, village)
// const getStationsWithDetails = async () => {
//   const stations = await fetchStations();
//   const cities = await fetchCities();
//   const thanas = await fetchThanas();
//   const villages = await fetchVillages();

//   return stations.map((station) => {
//     const nearestCity = geolib.findNearest(
//       { latitude: station.lat, longitude: station.lon },
//       cities.map((city) => ({
//         latitude: city.lat,
//         longitude: city.lon,
//         name: city.tags.name,
//       }))
//     );

//     const nearestThana = geolib.findNearest(
//       { latitude: station.lat, longitude: station.lon },
//       thanas.map((thana) => ({
//         latitude: thana.lat,
//         longitude: thana.lon,
//         name: thana.tags.name,
//       }))
//     );

//     const nearestVillage = geolib.findNearest(
//       { latitude: station.lat, longitude: station.lon },
//       villages.map((village) => ({
//         latitude: village.lat,
//         longitude: village.lon,
//         name: village.tags.name,
//       }))
//     );

//     return {
//       Lat: station.lat,
//       Lon: station.lon,
//       Station: station.tags.name,
//       District: nearestCity ? nearestCity.name : null,
//       Thana: nearestThana ? nearestThana.name : null,
//       Village: nearestVillage ? nearestVillage.name : null,
//     };
//   });
// };

// // Export functions for use in the package
// module.exports = {
//   fetchStations,
//   fetchCities,
//   fetchThanas,
//   fetchVillages,
//   getStationsWithDetails,
// };


const axios = require("axios");
const geolib = require("geolib");

// Overpass API URL
const overpassApiUrl = "http://overpass-api.de/api/interpreter";

// Function to generate queries for a specific country
const generateQuery = (type, isoCode) => {
  const queryMap = {
    railwayStations: `
      [out:json];
      area["ISO3166-1"="${isoCode}"][admin_level=2];
      node["railway"="station"](area);
      out body;
    `,
    cities: `
      [out:json];
      area["ISO3166-1"="${isoCode}"][admin_level=2];
      node["place"="city"](area);
      out body;
    `,
  };

  return queryMap[type];
};

// Function to fetch data from Overpass API
const fetchDataFromOverpass = async (query) => {
  try {
    const response = await axios.post(overpassApiUrl, `data=${encodeURIComponent(query)}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data.elements;
  } catch (error) {
    console.error("Error fetching data from Overpass API:", error.message);
    return [];
  }
};

// Fetch railway stations
const fetchStations = async (isoCode) => {
  const query = generateQuery("railwayStations", isoCode);
  return await fetchDataFromOverpass(query);
};

// Fetch cities
const fetchCities = async (isoCode) => {
  const query = generateQuery("cities", isoCode);
  return await fetchDataFromOverpass(query);
};

// Get stations with nearby city details
const getStationsWithDetails = async (isoCode) => {
  const stations = await fetchStations(isoCode);
  const cities = await fetchCities(isoCode);

  return stations.map((station) => {
    const nearestCity = geolib.findNearest(
      { latitude: station.lat, longitude: station.lon },
      cities.map((city) => ({
        latitude: city.lat,
        longitude: city.lon,
        name: city.tags.name,
      }))
    );

    return {
      Lat: station.lat,
      Lon: station.lon,
      Station: station.tags.name,
      City: nearestCity ? nearestCity.name : null,
    };
  });
};

// Export functions for use in the package
module.exports = {
  fetchStations,
  fetchCities,
  getStationsWithDetails,
};
