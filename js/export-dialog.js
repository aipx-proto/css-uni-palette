// Export dialog and clipboard operations

function updateExportFormat() {
  const selectedFormat = document.querySelector('input[name="export-format"]:checked').value;
  const exportOutput = document.getElementById('export-output');

  let content = '';
  switch (selectedFormat) {
    case 'css-calc':
      content = generateCombinedCSS();
      break;
    case 'css-raw':
      content = generateRawCSS();
      break;
    case 'json':
      content = generateJSONExport();
      break;
  }

  exportOutput.textContent = content;
}

function openExportDialog() {
  const dialog = document.getElementById('export-dialog');

  // Set default format and generate content
  document.querySelector('input[name="export-format"][value="css-calc"]').checked = true;
  updateExportFormat();

  dialog.showModal();
}

function closeExportDialog() {
  document.getElementById('export-dialog').close();
}

function copyExportToClipboard() {
  const exportOutput = document.getElementById('export-output');
  const content = exportOutput.textContent;

  if (navigator.clipboard && window.isSecureContext) {
    // Use the modern clipboard API
    navigator.clipboard.writeText(content).then(() => {
      // Provide visual feedback
      const copyBtn = document.querySelector('.copy-btn');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 1500);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      fallbackCopyTextToClipboard(content);
    });
  } else {
    // Fallback for older browsers
    fallbackCopyTextToClipboard(content);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      // Provide visual feedback
      const copyBtn = document.querySelector('.copy-btn');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 1500);
    }
  } catch (err) {
    console.error('Fallback: Could not copy text: ', err);
  }

  document.body.removeChild(textArea);
} 