# Railway Geolocation

**Railway Geolocation** is a Node.js package for fetching and processing railway station data worldwide using the Overpass API. This package allows you to retrieve detailed station data, including nearby cities, with minimal setup and no external database required.

---

## Features

- **Global Railway Stations**: Retrieve railway station data for any country by specifying the ISO3166-1 country code.
- **City Geolocation**: Get nearby city details for each station.
- **Simple Integration**: Easily integrate with your Node.js projects.
- **No External Database**: Fetch data directly from the Overpass API without additional setup.
- **Flexible Usage**: Supports any country with Overpass API coverage.

---

## Compatibility and Supported Environments

### Supported Environments

| Operating System           |
|----------------------------|
| **Windows**                |
| **MacOS**                  |
| **Linux**                  |

### Not Supported Environments

| Operating System                    |
|-------------------------------------|
| **Cloud-based Environments** (e.g., CodeSandbox, Repl.it) |

---

## Installation

Install the package using npm:

```bash
npm install railway-geolocation

```
```js

const { getStationsWithDetails } = require("railway-geolocation");

(async () => {
  // Fetch railway station details for Bangladesh
  const bangladeshStations = await getStationsWithDetails("BD");
  console.log("Bangladesh Stations:", bangladeshStations);

  // Fetch railway station details for India
  const indiaStations = await getStationsWithDetails("IN");
  console.log("India Stations:", indiaStations);
})();



```


## Contributing

Contributions are welcome! If you find any issues or have feature requests, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the ISC License.

## Author

Developed by **Md. Atikur Rahman**.