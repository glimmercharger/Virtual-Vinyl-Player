// ==================== AUDIO ELEMENTS ====================
const musicPlayer = document.getElementById('musicPlayer');
const cracklePlayer = document.getElementById('cracklePlayer');

// ==================== DOM ELEMENTS ====================
const mp3Upload = document.getElementById('mp3Upload');
const albumArtUpload = document.getElementById('albumArtUpload');
const tonearm = document.getElementById('tonearm');
const record = document.querySelector('.record');
const songNameDisplay = document.getElementById('songName');
const playStatusDisplay = document.getElementById('playStatus');
const albumArt = document.getElementById('albumArt');

// ==================== STATE MANAGEMENT ====================
let isPlaying = false;
let currentSongName = '';
let currentSongFile = null;
let currentAlbumArt = null;
let savedRecords = [];

// ==================== INITIALIZATION ====================
function init() {
    loadSavedRecords();
    setupEventListeners();
    checkForLoadRequest();
    cracklePlayer.volume = 0.3; // Keep crackle at lower volume
    musicPlayer.volume = 0.7;
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // File upload handler
    mp3Upload.addEventListener('change', handleFileUpload);
    
    // Album art upload handler
    albumArtUpload.addEventListener('change', handleAlbumArtUpload);

    // Tonearm click handler
    tonearm.addEventListener('click', togglePlayback);

    // Prevent default audio context menu
    musicPlayer.addEventListener('contextmenu', (e) => e.preventDefault());
}

// ==================== FILE UPLOAD ====================
function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file is MP3
    if (!file.type.includes('audio')) {
        alert('Please upload an audio file');
        return;
    }

    // Create object URL for the file
    currentSongFile = URL.createObjectURL(file);
    currentSongName = file.name.replace('.mp3', '');

    // Set the music player source
    musicPlayer.src = currentSongFile;

    // Update display
    updateStatusDisplay();
    renderSaveButton();
}

// ==================== ALBUM ART UPLOAD ====================
function handleAlbumArtUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file is an image
    if (!file.type.includes('image')) {
        alert('Please upload an image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        currentAlbumArt = e.target.result;
        displayAlbumArt(currentAlbumArt);
    };

    reader.readAsDataURL(file);
}

// ==================== DISPLAY ALBUM ART ====================
function displayAlbumArt(artData) {
    albumArt.innerHTML = `<img src="${artData}" alt="Album Art">`;
}

function clearAlbumArt() {
    currentAlbumArt = null;
    albumArt.innerHTML = '<span class="album-placeholder">♪</span>';
}

// ==================== PLAYBACK CONTROL ====================
function togglePlayback() {
    if (!currentSongFile) {
        alert('Please upload an MP3 file first');
        return;
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
        play();
    } else {
        pause();
    }
}

function play() {
    // Animate tonearm
    tonearm.classList.add('playing');

    // Start crackle
    cracklePlayer.currentTime = 0;
    cracklePlayer.play().catch(() => {
        console.log('Crackle audio failed to load from URL');
    });

    // Start music
    musicPlayer.play();

    // Spin record
    record.classList.add('playing');

    // Animate musical notes
    animateNotes(true);

    // Update display
    playStatusDisplay.textContent = '🎵 Music is playing...';
}

function pause() {
    // Retract tonearm
    tonearm.classList.remove('playing');

    // Stop crackle
    cracklePlayer.pause();

    // Stop music
    musicPlayer.pause();

    // Stop record spin
    record.classList.remove('playing');

    // Stop musical notes animation
    animateNotes(false);

    // Reset music position
    musicPlayer.currentTime = 0;

    // Update display
    playStatusDisplay.textContent = '⏸ Paused - Ready to drop the needle';
}

function animateNotes(isPlaying) {
    const notes = [
        document.getElementById('noteLeft1'),
        document.getElementById('noteLeft2'),
        document.getElementById('noteRight1'),
        document.getElementById('noteRight2')
    ];

    notes.forEach(note => {
        if (isPlaying) {
            note.classList.add('playing');
        } else {
            note.classList.remove('playing');
        }
    });
}

