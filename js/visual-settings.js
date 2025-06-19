// Visual settings management and body class toggling

// Apply visual settings to body classes
function applyVisualSettings() {
  Object.entries(visualSettings).forEach(([setting, enabled]) => {
    const className = `APPSETTING-${setting}`;
    if (enabled) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
  });
}

// Toggle visual setting
function toggleVisualSetting(setting, enabled) {
  visualSettings[setting] = enabled;
  saveVisualSettings();

  // Special handling for 'use-lch' - it affects CSS generation, not body classes
  if (setting === 'use-lch') {
    generateAndInjectCSS();
  } else {
    applyVisualSettings();
  }
} 