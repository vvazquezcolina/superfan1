#!/usr/bin/env python3
"""
Brand Asset Scraper - CLI tool for extracting brand assets from websites
Scrapes websites, extracts media, analyzes brand info, and optimizes assets
"""

import argparse
import sys
import os
from pathlib import Path
from colorama import init, Fore, Style
from scraper import WebScraper
from asset_processor import AssetProcessor
from brand_analyzer import BrandAnalyzer
from utils import setup_output_directory, print_banner, format_report

# Initialize colorama for cross-platform colored output
init(autoreset=True)

def main():
    """Main CLI interface for the Brand Asset Scraper"""
    
    print_banner()
    
    parser = argparse.ArgumentParser(
        description="Extract brand assets and analyze websites for rapid site cloning",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py https://example.com
  python main.py https://example.com -o ./output -d 2
  python main.py https://example.com --max-pages 50 --skip-videos
        """
    )
    
    parser.add_argument('url', help='Target website URL to scrape')
    parser.add_argument('-o', '--output', default='./scraped_assets', 
                       help='Output directory (default: ./scraped_assets)')
    parser.add_argument('-d', '--depth', type=int, default=3,
                       help='Maximum crawl depth (default: 3)')
    parser.add_argument('--max-pages', type=int, default=100,
                       help='Maximum pages to scrape (default: 100)')
    parser.add_argument('--skip-videos', action='store_true',
                       help='Skip video extraction to speed up process')
    parser.add_argument('--no-optimize', action='store_true',
                       help='Skip image optimization')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Enable verbose output')
    
    args = parser.parse_args()
    
    # Validate URL
    if not args.url.startswith(('http://', 'https://')):
        args.url = 'https://' + args.url
    
    print(f"{Fore.CYAN}🎯 Target URL: {args.url}")
    print(f"{Fore.CYAN}📁 Output Directory: {args.output}")
    print(f"{Fore.CYAN}🔍 Max Depth: {args.depth}, Max Pages: {args.max_pages}")
    print()
    
    try:
        # Setup output directory structure
        output_path = setup_output_directory(args.output)
        
        # Initialize components
        scraper = WebScraper(
            max_depth=args.depth,
            max_pages=args.max_pages,
            verbose=args.verbose
        )
        
        asset_processor = AssetProcessor(
            output_path=output_path,
            skip_videos=args.skip_videos,
            optimize_images=not args.no_optimize,
            verbose=args.verbose
        )
        
        brand_analyzer = BrandAnalyzer(
            output_path=output_path,
            verbose=args.verbose
        )
        
        # Step 1: Scrape the website
        print(f"{Fore.YELLOW}🕷️  Starting website crawl...")
        scrape_results = scraper.crawl_site(args.url)
        
        if not scrape_results['pages']:
            print(f"{Fore.RED}❌ No pages found. Check URL and try again.")
            sys.exit(1)
        
        # Step 2: Process and extract assets
        print(f"{Fore.YELLOW}🎨 Processing assets...")
        asset_results = asset_processor.process_assets(scrape_results)
        
        # Step 3: Analyze brand information
        print(f"{Fore.YELLOW}🧠 Analyzing brand information...")
        brand_results = brand_analyzer.analyze_brand(scrape_results['text_content'])
        
        # Step 4: Generate final report
        print(f"{Fore.GREEN}📊 Generating final report...")
        report = format_report(scrape_results, asset_results, brand_results, output_path)
        
        print(f"\n{Fore.GREEN}✅ {Style.BRIGHT}Brand asset extraction completed!")
        print(report)
        
        # Save report to file
        report_path = output_path / 'extraction_report.txt'
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report.replace(Fore.GREEN, '').replace(Fore.CYAN, '').replace(Style.BRIGHT, ''))
        
        print(f"{Fore.CYAN}📄 Full report saved to: {report_path}")
        
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}⚠️  Process interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n{Fore.RED}❌ Error: {str(e)}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main() 