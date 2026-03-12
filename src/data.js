const flightData = {
  flights: [
    {
      flightNumber: "BTS123",
      departure: "2026-06-01 10:00:00",
      arrival: "2026-06-01 12:00:00",
      from: "New York (JFK)",
      to: "Los Angeles (LAX)",
      duration: "5h 0m",
      airline: "Star Airlines"
    },
    {
      flightNumber: "BTS456",
      departure: "2026-06-10 15:30:00",
      arrival: "2026-06-10 17:45:00",
      from: "Los Angeles (LAX)",
      to: "San Francisco (SFO)",
      duration: "1h 15m",
      airline: "Star Airlines"
    }
  ],
  itinerary: {
    traveler: "John Doe",
    totalDuration: "6h 30m",
    totalStops: 1,
    details: [
      { leg: 1, from: "New York (JFK)", to: "Los Angeles (LAX)" },
      { leg: 2, from: "Los Angeles (LAX)", to: "San Francisco (SFO)" }
    ]
  }
};

export default flightData;