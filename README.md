# ✈️ ProofCard — Flight Comparison

**Compare flight fares, explore travel options, and find suitable flights for your journey.**

ProofCard is a React-based flight comparison application that helps users search for flights between Indian cities and compare available itineraries. It provides a clean, responsive interface for viewing airline information, departure and arrival times, journey duration, stops, and ticket prices.

The application uses a React frontend and an Express.js backend to retrieve flight information from the Ignav API, keeping API credentials on the server rather than exposing them in the browser.

## ✨ Features

- **Flight Search:** Search for flights by departure airport, destination airport, and travel date.
- **Airport Search:** Enter airport codes or city names supported by the flight API.
- **Live Flight Data:** Retrieve flight itineraries and fare information through the backend.
- **Fare Comparison:** Compare ticket prices across available flight options.
- **Sorting:** Sort flights by price or journey duration.
- **Flight Details:** View airline names, flight numbers, departure and arrival times, stops, and duration when provided by the API.
- **Lowest Fare Highlight:** Highlight the lowest-priced flight among the returned results.
- **Responsive UI:** Use the application on mobile, tablet, and desktop screens.
- **Loading and Error Handling:** Provide feedback while searching and when requests fail.
- **Secure Configuration:** Keep API credentials in environment variables on the backend.

> **Note:** Flight availability and prices depend on the upstream API response. Prices may change and should be verified before booking. ProofCard does not itself issue tickets.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Building reusable UI components |
| JavaScript | Application logic and interactions |
| Vite | Frontend development and build tooling |
| Tailwind CSS | Responsive styling |
| Node.js | Backend runtime |
| Express.js | Backend API and request handling |
| Ignav API | Flight itinerary and fare data |
| dotenv | Loading environment variables |
| Git and GitHub | Version control and source hosting |

## 📁 Project Structure

```text
flight-proofcard/
├── src/
│   ├── frontend/
│   │   ├── NewComponent.jsx
│   │   ├── index.jsx
│   │   └── flightService.js
│   └── sandbox/
│       ├── index.css
│       └── main.jsx
├── scripts/
│   └── validate-publish.js
├── .gitignore
├── .env.example
├── index.html
├── package.json
├── package-lock.json
├── server.js
├── vite.config.js
└── README.md
```

*The structure above reflects the intended application layout. Adjust the tree if your actual files differ.*

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) — preferably a current LTS release
- npm
- An Ignav API key with access to the required flight endpoint

### 1. Clone the repository

```bash
git clone https://github.com/khushbookhicher92/flight-proofcard.git
cd flight-proofcard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root, alongside `package.json` and `server.js`.

Add your backend API key:

```dotenv
IGNAV_API_KEY=your_actual_api_key
```

If your frontend uses a configured backend URL, set the appropriate variable in the frontend environment as well. For example, if the frontend service reads `VITE_FLIGHTS_API_URL`:

```dotenv
VITE_FLIGHTS_API_URL=http://localhost:3001/api/flights
```

Use the variable names expected by your actual source code. Never put the Ignav secret key in a `VITE_*` variable because Vite exposes those variables to browser code.

Create `.env.example` with placeholder values only:

```dotenv
IGNAV_API_KEY=your_ignav_api_key_here
VITE_FLIGHTS_API_URL=http://localhost:3001/api/flights
```

Ensure `.env` is included in `.gitignore`.

### 4. Start the backend

Open a terminal in the project root:

```bash
node server.js
```

The backend is expected to run at:

```text
http://localhost:3001
```

Confirm the port configured in `server.js` if the startup address differs.

### 5. Start the frontend

Open a second terminal in the project root:

```bash
npm start
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

Keep both processes running while testing the application.

> If `npm start` is not configured in `package.json`, use the development script defined there, commonly `npm run dev`.

## 🔌 API Integration

ProofCard uses a backend endpoint to process flight searches and retrieve data from Ignav.

### Backend endpoint

```http
POST /api/flights
```

### Example request

```json
{
  "from": "DEL",
  "to": "BOM",
  "date": "2026-11-15"
}
```

| Field | Description |
|---|---|
| `from` | Departure airport code |
| `to` | Destination airport code |
| `date` | Departure date in `YYYY-MM-DD` format |

### Upstream API

```text
https://ignav.com/api/fares/one-way
```

The backend should validate incoming search parameters, use the API key stored in its environment, and forward requests to the upstream service according to its documented request format.

The frontend should communicate with your backend rather than calling the secret-key-protected upstream endpoint directly.

The exact request headers, upstream payload, and response mapping must follow the Ignav API documentation and your `server.js` implementation.

## 🔐 Security

- Keep API keys in the backend environment.
- Do not commit `.env` or other files containing credentials.
- Commit `.env.example` with placeholder values only.
- Validate and sanitize incoming search parameters on the backend.
- Avoid returning API credentials or sensitive upstream error details to the frontend.
- Configure CORS to allow only the origins required by your application in production.

## 🧪 Troubleshooting

**The frontend displays an HTML response instead of JSON**

Check that `VITE_FLIGHTS_API_URL` points to the backend API endpoint, not the Vite development server or a website homepage.

**The backend cannot access the upstream API**

Check that `IGNAV_API_KEY` is set correctly, the upstream endpoint is valid, and your account has the required API access.

**No flights are returned**

Verify the airport codes, travel date, upstream API availability, and the response format expected by your frontend service.

**Environment variable changes are not reflected**

Restart the relevant development server after editing `.
