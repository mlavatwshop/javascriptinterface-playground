// Image Comparison functionality using img-comparison-slider library
export function initImageComparison() {
  const imageSelectRadios = document.querySelectorAll('input[name="imageSelect"]');
  const imageFormatRadios = document.querySelectorAll('input[name="imageFormat"]');
  const originalImage = document.getElementById('originalImage');
  const overlayImage = document.getElementById('overlayImage');

  // Check if all required elements exist
  if (!originalImage || !overlayImage) {
    console.error('Image comparison elements not found');
    return;
  }

  // Base path for images - account for vite base path
  function getImagePath(filename) {
    // In Vite, files in public folder are served from root
    // Account for base path from vite.config.js
    const base = import.meta.env.BASE_URL || '/javascriptinterface-playground/';
    // Remove trailing slash if present, then add filename
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${cleanBase}/${filename}`;
  }

  // Get current format
  function getCurrentFormat() {
    const selectedFormat = document.querySelector('input[name="imageFormat"]:checked');
    return selectedFormat ? selectedFormat.value : 'png';
  }

  // Get current image name
  function getCurrentImageName() {
    const selectedImage = document.querySelector('input[name="imageSelect"]:checked');
    return selectedImage ? selectedImage.value : '840';
  }

  // Update images
  function updateImages() {
    const format = getCurrentFormat();
    const imageName = getCurrentImageName();
    
    // Set original image to 840 (baseline)
    originalImage.src = getImagePath(`840.${format}`);
    
    // Set overlay image
    overlayImage.src = getImagePath(`${imageName}.${format}`);
  }

  // Handle format selection
  imageFormatRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      updateImages();
    });
  });

  // Handle image selection
  imageSelectRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      updateImages();
    });
  });

  // Initialize images
  updateImages();
}

