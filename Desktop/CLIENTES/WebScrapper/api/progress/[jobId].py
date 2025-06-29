"""
Vercel Serverless Function - Progress Check API Endpoint
"""

import json
import time
import uuid

# Mock job storage (shared with scrape.py - use database in production)
MOCK_JOBS = {}

def handler(request):
    """Handle progress check requests"""
    
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }
    
    if request.method != "GET":
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Extract job ID from URL
        job_id = request.query.get('jobId') or request.url.split('/')[-1]
        
        if not job_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Job ID required'})
            }
        
        # Simulate progress for demo
        progress = simulate_progress(job_id)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps(progress)
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

def simulate_progress(job_id):
    """Simulate scraping progress for demo purposes"""
    
    # Check if job exists in mock storage
    if job_id not in MOCK_JOBS:
        # Initialize new job
        MOCK_JOBS[job_id] = {
            'start_time': time.time(),
            'status': 'processing',
            'percentage': 0
        }
    
    job = MOCK_JOBS[job_id]
    elapsed = time.time() - job['start_time']
    
    # Simulate progress over 30 seconds
    if elapsed < 5:
        # Initial phase
        progress = {
            'status': 'processing',
            'percentage': min(20, int(elapsed * 4)),
            'currentStep': 'Initializing crawler...',
            'details': ['Setting up web scraper', 'Checking robots.txt']
        }
    elif elapsed < 15:
        # Crawling phase
        progress = {
            'status': 'processing',
            'percentage': min(50, 20 + int((elapsed - 5) * 3)),
            'currentStep': 'Crawling website pages...',
            'details': [
                f'Found {min(25, int((elapsed - 5) * 2.5))} pages',
                f'Discovered {min(50, int((elapsed - 5) * 5))} media files'
            ]
        }
    elif elapsed < 25:
        # Processing phase
        progress = {
            'status': 'processing',
            'percentage': min(80, 50 + int((elapsed - 15) * 3)),
            'currentStep': 'Processing assets and analyzing brand...',
            'details': [
                f'Downloaded {min(20, int((elapsed - 15) * 2))} images',
                f'Detected {min(3, int((elapsed - 15) / 3))} logos',
                'Analyzing brand colors and fonts'
            ]
        }
    else:
        # Completion
        progress = {
            'status': 'completed',
            'percentage': 100,
            'currentStep': 'Analysis complete!',
            'details': ['All assets processed successfully'],
            'results': {
                'pages_crawled': 25,
                'images_downloaded': 18,
                'logos_detected': 3,
                'videos_found': 5,
                'processing_time': round(elapsed, 1),
                'brand_analysis': {
                    'brand_name': 'Sample Brand',
                    'tagline': 'Innovation at your fingertips',
                    'tone': 'Professional',
                    'audience': ['Businesses', 'Professionals'],
                    'colors': ['#1E40AF', '#059669', '#7C3AED'],
                    'fonts': ['Inter', 'Roboto'],
                    'services': ['Software Development', 'Consulting', 'Design']
                },
                'download_url': f'/downloads/demo-{job_id}.zip'
            }
        }
        
        # Mark job as completed
        MOCK_JOBS[job_id]['status'] = 'completed'
    
    return progress 