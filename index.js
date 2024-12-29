const {
    fetchStations,
    fetchCities,
    fetchThanas,
    fetchVillages,
    getStationsWithDetails,
  } = require("./station");
  
  // Export the core functionalities for use
  module.exports = {
    fetchStations, // Fetch railway stations
    fetchCities, // Fetch cities
    fetchThanas, // Fetch thanas
    fetchVillages, // Fetch villages
    getStationsWithDetails, // Fetch railway stations with nearby details (city, thana, village)
  };
  