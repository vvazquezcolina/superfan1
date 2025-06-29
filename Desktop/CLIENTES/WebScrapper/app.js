// Brand Asset Scraper - Frontend JavaScript

class BrandAssetScraper {
    constructor() {
        this.form = document.getElementById('scraperForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.progressSection = document.getElementById('progressSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.isProcessing = false;
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
        
        // Advanced options toggle
        document.getElementById('toggleAdvanced').addEventListener('click', this.toggleAdvancedOptions);
        
        // URL input validation
        document.getElementById('websiteUrl').addEventListener('input', this.validateUrl);
    }
    
    toggleAdvancedOptions() {
        const options = document.getElementById('advancedOptions');
        const icon = document.getElementById('advancedIcon');
        
        if (options.classList.contains('hidden')) {
            options.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            options.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    }
    
    validateUrl(e) {
        const url = e.target.value;
        const urlPattern = /^https?:\/\/.+/;
        
        if (url && !urlPattern.test(url)) {
            e.target.classList.add('border-red-500');
            e.target.classList.remove('border-gray-300');
        } else {
            e.target.classList.remove('border-red-500');
            e.target.classList.add('border-gray-300');
        }
    }
    
    async handleFormSubmit() {
        if (this.isProcessing) return;
        
        const formData = this.getFormData();
        
        if (!this.validateFormData(formData)) {
            this.showToast('Please enter a valid URL', 'error');
            return;
        }
        
        this.isProcessing = true;
        this.showLoadingState();
        this.showProgressSection();
        
        try {
            // Start the scraping process
            const jobId = await this.startScraping(formData);
            
            if (jobId) {
                // Poll for progress
                await this.pollProgress(jobId);
            } else {
                throw new Error('Failed to start scraping job');
            }
            
        } catch (error) {
            console.error('Scraping error:', error);
            this.showToast(error.message || 'An error occurred during scraping', 'error');
            this.hideLoadingState();
            this.hideProgressSection();
        } finally {
            this.isProcessing = false;
        }
    }
    
    getFormData() {
        return {
            url: document.getElementById('websiteUrl').value.trim(),
            maxDepth: parseInt(document.getElementById('maxDepth').value),
            maxPages: parseInt(document.getElementById('maxPages').value),
            skipVideos: document.getElementById('skipVideos').checked
        };
    }
    
    validateFormData(data) {
        const urlPattern = /^https?:\/\/.+/;
        return urlPattern.test(data.url);
    }
    
    async startScraping(formData) {
        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to start scraping');
            }
            
            const result = await response.json();
            return result.jobId;
            
        } catch (error) {
            console.error('Start scraping error:', error);
            throw error;
        }
    }
    
