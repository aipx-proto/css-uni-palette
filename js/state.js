// App state management and localStorage operations

// Global app state
let appState = {};
let visualSettings = {};

// Load app state from localStorage or use default
function loadAppState() {
  try {
    const stored = localStorage.getItem('css-color-grid-state');
    if (stored) {
      appState = JSON.parse(stored);
    } else {
      appState = JSON.parse(JSON.stringify(palettePresets.tailwind));
    }
  } catch (error) {
    console.error('Failed to load app state:', error);
    appState = JSON.parse(JSON.stringify(palettePresets.tailwind));
  }
}

// Save app state to localStorage
function saveAppState() {
  try {
    localStorage.setItem('css-color-grid-state', JSON.stringify(appState));
  } catch (error) {
    console.error('Failed to save app state:', error);
  }
}

// Update app state and trigger CSS regeneration
function updateAppState(updates) {
  Object.assign(appState, updates);
  saveAppState();
  generateAndInjectCSS();
  updateUIControls();
}

// Load visual settings from localStorage or use default
function loadVisualSettings() {
  try {
    const stored = localStorage.getItem('css-color-grid-visual-settings');
    if (stored) {
      visualSettings = JSON.parse(stored);
    } else {
      visualSettings = {
        'show-labels': false,
        'space-cells': false,
        'show-as-text': false,
        'light-theme': false,
        'use-lch': false
      };
    }
  } catch (error) {
    console.error('Failed to load visual settings:', error);
    visualSettings = {
      'show-labels': false,
      'space-cells': false,
      'show-as-text': false,
      'light-theme': false,
      'use-lch': false
    };
  }
}

// Save visual settings to localStorage
function saveVisualSettings() {
  try {
    localStorage.setItem('css-color-grid-visual-settings', JSON.stringify(visualSettings));
  } catch (error) {
    console.error('Failed to save visual settings:', error);
  }
} 