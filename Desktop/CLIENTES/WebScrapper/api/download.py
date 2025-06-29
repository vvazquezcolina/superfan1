"""
Vercel Serverless Function - File Download with Cloud Storage
"""

import json
import os
import zipfile
import tempfile
import boto3
from datetime import datetime, timedelta

def handler(request):
    """Handle file download requests with real cloud storage"""
    
    # Handle CORS
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
        
        job_id = request_data.get('jobId')
        assets_data = request_data.get('assets', {})
        
        if not job_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Job ID required'})
            }
        
        # Create downloadable package
        download_url = create_download_package(job_id, assets_data)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'download_url': download_url,
                'expires_in': '24 hours'
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
                'error': 'Failed to create download',
                'message': str(e)
            })
        }

def create_download_package(job_id, assets_data):
    """Create a real ZIP file and upload to cloud storage"""
    
    # Initialize AWS S3 (or use other cloud storage)
    s3_client = boto3.client(
        's3',
        aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
        region_name=os.environ.get('AWS_REGION', 'us-east-1')
    )
    
    bucket_name = os.environ.get('S3_BUCKET_NAME', 'brand-scraper-downloads')
    
    # Create temporary ZIP file
    with tempfile.NamedTemporaryFile(suffix='.zip', delete=False) as temp_zip:
        with zipfile.ZipFile(temp_zip.name, 'w', zipfile.ZIP_DEFLATED) as zipf:
            
            # Add brand brief
            if assets_data.get('brand_brief'):
                zipf.writestr('info/brand_brief.txt', assets_data['brand_brief'])
            
            # Add raw text
            if assets_data.get('raw_text'):
                zipf.writestr('info/raw.txt', assets_data['raw_text'])
            
            # Add images (would need to download from URLs)
            for i, image_url in enumerate(assets_data.get('images', [])[:10]):  # Limit for demo
                try:
                    # Download image and add to ZIP
                    # This is a simplified version - real implementation would handle this properly
                    zipf.writestr(f'media/image_{i+1}.jpg', f'# Image URL: {image_url}')
                except:
                    continue
            
            # Add logos
            for i, logo_url in enumerate(assets_data.get('logos', [])):
                try:
                    zipf.writestr(f'media/logos/logo_{i+1}.png', f'# Logo URL: {logo_url}')
                except:
                    continue
            
            # Add extraction report
            report = create_extraction_report(assets_data)
            zipf.writestr('extraction_report.txt', report)
        
        # Upload to S3
        file_key = f'downloads/{job_id}/{job_id}_brand_assets.zip'
        
        with open(temp_zip.name, 'rb') as zip_file:
            s3_client.upload_fileobj(
                zip_file,
                bucket_name,
                file_key,
                ExtraArgs={
                    'ContentType': 'application/zip',
                    'ContentDisposition': f'attachment; filename="{job_id}_brand_assets.zip"'
                }
            )
        
        # Generate presigned URL (expires in 24 hours)
        download_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': file_key},
            ExpiresIn=86400  # 24 hours
        )
        
        # Clean up temporary file
        os.unlink(temp_zip.name)
        
        return download_url

def create_extraction_report(assets_data):
    """Create a text report of the extraction"""
    
    report = f"""
BRAND ASSET EXTRACTION REPORT
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

SUMMARY:
- Images found: {len(assets_data.get('images', []))}
- Logos detected: {len(assets_data.get('logos', []))}
- Videos found: {len(assets_data.get('videos', []))}

BRAND ANALYSIS:
{assets_data.get('brand_analysis', 'No analysis available')}

ASSET URLS:
"""
    
    if assets_data.get('images'):
        report += "\nIMAGES:\n"
        for i, img in enumerate(assets_data['images'], 1):
            report += f"{i}. {img}\n"
    
    if assets_data.get('logos'):
        report += "\nLOGOS:\n"
        for i, logo in enumerate(assets_data['logos'], 1):
            report += f"{i}. {logo}\n"
    
    return report 