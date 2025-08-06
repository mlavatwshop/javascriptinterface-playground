document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.querySelector('#app');
  
  // Configuration
  let jsInterfaceAvailable = false;

  // Main HTML content
  appElement.innerHTML = `
    <header>
      <nav>
        <h1>🖨️ Printer Control Panel</h1>
      </nav>
    </header>

    <article>
      <h2>🔍 Connection Status</h2>
      <div id="status">Checking JavaScript Interface...</div>
      <div id="jsinterface-section">
        <h3>📱 JavaScript Interface</h3>
        <div id="jsinterface-status">...</div>
      </div>
    </article>

    <article>
      <h2>🔌 Connection Management</h2>
      <div class="grid">
        <div>
          <h4>JavaScript Interface</h4>
          <button class="outline" onclick="connectPrinterJS()" id="connectBtnJS">Connect Printer</button>
          <button class="outline secondary" onclick="disconnectPrinterJS()" id="disconnectBtnJS">Disconnect Printer</button>
          <button class="outline" onclick="checkStatusJS()">Check Status</button>
        </div>
      </div>
    </article>

    <article>
      <h2>📄 Print Operations</h2>
      <div class="grid">
        <div>
          <label for="printText">Text to Print:</label>
          <textarea id="printText" placeholder="Enter text to print...">Hello from Printer Control Panel! This is a test print.</textarea>
          <div class="button-group">
            <button class="outline" onclick="printTextJS()">Print Text</button>
          </div>
        </div>
        
        <div>
          <label for="receiptData">Receipt Data (JSON):</label>
          <textarea id="receiptData" placeholder="Enter receipt data as JSON...">{
  "header": "Hesperide Boutique",
  "content": "Thank you for your purchase!\\n\\nItem 1: $10.00\\nItem 2: $15.00\\n--------------\\nTotal: $25.00",
  "footer": "Please come again!"
}</textarea>
          
          <div class="button-group">
            <button class="outline" onclick="printReceiptJS()">Print Receipt</button>
          </div>
        </div>
      </div>
    </article>

    <article>
      <h2>✂️ Paper Management</h2>
      <div class="button-group">
        <button class="outline" onclick="cutPaperJS()">Cut Paper</button>
      </div>
    </article>

    <article>
      <h2>📄 PDF Printing</h2>
      <div>
        <label for="pdfUrl">PDF URL:</label>
        <input type="url" id="pdfUrl" placeholder="Enter URL to PDF file..." value="http://192.168.142.14/other/androidapp/fac.pdf">
        <div class="button-group">
          <button class="outline" onclick="printPDFJS()">Print PDF</button>
        </div>
        <div id="pdfStatus" style="margin-top: 10px;"></div>
      </div>
    </article>

    <article>
      <h2>📋 Activity Log</h2>
      <button class="outline secondary" onclick="clearLog()">Clear Log</button>
      <pre id="log" style="padding: 15px;"></pre>
    </article>
  `;

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

  function updateStatus() {
    const statusElement = document.getElementById('status');
    const jsInterfaceStatus = document.getElementById('jsinterface-status');
    
    if (jsInterfaceAvailable) {
      statusElement.innerHTML = '<span class="success">JavaScript Interface available</span>';
      jsInterfaceStatus.innerHTML = '<span class="success">✅ Available</span>';
    } else {
      statusElement.innerHTML = '<span class="error">JavaScript Interface not available</span>';
      jsInterfaceStatus.innerHTML = '<span class="error">❌ Not available</span>';
    }
  }

  function checkPrinterManager() {
    const jsInterfaceStatus = document.getElementById('jsinterface-status');
    
    if (window.PrinterManager) {
      jsInterfaceStatus.innerHTML = '<span class="success">JavaScript Interface detected</span>';
      jsInterfaceAvailable = true;
      log('JavaScript Interface detected and ready');
    } else {
      jsInterfaceStatus.innerHTML = '<span class="error">JavaScript Interface not detected</span>';
      jsInterfaceAvailable = false;
      log('JavaScript Interface not detected');
    }
  }

  // JavaScript Interface API functions
  function checkStatusJS() {
    log('Checking printer status via JavaScript Interface...');
    
    try {
      if (window.PrinterManager && window.PrinterManager.getStatus) {
        const status = window.PrinterManager.getStatus();
        log(`Status via JS Interface: ${status}`);
      } else {
        log('No status method available in JavaScript Interface');
      }
    } catch (error) {
      log(`JS Interface status error: ${error.message}`);
    }
  }

  function connectPrinterJS() {
    log('Connecting to printer via JavaScript Interface...');
    
    try {
      if (window.PrinterManager && window.PrinterManager.connect) {
        const result = window.PrinterManager.connect();
        log('Printer connected via JavaScript Interface!');
      } else {
        log('No connect method available in JavaScript Interface');
      }
    } catch (error) {
      log(`JS Interface connection error: ${error.message}`);
    }
  }

  function disconnectPrinterJS() {
    log('Disconnecting printer via JavaScript Interface...');
    
    try {
      if (window.PrinterManager && window.PrinterManager.disconnect) {
        window.PrinterManager.disconnect();
        log('Printer disconnected via JavaScript Interface!');
      } else {
        log('No disconnect method available in JavaScript Interface');
      }
    } catch (error) {
      log(`JS Interface disconnection error: ${error.message}`);
    }
  }

  function printTextJS() {
    const printText = document.getElementById('printText').value;
    
    log('Printing text via JavaScript Interface...');
    
    try {
      if (window.PrinterManager && window.PrinterManager.printText) {
        window.PrinterManager.printText(printText);
        log('Text printed via JavaScript Interface!');
      } else {
        log('No printText method available in JavaScript Interface');
      }
    } catch (error) {
      log(`JS Interface text print error: ${error.message}`);
    }
  }

  function printReceiptJS() {
    const receiptData = document.getElementById('receiptData').value;
    
    log('Printing receipt via JavaScript Interface...');
    
    try {
      if (window.PrinterManager && window.PrinterManager.printReceipt) {
        window.PrinterManager.printReceipt(receiptData);
        log('Receipt printed via JavaScript Interface!');
      } else {
        log('No printReceipt method available in JavaScript Interface');
      }
    } catch (error) {
      log(`JS Interface receipt error: ${error.message}`);
    }
  }

  function cutPaperJS() {
    log('Cutting paper via JavaScript Interface...');
    
    try {
      if (window.PrinterManager && window.PrinterManager.cutPaper) {
        window.PrinterManager.cutPaper();
        log('Paper cut via JavaScript Interface!');
      } else {
        log('No cutPaper method available in JavaScript Interface');
      }
    } catch (error) {
      log(`JS Interface cut error: ${error.message}`);
    }
  }

  // PDF functions
  function printPDFJS() {
    const pdfUrl = document.getElementById('pdfUrl').value;
    const pdfStatus = document.getElementById('pdfStatus');
    
    if (!pdfUrl) {
      pdfStatus.innerHTML = '<span class="error">Please enter a PDF URL</span>';
      log('Error: No PDF URL provided');
      return;
    }

    log(`Sending PDF URL to JavaScript Interface: ${pdfUrl}`);
    pdfStatus.innerHTML = '<span>Sending PDF URL...</span>';
    
    try {
      if (window.PrinterManager && window.PrinterManager.printPDF) {
        window.PrinterManager.printPDF(pdfUrl);
        pdfStatus.innerHTML = '<span class="success">PDF URL sent to JavaScript Interface</span>';
        log('PDF URL sent to JavaScript Interface for printing!');
      } else if (window.PrinterManager && window.PrinterManager.printPDFFromURL) {
        window.PrinterManager.printPDFFromURL(pdfUrl);
        pdfStatus.innerHTML = '<span class="success">PDF URL sent to JavaScript Interface</span>';
        log('PDF URL sent to JavaScript Interface for printing!');
      } else {
        pdfStatus.innerHTML = '<span class="error">No PDF printing method available</span>';
        log('No printPDF or printPDFFromURL method available in JavaScript Interface');
      }
    } catch (error) {
      pdfStatus.innerHTML = `<span class="error">Error: ${error.message}</span>`;
      log(`JS Interface PDF print error: ${error.message}`);
    }
  }

  // Initialize
  function initialize() {
    log('Printer Control Panel loading...');
    
    // Check for JavaScript Interface
    checkPrinterManager();
    
    updateStatus();
    log('Initialization complete');
  }

  // Make functions globally available
  window.checkStatusJS = checkStatusJS;
  window.connectPrinterJS = connectPrinterJS;
  window.disconnectPrinterJS = disconnectPrinterJS;
  window.printTextJS = printTextJS;
  window.printReceiptJS = printReceiptJS;
  window.cutPaperJS = cutPaperJS;
  window.printPDFJS = printPDFJS;
  window.clearLog = clearLog;

  // Start initialization
  initialize();
});
