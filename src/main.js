document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.querySelector('#app');
  
  // Configuration
  const SERVER_URL = 'http://localhost:8080'; // Change this to your device's IP address
  let isConnected = false;
  let connectionMode = 'unknown'; // 'jsinterface' or 'ajax'

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
      
      <div id="jsinterface-section" style="display: none;">
        <h3>📱 JavaScript Interface</h3>
        <div id="jsinterface-status"></div>
        <div id="jsinterface-properties"></div>
      </div>

      <div id="ajax-section" style="display: none;">
        <h3>🌐 AJAX Server</h3>
        <div id="ajax-status"></div>
      </div>
    </article>

    <article>
      <h2>🔌 Connection Management</h2>
      <button class="outline" onclick="connectPrinter()" id="connectBtn">Connect Printer</button>
      <button class="outline secondary" onclick="disconnectPrinter()" id="disconnectBtn">Disconnect Printer</button>
      <button class="outline" onclick="checkStatus()">Check Status</button>
    </article>

    <article>
      <h2>📄 Print Operations</h2>
      <div class="grid">
        <div>
          <label for="printText">Text to Print:</label>
          <textarea id="printText" placeholder="Enter text to print...">Hello from Printer Control Panel! This is a test print.</textarea>
          <button class="outline" onclick="printText()">Print Text</button>
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
          
          <button class="outline" onclick="printReceipt()">Print Receipt</button>
        </div>
      </div>
    </article>

    <article>
      <h2>✂️ Paper Management</h2>
      <button class="outline" onclick="cutPaper()">Cut Paper</button>
    </article>

    <article>
      <h2>📋 Activity Log</h2>
      <button class="outline secondary" onclick="clearLog()">Clear Log</button>
      <div id="log" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; margin: 20px 0; max-height: 300px; overflow-y: auto; font-family: monospace; font-size: 12px;"></div>
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
    const connectBtn = document.getElementById('connectBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    
    if (connectionMode === 'jsinterface') {
      statusElement.innerHTML = `<span class="success">Connected via JavaScript Interface</span>`;
    } else if (connectionMode === 'ajax') {
      statusElement.innerHTML = `<span class="success">Connected via AJAX (${isConnected ? 'Printer Connected' : 'Printer Disconnected'})</span>`;
    } else {
      statusElement.innerHTML = `<span class="error">No connection method available</span>`;
    }
    
    connectBtn.disabled = isConnected;
    disconnectBtn.disabled = !isConnected;
  }

  // JavaScript Interface functions
  function checkPrinterManager() {
    const jsinterfaceSection = document.getElementById('jsinterface-section');
    const jsinterfaceStatus = document.getElementById('jsinterface-status');
    const jsinterfaceProperties = document.getElementById('jsinterface-properties');
    
    if (typeof window.PrinterManager !== 'undefined') {
      jsinterfaceSection.style.display = 'block';
      jsinterfaceStatus.innerHTML = '<span class="success">JavaScript Interface detected!</span>';
      connectionMode = 'jsinterface';
      
      // Get all properties of the PrinterManager object
      const properties = [];
      for (const prop in window.PrinterManager) {
        const type = typeof window.PrinterManager[prop];
        properties.push({ name: prop, type: type });
      }

      if (properties.length > 0) {
        const propertyList = properties.map(prop => 
          `<div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee;">
            <span><strong>${prop.name}</strong></span>
            <span>${prop.type}</span>
          </div>`
        ).join('');
        
        jsinterfaceProperties.innerHTML = `
          <div style="margin-top: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 5px 0; font-weight: bold; border-bottom: 2px solid #007bff;">
              <span>Method Name</span>
              <span>Type</span>
            </div>
            ${propertyList}
          </div>
        `;
      } else {
        jsinterfaceProperties.innerHTML = '<p>No methods found on PrinterManager object.</p>';
      }
      
      log('JavaScript Interface detected and ready');
      return true;
    } else {
      jsinterfaceSection.style.display = 'none';
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
    const ajaxSection = document.getElementById('ajax-section');
    const ajaxStatus = document.getElementById('ajax-status');
    
    try {
      await makeRequest('/status');
      ajaxSection.style.display = 'block';
      ajaxStatus.innerHTML = '<span class="success">AJAX server available</span>';
      if (connectionMode === 'unknown') {
        connectionMode = 'ajax';
      }
      log('AJAX server detected and ready');
      return true;
    } catch (error) {
      ajaxSection.style.display = 'none';
      ajaxStatus.innerHTML = '<span class="error">AJAX server not available</span>';
      log('AJAX server not available');
      return false;
    }
  }

  // Unified API functions
  async function checkStatus() {
    log('Checking printer status...');
    
    if (connectionMode === 'jsinterface') {
      try {
        // Use JavaScript Interface if available
        if (window.PrinterManager && window.PrinterManager.getStatus) {
          const status = window.PrinterManager.getStatus();
          log(`Status via JS Interface: ${status}`);
        } else {
          log('No status method available in JavaScript Interface');
        }
      } catch (error) {
        log(`JS Interface status error: ${error.message}`);
      }
    } else if (connectionMode === 'ajax') {
      try {
        const response = await makeRequest('/status');
        isConnected = response.data.connected;
        updateStatus();
        log(`AJAX Status: Connected = ${isConnected}`);
      } catch (error) {
        log(`AJAX status check failed: ${error.message}`);
      }
    }
  }

  async function connectPrinter() {
    log('Connecting to printer...');
    
    if (connectionMode === 'jsinterface') {
      try {
        if (window.PrinterManager && window.PrinterManager.connect) {
          const result = window.PrinterManager.connect();
          isConnected = true;
          updateStatus();
          log('Printer connected via JavaScript Interface!');
        } else {
          log('No connect method available in JavaScript Interface');
        }
      } catch (error) {
        log(`JS Interface connection error: ${error.message}`);
      }
    } else if (connectionMode === 'ajax') {
      try {
        const response = await makeRequest('/connect');
        if (response.data.success) {
          isConnected = true;
          updateStatus();
          log('Printer connected via AJAX!');
        } else {
          log(`AJAX connection failed: ${response.data.error}`);
        }
      } catch (error) {
        log(`AJAX connection error: ${error.message}`);
      }
    }
  }

  async function disconnectPrinter() {
    log('Disconnecting printer...');
    
    if (connectionMode === 'jsinterface') {
      try {
        if (window.PrinterManager && window.PrinterManager.disconnect) {
          window.PrinterManager.disconnect();
          isConnected = false;
          updateStatus();
          log('Printer disconnected via JavaScript Interface!');
        } else {
          log('No disconnect method available in JavaScript Interface');
        }
      } catch (error) {
        log(`JS Interface disconnection error: ${error.message}`);
      }
    } else if (connectionMode === 'ajax') {
      try {
        const response = await makeRequest('/disconnect');
        if (response.data.success) {
          isConnected = false;
          updateStatus();
          log('Printer disconnected via AJAX!');
        } else {
          log(`AJAX disconnection failed: ${response.data.error}`);
        }
      } catch (error) {
        log(`AJAX disconnection error: ${error.message}`);
      }
    }
  }

  async function printText() {
    const text = document.getElementById('printText').value;
    if (!text.trim()) {
      log('Error: No text to print');
      return;
    }
    
    log(`Printing text: "${text}"`);
    
    if (connectionMode === 'jsinterface') {
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
    } else if (connectionMode === 'ajax') {
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
  }

  async function printReceipt() {
    const header = document.getElementById('receiptHeader').value;
    const content = document.getElementById('receiptContent').value;
    const footer = document.getElementById('receiptFooter').value;
    
    log('Printing receipt...');
    
    if (connectionMode === 'jsinterface') {
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
    } else if (connectionMode === 'ajax') {
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
  }

  async function cutPaper() {
    log('Cutting paper...');
    
    if (connectionMode === 'jsinterface') {
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
    } else if (connectionMode === 'ajax') {
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
  }

  // Initialize
  async function initialize() {
    log('Printer Control Panel loading...');
    
    // Check for JavaScript Interface first
    const jsInterfaceAvailable = checkPrinterManager();
    
    // Check for AJAX server
    const ajaxAvailable = await checkAJAXServer();
    
    // Determine connection mode
    if (jsInterfaceAvailable) {
      connectionMode = 'jsinterface';
      log('Using JavaScript Interface mode');
    } else if (ajaxAvailable) {
      connectionMode = 'ajax';
      log('Using AJAX mode');
    } else {
      connectionMode = 'unknown';
      log('No connection method available');
    }
    
    updateStatus();
    log('Initialization complete');
    
    // Auto-check status every 10 seconds if using AJAX
    if (connectionMode === 'ajax') {
      setInterval(checkStatus, 10000);
    }
  }

  // Make functions globally available
  window.checkStatus = checkStatus;
  window.connectPrinter = connectPrinter;
  window.disconnectPrinter = disconnectPrinter;
  window.printText = printText;
  window.printReceipt = printReceipt;
  window.cutPaper = cutPaper;
  window.clearLog = clearLog;

  // Start initialization
  initialize();
});
