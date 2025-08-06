document.addEventListener('DOMContentLoaded', () => {
  // Utility functions
  function log(message) {
    const logElement = document.getElementById('log');
    const timestamp = new Date().toLocaleTimeString();
    logElement.innerHTML += `[${timestamp}] ${message}\n`;
    logElement.scrollTop = logElement.scrollHeight;
  }

  function clearLog() {
    document.getElementById('log').innerHTML = '';
  }

  // PDF printing function
  async function printPDF() {
    const pdfUrl = document.getElementById('pdfUrl').value;
    const pdfStatus = document.getElementById('pdfStatus');
    
    if (!pdfUrl) {
      pdfStatus.innerHTML = '<span class="error">Please enter a PDF URL</span>';
      log('Error: No PDF URL provided');
      return;
    }

    log(`Sending PDF print request: ${pdfUrl}`);
    pdfStatus.innerHTML = '<span>Sending print request...</span>';
    
    try {
      const response = await fetch('https://localhost:8080/print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: pdfUrl })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      pdfStatus.innerHTML = '<span class="success">PDF print request sent successfully</span>';
      log('PDF print request sent successfully');
      
      if (result.message) {
        log(`Server response: ${result.message}`);
      }
      
    } catch (error) {
      pdfStatus.innerHTML = `<span class="error">Error: ${error.message}</span>`;
      log(`PDF print error: ${error.message}`);
    }
  }

  // Make functions globally available
  window.printPDF = printPDF;
  window.clearLog = clearLog;

  // Initialize
  log('PDF Printer loaded and ready');
});
