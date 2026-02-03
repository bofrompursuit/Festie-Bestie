// Simulated Data
const initialArtists = [
    { id: 1, name: "The Strokes", genre: "Indie Rock", image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&q=80" },
    { id: 2, name: "SZA", genre: "R&B", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80" },
    { id: 3, name: "Kendrick Lamar", genre: "Hip Hop", image: "https://images.unsplash.com/photo-1621360841013-c768371e93cf?auto=format&fit=crop&q=80" },
    { id: 4, name: "Tame Impala", genre: "Psychedelic", image: "https://images.unsplash.com/photo-1514525253440-b39345208668?auto=format&fit=crop&q=80" },
    { id: 5, name: "Lizzo", genre: "Pop", image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80" }
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

// Render Favorites
function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    const favArtists = artists.filter(a => favorites.includes(a.id));
    grid.innerHTML = '';

    if (favArtists.length === 0) {
        grid.innerHTML = '<p style="color: #666; grid-column: 1/-1;">No favorites yet. Go pin some artists!</p>';
        return;
    }

    favArtists.forEach(artist => {
        const card = document.createElement('div');
        card.className = 'artist-card';
        card.innerHTML = `
             <div class="card-img-container">
                <img src="${artist.image}" alt="${artist.name}">
                <button class="pin-btn active" onclick="toggleFavorite(${artist.id})">❤️</button>
            </div>
            <div class="card-info">
                <div class="artist-name">${artist.name}</div>
                <div class="artist-meta">${artist.genre}</div>
            </div>
        `;
        grid.appendChild(card);
    });
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
window.addToCalendar = function () {
    // Generate a mock .ics file content or link
    const eventDetails = "Festie Bestie Plan\nCheck your app for details!";
    const mailToLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=My+Festival+Schedule&details=${encodeURIComponent(eventDetails)}`;
    window.open(mailToLink, '_blank');
}

window.sendNotification = function () {
    const toast = document.getElementById('notification-toast');
    toast.classList.add('show');

    // Simulate smart watch connect
    console.log("Connecting to SmartWatch...");

    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
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
