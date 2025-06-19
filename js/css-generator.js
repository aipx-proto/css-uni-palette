// CSS generation logic and injection

// Generate CSS from app state
function generateCSSFromState() {
  const shadeKeys = Object.keys(appState.shades).filter(key => {
    const value = parseFloat(appState.shades[key]);
    return value !== 0 && value !== 100;
  }).sort((a, b) => parseFloat(appState.shades[a]) - parseFloat(appState.shades[b]));

  // Generate symmetric steps for chroma and hue adjustments
  function generateSymmetricSteps(count, min, max) {
    if (count === 1) return [0];
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const value = min + (max - min) * t;
      arr.push(Math.round(value * 10) / 10);
    }
    return arr;
  }

  const chromaX = generateSymmetricSteps(shadeKeys.length, -1, -1).map((v, i, arr) => {
    const mid = (arr.length - 1) / 2;
    if (arr.length % 2 === 1) {
      return i <= mid ? -1 + (i / mid) * (1) : 0 - ((i - mid) / mid) * (1);
    } else {
      return i < mid ? -1 + (i / mid) * (1) : 0 - ((i - mid) / mid) * (1);
    }
  }).map(v => Math.round(v * 100) / 100);

  const hueX = generateSymmetricSteps(shadeKeys.length, -1, 1).map(v => Math.round(v * 100) / 100);

  // Generate source CSS
  let sourceCSS = ":root {\n";

  // Lightness scale
  sourceCSS += "  /* lightness scale */\n";
  sourceCSS += "  --l-0: 100%;\n";
  Object.entries(appState.shades).forEach(([key, value]) => {
    sourceCSS += `  --l-${key}: ${value};\n`;
  });
  sourceCSS += "  --l-1000: 0%;\n";

  // Controls
  sourceCSS += "\n  /* hue torsion */\n";
  sourceCSS += `  --h-x: ${appState['hue-torsion']};\n`;
  sourceCSS += "\n  /* chroma reduction */\n";
  sourceCSS += `  --c-x: ${appState['chroma-reduction']};\n`;

  // Source colors
  sourceCSS += "\n  /* source colors */\n";
  Object.entries(appState.colors).forEach(([key, value]) => {
    sourceCSS += `  --${key}: ${value};\n`;
  });

  // Source grays
  if (Object.keys(appState.grays).length > 0) {
    sourceCSS += "\n  /* source grays */\n";
    Object.entries(appState.grays).forEach(([key, value]) => {
      sourceCSS += `  --${key}: ${value};\n`;
    });
  }

  sourceCSS += "}\n";

  // Generate color variations CSS
  let colorCSS = ":root {\n";

  const useLCH = visualSettings['use-lch'] || false;
  const lch = useLCH ? 'lch' : 'oklch';
  const chromaCoefficient = useLCH ? 1 : 500;

  // Color variations
  Object.keys(appState.colors).forEach(color => {
    shadeKeys.forEach((shade, index) => {
      colorCSS += `  --color-${color}-${shade}: ${lch}(from var(--${color}) var(--l-${shade}) calc((var(--c-x) * ${chromaX[index]} / ${chromaCoefficient}) + c) calc((var(--h-x) * ${hueX[index]}) + h));\n`;
    });
    colorCSS += `\n`
  });

  // Gray variations
  Object.keys(appState.grays).forEach(gray => {
    shadeKeys.forEach(shade => {
      colorCSS += `  --color-${gray}-${shade}: ${lch}(from var(--${gray}) var(--l-${shade}) c h);\n`;
    });
    colorCSS += `\n`
  });

  colorCSS += `  --color-white: ${lch}(100% 0 0);\n`;
  colorCSS += `  --color-black: ${lch}(0% 0 0);\n`;
  colorCSS += "}\n";

  return { sourceCSS, colorCSS };
}

// Inject generated CSS into the page
function generateAndInjectCSS() {
  const { sourceCSS, colorCSS } = generateCSSFromState();

  // Inject source CSS
  let sourceStyleElement = document.getElementById('source-colors');
  if (!sourceStyleElement) {
    sourceStyleElement = document.createElement('style');
    sourceStyleElement.id = 'source-colors';
    document.head.appendChild(sourceStyleElement);
  }
  sourceStyleElement.textContent = sourceCSS;

  // Inject generated color CSS
  let colorStyleElement = document.getElementById('generated-colors');
  if (!colorStyleElement) {
    colorStyleElement = document.createElement('style');
    colorStyleElement.id = 'generated-colors';
    document.head.appendChild(colorStyleElement);
  }
  colorStyleElement.textContent = colorCSS;
}

// Export functions for CSS generation
function generateCombinedCSS() {
  const { sourceCSS, colorCSS } = generateCSSFromState();
  return `${exportColophon}\n/* SOURCE COLORS - edit to update palette */\n${sourceCSS}\n\n/* GENERATED COLORS - no need to edit, derived from source colors */\n${colorCSS}`;
}

function generateRawCSS() {
  const shadeKeys = Object.keys(appState.shades).filter(key => {
    const value = parseFloat(appState.shades[key]);
    return value !== 0 && value !== 100;
  }).sort((a, b) => parseFloat(appState.shades[b]) - parseFloat(appState.shades[a]));

  const computedStyle = getComputedStyle(document.documentElement);
  let css = exportColophon;
  css += ":root {\n";

  function getCalculatedValue(varName) {
    // potentially slow because of the document.body.appendChild and getComputedStyle...
    const temp = document.createElement("div");
    temp.style.backgroundColor = varName;
    document.body.appendChild(temp);
    const calculatedValue = getComputedStyle(temp).backgroundColor;
    document.body.removeChild(temp);
    return calculatedValue;
  }

  // Get computed values for color variations
  [...Object.keys(appState.colors), ...Object.keys(appState.grays)].forEach(color => {
    shadeKeys.forEach(shade => {
      const varName = `--color-${color}-${shade}`;
      const computedValue = computedStyle.getPropertyValue(varName).trim();
      let calculatedValue = computedValue;
      if (computedValue) {
        calculatedValue = getCalculatedValue(computedValue);
        css += `  ${varName}: ${calculatedValue};\n`;
      }
    });
    css += "\n";
  });

  // Add white and black
  const whiteValue = computedStyle.getPropertyValue('--color-white').trim();
  const blackValue = computedStyle.getPropertyValue('--color-black').trim();
  if (whiteValue) css += `  --color-white: ${whiteValue};\n`;
  if (blackValue) css += `  --color-black: ${blackValue};\n`;

  css += "}\n";
  return css;
}

function generateJSONExport() {
  return `${exportColophon}\n${JSON.stringify(appState, null, 2)}`;
} 