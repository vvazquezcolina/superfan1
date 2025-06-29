#!/usr/bin/env python3
"""
Example Usage Script - Demonstrates programmatic usage of Brand Asset Scraper

This script shows how to use the scraper components individually or together
for custom workflows and integrations.
"""

from pathlib import Path
from scraper import WebScraper
from asset_processor import AssetProcessor
from brand_analyzer import BrandAnalyzer
from utils import setup_output_directory

def basic_scraping_example():
    """Basic example of scraping a single website"""
    
    print("🔍 Basic Scraping Example")
    print("=" * 50)
    
    # Setup
    target_url = "https://example.com"
    output_dir = "./example_output"
    
    # Initialize scraper
    scraper = WebScraper(max_depth=2, max_pages=10, verbose=True)
    
    # Scrape the site
    print(f"Scraping: {target_url}")
    results = scraper.crawl_site(target_url)
    
    print(f"✅ Scraped {results['total_pages']} pages")
    print(f"📄 Found {len(results['text_content'])} text chunks")
    print(f"🖼️ Found {len(results['media_urls'])} media URLs")
    
    return results

def asset_processing_example():
    """Example of processing assets separately"""
    
    print("\n🎨 Asset Processing Example")
    print("=" * 50)
    
    # Setup output directory
    output_path = setup_output_directory("./processed_assets")
    
    # Initialize asset processor
    processor = AssetProcessor(
        output_path=output_path,
        optimize_images=True,
        verbose=True
    )
    
    # Mock scrape results for demonstration
    mock_results = {
        'text_content': ["Sample text content", "More sample content"],
        'pages': {
            'https://example.com': {
                'html': '<html><body>Sample HTML</body></html>',
                'title': 'Example Page'
            }
        },
        'media_urls': [
            'https://example.com/logo.png',
            'https://example.com/hero.jpg'
        ],
        'video_urls': [
            'https://youtube.com/watch?v=example'
        ]
    }
    
    # Process assets
    asset_stats = processor.process_assets(mock_results)
    
    print(f"✅ Asset processing complete")
    print(f"📁 Output directory: {output_path}")
    
    return asset_stats

def brand_analysis_example():
    """Example of brand analysis functionality"""
    
    print("\n🧠 Brand Analysis Example")
    print("=" * 50)
    
    # Setup
    output_path = Path("./brand_analysis")
    output_path.mkdir(exist_ok=True)
    
    # Initialize brand analyzer
    analyzer = BrandAnalyzer(output_path=output_path, verbose=True)
    
    # Sample text content (normally from scraping)
    sample_text = [
        "Welcome to TechCorp, your trusted partner in digital transformation.",
        "We help businesses leverage cutting-edge technology to achieve their goals.",
        "Our mission is to empower companies with innovative solutions.",
        "Services include: software development, consulting, and digital marketing.",
        "We serve startups, enterprises, and growing businesses worldwide.",
        "Contact us to learn how we can accelerate your success."
    ]
    
    # Analyze brand
    brand_results = analyzer.analyze_brand(sample_text)
    
    print(f"✅ Brand analysis complete")
    print(f"🏢 Brand Name: {brand_results['brand_name']}")
    print(f"💭 Tagline: {brand_results['tagline']}")
    print(f"🎯 Tone: {brand_results['tone']}")
    print(f"👥 Audience: {', '.join(brand_results['audience'])}")
    print(f"📋 Brief saved to: {output_path}/info/brand_brief.txt")
    
    return brand_results

