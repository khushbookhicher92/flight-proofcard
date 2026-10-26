✈️ ProofCard — Flight Comparison
Compare flight fares, check travel durations, and find suitable flights for your journey.

ProofCard is a React-based flight comparison application that helps users explore available flights between Indian cities. It connects a React frontend to an Express backend, which fetches flight fare data from the Ignav API.

The project aims to make flight comparison simple by presenting important information such as ticket prices, airlines, departure and arrival times, and journey duration in one place.

✨ Features
Search Flights: Search for flights using departure airport, destination airport, and travel date.

Airport Autocomplete: Find airports using city names, airport names, or airport codes.

Live Flight Data: Fetch flight itineraries and fare information through the Ignav API.

Compare Fares: View available flight options and compare their prices.

Sort Results: Organize flight options by price or journey duration.

Flight Details: View airline information, flight timings, and travel duration.

Lowest Fare Highlight: Identify the lowest-priced option among the returned results.

Responsive Interface: Explore flight information through a clean, user-friendly interface.

Note: Available flights and fares depend on the API response. Prices may change and should be verified before booking.

🛠️ Tech Stack
Technology	Purpose
React	Building the user interface
JavaScript	Application logic and interactions
Vite	Frontend development and build tooling
Tailwind CSS	Styling the interface
Node.js	Running the backend
Express.js	Creating the flight search API
Ignav API	Retrieving flight fare information
dotenv	Managing environment variables
Git and GitHub	Version control and project hosting
📁 Project Structure
flight-proofcard/
│
├── src/
│   ├── frontend/
│   │   ├── NewComponent.jsx
│   │   └── index.jsx
│   │
│   └── sandbox/
│       ├── index.css
│       └── main.jsx
│
├── scripts/
│   └── validate-publish.js
│
├── .gitignore
├── .env                  # Local API key; not committed
├── .env.example          # Example environment configuration
├── index.html
├── package.json
├── package-lock.json
├── server.js              # Express backend
├── vite.config.js
└── README.md
🚀 Getting Started
Follow these steps to run the project locally.

1. Prerequisites
Make sure you have installed:

Node.js

npm, which is included with Node.js

An Ignav API key for live flight searches

2. Clone the Repository
git clone https://github.com/Mahi9391/Flight-proofcard.git
Move into the project directory:

cd Flight-proofcard
3. Install Dependencies
npm install
4. Configure Environment Variables
Create a .env file in the project root directory, alongside package.json and server.js.

Add your Ignav API key:

IGNAV_API_KEY=your_api_key_here
Replace your_api_key_here with your actual API key.

Security: Never commit your .env file or expose your API key in frontend code. The .env file is excluded from Git using .gitignore.

5. Start the Backend
Open a terminal in the project directory and run:

node server.js
The backend should start at:

http://localhost:3001
The frontend sends flight search requests to the backend, which communicates with the Ignav API.

6. Start the Frontend
Open a second terminal in the same project directory and run:

npm start
Open the local URL displayed in the terminal to access the application.

Keep both terminals running while using the application.

🔌 API Integration
ProofCard uses an Express backend to communicate with the Ignav flight fares API.

Backend endpoint

POST /api/flights
Request body

{
  "from": "DEL",
  "to": "BOM",
  "date": "2026-11-15"
}
Field	Description
from	Departure airport code
to	Destination airport code
date	Departure date in YYYY-MM-DD format
The backend validates the search inputs, securely uses the API key stored in the environment, and forwards the request to Ignav. The returned itineraries are then used by the frontend to display flight options.

The backend uses the following upstream endpoint:

https://ignav.com/api/fares/one-way
Actual results depend on API availability, route coverage, and the selected travel date.

🔒 Security
API credentials are stored in environment variables.

.env is excluded from version control.

The API key is used by the backend rather than being exposed directly in the browser.

An .env.example file can be shared with placeholder values to document the required configuration.

🔮 Future Improvements
Potential enhancements include:

Expanding airport coverage.

Adding filters for airlines, stops, and price ranges.

Improving loading, error, and empty-result states.

Adding more detailed flight comparisons.

Supporting additional travel preferences and search options.
