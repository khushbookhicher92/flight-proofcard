import React, { useEffect, useState } from "react";

const DEMO_DATE = "2026-11-15";

const INDIAN_AIRPORTS = [
  { city: "Delhi", name: "Indira Gandhi International Airport", code: "DEL" },
  { city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport", code: "BOM" },
  { city: "Bengaluru", name: "Kempegowda International Airport", code: "BLR" },
  { city: "Hyderabad", name: "Rajiv Gandhi International Airport", code: "HYD" },
  { city: "Chennai", name: "Chennai International Airport", code: "MAA" },
  { city: "Kolkata", name: "Netaji Subhas Chandra Bose International Airport", code: "CCU" },
  { city: "Pune", name: "Pune Airport", code: "PNQ" },
  { city: "Ahmedabad", name: "Sardar Vallabhbhai Patel International Airport", code: "AMD" },
  { city: "Jaipur", name: "Jaipur International Airport", code: "JAI" },
  { city: "Lucknow", name: "Chaudhary Charan Singh International Airport", code: "LKO" },
  { city: "Chandigarh", name: "Shaheed Bhagat Singh International Airport", code: "IXC" },
  { city: "Amritsar", name: "Sri Guru Ram Dass Jee International Airport", code: "ATQ" },
  { city: "Goa", name: "Manohar International Airport", code: "GOX" },
  { city: "Kochi", name: "Cochin International Airport", code: "COK" },
  { city: "Patna", name: "Jay Prakash Narayan Airport", code: "PAT" },
  { city: "Indore", name: "Devi Ahilya Bai Holkar Airport", code: "IDR" },
  { city: "Nagpur", name: "Dr. Babasaheb Ambedkar International Airport", code: "NAG" },
  { city: "Bhubaneswar", name: "Biju Patnaik International Airport", code: "BBI" },
  { city: "Guwahati", name: "Lokpriya Gopinath Bordoloi International Airport", code: "GAU" },
  { city: "Varanasi", name: "Lal Bahadur Shastri International Airport", code: "VNS" },
];

function durationInMinutes(duration) {
  const hours = Number(duration.match(/(\d+)h/)?.[1] || 0);
  const minutes = Number(duration.match(/(\d+)m/)?.[1] || 0);
  return hours * 60 + minutes;
}

function NewComponent(props) {
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [activeAirportField, setActiveAirportField] = useState("");

  const [date, setDate] = useState();
  const [flights, setFlights] = useState([]);
  const [searchedRoute, setSearchedRoute] = useState(null);
  const [sortBy, setSortBy] = useState("price");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props?.messageHandlers?.componentLoaded?.();
  }, []);

  function selectAirport(field, airport) {
    if (field === "from") {
      setFrom(airport.code);
      setFromSearch(`${airport.city} (${airport.code})`);
    } else {
      setTo(airport.code);
      setToSearch(`${airport.city} (${airport.code})`);
    }

    setActiveAirportField("");
    setError("");
  }

  function getSuggestions(search) {
    const query = search.trim().toLowerCase();

    if (!query) return INDIAN_AIRPORTS;

    return INDIAN_AIRPORTS.filter((airport) =>
      `${airport.city} ${airport.name} ${airport.code}`
        .toLowerCase()
        .includes(query)
    );
  }

  async function handleSearch(e) {
    e.preventDefault();

    setError("");
    setFlights([]);
    setSearchedRoute(null);
    setActiveAirportField("");

    // Ensure the user selected a valid airport from the list.
    const validFrom = INDIAN_AIRPORTS.find(
      (airport) => airport.code === from
    );

    const validTo = INDIAN_AIRPORTS.find(
      (airport) => airport.code === to
    );

    if (!validFrom || !validTo) {
      setError("Please select both airports from the suggestions.");
      return;
    }

    if (!date) {
      setError("Please select a travel date.");
      return;
    }

    if (from === to) {
      setError("Departure and destination must be different.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, date }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Flight search failed.");
      }

      const results = data.itineraries || [];

      const formatTime = (value) => {
        if (!value) return "N/A";

        const match = String(value).match(/T(\d{2}):(\d{2})/);

        if (!match) return "N/A";

        const hours = Number(match[1]);
        const minutes = match[2];
        const suffix = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;

        return `${String(displayHours).padStart(2, "0")}:${minutes} ${suffix}`;
      };

      const mappedFlights = results
        .map((item, index) => {
          const segments = item.outbound?.segments || [];
          const first = segments[0];
          const last = segments[segments.length - 1];
          const duration = Number(item.outbound?.duration_minutes || 0);
          const price = Number(item.price?.amount);

          return {
            id:
              item.ignav_id ||
              `${first?.flight_number || "flight"}-${index}`,

            airline:
              item.outbound?.carrier ||
              first?.operating_carrier_name ||
              "Airline unavailable",

            code:
              segments
                .map(
                  (segment) =>
                    `${segment.marketing_carrier_code || ""}${
                      segment.flight_number || ""
                    }`
                )
                .filter(Boolean)
                .join(" / ") || "Flight details unavailable",

            price: Number.isFinite(price) ? price : 0,
            currency: item.price?.currency || "INR",
            priceStatus: item.price?.status || "unknown",

            duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,

            stops:
              segments.length <= 1
                ? "Non-stop"
                : `${segments.length - 1} stop(s)`,

            departure: formatTime(first?.departure_time_local),
            arrival: formatTime(last?.arrival_time_local),

            baggage: "Check airline fare rules",

            feedback:
              item.price?.status === "verified"
                ? "Fare marked as verified by the provider. Confirm the final fare before booking."
                : "Confirm the final fare and baggage allowance with the provider.",
          };
        })
        .filter((flight) => flight.price > 0);

      if (mappedFlights.length === 0) {
        setError("No valid flight fares found for this route and date.");
        return;
      }

      setFlights(mappedFlights);
      setSearchedRoute({ from, to, date });
      setSortBy("price");
    } catch (err) {
      setError(
        err.message || "Could not fetch flights. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;

    if (sortBy === "duration") {
      return durationInMinutes(a.duration) - durationInMinutes(b.duration);
    }

    return 0;
  });

  const lowestFareId =
    sortedFlights.length > 0 ? sortedFlights[0].id : null;

  const fromAirport = INDIAN_AIRPORTS.find(
    (airport) => airport.code === searchedRoute?.from
  );

  const toAirport = INDIAN_AIRPORTS.find(
    (airport) => airport.code === searchedRoute?.to
  );

  function renderAirportField(field, label, search, setSearch) {
    const suggestions = getSuggestions(search);
    const isActive = activeAirportField === field;

    return (
      <div className="relative">
        <label className="mb-1 block text-sm font-medium">{label}</label>

        <input
          value={search}
          onFocus={() => setActiveAirportField(field)}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            setActiveAirportField(field);

            // Invalidate the old selection until a new airport is selected.
            if (field === "from") {
              setFrom("");
            } else {
              setTo("");
            }
          }}
          placeholder="Search city or airport"
          autoComplete="off"
          className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          required
        />

        {isActive && (
          <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {suggestions.length > 0 ? (
              suggestions.map((airport) => (
                <button
                  key={airport.code}
                  type="button"
                  className="block w-full border-b border-gray-100 p-3 text-left hover:bg-blue-50"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectAirport(field, airport)}
                >
                  <span className="block font-medium">
                    {airport.city} ({airport.code})
                  </span>
                  <span className="block text-xs text-gray-500">
                    {airport.name}
                  </span>
                </button>
              ))
            ) : (
              <p className="p-3 text-sm text-gray-500">
                No matching airport. Try another city.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-gray-50 p-5 font-sans text-gray-800">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">✈️ ProofCard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Compare flights and find the best value.
        </p>
      </header>

      <form
        onSubmit={handleSearch}
        className="space-y-4 rounded-lg border bg-white p-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderAirportField("from", "From", fromSearch, setFromSearch)}
          {renderAirportField("to", "To", toSearch, setToSearch)}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Travel Date
          </label>
          <input
            type="date"
            min={new Date().toLocaleDateString("en-CA")}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search Flights"}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {searchedRoute && flights.length > 0 && (
        <section className="mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">
                {fromAirport?.city || searchedRoute.from} →{" "}
                {toAirport?.city || searchedRoute.to}
              </h2>
              <p className="text-sm text-gray-500">
                {searchedRoute.date} · {flights.length} flights
              </p>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border border-gray-300 bg-white p-2 text-sm"
              aria-label="Sort flights"
            >
              <option value="price">Lowest fare</option>
              <option value="duration">Shortest duration</option>
            </select>
          </div>

          {sortedFlights.map((flight) => (
            <div
              key={flight.id}
              className="mb-4 rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold">{flight.airline}</h3>
                  <p className="text-sm text-gray-500">{flight.code}</p>
                </div>

                {flight.id === lowestFareId && (
                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                    LOWEST FARE
                  </span>
                )}
              </div>

              <div className="my-5 grid grid-cols-3 items-center gap-2">
                <div>
                  <p className="font-semibold">{flight.departure}</p>
                  <p className="text-sm text-gray-500">
                    {fromAirport?.code || searchedRoute.from}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">{flight.duration}</p>
                  <div className="my-2 border-t border-gray-300" />
                  <p className="text-xs text-gray-500">{flight.stops}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">{flight.arrival}</p>
                  <p className="text-sm text-gray-500">
                    {toAirport?.code || searchedRoute.to}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-3 border-t pt-3">
                <div>
                  <p className="text-xl font-bold">
                    {flight.currency === "INR"
                      ? "₹"
                      : `${flight.currency} `}
                    {flight.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-gray-500">
                    Fare per person · {flight.priceStatus}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-600">
                🧳 {flight.baggage}
              </p>

              <p className="mt-2 rounded bg-gray-50 p-3 text-sm text-gray-600">
                <strong>Fare information:</strong> {flight.feedback}
              </p>
            </div>
          ))}
        </section>
      )}

      {!searchedRoute && !error && (
        <div className="mt-6 rounded-lg border border-dashed bg-white p-8 text-center">
          <p className="text-lg font-semibold">
            Compare your flight options
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Enter a city or airport name, select a suggestion, and search for flights.
          </p>
        </div>
      )}
    </div>
  );
}

export default NewComponent;