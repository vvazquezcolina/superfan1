"""
Utility Functions - Helper functions for the Brand Asset Scraper
"""

from pathlib import Path
from colorama import Fore, Style
import shutil

def setup_output_directory(output_path):
    """Setup the output directory structure"""
    
    output_path = Path(output_path)
    
    # Create main directory
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Create subdirectories
    subdirs = ['media', 'media/logos', 'info', 'html']
    for subdir in subdirs:
        (output_path / subdir).mkdir(parents=True, exist_ok=True)
    
    print(f"{Fore.GREEN}📁 Output directory structure created: {output_path}")
    return output_path

def print_banner():
    """Print application banner"""
    
    banner = f"""
{Fore.CYAN}{Style.BRIGHT}
╔═══════════════════════════════════════════════════════════════╗
║                    Brand Asset Scraper                        ║
║                                                               ║
║           Extract brand assets for rapid site cloning         ║
║                                                               ║
║   🕷️  Web Crawler  |  🎨 Asset Processor  |  🧠 Brand AI     ║
╚═══════════════════════════════════════════════════════════════╝
{Style.RESET_ALL}
"""
    print(banner)

def format_report(scrape_results, asset_results, brand_results, output_path):
    """Format and return the final console report"""
    
    # Calculate totals
    total_pages = scrape_results['total_pages']
    total_images = asset_results['images_downloaded']
    total_logos = asset_results['logos_detected']
    total_videos = asset_results.get('videos_processed', 0)
    failed_downloads = asset_results.get('failed_downloads', 0)
    optimized_images = asset_results.get('images_optimized', 0)
    
    report = f"""
{Fore.GREEN}{Style.BRIGHT}═══════════════════════════════════════════════════════════════
                          EXTRACTION REPORT                          
═══════════════════════════════════════════════════════════════{Style.RESET_ALL}

{Fore.CYAN}📊 SCRAPING SUMMARY{Style.RESET_ALL}
   • Pages crawled: {total_pages}
   • Domain: {scrape_results['base_domain']}
   • Text content saved to: {output_path}/info/raw.txt

{Fore.CYAN}🎨 ASSET PROCESSING{Style.RESET_ALL}
   • Images downloaded: {total_images}
   • Images optimized: {optimized_images}
   • Logos detected: {total_logos}
   • Video URLs saved: {total_videos}
   • Failed downloads: {failed_downloads}

{Fore.CYAN}🧠 BRAND ANALYSIS{Style.RESET_ALL}
   • Brand Name: {brand_results['brand_name']}
   • Tagline: {brand_results['tagline']}
   • Primary Tone: {brand_results['tone']}
   • Target Audience: {', '.join(brand_results['audience'])}
   • Services Identified: {len(brand_results['services'])}
   • Colors Extracted: {len(brand_results['colors'])}
   • Fonts Found: {len(brand_results['fonts'])}

{Fore.CYAN}📁 OUTPUT STRUCTURE{Style.RESET_ALL}
   • Main Directory: {output_path}
   • Media Files: {output_path}/media/
   • Logo Files: {output_path}/media/logos/
   • Brand Brief: {output_path}/info/brand_brief.txt
   • Raw Text: {output_path}/info/raw.txt
   • HTML Pages: {output_path}/html/
   • Video URLs: {output_path}/media/videos.txt

{Fore.GREEN}{Style.BRIGHT}═══════════════════════════════════════════════════════════════{Style.RESET_ALL}
"""
    
    return report

def get_file_size_mb(file_path):
    """Get file size in MB"""
    try:
        size_bytes = Path(file_path).stat().st_size
        return round(size_bytes / (1024 * 1024), 2)
    except:
        return 0

def clean_filename(filename):
    """Clean filename for cross-platform compatibility"""
    import re
    
    # Remove or replace invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    
    # Remove multiple underscores
    filename = re.sub(r'_+', '_', filename)
    
    # Trim and ensure not empty
    filename = filename.strip('_')
    if not filename:
        filename = 'unnamed'
    
    return filename

def format_bytes(bytes_value):
    """Format bytes into human readable format"""
    
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_value < 1024.0:
            return f"{bytes_value:.1f} {unit}"
        bytes_value /= 1024.0
    return f"{bytes_value:.1f} TB"

def validate_url(url):
    """Validate and normalize URL"""
    
    if not url:
        return None
    
    # Add protocol if missing
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Basic URL validation
    import re
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    if url_pattern.match(url):
        return url
    else:
        return None

def create_directory_tree(path, prefix="", max_depth=3, current_depth=0):
    """Create a visual directory tree representation"""
    
    if current_depth >= max_depth:
        return ""
    
    tree = ""
    path = Path(path)
    
    if not path.exists():
        return f"{prefix}[Directory not found]\n"
    
    try:
        items = sorted(path.iterdir())
        dirs = [item for item in items if item.is_dir()]
        files = [item for item in items if item.is_file()]
        
        # Show directories first
        for i, directory in enumerate(dirs):
            is_last_dir = (i == len(dirs) - 1) and len(files) == 0
            tree += f"{prefix}{'└── ' if is_last_dir else '├── '}{directory.name}/\n"
            
            extension = "    " if is_last_dir else "│   "
            tree += create_directory_tree(
                directory, 
                prefix + extension, 
                max_depth, 
                current_depth + 1
            )
        
        # Show files
        for i, file in enumerate(files):
            is_last = i == len(files) - 1
            tree += f"{prefix}{'└── ' if is_last else '├── '}{file.name}\n"
            
    except PermissionError:
        tree += f"{prefix}[Permission denied]\n"
    
    return tree

def print_success_message(output_path):
    """Print final success message with next steps"""
    
    success_msg = f"""
{Fore.GREEN}{Style.BRIGHT}🎉 Brand Asset Extraction Complete!{Style.RESET_ALL}

{Fore.CYAN}📂 Your extracted assets are ready at:{Style.RESET_ALL}
   {output_path}

{Fore.CYAN}🚀 Next Steps:{Style.RESET_ALL}
   1. Review the brand brief: {output_path}/info/brand_brief.txt
   2. Check extracted media: {output_path}/media/
   3. Examine logos separately: {output_path}/media/logos/
   4. Use raw text for AI processing: {output_path}/info/raw.txt

{Fore.YELLOW}💡 Pro Tips:{Style.RESET_ALL}
   • Images are optimized and renamed descriptively
   • Brand colors and fonts are extracted for easy reuse
   • HTML structure is preserved for reference
   • Video URLs are saved for manual download if needed

{Fore.GREEN}Happy cloning! 🎨{Style.RESET_ALL}
"""
    
    print(success_msg) 