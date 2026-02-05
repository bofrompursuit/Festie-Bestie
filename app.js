// Simulated Data
const initialArtists = [
    { id: 1, name: "The Strokes", genre: "Indie Rock", image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&q=80", timeStart: 2000, timeEnd: 2130 }, // 8:00 PM - 9:30 PM
    { id: 2, name: "SZA", genre: "R&B", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80", timeStart: 2100, timeEnd: 2230 }, // 9:00 PM - 10:30 PM (Overlap!)
    { id: 3, name: "Kendrick Lamar", genre: "Hip Hop", image: "https://images.unsplash.com/photo-1621360841013-c768371e93cf?auto=format&fit=crop&q=80", timeStart: 1800, timeEnd: 1900 },
    { id: 4, name: "Tame Impala", genre: "Psychedelic", image: "https://images.unsplash.com/photo-1514525253440-b39345208668?auto=format&fit=crop&q=80", timeStart: 1930, timeEnd: 2100 }, // Overlaps Strokes
    { id: 5, name: "Lizzo", genre: "Pop", image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80", timeStart: 1600, timeEnd: 1730 }
];

// State
let artists = JSON.parse(localStorage.getItem('artists')) || initialArtists;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderArtists(artists);
    renderFavorites();

    const searchInput = document.getElementById('search-bar');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = artists.filter(a => a.name.toLowerCase().includes(term));
            renderArtists(filtered);
        });
    }

    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
        fileInput.addEventListener('change', handleImageUpload);
    }
});

