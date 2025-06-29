# Brand Asset Scraper 🕷️🎨

A comprehensive CLI tool that extracts brand assets and analyzes websites for rapid site cloning. Perfect for designers, developers, and marketers who need to quickly understand and replicate brand identities.

## ✨ Features

- **🕷️ Full Website Crawling**: Crawls entire websites with configurable depth and page limits
- **🎨 Asset Extraction**: Downloads and organizes all images, videos, and media files
- **🧠 Brand Analysis**: Uses AI-powered text analysis to extract brand information
- **🖼️ Image Optimization**: Lossless compression and resizing (max 1920px width)
- **🔍 Logo Detection**: Automatically identifies and separates logo files
- **📝 Descriptive Naming**: Renames files with meaningful, SEO-friendly names
- **🎯 Brand Brief Generation**: Creates comprehensive brand briefs with colors, fonts, and tone
- **📊 Detailed Reporting**: Console and file reports with extraction statistics

## 🚀 Quick Start

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd WebScrapper
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the scraper:**
```bash
python main.py https://example.com
```

### Basic Usage Examples

```bash
# Scrape a website with default settings
python main.py https://apple.com

# Custom output directory and crawl depth
python main.py https://nike.com -o ./nike_assets -d 2

# Limit pages and skip videos for faster processing
python main.py https://stripe.com --max-pages 25 --skip-videos

# Verbose mode with no image optimization
python main.py https://airbnb.com --verbose --no-optimize

# Get help and see all options
python main.py --help
```

## 📁 Output Structure

The tool creates a well-organized directory structure:

```
scraped_assets/
├── media/
│   ├── logos/                    # Auto-detected logo files
│   │   ├── company-logo-a1b2c3d4.png
│   │   └── brand-header-e5f6g7h8.svg
│   ├── hero-image-i9j0k1l2.jpg   # Descriptively named images
│   ├── product-shot-m3n4o5p6.jpg
│   └── videos.txt                # List of video URLs found
├── info/
│   ├── raw.txt                   # All extracted text content
│   └── brand_brief.txt           # AI-generated brand analysis
├── html/                         # Raw HTML pages for reference
│   ├── 001_example-com.html
│   └── 002_example-com-about.html
└── extraction_report.txt         # Detailed extraction report
```

## 🎯 Brand Brief Features

The AI-powered brand analyzer extracts:

- **Brand Identity**: Name, tagline, mission statement
- **Products/Services**: Automatically identified offerings
- **Target Audience**: Detected customer segments
- **Brand Tone**: Professional, friendly, innovative, etc.
- **Visual Identity**: 
  - Primary and secondary hex colors
  - Typography (extracted from CSS)
  - Logo files (auto-detected and organized)

## ⚙️ Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `url` | Target website URL to scrape | Required |
| `-o, --output` | Output directory path | `./scraped_assets` |
| `-d, --depth` | Maximum crawl depth | `3` |
| `--max-pages` | Maximum pages to scrape | `100` |
| `--skip-videos` | Skip video URL extraction | `False` |
| `--no-optimize` | Skip image optimization | `False` |
| `-v, --verbose` | Enable detailed logging | `False` |

## 🛠️ Advanced Features

### Logo Detection Algorithm

The tool uses multiple signals to identify logos:
- URL patterns (`/logo/`, `/brand/`, `/header/`)
- Filename keywords (`logo`, `brand`, `company-logo`)
- Image dimensions (small, wide aspect ratios)
- CSS class names (`navbar-brand`, `site-logo`)

### Image Optimization

- **Format Conversion**: Converts all images to optimized JPEG
- **Resizing**: Max width of 1920px while maintaining aspect ratio
- **Compression**: 85% quality with optimization enabled
- **EXIF Handling**: Auto-rotation based on EXIF data
- **Transparency**: White background for transparent PNGs

### Brand Analysis Intelligence

- **Text Processing**: Removes navigation, footer, and boilerplate content
- **Keyword Extraction**: Identifies services, audience, and tone indicators
- **Color Extraction**: Finds hex colors in CSS and inline styles
- **Font Detection**: Extracts font-family declarations from CSS
- **Mission Extraction**: Locates mission/vision statements

## 📊 Sample Report

```
═══════════════════════════════════════════════════════════════
                          EXTRACTION REPORT                          
═══════════════════════════════════════════════════════════════

📊 SCRAPING SUMMARY
   • Pages crawled: 25
   • Domain: example.com
   • Text content saved to: ./scraped_assets/info/raw.txt

🎨 ASSET PROCESSING
   • Images downloaded: 47
   • Images optimized: 42
   • Logos detected: 3
   • Video URLs saved: 8
   • Failed downloads: 2

🧠 BRAND ANALYSIS
   • Brand Name: Example Corp
   • Tagline: Innovation at your fingertips
   • Primary Tone: Professional
   • Target Audience: Businesses, Professionals
   • Services Identified: 4
   • Colors Extracted: 6
   • Fonts Found: 2
```

## 🔧 Configuration Tips

### For Large Websites
```bash
# Increase limits for comprehensive scraping
python main.py https://large-site.com --max-pages 500 -d 4
```

### For Quick Brand Analysis
```bash
# Fast analysis with limited scope
python main.py https://startup.com --max-pages 10 -d 1 --skip-videos
```

### For Media-Heavy Sites
```bash
# Skip optimization for speed
python main.py https://portfolio.com --no-optimize --verbose
```

## 🚫 Limitations & Ethics

### Respectful Scraping
- Built-in 1-second delay between requests
- Checks `robots.txt` (warns if disallowed)
- Respects rate limits and server resources
- User-Agent identifies as browser, not bot

### Legal Considerations
- Only scrape websites you have permission to access
- Respect copyright and intellectual property rights
- Use extracted assets responsibly and legally
- Consider terms of service for each website

### Technical Limitations
- JavaScript-heavy sites may have incomplete extraction
- Some images may fail due to hotlink protection
- CDN assets might not be accessible
- Large files may timeout during download

## 🐛 Troubleshooting

### Common Issues

**Empty Results:**
- Check if the website requires JavaScript
- Verify the URL is accessible
- Try with `--verbose` flag for detailed logs

**Download Failures:**
- Some sites block direct asset downloads
- Check your internet connection
- Reduce concurrent requests if needed

**Analysis Inaccuracies:**
- Brand analysis works best with content-rich sites
- Marketing pages provide better results than technical docs
- E-commerce sites may have mixed signals

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- JavaScript rendering support (using Selenium/Puppeteer)
- Better logo detection algorithms
- Enhanced brand analysis with NLP models
- Video download capabilities
- Website screenshot generation
- Color palette generation from images

## 📄 License

This project is for educational and ethical use only. Please respect website terms of service and copyright laws.

---

**Happy brand scraping! 🚀** 

Use this tool responsibly to understand brand identities and create inspired (not copied) designs. 