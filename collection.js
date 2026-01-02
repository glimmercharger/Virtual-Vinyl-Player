// ==================== DOM ELEMENTS ====================
const collectionGrid = document.getElementById('collectionGrid');
const totalRecordsDisplay = document.getElementById('totalRecords');

// ==================== STATE ====================
let savedRecords = [];

// ==================== INITIALIZATION ====================
function init() {
    loadSavedRecords();
    renderCollection();
}

// ==================== LOAD RECORDS ====================
function loadSavedRecords() {
    const stored = localStorage.getItem('vinylRecords');
    savedRecords = stored ? JSON.parse(stored) : [];
}

// ==================== RENDER COLLECTION ====================
function renderCollection() {
    totalRecordsDisplay.textContent = savedRecords.length;

    if (savedRecords.length === 0) {
        collectionGrid.innerHTML = '<p class="empty-message">No records in your collection yet. Upload and save songs from the player!</p>';
        return;
    }

    // Sort records by date added (newest first)
    const sorted = [...savedRecords].reverse();

    collectionGrid.innerHTML = sorted
        .map(
            (record) => `
        <div class="collection-card">
            <div class="collection-card-art">
                <div class="album-art">
                    <span class="album-placeholder">♪</span>
                </div>
            </div>
            <div class="collection-card-info">
                <h3 class="collection-card-title">${escapeHtml(record.name)}</h3>
                <p class="collection-card-date">📅 ${record.dateAdded}</p>
                <div class="collection-card-actions">
                    <button class="record-button btn-load" onclick="loadAndPlay(${record.id})">▶ Play</button>
                    <button class="record-button btn-delete" onclick="deleteRecord(${record.id})">🗑 Delete</button>
                </div>
            </div>
        </div>
    `
        )
        .join('');
}

// ==================== RECORD ACTIONS ====================
function loadAndPlay(recordId) {
    const record = savedRecords.find(r => r.id === recordId);
    if (!record) return;

    // Store the record ID to load on the main page
    sessionStorage.setItem('recordToLoad', recordId);

    // Redirect to main player
    window.location.href = 'index.html';
}

function deleteRecord(recordId) {
    if (confirm('Are you sure you want to delete this record from your collection?')) {
        loadSavedRecords();
        savedRecords = savedRecords.filter(r => r.id !== recordId);
        localStorage.setItem('vinylRecords', JSON.stringify(savedRecords));
        renderCollection();
    }
}

// ==================== UTILITY ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', init);
