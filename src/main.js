import { initImageComparison } from './imageComparison.js';

document.addEventListener('DOMContentLoaded', () => {
  // Add default file path on load (full URL), stored in /public/ticket.pdf
  const defaultPdfUrl = `${window.location.href.endsWith('/') ? window.location.href : window.location.href + '/'}ticket.pdf`;
  const pdfUrlInput = document.getElementById('pdfUrl');
  if (pdfUrlInput) {
    pdfUrlInput.value = defaultPdfUrl;
  }

  // Utility functions
  function log(message) {
    const logElement = document.getElementById('log');
    if (logElement) {
      const timestamp = new Date().toLocaleTimeString();
      logElement.innerHTML += `[${timestamp}] ${message}\n`;
      logElement.scrollTop = logElement.scrollHeight;
    }
  }

  function clearLog() {
    const logElement = document.getElementById('log');
    if (logElement) {
      logElement.innerHTML = '';
    }
  }

  // PDF printing function
  async function printPDF(source = 'http://localhost:8080') {
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
      const response = await fetch(`${source}/print`, {
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

  // Routing functionality
  function navigate(path) {
    // Hide all routes
    const routes = document.querySelectorAll('.route');
    routes.forEach(route => {
      route.style.display = 'none';
    });

    // Show selected route
    if (path === '/compare') {
      const compareRoute = document.getElementById('route-compare');
      if (compareRoute) {
        compareRoute.style.display = 'block';
        // Initialize image comparison when route is shown
        setTimeout(() => {
          initImageComparison();
        }, 100);
      }
    } else {
      const pdfRoute = document.getElementById('route-pdf');
      if (pdfRoute) {
        pdfRoute.style.display = 'block';
      }
    }

    // Update URL hash
    window.location.hash = path;
  }

  // Handle initial route
  function handleRoute() {
    const hash = window.location.hash || '#/';
    const path = hash.substring(1) || '/';
    navigate(path);
  }

  // Listen for hash changes
  window.addEventListener('hashchange', handleRoute);

  // Make functions globally available
  window.printPDF = printPDF;
  window.clearLog = clearLog;
  window.navigate = navigate;

  // Initialize routing
  handleRoute();

  // Initialize
  log('Website loaded and ready.');
});
