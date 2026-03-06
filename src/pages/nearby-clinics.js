// Nearby Clinics page - using Leaflet + OpenStreetMap
import { showToast } from '../components/toast.js';
import { renderNavbar, initNavbar } from '../components/navbar.js';

export function renderNearbyClinics() {
    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/nearby-clinics')}
      <main class="main-content">
        <div class="page-header">
          <h1>📍 Nearby Clinics & Hospitals</h1>
          <p>Find healthcare facilities near your location</p>
        </div>

        <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); flex-wrap: wrap;">
          <button class="btn btn-primary" id="find-clinics-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Find Nearby
          </button>
          <button class="btn btn-secondary search-type active" data-type="hospital">🏥 Hospitals</button>
          <button class="btn btn-secondary search-type" data-type="pharmacy">💊 Pharmacies</button>
          <button class="btn btn-secondary search-type" data-type="clinic">🩺 Clinics</button>
        </div>

        <div class="map-container" id="map-container">
          <div id="map" style="height: 100%; width: 100%;"></div>
        </div>

        <div id="clinics-list" style="margin-top: var(--space-lg);"></div>
      </main>
    </div>
  `;

    initNavbar();

    let map = null;
    let userLat = null;
    let userLng = null;
    let searchType = 'hospital';

    // Init map
    if (window.L) {
        map = L.map('map').setView([20.5937, 78.9629], 5); // India center
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
    }

    // Search type buttons
    document.querySelectorAll('.search-type').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.search-type').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            searchType = btn.dataset.type;
            if (userLat && userLng) searchNearby();
        });
    });

    // Find clinics
    document.getElementById('find-clinics-btn').addEventListener('click', () => {
        if (!navigator.geolocation) {
            showToast('Geolocation is not supported by your browser', 'error');
            return;
        }

        const btn = document.getElementById('find-clinics-btn');
        btn.disabled = true;
        btn.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span> Locating...';

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userLat = pos.coords.latitude;
                userLng = pos.coords.longitude;

                if (map) {
                    map.setView([userLat, userLng], 14);

                    // User marker
                    const userIcon = L.divIcon({
                        html: '<div style="width:16px;height:16px;background:var(--accent-secondary);border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(59,130,246,0.5);"></div>',
                        iconSize: [16, 16],
                        className: ''
                    });
                    L.marker([userLat, userLng], { icon: userIcon }).addTo(map).bindPopup('📍 You are here');
                }

                searchNearby();
                btn.disabled = false;
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Find Nearby';
            },
            (err) => {
                showToast('Could not get your location. Please allow location access.', 'error');
                btn.disabled = false;
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Find Nearby';
            },
            { enableHighAccuracy: true }
        );
    });

    async function searchNearby() {
        if (!userLat || !userLng) return;

        const listDiv = document.getElementById('clinics-list');
        listDiv.innerHTML = '<div style="text-align:center; padding: var(--space-lg); color: var(--text-muted);"><div class="typing-indicator" style="justify-content:center;"><span></span><span></span><span></span></div><p>Searching nearby facilities...</p></div>';

        try {
            const amenityType = searchType === 'hospital' ? 'hospital' : searchType === 'pharmacy' ? 'pharmacy' : 'clinic';
            const radius = 5000;
            const query = `[out:json][timeout:10];node["amenity"="${amenityType}"](around:${radius},${userLat},${userLng});out body;`;

            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: `data=${encodeURIComponent(query)}`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const data = await response.json();
            const places = data.elements || [];

            // Clear old markers (except user marker)
            if (map) {
                map.eachLayer(layer => {
                    if (layer instanceof L.Marker && !layer.getPopup()?.getContent()?.includes('You are here')) {
                        map.removeLayer(layer);
                    }
                });
            }

            if (places.length === 0) {
                listDiv.innerHTML = `
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <h3>No ${searchType}s found nearby</h3>
            <p>Try expanding your search or try a different category.</p>
          </div>
        `;
                return;
            }

            // Add markers and list
            const placesWithDist = places.map(p => ({
                ...p,
                name: p.tags?.name || `Unknown ${searchType}`,
                distance: getDistance(userLat, userLng, p.lat, p.lon)
            })).sort((a, b) => a.distance - b.distance).slice(0, 20);

            placesWithDist.forEach(p => {
                if (map) {
                    const icon = L.divIcon({
                        html: `<div style="width:12px;height:12px;background:var(--accent-danger);border:2px solid white;border-radius:50%;box-shadow:0 0 6px rgba(239,68,68,0.4);"></div>`,
                        iconSize: [12, 12],
                        className: ''
                    });
                    L.marker([p.lat, p.lon], { icon }).addTo(map)
                        .bindPopup(`<strong>${p.name}</strong><br>${p.tags?.['addr:street'] || ''}<br>${(p.distance / 1000).toFixed(1)} km away`);
                }
            });

            listDiv.innerHTML = `
        <h2 style="font-size: 1.1rem; margin-bottom: var(--space-md);">${placesWithDist.length} ${searchType}s found nearby</h2>
        <div class="appointment-list">
          ${placesWithDist.map(p => `
            <div class="appointment-card" style="cursor: pointer;" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}', '_blank')">
              <div class="appointment-date" style="background: rgba(var(--accent-danger-rgb), 0.12);">
                <span class="day" style="font-size: 0.9rem; color: var(--accent-danger);">${(p.distance / 1000).toFixed(1)}</span>
                <span class="month" style="color: var(--accent-danger);">km</span>
              </div>
              <div class="appointment-info">
                <h4>${p.name}</h4>
                <p>${p.tags?.['addr:street'] || ''} ${p.tags?.['addr:city'] || ''} ${p.tags?.phone ? '📞 ' + p.tags.phone : ''}</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          `).join('')}
        </div>
      `;

            showToast(`Found ${placesWithDist.length} ${searchType}s nearby!`, 'success');
        } catch (err) {
            listDiv.innerHTML = `<div class="card" style="border-left: 3px solid var(--accent-danger);"><p style="color: var(--accent-danger);">❌ Error searching: ${err.message}</p></div>`;
        }
    }
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
