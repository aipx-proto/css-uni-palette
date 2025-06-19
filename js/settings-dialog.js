// Settings dialog management

// Populate preset selector with available presets
function populatePresetSelector() {
  const selector = document.getElementById('preset-selector');

  // Clear existing options except the first one
  while (selector.children.length > 1) {
    selector.removeChild(selector.lastChild);
  }

  // Add options for each preset
  Object.keys(palettePresets).forEach(presetKey => {
    const option = document.createElement('option');
    option.value = presetKey;
    option.textContent = presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
    selector.appendChild(option);
  });
}

// Settings dialog functions
function openSettingsDialog() {
  const dialog = document.getElementById('settings-dialog');

  // Populate preset selector
  populatePresetSelector();

  // Populate visual settings checkboxes
  document.getElementById('visual-show-labels').checked = visualSettings['show-labels'];
  document.getElementById('visual-space-cells').checked = visualSettings['space-cells'];
  document.getElementById('visual-show-as-text').checked = visualSettings['show-as-text'];
  document.getElementById('visual-light-theme').checked = visualSettings['light-theme'];
  document.getElementById('visual-use-lch').checked = visualSettings['use-lch'];

  // Populate textareas with current state
  document.getElementById('settings-shades').value = JSON.stringify(appState.shades, null, 2);
  document.getElementById('settings-colors').value = JSON.stringify(appState.colors, null, 2);
  document.getElementById('settings-grays').value = JSON.stringify(appState.grays, null, 2);
  document.getElementById('settings-hue-torsion').value = appState['hue-torsion'];
  document.getElementById('settings-chroma-reduction').value = appState['chroma-reduction'];

  // Clear any error messages
  document.getElementById('settings-error').style.display = 'none';

  dialog.showModal();
}

function closeSettingsDialog() {
  document.getElementById('settings-dialog').close();
}

function applyPreset(presetName) {
  if (presetName && palettePresets[presetName]) {
    updateAppState(JSON.parse(JSON.stringify(palettePresets[presetName])));
    renderGrid();

    // Update settings dialog if it's open
    if (document.getElementById('settings-dialog').open) {
      openSettingsDialog();
    }
  }
}

function applySettings() {
  const errorDiv = document.getElementById('settings-error');

  try {
    const shades = JSON.parse(document.getElementById('settings-shades').value);
    const colors = JSON.parse(document.getElementById('settings-colors').value);
    const grays = JSON.parse(document.getElementById('settings-grays').value);
    const hueTorsion = parseInt(document.getElementById('settings-hue-torsion').value);
    const chromaReduction = parseInt(document.getElementById('settings-chroma-reduction').value);

    // Validation
    if (typeof shades !== 'object' || typeof colors !== 'object' || typeof grays !== 'object') {
      throw new Error('All JSON fields must be objects');
    }

    updateAppState({
      shades,
      colors,
      grays,
      'hue-torsion': hueTorsion,
      'chroma-reduction': chromaReduction
    });

    renderGrid();
    closeSettingsDialog();

  } catch (error) {
    errorDiv.textContent = `Error: ${error.message}`;
    errorDiv.style.display = 'block';
  }
}

function resetSettings() {
  updateAppState(JSON.parse(JSON.stringify(palettePresets.tailwind)));
  renderGrid();

  // Update settings dialog if it's open
  if (document.getElementById('settings-dialog').open) {
    openSettingsDialog();
  }
} 