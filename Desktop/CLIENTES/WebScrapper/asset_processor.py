"""
Asset Processor Module - Handles media download, optimization, and organization
"""

import requests
from pathlib import Path
import re
from urllib.parse import urlparse, unquote
from PIL import Image, ImageOps
import io
from tqdm import tqdm
from colorama import Fore, Style
import hashlib
import mimetypes

class AssetProcessor:
    """Handles downloading, processing, and organizing website assets"""
    
    def __init__(self, output_path, skip_videos=False, optimize_images=True, verbose=False):
        self.output_path = Path(output_path)
        self.skip_videos = skip_videos
        self.optimize_images = optimize_images
        self.verbose = verbose
        
        # Asset storage paths
        self.media_path = self.output_path / 'media'
        self.logos_path = self.media_path / 'logos'
        self.info_path = self.output_path / 'info'
        
        # Ensure directories exist
        self.media_path.mkdir(parents=True, exist_ok=True)
        self.logos_path.mkdir(parents=True, exist_ok=True)
        self.info_path.mkdir(parents=True, exist_ok=True)
        
        # Download session
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        
        # Supported formats
        self.image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'}
        self.video_extensions = {'.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv'}
        
        # Logo detection keywords
        self.logo_keywords = {
            'logo', 'brand', 'header-logo', 'site-logo', 'company-logo',
            'navbar-brand', 'masthead', 'brand-logo', 'site-brand'
        }
        
        # Tracking stats
        self.stats = {
            'images_downloaded': 0,
            'images_optimized': 0,
            'logos_detected': 0,
            'videos_processed': 0,
            'skipped_duplicates': 0,
            'failed_downloads': 0
        }
        
        # Track downloaded files to prevent duplicates
        self.downloaded_hashes = set()
    
    def process_assets(self, scrape_results):
        """Main asset processing function"""
        
        # Save raw text content
        self._save_raw_text(scrape_results['text_content'])
        
        # Save raw HTML pages
        self._save_html_pages(scrape_results['pages'])
        
        # Process media files
        if scrape_results['media_urls']:
            print(f"{Fore.CYAN}📸 Processing {len(scrape_results['media_urls'])} media files...")
            self._process_media_files(scrape_results['media_urls'])
        
        # Process video URLs
        if not self.skip_videos and scrape_results['video_urls']:
            print(f"{Fore.CYAN}🎥 Processing {len(scrape_results['video_urls'])} video URLs...")
            self._save_video_urls(scrape_results['video_urls'])
        
        return self.stats
    
    def _save_raw_text(self, text_content):
        """Save concatenated text content to raw.txt"""
        
        raw_text_path = self.info_path / 'raw.txt'
        
        with open(raw_text_path, 'w', encoding='utf-8') as f:
            for text_chunk in text_content:
                if text_chunk.strip():  # Skip empty chunks
                    f.write(text_chunk + '\n')
        
        if self.verbose:
            print(f"{Fore.GREEN}💾 Saved raw text to: {raw_text_path}")
    
    def _save_html_pages(self, pages_data):
        """Save raw HTML pages for reference"""
        
        html_dir = self.output_path / 'html'
        html_dir.mkdir(exist_ok=True)
        
        for i, (url, page_data) in enumerate(pages_data.items()):
            # Create safe filename from URL
            safe_filename = self._create_safe_filename(url, 'html')
            html_path = html_dir / f"{i:03d}_{safe_filename}"
            
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(page_data['html'])
        
        if self.verbose:
            print(f"{Fore.GREEN}💾 Saved {len(pages_data)} HTML pages to: {html_dir}")
    
    def _process_media_files(self, media_urls):
        """Download and process all media files"""
        
        with tqdm(media_urls, desc="Downloading media", unit="file") as pbar:
            for url in pbar:
                try:
                    self._download_and_process_media(url)
                    pbar.set_postfix(
                        downloaded=self.stats['images_downloaded'],
                        optimized=self.stats['images_optimized'],
                        logos=self.stats['logos_detected']
                    )
                except Exception as e:
                    self.stats['failed_downloads'] += 1
                    if self.verbose:
                        print(f"{Fore.RED}❌ Failed to download {url}: {str(e)}")
    
    def _download_and_process_media(self, url):
        """Download and process individual media file"""
        
        try:
            # Download the file
            response = self.session.get(url, timeout=30, stream=True)
            response.raise_for_status()
            
            # Check if it's actually an image
            content_type = response.headers.get('content-type', '').lower()
            if not any(img_type in content_type for img_type in ['image/', 'svg']):
                # Try to determine from URL extension
                parsed_url = urlparse(url)
                path_ext = Path(parsed_url.path.lower()).suffix
                if path_ext not in self.image_extensions:
                    return
            
            # Read content
            content = response.content
            
            # Check for duplicates using hash
            content_hash = hashlib.md5(content).hexdigest()
            if content_hash in self.downloaded_hashes:
                self.stats['skipped_duplicates'] += 1
                return
            
            self.downloaded_hashes.add(content_hash)
            
            # Determine if it's likely a logo
            is_logo = self._is_likely_logo(url, content)
            
            # Create descriptive filename
            filename = self._create_descriptive_filename(url, content_hash, is_logo)
            
            # Determine save path
            save_path = self.logos_path if is_logo else self.media_path
            file_path = save_path / filename
            
            # Process and save the image
            if self.optimize_images and not url.lower().endswith('.svg'):
                self._optimize_and_save_image(content, file_path)
                self.stats['images_optimized'] += 1
            else:
                # Save as-is
                with open(file_path, 'wb') as f:
                    f.write(content)
            
            self.stats['images_downloaded'] += 1
            
            if is_logo:
                self.stats['logos_detected'] += 1
                
        except Exception as e:
            self.stats['failed_downloads'] += 1
            if self.verbose:
                print(f"{Fore.RED}❌ Error processing {url}: {str(e)}")
    
    def _optimize_and_save_image(self, content, file_path):
        """Optimize image and save with proper format"""
        
        try:
            # Open image
            image = Image.open(io.BytesIO(content))
            
            # Convert to RGB if necessary
            if image.mode in ('RGBA', 'LA', 'P'):
                # Create white background for transparent images
                background = Image.new('RGB', image.size, (255, 255, 255))
                if image.mode == 'P':
                    image = image.convert('RGBA')
                background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
                image = background
            elif image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize if too large (max width 1920px)
            max_width = 1920
            if image.width > max_width:
                ratio = max_width / image.width
                new_height = int(image.height * ratio)
                image = image.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Auto-orient based on EXIF data
            image = ImageOps.exif_transpose(image)
            
            # Save with optimization
            image.save(file_path, 'JPEG', quality=85, optimize=True)
            
        except Exception as e:
            # If optimization fails, save original
            with open(file_path, 'wb') as f:
                f.write(content)
    
    def _is_likely_logo(self, url, content):
        """Determine if an image is likely a logo"""
        
        url_lower = url.lower()
        
        # Check URL for logo keywords
        if any(keyword in url_lower for keyword in self.logo_keywords):
            return True
        
        # Check if it's in a logos/brand directory
        if any(path_part in url_lower for path_part in ['/logo/', '/brand/', '/header/', '/nav/']):
            return True
        
        # Check image dimensions (logos are often small and wide/square)
        try:
            image = Image.open(io.BytesIO(content))
            width, height = image.size
            
            # Small images are likely logos/icons
            if max(width, height) < 200:
                return True
            
            # Wide aspect ratio might be a logo
            if width > height * 2 and height < 100:
                return True
                
        except:
            pass
        
        return False
    
    def _create_descriptive_filename(self, url, content_hash, is_logo):
        """Create descriptive filename for the media file"""
        
        parsed_url = urlparse(url)
        original_path = Path(unquote(parsed_url.path))
        
        # Get original extension
        original_ext = original_path.suffix.lower()
        if not original_ext or original_ext not in self.image_extensions:
            original_ext = '.jpg'
        
        # Extract descriptive parts from URL
        path_parts = [part for part in original_path.parts if part and part != '/']
        filename_parts = []
        
        # Add meaningful parts from URL path
        for part in reversed(path_parts):
            clean_part = re.sub(r'[^a-zA-Z0-9\-_]', '', part.lower())
            if clean_part and len(clean_part) > 2:
                filename_parts.append(clean_part)
                if len(filename_parts) >= 3:  # Limit to avoid too long names
                    break
        
        # Add content-based identifier
        if not filename_parts:
            if is_logo:
                filename_parts = ['logo']
            else:
                filename_parts = ['image']
        
        # Create base filename
        base_name = '-'.join(filename_parts[:3])  # Max 3 parts
        
        # Add hash suffix to prevent collisions
        hash_suffix = content_hash[:8]
        
        filename = f"{base_name}-{hash_suffix}{original_ext}"
        
        # Ensure filename is not too long
        if len(filename) > 100:
            filename = f"{base_name[:50]}-{hash_suffix}{original_ext}"
        
        return filename
    
    def _create_safe_filename(self, url, extension):
        """Create safe filename from URL"""
        
        parsed_url = urlparse(url)
        # Use domain and path to create filename
        domain = parsed_url.netloc.replace('www.', '').replace('.', '-')
        path = parsed_url.path.replace('/', '-').replace('.', '-')
        
        safe_name = f"{domain}{path}"
        # Clean up the name
        safe_name = re.sub(r'[^a-zA-Z0-9\-_]', '', safe_name)
        safe_name = re.sub(r'-+', '-', safe_name).strip('-')
        
        if len(safe_name) > 100:
            safe_name = safe_name[:100]
        
        return f"{safe_name}.{extension}"
    
    def _save_video_urls(self, video_urls):
        """Save video URLs to text file"""
        
        video_file = self.media_path / 'videos.txt'
        
        with open(video_file, 'w', encoding='utf-8') as f:
            f.write("# Video URLs found on the website\n\n")
            for url in video_urls:
                f.write(f"{url}\n")
        
        self.stats['videos_processed'] = len(video_urls)
        
        if self.verbose:
            print(f"{Fore.GREEN}💾 Saved {len(video_urls)} video URLs to: {video_file}") 