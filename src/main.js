document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.querySelector('#app');
  
  // Main HTML content
  appElement.innerHTML = `
    <header>
      <nav>
        <h1>JavascriptInterface Detector</h1>
      </nav>
    </header>
    <article>
      <h2>Status</h2>
      <div id="status"></div>
    </article>
    <article id="properties-section">
      <h2>JavascriptInterface Properties</h2>
      <div id="properties">Checking for JavascriptInterface...</div>
    </article>
  `;

  // Function to check if JavascriptInterface exists and list its properties
  function checkJavascriptInterface() {
    const statusElement = document.getElementById('status');
    const propertiesElement = document.getElementById('properties');
    const propertiesSection = document.getElementById('properties-section');
    
    // Check if JavascriptInterface is defined
    if (typeof window.JavascriptInterface !== 'undefined') {
      statusElement.innerHTML = '<span class="success">JavascriptInterface detected!</span>';
      
      // Get all properties of the JavascriptInterface object
      const properties = [];
      for (const prop in window.JavascriptInterface) {
        const type = typeof window.JavascriptInterface[prop];
        properties.push({
          name: prop,
          type: type
        });
      }

      // Display the properties
      if (properties.length > 0) {
        const propertyList = properties.map(prop => {
          return `<div class="property">
            <span class="property-name">${prop.name}</span>
            <span class="property-type">${prop.type}</span>
          </div>`;
        }).join('');
        
        propertiesElement.innerHTML = `
          <div class="property-header">
            <span>Name</span>
            <span>Type</span>
          </div>
          ${propertyList}
        `;
      } else {
        propertiesElement.innerHTML = '<p>No properties found on JavascriptInterface object.</p>';
      }
    } else {
      statusElement.innerHTML = '<span class="error">JavascriptInterface not detected.</span>';
      propertiesSection.style.display = 'none'; // Hide properties section if not detected
    }
  }

  // Run the check when page loads
  checkJavascriptInterface();
});
