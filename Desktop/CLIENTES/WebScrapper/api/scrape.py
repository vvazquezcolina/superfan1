"""
Vercel Serverless Function - Main Scraping API Endpoint
"""

import json
import uuid
import time
from urllib.parse import urlparse

# Mock job storage (use database in production)
JOBS = {}

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
        # Parse request body - handle different Vercel request formats
        if hasattr(request, 'get_json'):
            request_data = request.get_json()
        elif hasattr(request, 'json'):
            request_data = request.json
        else:
            import json as json_module
            body = request.body
            if isinstance(body, bytes):
                body = body.decode('utf-8')
            request_data = json_module.loads(body)
        
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
        
        # Generate job ID
        job_id = str(uuid.uuid4())
        
        # Initialize mock job for demo
        JOBS[job_id] = {
            'status': 'processing',
            'percentage': 10,
            'currentStep': 'Initializing crawler...',
            'details': ['Starting website analysis...'],
            'url': url,
            'start_time': time.time()
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
                'message': 'Scraping job initiated successfully'
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