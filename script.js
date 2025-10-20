// Initialize AOS
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });

        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const uploadArea = document.getElementById('uploadArea');
            const fileInput = document.getElementById('fileInput');
            const uploadBtn = document.getElementById('uploadBtn');
            const originalPreview = document.getElementById('originalPreview');
            const enhancedPreview = document.getElementById('enhancedPreview');
            const enhanceBtn = document.getElementById('enhanceBtn');
            const downloadBtn = document.getElementById('downloadBtn');
            const resetBtn = document.getElementById('resetBtn');
            const shareBtn = document.getElementById('shareBtn');
            const compareBtn = document.getElementById('compareBtn');
            const closeCompare = document.getElementById('closeCompare');
            const compareOverlay = document.getElementById('compareOverlay');
            const compareOriginal = document.getElementById('compareOriginal');
            const compareEnhanced = document.getElementById('compareEnhanced');
            const qualityValue = document.getElementById('qualityValue');
            const resolutionValue = document.getElementById('resolutionValue');
            const fileSizeValue = document.getElementById('fileSizeValue');
            const enhancementTime = document.getElementById('enhancementTime');
            
            // Sliders
            const sharpnessSlider = document.getElementById('sharpness');
            const brightnessSlider = document.getElementById('brightness');
            const contrastSlider = document.getElementById('contrast');
            const saturationSlider = document.getElementById('saturation');
            const noiseSlider = document.getElementById('noise');
            const upscaleSlider = document.getElementById('upscale');
            
            // Value displays
            const sharpnessValue = document.getElementById('sharpnessValue');
            const brightnessValue = document.getElementById('brightnessValue');
            const contrastValue = document.getElementById('contrastValue');
            const saturationValue = document.getElementById('saturationValue');
            const noiseValue = document.getElementById('noiseValue');
            const upscaleValue = document.getElementById('upscaleValue');
            
            // Preset buttons
            const presetButtons = document.querySelectorAll('.preset-btn');
            
            let originalImage = null;
            let enhancedImageUrl = null;
            let originalFileSize = 0;
            let startTime = 0;
            
            // Event Listeners
            uploadBtn.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('click', () => fileInput.click());
            
            // Drag and drop functionality
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('active');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('active');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('active');
                if (e.dataTransfer.files.length) {
                    handleImageUpload(e.dataTransfer.files[0]);
                }
            });
            
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length) {
                    handleImageUpload(fileInput.files[0]);
                }
            });
            
            // Update slider value displays
            sharpnessSlider.addEventListener('input', () => {
                sharpnessValue.textContent = `${sharpnessSlider.value}%`;
            });
            
            brightnessSlider.addEventListener('input', () => {
                brightnessValue.textContent = `${brightnessSlider.value}%`;
            });
            
            contrastSlider.addEventListener('input', () => {
                contrastValue.textContent = `${contrastSlider.value}%`;
            });
            
            saturationSlider.addEventListener('input', () => {
                saturationValue.textContent = `${saturationSlider.value}%`;
            });
            
            noiseSlider.addEventListener('input', () => {
                noiseValue.textContent = `${noiseSlider.value}%`;
            });
            
            upscaleSlider.addEventListener('input', () => {
                upscaleValue.textContent = `${upscaleSlider.value}%`;
            });
            
            // Preset buttons
            presetButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active class from all buttons
                    presetButtons.forEach(b => b.classList.remove('active'));
                    // Add active class to clicked button
                    btn.classList.add('active');
                    
                    // Apply preset values
                    const preset = btn.getAttribute('data-preset');
                    applyPreset(preset);
                });
            });
            
            // Enhance button
            enhanceBtn.addEventListener('click', enhanceImage);
            
            // Download button
            downloadBtn.addEventListener('click', downloadImage);
            
            // Reset button
            resetBtn.addEventListener('click', resetControls);
            
            // Share button
            shareBtn.addEventListener('click', shareImage);
            
            // Compare button
            compareBtn.addEventListener('click', toggleCompare);
            
            // Close compare overlay
            closeCompare.addEventListener('click', toggleCompare);
            
            // Functions
            function handleImageUpload(file) {
                if (!file.type.match('image.*')) {
                    alert('Please select an image file (JPG, PNG, or WEBP).');
                    return;
                }
                
                if (file.size > 10 * 1024 * 1024) {
                    alert('File size exceeds 10MB limit. Please choose a smaller image.');
                    return;
                }
                
                originalFileSize = file.size;
                fileSizeValue.textContent = `${(file.size / 1024).toFixed(1)} KB`;
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    originalImage = new Image();
                    originalImage.onload = function() {
                        originalPreview.innerHTML = '';
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'contain';
                        img.style.borderRadius = '12px';
                        originalPreview.appendChild(img);
                        
                        // Update resolution
                        const mp = (originalImage.width * originalImage.height / 1000000).toFixed(1);
                        resolutionValue.textContent = `${mp} MP`;
                        
                        // Reset enhanced preview
                        enhancedPreview.innerHTML = '<i class="fas fa-sparkles"></i>';
                        downloadBtn.disabled = true;
                        qualityValue.textContent = '+0%';
                        enhancementTime.textContent = '0s';
                    };
                    originalImage.src = e.target.result;
                };
                
                reader.readAsDataURL(file);
            }
            
            function applyPreset(preset) {
                switch(preset) {
                    case 'portrait':
                        sharpnessSlider.value = 70;
                        brightnessSlider.value = 60;
                        contrastSlider.value = 55;
                        saturationSlider.value = 45;
                        noiseSlider.value = 80;
                        upscaleSlider.value = 100;
                        break;
                    case 'landscape':
                        sharpnessSlider.value = 75;
                        brightnessSlider.value = 65;
                        contrastSlider.value = 70;
                        saturationSlider.value = 75;
                        noiseSlider.value = 60;
                        upscaleSlider.value = 120;
                        break;
                    case 'vintage':
                        sharpnessSlider.value = 40;
                        brightnessSlider.value = 55;
                        contrastSlider.value = 60;
                        saturationSlider.value = 30;
                        noiseSlider.value = 20;
                        upscaleSlider.value = 100;
                        break;
                    case 'bw':
                        sharpnessSlider.value = 65;
                        brightnessSlider.value = 50;
                        contrastSlider.value = 70;
                        saturationSlider.value = 0;
                        noiseSlider.value = 50;
                        upscaleSlider.value = 100;
                        break;
                    case 'vibrant':
                        sharpnessSlider.value = 60;
                        brightnessSlider.value = 60;
                        contrastSlider.value = 65;
                        saturationSlider.value = 85;
                        noiseSlider.value = 70;
                        upscaleSlider.value = 110;
                        break;
                }
                
                // Update value displays
                sharpnessValue.textContent = `${sharpnessSlider.value}%`;
                brightnessValue.textContent = `${brightnessSlider.value}%`;
                contrastValue.textContent = `${contrastSlider.value}%`;
                saturationValue.textContent = `${saturationSlider.value}%`;
                noiseValue.textContent = `${noiseSlider.value}%`;
                upscaleValue.textContent = `${upscaleSlider.value}%`;
            }
            
            function enhanceImage() {
                if (!originalImage) {
                    alert('Please upload an image first.');
                    return;
                }
                
                // Show processing state
                enhanceBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                enhanceBtn.disabled = true;
                enhancedPreview.classList.add('processing');
                
                // Start timer
                startTime = Date.now();
                
                // Simulate AI processing delay
                setTimeout(() => {
                    // Calculate enhancement values
                    const sharpness = (sharpnessSlider.value - 50) * 2;
                    const brightness = (brightnessSlider.value - 50) * 2;
                    const contrast = (contrastSlider.value - 50) * 2;
                    const saturation = (saturationSlider.value - 50) * 2;
                    const noise = (noiseSlider.value - 50) / 10;
                    const upscale = parseInt(upscaleSlider.value) / 100;
                    
                    // Create enhanced image preview
                    enhancedPreview.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = originalImage.src;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'contain';
                    img.style.borderRadius = '12px';
                    
                    // Apply CSS filters for demonstration
                    img.style.filter = `
                        brightness(${100 + brightness}%)
                        contrast(${100 + contrast}%)
                        saturate(${100 + saturation}%)
                        blur(${Math.max(0, 0.5 - noise)}px)
                    `;
                    
                    enhancedPreview.appendChild(img);
                    
                    // Calculate quality improvement (simulated)
                    const qualityImprovement = 
                        Math.abs(sharpnessSlider.value - 50) + 
                        Math.abs(brightnessSlider.value - 50) + 
                        Math.abs(contrastSlider.value - 50) + 
                        Math.abs(saturationSlider.value - 50) + 
                        Math.abs(noiseSlider.value - 50);
                    
                    const improvementPercent = Math.min(150, Math.round(qualityImprovement / 2));
                    qualityValue.textContent = `+${improvementPercent}%`;
                    
                    // Update file size (simulated improvement)
                    const newFileSize = originalFileSize * (1 + improvementPercent/100);
                    fileSizeValue.textContent = `${(newFileSize / 1024).toFixed(1)} KB`;
                    
                    // Update enhancement time
                    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
                    enhancementTime.textContent = `${elapsedTime}s`;
                    
                    // Store enhanced image URL for download
                    enhancedImageUrl = originalImage.src;
                    
                    // Reset button state
                    enhanceBtn.innerHTML = '<i class="fas fa-bolt"></i> Enhance Image';
                    enhanceBtn.disabled = false;
                    enhancedPreview.classList.remove('processing');
                    
                    // Enable download button
                    downloadBtn.disabled = false;
                }, 2000);
            }
            
            function downloadImage() {
                if (!enhancedImageUrl) {
                    alert('No enhanced image available to download.');
                    return;
                }
                
                // Create a temporary link for download
                const link = document.createElement('a');
                link.download = 'enhanced-image.png';
                link.href = enhancedImageUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            function resetControls() {
                // Reset sliders to default values
                sharpnessSlider.value = 50;
                brightnessSlider.value = 50;
                contrastSlider.value = 50;
                saturationSlider.value = 50;
                noiseSlider.value = 50;
                upscaleSlider.value = 100;
                
                // Update value displays
                sharpnessValue.textContent = '50%';
                brightnessValue.textContent = '50%';
                contrastValue.textContent = '50%';
                saturationValue.textContent = '50%';
                noiseValue.textContent = '50%';
                upscaleValue.textContent = '100%';
                
                // Reset enhanced preview
                if (originalPreview.querySelector('img')) {
                    enhancedPreview.innerHTML = '<i class="fas fa-sparkles"></i>';
                }
                
                // Disable download button
                downloadBtn.disabled = true;
                
                // Reset quality indicator
                qualityValue.textContent = '+0%';
                
                // Reset presets
                presetButtons.forEach(btn => btn.classList.remove('active'));
                
                // Reset stats
                fileSizeValue.textContent = originalFileSize ? `${(originalFileSize / 1024).toFixed(1)} KB` : '0 KB';
                enhancementTime.textContent = '0s';
            }
            
            function shareImage() {
                if (!enhancedImageUrl) {
                    alert('No enhanced image available to share.');
                    return;
                }
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Enhanced Image',
                        text: 'Check out this image I enhanced with PixelPerfect!',
                        url: enhancedImageUrl,
                    })
                    .catch(error => console.log('Error sharing:', error));
                } else {
                    alert('Web Share API not supported in your browser. You can download the image and share it manually.');
                }
            }
            
            function toggleCompare() {
                if (!enhancedImageUrl) {
                    alert('No enhanced image available to compare.');
                    return;
                }
                
                compareOverlay.classList.toggle('active');
                
                if (compareOverlay.classList.contains('active')) {
                    compareOriginal.src = originalImage.src;
                    compareEnhanced.src = enhancedImageUrl;
                }
            }
        });