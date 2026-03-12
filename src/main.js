// src/main.js

// Countdown Timer to May 12, 2026
function startCountdown(date) {
    const countdownElement = document.getElementById("countdown");
    const targetDate = new Date(date).getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = "EXPIRED";
        }
    }, 1000);
}

// Flight Map Visualization
function initializeFlightMap() {
    const flightRoutes = [
        { city: "JFK", lat: 40.6413, lng: -73.7781 },
        { city: "AUH", lat: 24.4264, lng: 54.6403 },
        { city: "CMB", lat: 6.2628, lng: 80.2162 },
        { city: "CGK", lat: -6.1256, lng: 106.6501 },
        { city: "DPS", lat: -8.7205, lng: 115.1672 },
        { city: "LBJ", lat: -8.5126, lng: 115.1330 }
    ];

    // Initialize map and animation logic here...
}

// Packing Manifest
const packingManifest = {
    items: [
        { name: "Monos Luggage", link: "https://www.monosluggage.com" },
        { name: "EPICKA Adapters", link: "https://www.epicka.com" },
        { name: "Reef-Safe Sunscreen", link: "https://www.example.com/reef-safe-sunscreen" }
    ]
};

// WhatsApp Button
function createWhatsAppButton() {
    const button = document.createElement('a');
    button.href = "https://wa.me/?text=I'm%20planning%20my%20trip!";
    button.innerText = "Chat on WhatsApp";
    button.target = "_blank";
    button.classList.add('whatsapp-button');
    document.body.appendChild(button);
}

// Itinerary Chapters
const itinerary = [
    { title: "The Pearl of the Indian Ocean in Sri Lanka", dates: "May 14-20, 2026" },
    { title: "The Cliffside Sanctuary in Uluwatu", dates: "May 20-22, 2026" },
    { title: "The Vessel in the Void in Komodo", dates: "May 22-24, 2026" },
    { title: "The Jungle Decontamination in Ubud", dates: "May 24-27, 2026" }
];

// Initial Setup
document.addEventListener("DOMContentLoaded", () => {
    startCountdown("2026-05-12T00:00:00Z");
    initializeFlightMap();
    createWhatsAppButton();

    console.log("Packing Manifest:", packingManifest);
    console.log("Itinerary:", itinerary);
});
