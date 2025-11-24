document.addEventListener('DOMContentLoaded', () => {
  // Ticket URLs configuration
  const baseUrl = window.location.href.endsWith('/') ? window.location.href : window.location.href + '/';
  const ticketUrls = {
    default: `${baseUrl}ticket.pdf`,
    'no-margin': `${baseUrl}ticket_alt.pdf`,
    custom: ''
  };

  // Initialize PDF URL input
  const pdfUrlInput = document.getElementById('pdfUrl');
  
  // Set default ticket on load
  if (pdfUrlInput) {
    pdfUrlInput.value = ticketUrls.default;
  }

  // Update PDF URL based on radio button selection
  function updatePdfUrl() {
    const selectedRadio = document.querySelector('input[name="ticketSelect"]:checked');
    if (!selectedRadio) return;
    
    const selectedTicket = selectedRadio.value;
    
    if (selectedTicket === 'custom') {
      pdfUrlInput.value = '';
      pdfUrlInput.readOnly = false;
      pdfUrlInput.focus();
    } else {
      pdfUrlInput.value = ticketUrls[selectedTicket];
      pdfUrlInput.readOnly = true;
    }
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
      pdfStatus.innerHTML = '<span class="error">Veuillez entrer une URL de PDF</span>';
      log('Erreur : Aucune URL de PDF fournie');
      return;
    }

    log(`Envoi de la demande d\'impression PDF : ${pdfUrl}`);
    pdfStatus.innerHTML = '<span>Envoi de la demande d\'impression...</span>';
    
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
      pdfStatus.innerHTML = '<span class="success">Demande d\'impression PDF envoyée avec succès</span>';
      log('Demande d\'impression PDF envoyée avec succès');
      
      if (result.message) {
        log(`Réponse du serveur : ${result.message}`);
      }
      
    } catch (error) {
      pdfStatus.innerHTML = `<span class="error">Erreur : ${error.message}</span>`;
      log(`Erreur d\'impression PDF : ${error.message}`);
    }
  }

  // Make functions globally available
  window.printPDF = printPDF;
  window.clearLog = clearLog;
  window.updatePdfUrl = updatePdfUrl;

  // Initialize
  log('Site web chargé et prêt.');
});
