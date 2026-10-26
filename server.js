import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/flights", async (req, res) => {
  try {
    const { from, to, date } = req.body;

    if (!from || !to || !date) {
      return res.status(400).json({
        error: "Departure, destination and date are required.",
      });
    }

    if (!process.env.IGNAV_API_KEY) {
      return res.status(500).json({
        error: "IGNAV_API_KEY is missing from .env",
      });
    }

    const response = await fetch(
      "https://ignav.com/api/fares/one-way",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.IGNAV_API_KEY,
        },
        body: JSON.stringify({
          origin: from.trim().toUpperCase(),
          destination: to.trim().toUpperCase(),
          departure_date: date,
          market: "IN",
          adults: 1,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error || data.message || "Flight search failed.",
      });
    }

    return res.json(data);
  } catch (error) {
    console.error("Flight API error:", error.message);

    return res.status(500).json({
      error: "Could not fetch flights. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Flight backend running at http://localhost:${PORT}`);
});