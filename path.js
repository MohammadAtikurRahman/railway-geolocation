const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors()); // Enable CORS

const port = 2000;

// Endpoint to fetch all railway paths with stations in Bangladesh
app.get("/path", async (req, res) => {
  try {
    const overpassApiUrl = `https://overpass-api.de/api/interpreter`;

    // Overpass query to get railway lines and stations
    const query = `
      [out:json][timeout:180];
      area["ISO3166-1"="BD"][admin_level=2];
      (
        way["railway"~"^(rail|light_rail|tram|subway|narrow_gauge|preserved|funicular|monorail|miniature)$"](area);
        way["railway"~"^(spur|crossover|branch|main|highspeed|industrial|industrial_service|construction|proposed|disused|abandoned|razed)$"](area);
        way["bridge"](area);
        way["tunnel"](area);
        way["railway:ref"](area);
        node["railway"="station"](area);   // Adding stations
        node["railway"="halt"](area);      // Adding halts (smaller stations)
        relation["railway"](area);
      );
      out geom;
    `;

    // Make a POST request to the Overpass API with the query
    const response = await axios.post(overpassApiUrl, `data=${encodeURIComponent(query)}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Check if data was returned
    if (response.data && response.data.elements) {
      const paths = response.data.elements
        .map((element) => {
          if (element.type === "relation" && element.members) {
            return null; // Skipping relations for simplicity
          } else if (element.type === "way" && element.geometry) {
            return {
              id: element.id,
              type: element.tags.railway || "unknown",
              coordinates: element.geometry.map((point) => [point.lat, point.lon]),
            };
          } else if (element.type === "node" && element.tags.railway === "station") {
            return {
              id: element.id,
              type: "station",
              name: element.tags.name || "Unnamed Station",
              coordinates: [element.lat, element.lon],
            };
          } else if (element.type === "node" && element.tags.railway === "halt") {
            return {
              id: element.id,
              type: "halt",
              name: element.tags.name || "Unnamed Halt",
              coordinates: [element.lat, element.lon],
            };
          }
          return null;
        })
        .filter((path) => path !== null);

      // Send back the railway path data and station data
      res.status(200).json({
        success: true,
        message: "Railway paths and stations in Bangladesh retrieved successfully",
        data: paths,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No railway paths or stations found in Bangladesh",
      });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error fetching railway paths and stations:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching railway paths and stations for Bangladesh",
      error: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
