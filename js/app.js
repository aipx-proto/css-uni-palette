// Main app initialization and coordination

// Initialize the app
document.addEventListener('DOMContentLoaded', async function () {
  loadAppState();
  loadVisualSettings();
  applyVisualSettings();
  generateAndInjectCSS();
  
  // Load the template first, then render the grid
  await loadGridTemplate();
  renderGrid();
  updateUIControls();
}); 