def complete_workflow_example():
    """Example of complete workflow with custom settings"""
    
    print("\n🚀 Complete Workflow Example")
    print("=" * 50)
    
    # Configuration
    target_url = "https://stripe.com"  # Example site
    output_dir = "./complete_extraction"
    
    # Setup
    output_path = setup_output_directory(output_dir)
    
    # Initialize components
    scraper = WebScraper(max_depth=2, max_pages=20, verbose=False)
    processor = AssetProcessor(output_path, optimize_images=True, verbose=False)
    analyzer = BrandAnalyzer(output_path, verbose=False)
    
    try:
        # Step 1: Scrape
        print("📡 Scraping website...")
        scrape_results = scraper.crawl_site(target_url)
        
        # Step 2: Process assets
        print("🎨 Processing assets...")
        asset_results = processor.process_assets(scrape_results)
        
        # Step 3: Analyze brand
        print("🧠 Analyzing brand...")
        brand_results = analyzer.analyze_brand(scrape_results['text_content'])
        
        # Summary
        print("\n📊 EXTRACTION SUMMARY")
        print("-" * 30)
        print(f"Pages crawled: {scrape_results['total_pages']}")
        print(f"Images processed: {asset_results['images_downloaded']}")
        print(f"Logos detected: {asset_results['logos_detected']}")
        print(f"Brand name: {brand_results['brand_name']}")
        print(f"Output location: {output_path}")
        
        return {
            'scrape_results': scrape_results,
            'asset_results': asset_results,
            'brand_results': brand_results
        }
        
    except Exception as e:
        print(f"❌ Error during extraction: {str(e)}")
        return None

def custom_filtering_example():
    """Example of custom filtering and processing"""
    
    print("\n🔧 Custom Filtering Example")
    print("=" * 50)
    
    # Custom scraper with specific filters
    class CustomScraper(WebScraper):
        def _extract_images(self, soup, base_url):
            """Override to filter only large images"""
            images = super()._extract_images(soup, base_url)
            
            # Filter for likely high-quality images
            filtered_images = []
            for img_url in images:
                if any(keyword in img_url.lower() for keyword in ['hero', 'banner', 'main', 'large']):
                    filtered_images.append(img_url)
            
            return filtered_images
    
    # Use custom scraper
    custom_scraper = CustomScraper(max_depth=1, max_pages=5)
    
    print("Custom scraper created with image filtering")
    print("Only extracts images with 'hero', 'banner', 'main', or 'large' in URL")
    
    return custom_scraper

def batch_processing_example():
    """Example of processing multiple websites"""
    
    print("\n📦 Batch Processing Example")
    print("=" * 50)
    
    # List of websites to process
    websites = [
        "https://apple.com",
        "https://google.com", 
        "https://microsoft.com"
    ]
    
    results = {}
    
    for i, url in enumerate(websites, 1):
        print(f"\n[{i}/{len(websites)}] Processing: {url}")
        
        # Create separate output directory for each site
        domain = url.replace('https://', '').replace('http://', '').split('/')[0]
        output_dir = f"./batch_output/{domain}"
        
        # Quick processing with minimal settings
        scraper = WebScraper(max_depth=1, max_pages=5, verbose=False)
        
        try:
            scrape_result = scraper.crawl_site(url)
            results[domain] = {
                'pages': scrape_result['total_pages'],
                'media_count': len(scrape_result['media_urls']),
                'status': 'success'
            }
            print(f"  ✅ Success: {scrape_result['total_pages']} pages")
            
        except Exception as e:
            results[domain] = {
                'status': 'failed',
                'error': str(e)
            }
            print(f"  ❌ Failed: {str(e)}")
    
    print(f"\n📊 Batch processing complete. Results for {len(results)} websites:")
    for domain, result in results.items():
        status = result['status']
        if status == 'success':
            print(f"  {domain}: {result['pages']} pages, {result['media_count']} media files")
        else:
            print(f"  {domain}: Failed - {result['error']}")
    
    return results

if __name__ == "__main__":
    """Run example demonstrations"""
    
    print("🎯 Brand Asset Scraper - Usage Examples")
    print("=" * 60)
    
    # Run examples
    try:
        # Basic scraping
        basic_results = basic_scraping_example()
        
        # Asset processing
        asset_stats = asset_processing_example()
        
        # Brand analysis
        brand_info = brand_analysis_example()
        
        # Custom filtering
        custom_scraper = custom_filtering_example()
        
        # Batch processing
        batch_results = batch_processing_example()
        
        print(f"\n🎉 All examples completed successfully!")
        print(f"Check the output directories for results.")
        
    except Exception as e:
        print(f"\n❌ Example failed: {str(e)}")
        print("Make sure all dependencies are installed: pip install -r requirements.txt")
    
    print(f"\n💡 Tip: Modify these examples for your specific use cases!")
    print(f"See README.md for more detailed documentation.") 