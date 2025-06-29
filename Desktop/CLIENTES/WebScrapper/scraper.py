"""
Web Scraper Module - Handles website crawling and content extraction
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, urlunparse
from urllib.robotparser import RobotFileParser
import time
import re
from pathlib import Path
from collections import deque
from tqdm import tqdm
from colorama import Fore, Style

class WebScraper:
    """Handles comprehensive website crawling and content extraction"""
    
    def __init__(self, max_depth=3, max_pages=100, delay=1, verbose=False):
        self.max_depth = max_depth
        self.max_pages = max_pages
        self.delay = delay  # Delay between requests (be respectful)
        self.verbose = verbose
        
        # Initialize session with proper headers
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
        
        # Storage for scraped data
        self.visited_urls = set()
        self.pages_data = {}
        self.all_text = []
        self.media_urls = []
        self.video_urls = []
        
    def crawl_site(self, start_url):
        """Main crawling function that orchestrates the entire process"""
        
        base_domain = urlparse(start_url).netloc
        
        # Check robots.txt
        if self.verbose:
            print(f"{Fore.CYAN}🤖 Checking robots.txt...")
        
        robots_allowed = self._check_robots_txt(start_url)
        if not robots_allowed:
            print(f"{Fore.YELLOW}⚠️  robots.txt disallows crawling, proceeding anyway...")
        
        # Initialize crawling queue
        crawl_queue = deque([(start_url, 0)])  # (url, depth)
        
        with tqdm(total=self.max_pages, desc="Crawling pages", unit="page") as pbar:
            while crawl_queue and len(self.visited_urls) < self.max_pages:
                current_url, depth = crawl_queue.popleft()
                
                # Skip if already visited or depth exceeded
                if current_url in self.visited_urls or depth > self.max_depth:
                    continue
                
                # Skip external links
                if urlparse(current_url).netloc != base_domain:
                    continue
                
                if self.verbose:
                    print(f"{Fore.CYAN}🔍 Crawling: {current_url} (depth: {depth})")
                
                try:
                    # Fetch and parse page
                    page_data = self._scrape_page(current_url)
                    
                    if page_data:
                        self.visited_urls.add(current_url)
                        self.pages_data[current_url] = page_data
                        
                        # Add text content
                        if page_data['text']:
                            self.all_text.extend(page_data['text'])
                        
                        # Collect media URLs
                        self.media_urls.extend(page_data['images'])
                        self.video_urls.extend(page_data['videos'])
                        
                        # Add internal links to queue for next depth level
                        for link in page_data['internal_links']:
                            if link not in self.visited_urls:
                                crawl_queue.append((link, depth + 1))
                        
                        pbar.update(1)
                    
                    # Be respectful - add delay between requests
                    time.sleep(self.delay)
                    
                except Exception as e:
                    if self.verbose:
                        print(f"{Fore.RED}❌ Error scraping {current_url}: {str(e)}")
                    continue
        
        # Compile results
        results = {
            'pages': self.pages_data,
            'text_content': self.all_text,
            'media_urls': list(set(self.media_urls)),  # Remove duplicates
            'video_urls': list(set(self.video_urls)),
            'total_pages': len(self.visited_urls),
            'base_domain': base_domain
        }
        
        print(f"{Fore.GREEN}✅ Crawled {len(self.visited_urls)} pages successfully")
        return results
    
    def _scrape_page(self, url):
        """Scrape individual page and extract all relevant content"""
        
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.content, 'lxml')
            
            # Extract text content
            text_content = self._extract_text_content(soup)
            
            # Extract media URLs
            images = self._extract_images(soup, url)
            videos = self._extract_videos(soup, url)
            
            # Extract internal links
            internal_links = self._extract_internal_links(soup, url)
            
            # Save raw HTML
            html_content = str(soup)
            
            return {
                'url': url,
                'html': html_content,
                'text': text_content,
                'images': images,
                'videos': videos,
                'internal_links': internal_links,
                'title': soup.title.string if soup.title else '',
                'meta_description': self._get_meta_description(soup)
            }
            
        except Exception as e:
            if self.verbose:
                print(f"{Fore.RED}❌ Failed to scrape {url}: {str(e)}")
            return None
    
    def _extract_text_content(self, soup):
        """Extract clean text content from HTML"""
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()
        
        # Get text and clean it
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text_content = [chunk for chunk in chunks if chunk]
        
        return text_content
    
    def _extract_images(self, soup, base_url):
        """Extract all image URLs from the page"""
        
        images = []
        
        # Find all img tags
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
            if src:
                full_url = urljoin(base_url, src)
                images.append(full_url)
        
        # Find CSS background images
        for element in soup.find_all(style=True):
            style = element.get('style', '')
            bg_matches = re.findall(r'background-image:\s*url\(["\']?([^"\']+)["\']?\)', style)
            for match in bg_matches:
                full_url = urljoin(base_url, match)
                images.append(full_url)
        
        # Find SVG images
        for svg in soup.find_all('svg'):
            # Check for embedded images in SVG
            for image in svg.find_all('image'):
                href = image.get('href') or image.get('xlink:href')
                if href:
                    full_url = urljoin(base_url, href)
                    images.append(full_url)
        
        return images
    
    def _extract_videos(self, soup, base_url):
        """Extract video URLs from the page"""
        
        videos = []
        
        # Find video tags
        for video in soup.find_all('video'):
            src = video.get('src')
            if src:
                full_url = urljoin(base_url, src)
                videos.append(full_url)
            
            # Check source tags within video
            for source in video.find_all('source'):
                src = source.get('src')
                if src:
                    full_url = urljoin(base_url, src)
                    videos.append(full_url)
        
        # Find iframe embeds (YouTube, Vimeo, etc.)
        for iframe in soup.find_all('iframe'):
            src = iframe.get('src')
            if src and any(domain in src for domain in ['youtube.com', 'vimeo.com', 'dailymotion.com']):
                videos.append(src)
        
        return videos
    
    def _extract_internal_links(self, soup, base_url):
        """Extract internal links for further crawling"""
        
        base_domain = urlparse(base_url).netloc
        internal_links = []
        
        for link in soup.find_all('a', href=True):
            href = link.get('href')
            if href:
                full_url = urljoin(base_url, href)
                parsed_url = urlparse(full_url)
                
                # Only include internal links
                if parsed_url.netloc == base_domain:
                    # Clean URL (remove fragments and query params for crawling)
                    clean_url = urlunparse(parsed_url._replace(fragment='', query=''))
                    internal_links.append(clean_url)
        
        return list(set(internal_links))  # Remove duplicates
    
    def _get_meta_description(self, soup):
        """Extract meta description"""
        
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            return meta_desc.get('content', '')
        return ''
    
    def _check_robots_txt(self, url):
        """Check if crawling is allowed by robots.txt"""
        
        try:
            parsed_url = urlparse(url)
            robots_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"
            
            rp = RobotFileParser()
            rp.set_url(robots_url)
            rp.read()
            
            return rp.can_fetch('*', url)
        except:
            return True  # Assume allowed if can't check 