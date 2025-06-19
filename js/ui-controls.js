// Slider controls and input handlers

// Update UI controls to match app state
function updateUIControls() {
  // Update sliders
  const hueSlider = document.getElementById('hue-torsion');
  const chromaSlider = document.getElementById('chroma-reduction');
  const hueValue = document.getElementById('hue-value');
  const chromaValue = document.getElementById('chroma-value');

  if (hueSlider) {
    hueSlider.value = appState['hue-torsion'];
    hueValue.textContent = appState['hue-torsion'];
  }
  if (chromaSlider) {
    chromaSlider.value = appState['chroma-reduction'];
    chromaValue.textContent = appState['chroma-reduction'];
  }
}

// Slider event handlers
function updateHueTorsion(value) {
  updateAppState({ 'hue-torsion': parseInt(value) });
}

function updateChromaReduction(value) {
  updateAppState({ 'chroma-reduction': parseInt(value) });
} 