// Navigation
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Render Artist Grid
function renderArtists(list) {
    const grid = document.getElementById('artist-grid');
    grid.innerHTML = '';
    list.forEach(artist => {
        const isFav = favorites.includes(artist.id);
        const card = document.createElement('div');
        card.className = 'artist-card';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${artist.image}" alt="${artist.name}">
                <button class="pin-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${artist.id})">
                    ${isFav ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="card-info">
                <div class="artist-name">${artist.name}</div>
                <div class="artist-meta">${artist.genre}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Render Favorites & Check Conflicts
function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    const favArtists = artists.filter(a => favorites.includes(a.id));
    grid.innerHTML = '';

    // Check overlaps
    let conflicts = [];
    for (let i = 0; i < favArtists.length; i++) {
        for (let j = i + 1; j < favArtists.length; j++) {
            const a = favArtists[i];
            const b = favArtists[j];
            if (a.timeStart && b.timeStart && a.timeStart < b.timeEnd && b.timeStart < a.timeEnd) {
                conflicts.push([a, b]);
            }
        }
    }

    // Display Conflict Warning
    if (conflicts.length > 0) {
        const conflictDiv = document.createElement('div');
        conflictDiv.className = 'conflict-alert';
        conflictDiv.innerHTML = `
            <h3>⚠️ SCHEDULE CLASH DETECTED</h3>
            <p><strong>${conflicts[0][0].name}</strong> overlaps with <strong>${conflicts[0][1].name}</strong>.</p>
            <div class="split-suggestion">
                💡 <strong>Split Set Idea:</strong> Catch the first 30 mins of ${conflicts[0][0].name}, then run to ${conflicts[0][1].name}!
            </div>
        `;
        grid.appendChild(conflictDiv);
    }

    if (favArtists.length === 0) {
        grid.innerHTML = '<p style="color: #666; grid-column: 1/-1;">No favorites yet. Go pin some artists!</p>';
        return;
    }

    favArtists.forEach(artist => {
        const card = document.createElement('div'); // ... same card creation logic
        card.className = 'artist-card';
        card.innerHTML = `
             <div class="card-img-container">
                <img src="${artist.image}" alt="${artist.name}">
                <button class="pin-btn active" onclick="toggleFavorite(${artist.id})">❤️</button>
            </div>
            <div class="card-info">
                <div class="artist-name">${artist.name}</div>
                <div class="artist-meta">${formatTime(artist.timeStart)} - ${formatTime(artist.timeEnd)}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function formatTime(num) {
    if (!num) return 'TBA';
    let str = num.toString();
    // Simple mock formatting for 24h int like 2000 -> 8:00 PM
    let hour = Math.floor(num / 100);
    let min = num % 100;
    let ampm = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    return `${hour}:${min.toString().padStart(2, '0')} ${ampm}`;
}

// Toggle Favorite
window.toggleFavorite = function (id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderArtists(artists); // Re-render main list to update button state
    renderFavorites(); // Update favorites section
}

// Upload Handling
window.triggerUpload = function () {
    document.getElementById('image-upload').click();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const newArtist = {
            id: Date.now(),
            name: "Custom Artist", // In a real app, we'd ask for input
            genre: "Various",
            image: e.target.result
        };
        artists.unshift(newArtist); // Add to beginning
        localStorage.setItem('artists', JSON.stringify(artists));
        renderArtists(artists);
    };
    reader.readAsDataURL(file);
}

// Integrations
// Integrations
window.addToCalendar = function () {
    const favArtists = artists.filter(a => favorites.includes(a.id));
    if (favArtists.length === 0) {
        alert("Pin some artists first!");
        return;
    }

    const artistList = favArtists.map(a => `${a.name} (${formatTime(a.timeStart)} - ${formatTime(a.timeEnd)})`).join('\\n');
    const title = encodeURIComponent("My Festie Bestie Schedule");
    const details = encodeURIComponent("My Lineup:\\n" + artistList);
    const location = encodeURIComponent("Governors Ball, NYC");

    // Create a Google Calendar Event Link (Defaults to today)
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, '_blank');
}

window.sendNotification = function () {
    const toast = document.getElementById('notification-toast');

    // 1. Show In-App Toast
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);

    // 2. Request & Send Real Browser Notification
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("⌚ Festie Bestie Alert", {
                    body: "HEADLINER STARTING SOON! Get to the Main Stage.",
                    icon: "https://cdn-icons-png.flaticon.com/512/3075/3075908.png"
                });
            } else {
                console.log("Notification permission needed for real alerts.");
            }
        });
    }
}

// Smart Import Logic
window.triggerSmartScan = function () {
    document.getElementById('poster-upload').click();
}

// Handle File Selection (Poster)
window.handlePosterScan = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show Modal
    const modal = document.getElementById('scan-modal');
    const status = document.getElementById('scan-status');
    const details = document.getElementById('scan-details');

    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.add('active'));

    // Simulate Analysis Steps
    setTimeout(() => {
        status.textContent = "Detecting Text...";
        details.textContent = "Found 15 potential artist names...";
    }, 1500);

    setTimeout(() => {
        status.textContent = "Matching Genres...";
        details.textContent = "Categorizing into Indie, Rock, Pop...";
    }, 3000);

    setTimeout(() => {
        status.textContent = "Building Schedule...";
        details.textContent = " assigning time slots...";
    }, 4500);

    setTimeout(() => {
        completeImport(modal, "Poster");
    }, 6000);
}

window.triggerLinkImport = function () {
    const link = prompt("Paste the URL of the festival lineup or schedule:");
    if (link) {
        // Show Modal
        const modal = document.getElementById('scan-modal');
        const status = document.getElementById('scan-status');
        const details = document.getElementById('scan-details');

        modal.classList.remove('hidden');
        requestAnimationFrame(() => modal.classList.add('active'));

        status.textContent = "Scraping Website...";
        details.textContent = "Accessing " + link;

        // Simulate Analysis Steps
        setTimeout(() => {
            status.textContent = "Extracting Data...";
            details.textContent = "Found table data...";
        }, 2000);

        setTimeout(() => {
            completeImport(modal, "Link");
        }, 4000);
    }
}

function completeImport(modal, source) {
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 300);

    // Initial Simulated Imported Artists
    const newArtists = [
        { id: Date.now() + 1, name: "Neon Dreams", genre: "Synth Pop", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80" },
        { id: Date.now() + 2, name: "The Midnight Echo", genre: "Alternative", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&q=80" },
        { id: Date.now() + 3, name: "Electric Youth", genre: "Electronic", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80" }
    ];

    // Prepend to list
    artists = [...newArtists, ...artists];
    localStorage.setItem('artists', JSON.stringify(artists));
    renderArtists(artists);

    // Show Success Toast
    const toast = document.getElementById('notification-toast');
    toast.innerHTML = `✅ ${source} Analyzed! Added ${newArtists.length} new artists.`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Friend Finder Logic (Google Maps Integration)
let map;
let friendMarkers = {};
let meetupMarker = null;

// Initial Data with Real Coordinates (Randalls Island / Gov Ball context)
// Base coords: 40.796944, -73.922114 (Approx Randalls Island)
const initialFriends = [
    { id: 1, name: "Sarah", status: "At the Main Stage", location: "Main Stage", lat: 40.7960, lng: -73.9220, battery: 78, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80" },
    { id: 2, name: "Mike", status: "Grabbing food", location: "Food Court", lat: 40.7975, lng: -73.9240, battery: 45, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80" },
    { id: 3, name: "Jess", status: "Chilling @ VIP", location: "VIP Tent", lat: 40.7965, lng: -73.9210, battery: 92, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" }
];

let friends = JSON.parse(localStorage.getItem('friends')) || initialFriends;

// Init Google Map
window.initMap = async function () {
    const mapOptions = {
        center: { lat: 40.7968, lng: -73.9225 }, // Randalls Island
        zoom: 16,
        mapId: '8e0a97af9386f1e5', // Required for AdvancedMarkerElement
        disableDefaultUI: false,
        styles: [ // Dark Mode Style
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
            },
        ]
    };

    map = new google.maps.Map(document.getElementById("festival-map"), mapOptions);

    // Load marker library once
    try {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        window.AdvancedMarkerElement = AdvancedMarkerElement;
    } catch (e) {
        console.error("Failed to load Google Maps marker library:", e);
    }

    renderFriends();

    // Start Simulation
    setInterval(simulateMovement, 3000);
}

// Render Friends as Markers
async function renderFriends() {
    if (!map || !window.AdvancedMarkerElement) return;

    friends.forEach(friend => {
        // If marker exists, update position
        if (friendMarkers[friend.id]) {
            friendMarkers[friend.id].position = { lat: friend.lat, lng: friend.lng };
        } else {
            // Create Custom HTML element matching original design
            const pin = document.createElement('div');
            pin.className = 'friend-pin';
            pin.setAttribute('data-name', friend.name);
            pin.innerHTML = `<img src="${friend.image}" alt="${friend.name}">`;

            const marker = new window.AdvancedMarkerElement({
                map: map,
                position: { lat: friend.lat, lng: friend.lng },
                title: friend.name,
                content: pin,
            });

            // Add click listener
            marker.addListener("click", () => {
                showFriendDetails(friend);
            });

            friendMarkers[friend.id] = marker;
        }
    });
}

// Show Friend Details
window.showFriendDetails = function (friend) {
    const modal = document.getElementById('friend-modal');
    document.getElementById('friend-img').src = friend.image;
    document.getElementById('friend-name').textContent = friend.name;
    document.getElementById('friend-status').textContent = `"${friend.status}"`;
    document.getElementById('friend-battery').textContent = friend.battery + '%';
    document.getElementById('friend-location').textContent = friend.location || 'Unknown'; // Use stored text location or reverse geocode later

    modal.classList.remove('hidden');
    modal.classList.add('active');
}

window.closeFriendModal = function () {
    const modal = document.getElementById('friend-modal');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

window.pingFriend = function () {
    const name = document.getElementById('friend-name').textContent;
    alert(`👋 Pinged ${name}! They'll get a nudge.`);
    closeFriendModal();
}

window.setMeetupPoint = async function () {
    if (!map) return;

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Get center of map
    const center = map.getCenter();

    // Remove existing
    if (meetupMarker) meetupMarker.map = null;

    // Create original style meetup pin
    const pin = document.createElement('div');
    pin.className = 'meetup-pin';
    pin.innerHTML = '📍';

    meetupMarker = new AdvancedMarkerElement({
        position: center,
        map: map,
        title: "Meetup Point",
        content: pin,
    });

    // Alert
    const toast = document.getElementById('notification-toast');
    toast.innerHTML = `📍 Meetup Point Set at Map Center! Notifying Squad...`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Simulate Friend Movement
function simulateMovement() {
    friends = friends.map(friend => {
        // Small random lat/lng delta
        const deltaLat = (Math.random() - 0.5) * 0.0005;
        const deltaLng = (Math.random() - 0.5) * 0.0005;

        return { ...friend, lat: friend.lat + deltaLat, lng: friend.lng + deltaLng };
    });

    renderFriends();
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.log('SW registration failed: ', err));
    });
}

// Chat Widget Logic
let isChatOpen = false;

window.toggleChat = function () {
    const widget = document.getElementById('chat-widget');
    const icon = widget.querySelector('.toggle-icon');
    isChatOpen = !isChatOpen;

    if (isChatOpen) {
        widget.classList.remove('collapsed');
        icon.textContent = '▼';
        // Auto scroll to bottom
        const body = document.getElementById('chat-messages');
        body.scrollTop = body.scrollHeight;
    } else {
        widget.classList.add('collapsed');
        icon.textContent = '▲';
    }
}

window.handleChatKey = function (e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
}

window.sendChatMessage = function () {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    // Add User Message
    addMessage('You', text, 'sent');
    input.value = '';

    // Scroll
    const body = document.getElementById('chat-messages');
    body.scrollTop = body.scrollHeight;

    // Simulate Reply
    setTimeout(() => {
        const randomFriend = friends[Math.floor(Math.random() * friends.length)];
        const responses = [
            "Omg yes! ⚡️",
            "On my way! 🏃‍♀️",
            "Meet at the left speaker?",
            "Wait for me!!",
            "This set is gonna be INSANE 🔥"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomFriend.name, randomResponse, 'received');
    }, 2000 + Math.random() * 2000);
}

function addMessage(sender, text, type) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `
        <span class="sender">${sender}</span>
        <p>${text}</p>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Watch Notification Logic
window.sendNotification = function () {
    // 1. Show In-App Toast
    const toast = document.getElementById('notification-toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);

    // 2. Show Visual Watch Demo Overlay
    const watchOverlay = document.getElementById('watch-overlay');
    watchOverlay.classList.remove('hidden');
    // Force reflow
    void watchOverlay.offsetWidth;
    watchOverlay.classList.add('active');

    // 3. Request & Send Real Browser Notification
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("⌚ FESTIE BESTIE", {
                    body: "HEADLINER STARTING: The Strokes in 15 mins!",
                    icon: "https://cdn-icons-png.flaticon.com/512/3075/3075908.png",
                    silent: false
                });
            }
        });
    }
}

window.closeWatchDemo = function () {
    const watchOverlay = document.getElementById('watch-overlay');
    watchOverlay.classList.remove('active');
    setTimeout(() => watchOverlay.classList.add('hidden'), 500);
}
