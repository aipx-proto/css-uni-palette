// Grid rendering and template handling
let gridTemplate = null;

// Load and compile the Handlebars template
async function loadGridTemplate() {
  try {
    const response = await fetch('templates/grid-template.hbs');
    if (!response.ok) {
      throw new Error(`Failed to load template: ${response.status}`);
    }
    const templateSource = await response.text();
    gridTemplate = Handlebars.compile(templateSource);
    return gridTemplate;
  } catch (error) {
    console.error('Error loading grid template:', error);
    // Fallback: return a simple template function
    return () => '<div class="color-grid">Failed to load template</div>';
  }
}

// Render the grid based on app state
function renderGrid() {
  if (!gridTemplate) {
    console.error('Grid template not loaded yet');
    return;
  }

  const shadeKeys = Object.keys(appState.shades).filter(key => {
    const value = parseFloat(appState.shades[key]);
    return value !== 0 && value !== 100;
  }).sort((a, b) => parseFloat(appState.shades[b]) - parseFloat(appState.shades[a]));

  const data = {
    colors: Object.keys(appState.colors),
    grays: Object.keys(appState.grays),
    shades: shadeKeys
  };

  const html = gridTemplate(data);
  document.getElementById('color-grid-container').innerHTML = html;

  // Setup event listeners
  setTimeout(() => {
    setupColorInputs();
    setupLightnessInputs();
  }, 0);
}

// Setup color input event listeners
function setupColorInputs() {
  const colorInputs = document.querySelectorAll('.color-input');

  colorInputs.forEach(input => {
    const colorName = input.dataset.color;
    const colorValue = appState.colors[colorName] || appState.grays[colorName];
    if (colorValue) {
      input.value = colorValue;
    }

    input.addEventListener('input', function () {
      if (appState.colors[colorName] !== undefined) {
        updateAppState({ colors: { ...appState.colors, [colorName]: this.value } });
      } else if (appState.grays[colorName] !== undefined) {
        updateAppState({ grays: { ...appState.grays, [colorName]: this.value } });
      }
    });
  });
}

// Setup lightness input event listeners
function setupLightnessInputs() {
  const lightnessInputs = document.querySelectorAll('.lightness-input');

  lightnessInputs.forEach(input => {
    const shade = input.dataset.shade;
    if (appState.shades[shade]) {
      input.value = parseFloat(appState.shades[shade]);
    }

    input.addEventListener('input', function () {
      if (appState.shades[shade] !== undefined) {
        updateAppState({ shades: { ...appState.shades, [shade]: `${this.value}%` } });
      }
    });
  });
} 