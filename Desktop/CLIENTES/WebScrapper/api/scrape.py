"""
Vercel Serverless Function - Main Scraping API Endpoint
"""

import json
import uuid
import time
import traceback
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse
import tempfile
import os
import zipfile
import io

# Import our scraping modules
try:
    from scraper import WebScraper
    from asset_processor import AssetProcessor
    from brand_analyzer import BrandAnalyzer
    from utils import setup_output_directory
except ImportError:
    # Handle import in serverless environment
    import sys
    sys.path.append('.')
    from scraper import WebScraper
    from asset_processor import AssetProcessor
    from brand_analyzer import BrandAnalyzer
    from utils import setup_output_directory

# In-memory job storage (for demo - use Redis/database in production)
JOBS = {}

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle POST request to start scraping"""
        try:
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            # Validate input
            url = request_data.get('url', '').strip()
            if not url or not self._validate_url(url):
                self._send_error(400, "Invalid URL provided")
                return
            
            # Extract parameters
            max_depth = min(int(request_data.get('maxDepth', 3)), 4)  # Limit for serverless
            max_pages = min(int(request_data.get('maxPages', 25)), 50)  # Limit for serverless
            skip_videos = request_data.get('skipVideos', True)  # Default to true for performance
            
            # Generate job ID
            job_id = str(uuid.uuid4())
            
            # Initialize job tracking
            JOBS[job_id] = {
                'status': 'started',
                'percentage': 0,
                'currentStep': 'Initializing scraper...',
                'details': [],
                'startTime': time.time(),
                'url': url,
                'config': {
                    'max_depth': max_depth,
                    'max_pages': max_pages,
                    'skip_videos': skip_videos
                }
            }
            
            # Start async processing (simulate with immediate processing for demo)
            try:
                self._process_scraping_job(job_id)
            except Exception as e:
                JOBS[job_id]['status'] = 'failed'
                JOBS[job_id]['error'] = str(e)
                print(f"Scraping error: {e}")
                traceback.print_exc()
            
            # Return job ID
            self._send_json_response({
                'jobId': job_id,
                'status': 'started',
                'message': 'Scraping job initiated'
            })
            
        except Exception as e:
            print(f"API Error: {e}")
            traceback.print_exc()
            self._send_error(500, f"Internal server error: {str(e)}")
    
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self._send_cors_headers()
        self.end_headers()
    
    def _process_scraping_job(self, job_id):
        """Process the scraping job"""
        job = JOBS[job_id]
        config = job['config']
        
        try:
            # Update progress
            self._update_job_progress(job_id, 10, "Setting up scraper...", ["Initializing web scraper"])
            
            # Create temporary directory
            with tempfile.TemporaryDirectory() as temp_dir:
                output_path = setup_output_directory(temp_dir + '/scraped_assets')
                
                # Initialize components
                scraper = WebScraper(
                    max_depth=config['max_depth'],
                    max_pages=config['max_pages'],
                    delay=0.5,  # Faster for demo
                    verbose=False
                )
                
                asset_processor = AssetProcessor(
                    output_path=output_path,
                    skip_videos=config['skip_videos'],
                    optimize_images=True,
                    verbose=False
                )
                
                brand_analyzer = BrandAnalyzer(
                    output_path=output_path,
                    verbose=False
                )
                
                # Step 1: Scrape website
                self._update_job_progress(job_id, 20, "Crawling website...", ["Starting website crawl"])
                scrape_results = scraper.crawl_site(job['url'])
                
                if not scrape_results['pages']:
                    raise Exception("No pages found. Website may be inaccessible or block crawlers.")
                
                self._update_job_progress(job_id, 40, "Processing assets...", [
                    f"Found {scrape_results['total_pages']} pages",
                    f"Found {len(scrape_results['media_urls'])} media files"
                ])
                
                # Step 2: Process assets (limited for demo)
                limited_media = scrape_results['media_urls'][:20]  # Limit for serverless
                scrape_results['media_urls'] = limited_media
                
                asset_results = asset_processor.process_assets(scrape_results)
                
                self._update_job_progress(job_id, 70, "Analyzing brand...", [
                    f"Downloaded {asset_results['images_downloaded']} images",
                    f"Detected {asset_results['logos_detected']} logos"
                ])
                
                # Step 3: Brand analysis
                brand_results = brand_analyzer.analyze_brand(scrape_results['text_content'])
                
                self._update_job_progress(job_id, 90, "Creating download package...", [
                    "Compressing assets",
                    "Generating reports"
                ])
                
                # Create downloadable package
                download_url = self._create_download_package(output_path, job_id)
                
                # Complete job
                processing_time = round(time.time() - job['startTime'], 2)
                
                JOBS[job_id].update({
                    'status': 'completed',
                    'percentage': 100,
                    'currentStep': 'Completed successfully!',
                    'results': {
                        'pages_crawled': scrape_results['total_pages'],
                        'images_downloaded': asset_results['images_downloaded'],
                        'logos_detected': asset_results['logos_detected'],
                        'videos_found': len(scrape_results['video_urls']),
                        'processing_time': processing_time,
                        'brand_analysis': brand_results,
                        'download_url': download_url
                    }
                })
                
        except Exception as e:
            JOBS[job_id].update({
                'status': 'failed',
                'error': str(e),
                'percentage': 0
            })
            raise e
    
    def _create_download_package(self, output_path, job_id):
        """Create a downloadable ZIP package (simulated for demo)"""
        # In a real implementation, you'd:
        # 1. Create a ZIP file of the assets
        # 2. Upload to cloud storage (AWS S3, etc.)
        # 3. Return the download URL
        
        # For demo, return a placeholder URL
        return f"https://example.com/downloads/{job_id}.zip"
    
    def _update_job_progress(self, job_id, percentage, step, details):
        """Update job progress"""
        if job_id in JOBS:
            JOBS[job_id].update({
                'percentage': percentage,
                'currentStep': step,
                'details': details
            })
    
    def _validate_url(self, url):
        """Validate URL format"""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False
    
    def _send_json_response(self, data, status_code=200):
        """Send JSON response with CORS headers"""
        self.send_response(status_code)
        self._send_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        response = json.dumps(data)
        self.wfile.write(response.encode('utf-8'))
    
    def _send_error(self, status_code, message):
        """Send error response"""
        self.send_response(status_code)
        self._send_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        error_response = json.dumps({
            'error': True,
            'message': message,
            'status': status_code
        })
        self.wfile.write(error_response.encode('utf-8'))
    
    def _send_cors_headers(self):
        """Send CORS headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

# Main handler function for Vercel
def handler(request):
    """Main handler function for Vercel serverless function"""
    
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }
    
    if request.method != "POST":
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parse request body
        if hasattr(request, 'json'):
            request_data = request.json
        else:
            request_data = json.loads(request.body)
        
        # Validate input
        url = request_data.get('url', '').strip()
        if not url or not _validate_url(url):
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Invalid URL provided'})
            }
        
        # For demo purposes, return a mock response
        job_id = str(uuid.uuid4())
        
        # Initialize mock job
        JOBS[job_id] = {
            'status': 'processing',
            'percentage': 25,
            'currentStep': 'Crawling website...',
            'details': ['Starting website analysis...'],
            'url': url
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'jobId': job_id,
                'status': 'started',
                'message': 'Scraping job initiated'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }

def _validate_url(url):
    """Validate URL format"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False 