    async pollProgress(jobId) {
        const maxAttempts = 120; // 10 minutes max (5 second intervals)
        let attempts = 0;
        
        const poll = async () => {
            try {
                const response = await fetch(`/api/progress/${jobId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to get progress');
                }
                
                const progress = await response.json();
                this.updateProgress(progress);
                
                if (progress.status === 'completed') {
                    await this.handleCompletion(progress);
                    return;
                } else if (progress.status === 'failed') {
                    throw new Error(progress.error || 'Scraping failed');
                } else if (progress.status === 'processing' && attempts < maxAttempts) {
                    attempts++;
                    setTimeout(poll, 5000); // Poll every 5 seconds
                } else {
                    throw new Error('Scraping timed out');
                }
                
            } catch (error) {
                console.error('Progress polling error:', error);
                throw error;
            }
        };
        
        await poll();
    }
    
    updateProgress(progress) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const progressPercent = document.getElementById('progressPercent');
        const progressDetails = document.getElementById('progressDetails');
        
        // Update progress bar
        progressBar.style.width = `${progress.percentage}%`;
        progressPercent.textContent = `${progress.percentage}%`;
        
        // Update progress text
        progressText.textContent = progress.currentStep || 'Processing...';
        
        // Update details
        if (progress.details) {
            progressDetails.innerHTML = `
                <div class="space-y-1">
                    ${progress.details.map(detail => `<div>• ${detail}</div>`).join('')}
                </div>
            `;
        }
    }
    
    async handleCompletion(progress) {
        this.hideLoadingState();
        this.hideProgressSection();
        
        // Show results
        this.displayResults(progress.results);
        this.showResultsSection();
        
        this.showToast('Brand assets extracted successfully!', 'success');
    }
    
    displayResults(results) {
        const resultsContent = document.getElementById('resultsContent');
        
        resultsContent.innerHTML = `
            <div class="space-y-8">
                <!-- Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-blue-50 p-6 rounded-lg text-center">
                        <div class="text-3xl font-bold text-blue-600">${results.pages_crawled || 0}</div>
                        <div class="text-sm text-gray-600">Pages Crawled</div>
                    </div>
                    <div class="bg-purple-50 p-6 rounded-lg text-center">
                        <div class="text-3xl font-bold text-purple-600">${results.images_downloaded || 0}</div>
                        <div class="text-sm text-gray-600">Images Downloaded</div>
                    </div>
                    <div class="bg-green-50 p-6 rounded-lg text-center">
                        <div class="text-3xl font-bold text-green-600">${results.logos_detected || 0}</div>
                        <div class="text-sm text-gray-600">Logos Detected</div>
                    </div>
                    <div class="bg-orange-50 p-6 rounded-lg text-center">
                        <div class="text-3xl font-bold text-orange-600">${results.videos_found || 0}</div>
                        <div class="text-sm text-gray-600">Videos Found</div>
                    </div>
                </div>
                
                <!-- Brand Analysis -->
                ${results.brand_analysis ? this.renderBrandAnalysis(results.brand_analysis) : ''}
                
                <!-- Download Section -->
                <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
                    <h4 class="text-xl font-semibold text-gray-800 mb-4">
                        <i class="fas fa-download mr-2"></i>
                        Download Your Assets
                    </h4>
                    <p class="text-gray-600 mb-4">
                        Your brand assets have been processed and are ready for download.
                    </p>
                    <button onclick="window.open('${results.download_url}', '_blank')" 
                            class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition">
                        <i class="fas fa-download mr-2"></i>
                        Download Asset Package
                    </button>
                </div>
                
                <!-- Processing Time -->
                <div class="text-center text-sm text-gray-500">
                    Processing completed in ${results.processing_time || 'unknown'} seconds
                </div>
            </div>
        `;
    }
    
    renderBrandAnalysis(analysis) {
        return `
            <div class="bg-white border-2 border-gray-100 rounded-xl p-6">
                <h4 class="text-xl font-semibold text-gray-800 mb-6">
                    <i class="fas fa-brain mr-2 text-purple-600"></i>
                    Brand Analysis
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h5 class="font-semibold text-gray-700 mb-2">Brand Identity</h5>
                        <div class="space-y-2 text-sm">
                            <div><strong>Name:</strong> ${analysis.brand_name || 'Not detected'}</div>
                            <div><strong>Tagline:</strong> ${analysis.tagline || 'Not detected'}</div>
                            <div><strong>Tone:</strong> ${analysis.tone || 'Not detected'}</div>
                        </div>
                    </div>
                    
                    <div>
                        <h5 class="font-semibold text-gray-700 mb-2">Target Audience</h5>
                        <div class="flex flex-wrap gap-2">
                            ${(analysis.audience || []).map(aud => 
                                `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">${aud}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h5 class="font-semibold text-gray-700 mb-2">Brand Colors</h5>
                        <div class="flex flex-wrap gap-2">
                            ${(analysis.colors || []).map(color => 
                                `<div class="flex items-center space-x-2">
                                    <div class="w-6 h-6 rounded border" style="background-color: ${color}"></div>
                                    <span class="text-xs font-mono">${color}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h5 class="font-semibold text-gray-700 mb-2">Typography</h5>
                        <div class="space-y-1 text-sm">
                            ${(analysis.fonts || []).map(font => 
                                `<div class="bg-gray-100 px-2 py-1 rounded text-xs">${font}</div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                ${analysis.services ? `
                    <div class="mt-4">
                        <h5 class="font-semibold text-gray-700 mb-2">Services/Products</h5>
                        <div class="flex flex-wrap gap-2">
                            ${analysis.services.map(service => 
                                `<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">${service}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    showLoadingState() {
        document.getElementById('submitText').classList.add('hidden');
        document.getElementById('loadingText').classList.remove('hidden');
        this.submitBtn.disabled = true;
    }
    
    hideLoadingState() {
        document.getElementById('submitText').classList.remove('hidden');
        document.getElementById('loadingText').classList.add('hidden');
        this.submitBtn.disabled = false;
    }
    
    showProgressSection() {
        this.progressSection.classList.remove('hidden');
        this.progressSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    hideProgressSection() {
        this.progressSection.classList.add('hidden');
    }
    
    showResultsSection() {
        this.resultsSection.classList.remove('hidden');
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showToast(message, type = 'error') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        
        // Set color based on type
        if (type === 'success') {
            toast.className = 'toast fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        } else {
            toast.className = 'toast fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        }
        
        // Show toast
        toast.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BrandAssetScraper();
});

// Utility functions
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function timeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    
    return time.toLocaleDateString();
} 