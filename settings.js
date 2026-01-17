// ==================== SETTINGS MANAGEMENT ====================

// Load settings from localStorage
function loadSettings() {
    const settings = {
        musicVolume: localStorage.getItem('musicVolume') || 70,
        crackleVolume: localStorage.getItem('crackleVolume') || 30,
        animationSpeed: localStorage.getItem('animationSpeed') || 'normal',
        showNotes: localStorage.getItem('showNotes') !== 'false',
        colorTheme: localStorage.getItem('colorTheme') || 'default'
    };
    return settings;
}

// Save settings to localStorage
function saveSettings(settings) {
    Object.keys(settings).forEach(key => {
        localStorage.setItem(key, settings[key]);
    });
}

// Initialize settings page
function init() {
    const settings = loadSettings();
    
    // Apply theme
    applyTheme(settings.colorTheme);
    
    // Set initial values
    document.getElementById('colorTheme').value = settings.colorTheme;
    document.getElementById('musicVolume').value = settings.musicVolume;
    document.getElementById('musicVolumeValue').textContent = settings.musicVolume + '%';
    document.getElementById('crackleVolume').value = settings.crackleVolume;
    document.getElementById('crackleVolumeValue').textContent = settings.crackleVolume + '%';
    document.getElementById('animationSpeed').value = settings.animationSpeed;
    document.getElementById('showNotes').checked = settings.showNotes;
    
    setupEventListeners();
}

// Apply color theme
function applyTheme(theme) {
    document.body.className = `theme-${theme}`;
}

// Setup event listeners
function setupEventListeners() {
    // Color theme
    const colorTheme = document.getElementById('colorTheme');
    colorTheme.addEventListener('change', (e) => {
        const theme = e.target.value;
        applyTheme(theme);
        localStorage.setItem('colorTheme', theme);
    });
    
    // Music volume
    const musicVolume = document.getElementById('musicVolume');
    musicVolume.addEventListener('input', (e) => {
        const value = e.target.value;
        document.getElementById('musicVolumeValue').textContent = value + '%';
        localStorage.setItem('musicVolume', value);
    });
    
    // Crackle volume
    const crackleVolume = document.getElementById('crackleVolume');
    crackleVolume.addEventListener('input', (e) => {
        const value = e.target.value;
        document.getElementById('crackleVolumeValue').textContent = value + '%';
        localStorage.setItem('crackleVolume', value);
    });
    
    // Animation speed
    const animationSpeed = document.getElementById('animationSpeed');
    animationSpeed.addEventListener('change', (e) => {
        localStorage.setItem('animationSpeed', e.target.value);
    });
    
    // Show notes
    const showNotes = document.getElementById('showNotes');
    showNotes.addEventListener('change', (e) => {
        localStorage.setItem('showNotes', e.target.checked);
    });
    
    // Clear collection
    const clearCollection = document.getElementById('clearCollection');
    clearCollection.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all records? This cannot be undone!')) {
            localStorage.removeItem('vinylRecords');
            alert('Collection cleared successfully!');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
