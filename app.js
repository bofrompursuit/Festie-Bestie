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

// Friend Finder Logic
const initialFriends = [
    { id: 1, name: "Sarah", status: "At the Main Stage", location: "Main Stage", x: 30, y: 40, battery: 78, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80" },
    { id: 2, name: "Mike", status: "Grabbing food", location: "Food Court", x: 70, y: 60, battery: 45, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80" },
    { id: 3, name: "Jess", status: "Chilling @ VIP", location: "VIP Text", x: 60, y: 20, battery: 92, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" }
];

let friends = JSON.parse(localStorage.getItem('friends')) || initialFriends;

// Render Friends on Map
function renderFriends() {
    const map = document.getElementById('festival-map');
    // Clear existing friend pins (keep meetup pin if any)
    const existingPins = map.querySelectorAll('.friend-pin');
    existingPins.forEach(p => p.remove());

    friends.forEach(friend => {
        const pin = document.createElement('div');
        pin.className = 'friend-pin';
        pin.style.left = friend.x + '%';
        pin.style.top = friend.y + '%';
        pin.setAttribute('data-name', friend.name);
        pin.onclick = () => showFriendDetails(friend);

        pin.innerHTML = `<img src="${friend.image}" alt="${friend.name}">`;
        map.appendChild(pin);
    });
}

// Show Friend Details
window.showFriendDetails = function (friend) {
    const modal = document.getElementById('friend-modal');
    document.getElementById('friend-img').src = friend.image;
    document.getElementById('friend-name').textContent = friend.name;
    document.getElementById('friend-status').textContent = `"${friend.status}"`;
    document.getElementById('friend-battery').textContent = friend.battery + '%';
    document.getElementById('friend-location').textContent = friend.location;

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

window.setMeetupPoint = function () {
    const map = document.getElementById('festival-map');

    // Remove existing meetup pin
    const existing = map.querySelector('.meetup-pin');
    if (existing) existing.remove();

    // Create new pin randomly for demo (or click listener in real app)
    const pin = document.createElement('div');
    pin.className = 'meetup-pin';
    pin.innerHTML = '📍';
    pin.style.top = (20 + Math.random() * 60) + '%';
    pin.style.left = (20 + Math.random() * 60) + '%';

    map.appendChild(pin);

    // Alert
    const toast = document.getElementById('notification-toast');
    toast.innerHTML = `📍 Meetup Point Set! Notifying Squad...`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Simulate Friend Movement
setInterval(() => {
    friends = friends.map(friend => {
        // Random walk
        let newX = friend.x + (Math.random() - 0.5) * 4;
        let newY = friend.y + (Math.random() - 0.5) * 4;

        // Bounds check (0-100)
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));

        return { ...friend, x: newX, y: newY };
    });

    // Save minimal updates to local storage? maybe not needed for mock
    // localStorage.setItem('friends', JSON.stringify(friends)); 

    renderFriends();
}, 2500);

// Init Render
renderFriends();

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.log('SW registration failed: ', err));
    });
}