// ==================== STATUS DISPLAY ====================
function updateStatusDisplay() {
    songNameDisplay.textContent = currentSongName || 'No song loaded';
    if (!isPlaying) {
        playStatusDisplay.textContent = 'Click the needle to start playing';
    }
}

// ==================== SAVED RECORDS - LOCAL STORAGE ====================
function loadSavedRecords() {
    const stored = localStorage.getItem('vinylRecords');
    savedRecords = stored ? JSON.parse(stored) : [];
}

function saveSavedRecords() {
    localStorage.setItem('vinylRecords', JSON.stringify(savedRecords));
}

function checkForLoadRequest() {
    const recordToLoad = sessionStorage.getItem('recordToLoad');
    if (recordToLoad) {
        sessionStorage.removeItem('recordToLoad');
        const record = savedRecords.find(r => r.id === parseInt(recordToLoad));
        if (record) {
            loadRecordFromCollection(record);
        }
    }
}

function loadRecordFromCollection(record) {
    currentSongFile = record.fileData;
    currentSongName = record.name;
    currentAlbumArt = record.albumArt || null;
    musicPlayer.src = currentSongFile;
    
    if (currentAlbumArt) {
        displayAlbumArt(currentAlbumArt);
    } else {
        clearAlbumArt();
    }
    
    updateStatusDisplay();

    // Clear file input
    mp3Upload.value = '';
    albumArtUpload.value = '';

    // Remove save button if visible
    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn) saveBtn.remove();
}

function saveCurrentRecord() {
    if (!currentSongFile || !currentSongName) {
        alert('Please load a song first');
        return;
    }

    // Check if record already exists
    const exists = savedRecords.some(r => r.name === currentSongName);
    if (exists) {
        alert('This record is already saved!');
        return;
    }

    // Read the file and convert to base64 for storage
    const fileInput = mp3Upload.files[0];
    if (!fileInput) {
        alert('Please upload the file again');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Data = e.target.result;

        const newRecord = {
            id: Date.now(),
            name: currentSongName,
            dateAdded: new Date().toLocaleDateString(),
            fileData: base64Data,
            albumArt: currentAlbumArt
        };

        savedRecords.push(newRecord);
        saveSavedRecords();
        alert(`🎵 "${currentSongName}" saved to your collection!`);
    };

    reader.readAsDataURL(fileInput);
}

function loadSavedRecord(recordId) {
    const record = savedRecords.find(r => r.id === recordId);
    if (!record) return;

    // Restore from base64
    const blobUrl = record.fileData;
    currentSongFile = blobUrl;
    currentSongName = record.name;

    musicPlayer.src = currentSongFile;
    updateStatusDisplay();

    // Clear file input
    mp3Upload.value = '';

    // Remove save button if visible
    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn) saveBtn.remove();
}

function deleteRecord(recordId) {
    if (confirm('Are you sure you want to delete this record?')) {
        savedRecords = savedRecords.filter(r => r.id !== recordId);
        saveSavedRecords();
    }
}

// ==================== RENDER FUNCTIONS ====================
function renderSaveButton() {
    // Remove existing save button if present
    const existingBtn = document.querySelector('.btn-save');
    if (existingBtn) existingBtn.remove();

    // Create and insert save button
    const saveContainer = document.createElement('div');
    saveContainer.className = 'save-button-container';

    const saveButton = document.createElement('button');
    saveButton.className = 'record-button btn-save';
    saveButton.textContent = '💾 Save Record';
    saveButton.onclick = saveCurrentRecord;

    saveContainer.appendChild(saveButton);
    document.querySelector('.controls').appendChild(saveContainer);
}

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', init);

// ==================== CLEANUP ====================
// Clean up object URLs when page unloads
window.addEventListener('beforeunload', () => {
    if (currentSongFile && currentSongFile.startsWith('blob:')) {
        URL.revokeObjectURL(currentSongFile);
    }
});
