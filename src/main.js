document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.querySelector('#app');
  
  // Configuration
  const SERVER_URL = 'http://localhost:8080'; // Change this to your device's IP address
  let isConnected = false;
  let jsInterfaceAvailable = false;
  let ajaxAvailable = false;

  // Main HTML content
  appElement.innerHTML = `
    <header>
      <nav>
        <h1>🖨️ Printer Control Panel</h1>
      </nav>
    </header>

    <article>
      <h2>🔍 Connection Status</h2>
      <div id="status">Checking connection methods...</div>
      <div id="status-details" class="grid">
        <div id="jsinterface-section">
          <h3>📱 JavaScript Interface</h3>
          <div id="jsinterface-status">...</div>
        </div>

        <div id="ajax-section">
          <h3>🌐 AJAX Server</h3>
          <div id="ajax-status">...</div>
        </div>
      </div>
    </article>

    <article>
      <h2>🔌 Connection Management</h2>
      <div class="grid">
        <div>
          <h4>JavaScript Interface</h4>
          <button class="outline" onclick="connectPrinterJS()" id="connectBtnJS">Connect Printer (JS)</button>
          <button class="outline secondary" onclick="disconnectPrinterJS()" id="disconnectBtnJS">Disconnect Printer (JS)</button>
          <button class="outline" onclick="checkStatusJS()">Check Status (JS)</button>
        </div>
        
        <div>
          <h4>AJAX Server</h4>
          <button class="outline" onclick="connectPrinterAJAX()" id="connectBtnAJAX">Connect Printer (AJAX)</button>
          <button class="outline secondary" onclick="disconnectPrinterAJAX()" id="disconnectBtnAJAX">Disconnect Printer (AJAX)</button>
          <button class="outline" onclick="checkStatusAJAX()">Check Status (AJAX)</button>
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
            <button class="outline" onclick="printTextJS()">Print Text (JS)</button>
            <button class="outline" onclick="printTextAJAX()">Print Text (AJAX)</button>
          </div>
        </div>
        
        <div>
          <label for="receiptHeader">Receipt Header:</label>
          <input type="text" id="receiptHeader" value="Hesperide Boutique" placeholder="Receipt header...">
          
          <label for="receiptContent">Receipt Content:</label>
          <textarea id="receiptContent" placeholder="Receipt content...">Thank you for your purchase!

Item 1: $10.00
Item 2: $15.00
--------------
Total: $25.00</textarea>
          
          <label for="receiptFooter">Receipt Footer:</label>
          <input type="text" id="receiptFooter" value="Please come again!" placeholder="Receipt footer...">
          
          <div class="button-group">
            <button class="outline" onclick="printReceiptJS()">Print Receipt (JS)</button>
            <button class="outline" onclick="printReceiptAJAX()">Print Receipt (AJAX)</button>
          </div>
        </div>
      </div>
    </article>

    <article>
      <h2>✂️ Paper Management</h2>
      <div class="button-group">
        <button class="outline" onclick="cutPaperJS()">Cut Paper (JS)</button>
        <button class="outline" onclick="cutPaperAJAX()">Cut Paper (AJAX)</button>
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
    const connectBtnJS = document.getElementById('connectBtnJS');
    const disconnectBtnJS = document.getElementById('disconnectBtnJS');
    const connectBtnAJAX = document.getElementById('connectBtnAJAX');
    const disconnectBtnAJAX = document.getElementById('disconnectBtnAJAX');
    
    let statusText = '';
    if (jsInterfaceAvailable && ajaxAvailable) {
      statusText = `<span class="success">Both JavaScript Interface and AJAX available</span>`;
    } else if (jsInterfaceAvailable) {
      statusText = `<span class="success">JavaScript Interface available</span>`;
    } else if (ajaxAvailable) {
      statusText = `<span class="success">AJAX server available</span>`;
    } else {
      statusText = `<span class="error">No connection method available</span>`;
    }
    
    statusElement.innerHTML = statusText;
    
    // Update button states based on availability
    connectBtnJS.disabled = !jsInterfaceAvailable;
    disconnectBtnJS.disabled = !jsInterfaceAvailable;
    connectBtnAJAX.disabled = !ajaxAvailable;
    disconnectBtnAJAX.disabled = !ajaxAvailable;
  }

  // JavaScript Interface functions
  function checkPrinterManager() {
    const jsinterfaceStatus = document.getElementById('jsinterface-status');
    
    if (typeof window.PrinterManager !== 'undefined') {
      jsinterfaceStatus.innerHTML = '<span class="success">JavaScript Interface detected!</span>';
      jsInterfaceAvailable = true;
      log('JavaScript Interface detected and ready');
      return true;
    } else {
      jsinterfaceStatus.innerHTML = '<span class="error">JavaScript Interface not detected</span>';
      log('JavaScript Interface not detected');
      return false;
    }
  }

  // AJAX functions
  async function makeRequest(endpoint, method = 'GET') {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      log(`AJAX Error: ${error.message}`);
      throw error;
    }
  }

  async function checkAJAXServer() {
    const ajaxStatus = document.getElementById('ajax-status');
    
    try {
      await makeRequest('/status');
      ajaxStatus.innerHTML = '<span class="success">AJAX server available</span>';
      ajaxAvailable = true;
      log('AJAX server detected and ready');
      return true;
    } catch (error) {
      ajaxStatus.innerHTML = '<span class="error">AJAX server not available</span>';
      log('AJAX server not available');
      return false;
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
    const text = document.getElementById('printText').value;
    if (!text.trim()) {
      log('Error: No text to print');
      return;
    }
    
    log(`Printing text via JavaScript Interface: "${text}"`);
    
    try {
      if (window.PrinterManager && window.PrinterManager.printText) {
        window.PrinterManager.printText(text);
        log('Text printed via JavaScript Interface!');
      } else {
        log('No printText method available in JavaScript Interface');
      }
    } catch (error) {
      log(`JS Interface print error: ${error.message}`);
    }
  }

  function printReceiptJS() {
    const header = document.getElementById('receiptHeader').value;
    const content = document.getElementById('receiptContent').value;
    const footer = document.getElementById('receiptFooter').value;
    
    log('Printing receipt via JavaScript Interface...');
    
    try {
      if (window.PrinterManager && window.PrinterManager.printReceipt) {
        window.PrinterManager.printReceipt(header, content, footer);
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

  // AJAX API functions
  async function checkStatusAJAX() {
    log('Checking printer status via AJAX...');
    
    try {
      const response = await makeRequest('/status');
      log(`AJAX Status: ${JSON.stringify(response)}`);
    } catch (error) {
      log(`AJAX status check failed: ${error.message}`);
    }
  }

  async function connectPrinterAJAX() {
    log('Connecting to printer via AJAX...');
    
    try {
      const response = await makeRequest('/connect');
      if (response.data.success) {
        log('Printer connected via AJAX!');
      } else {
        log(`AJAX connection failed: ${response.data.error}`);
      }
    } catch (error) {
      log(`AJAX connection error: ${error.message}`);
    }
  }

  async function disconnectPrinterAJAX() {
    log('Disconnecting printer via AJAX...');
    
    try {
      const response = await makeRequest('/disconnect');
      if (response.data.success) {
        log('Printer disconnected via AJAX!');
      } else {
        log(`AJAX disconnection failed: ${response.data.error}`);
      }
    } catch (error) {
      log(`AJAX disconnection error: ${error.message}`);
    }
  }

  async function printTextAJAX() {
    const text = document.getElementById('printText').value;
    if (!text.trim()) {
      log('Error: No text to print');
      return;
    }
    
    log(`Printing text via AJAX: "${text}"`);
    
    try {
      const response = await makeRequest('/print/text', 'POST');
      if (response.data.success) {
        log('Text printed via AJAX!');
      } else {
        log(`AJAX print failed: ${response.data.error}`);
      }
    } catch (error) {
      log(`AJAX print error: ${error.message}`);
    }
  }

  async function printReceiptAJAX() {
    const header = document.getElementById('receiptHeader').value;
    const content = document.getElementById('receiptContent').value;
    const footer = document.getElementById('receiptFooter').value;
    
    log('Printing receipt via AJAX...');
    
    try {
      const response = await makeRequest('/print/receipt', 'POST');
      if (response.data.success) {
        log('Receipt printed via AJAX!');
      } else {
        log(`AJAX receipt print failed: ${response.data.error}`);
      }
    } catch (error) {
      log(`AJAX receipt error: ${error.message}`);
    }
  }

  async function cutPaperAJAX() {
    log('Cutting paper via AJAX...');
    
    try {
      const response = await makeRequest('/cut', 'POST');
      if (response.data.success) {
        log('Paper cut via AJAX!');
      } else {
        log(`AJAX cut failed: ${response.data.error}`);
      }
    } catch (error) {
      log(`AJAX cut error: ${error.message}`);
    }
  }

  // Initialize
  async function initialize() {
    log('Printer Control Panel loading...');
    
    // Check for JavaScript Interface first
    checkPrinterManager();
    
    // Check for AJAX server
    await checkAJAXServer();
    
    updateStatus();
    log('Initialization complete');
    
    // Auto-check status every 10 seconds if AJAX is available
    if (ajaxAvailable) {
      setInterval(checkStatusAJAX, 10000);
    }
  }

  // Make functions globally available
  window.checkStatusJS = checkStatusJS;
  window.connectPrinterJS = connectPrinterJS;
  window.disconnectPrinterJS = disconnectPrinterJS;
  window.printTextJS = printTextJS;
  window.printReceiptJS = printReceiptJS;
  window.cutPaperJS = cutPaperJS;
  
  window.checkStatusAJAX = checkStatusAJAX;
  window.connectPrinterAJAX = connectPrinterAJAX;
  window.disconnectPrinterAJAX = disconnectPrinterAJAX;
  window.printTextAJAX = printTextAJAX;
  window.printReceiptAJAX = printReceiptAJAX;
  window.cutPaperAJAX = cutPaperAJAX;
  
  window.clearLog = clearLog;

  // Start initialization
  initialize();
});
