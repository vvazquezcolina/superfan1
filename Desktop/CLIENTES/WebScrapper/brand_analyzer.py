"""
Brand Analyzer Module - Analyzes website text to extract brand information
"""

import re
from pathlib import Path
from collections import Counter
from colorama import Fore, Style
import textstat

class BrandAnalyzer:
    """Analyzes website content to extract brand information and create brand brief"""
    
    def __init__(self, output_path, verbose=False):
        self.output_path = Path(output_path)
        self.info_path = self.output_path / 'info'
        self.verbose = verbose
        
        # Common color hex patterns
        self.hex_color_pattern = re.compile(r'#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})')
        
        # Font patterns
        self.font_patterns = [
            r'font-family:\s*["\']?([^"\';\n]+)["\']?',
            r'fontFamily:\s*["\']([^"\']+)["\']',
            r'--font-[^:]*:\s*["\']?([^"\';\n]+)["\']?'
        ]
        
        # Common service/product keywords
        self.service_keywords = {
            'services', 'solutions', 'products', 'offerings', 'consulting',
            'software', 'platform', 'tool', 'app', 'system', 'service',
            'technology', 'development', 'design', 'marketing', 'analytics'
        }
        
        # Tone indicators
        self.tone_keywords = {
            'professional': ['professional', 'business', 'enterprise', 'corporate', 'industry'],
            'friendly': ['friendly', 'welcoming', 'approachable', 'personal', 'warm'],
            'innovative': ['innovative', 'cutting-edge', 'modern', 'advanced', 'next-generation'],
            'reliable': ['reliable', 'trusted', 'secure', 'stable', 'proven'],
            'creative': ['creative', 'artistic', 'unique', 'original', 'inspiring'],
            'casual': ['casual', 'relaxed', 'informal', 'easy', 'simple']
        }
        
        # Target audience keywords
        self.audience_keywords = {
            'businesses': ['business', 'company', 'corporation', 'enterprise', 'organization'],
            'startups': ['startup', 'entrepreneur', 'founders', 'early-stage'],
            'developers': ['developer', 'programmer', 'engineer', 'technical', 'coding'],
            'designers': ['designer', 'creative', 'artist', 'visual', 'graphic'],
            'consumers': ['customer', 'user', 'individual', 'personal', 'consumer'],
            'professionals': ['professional', 'expert', 'specialist', 'practitioner']
        }
    
    def analyze_brand(self, text_content):
        """Main brand analysis function"""
        
        # Combine all text
        full_text = ' '.join(text_content)
        
        # Clean and prepare text for analysis
        clean_text = self._clean_text(full_text)
        
        # Extract brand information
        brand_name = self._extract_brand_name(clean_text)
        tagline = self._extract_tagline(clean_text)
        services = self._extract_services(clean_text)
        audience = self._identify_target_audience(clean_text)
        tone = self._analyze_tone(clean_text)
        colors = self._extract_colors(full_text)  # Use original text for CSS
        fonts = self._extract_fonts(full_text)
        mission = self._extract_mission(clean_text)
        
        # Create brand brief
        brand_brief = self._create_brand_brief(
            brand_name, tagline, services, audience, tone, colors, fonts, mission
        )
        
        # Save brand brief
        self._save_brand_brief(brand_brief)
        
        return {
            'brand_name': brand_name,
            'tagline': tagline,
            'services': services,
            'audience': audience,
            'tone': tone,
            'colors': colors,
            'fonts': fonts,
            'mission': mission
        }
    
    def _clean_text(self, text):
        """Clean and normalize text for analysis"""
        
        # Remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', text)
        
        # Remove common navigation and footer text
        noise_patterns = [
            r'copyright.*?\d{4}',
            r'all rights reserved',
            r'privacy policy',
            r'terms of service',
            r'cookie policy',
            r'home\s+about\s+contact',
            r'menu\s+toggle',
            r'skip to content'
        ]
        
        for pattern in noise_patterns:
            text = re.sub(pattern, '', text, flags=re.IGNORECASE)
        
        return text.strip()
    
    def _extract_brand_name(self, text):
        """Extract likely brand name from text"""
        
        # Look for common patterns
        patterns = [
            r'welcome to ([A-Z][a-zA-Z\s]+)',
            r'about ([A-Z][a-zA-Z\s]{2,20})',
            r'^([A-Z][a-zA-Z\s]{2,20})\s+is\s+',
            r'([A-Z][a-zA-Z\s]{2,20})\s+helps\s+',
            r'at ([A-Z][a-zA-Z\s]{2,20}),?\s+we'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                # Return the most common match
                brand_candidates = [match.strip() for match in matches]
                if brand_candidates:
                    return Counter(brand_candidates).most_common(1)[0][0]
        
        # Fallback: look for capitalized words at the beginning
        words = text.split()[:50]  # First 50 words
        capitalized = [word for word in words if word[0].isupper() and len(word) > 2]
        
        if capitalized:
            return capitalized[0]
        
        return "Brand Name"  # Default fallback
    
    def _extract_tagline(self, text):
        """Extract potential tagline or slogan"""
        
        # Look for common tagline patterns
        patterns = [
            r'([A-Z][^.!?]*(?:solution|innovation|future|better|best|leading)[^.!?]*[.!])',
            r'([A-Z][^.!?]*(?:we help|we make|we create|we build)[^.!?]*[.!])',
            r'([A-Z][^.!?]*(?:your|our).*?(?:partner|solution|choice)[^.!?]*[.!])'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text)
            if matches:
                # Return the shortest match (taglines are usually concise)
                taglines = [match.strip() for match in matches if 10 < len(match) < 100]
                if taglines:
                    return min(taglines, key=len)
        
        # Look for sentences with specific keywords
        sentences = re.split(r'[.!?]+', text)
        for sentence in sentences[:20]:  # Check first 20 sentences
            if any(keyword in sentence.lower() for keyword in ['mission', 'vision', 'believe']):
                if 10 < len(sentence) < 150:
                    return sentence.strip()
        
        return "Empowering your success"
    
    def _extract_services(self, text):
        """Extract services or products offered"""
        
        services = []
        text_lower = text.lower()
        
        # Look for service-related sections
        service_sections = re.findall(
            r'(?:services|products|solutions|offerings)[^.]*?([^.!?]*[.!?])',
            text_lower
        )
        
        # Extract service keywords
        words = re.findall(r'\b\w+\b', text_lower)
        word_freq = Counter(words)
        
        # Find service-related terms
        for word, freq in word_freq.most_common(50):
            if word in self.service_keywords and freq > 2:
                services.append(word.title())
        
        # Look for bulleted or listed services
        list_patterns = [
            r'[•\*\-]\s*([A-Z][^.!?\n]*)',
            r'\d+\.\s*([A-Z][^.!?\n]*)',
            r'(?:we offer|we provide|including)[:\s]*([^.!?\n]*)'
        ]
        
        for pattern in list_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                if 5 < len(match) < 50:
                    services.append(match.strip())
        
        # Remove duplicates and limit
        unique_services = list(dict.fromkeys(services))[:5]
        return unique_services if unique_services else ["Digital Solutions", "Consulting"]
    
    def _identify_target_audience(self, text):
        """Identify target audience from text"""
        
        text_lower = text.lower()
        audience_scores = {}
        
        # Score each audience type
        for audience_type, keywords in self.audience_keywords.items():
            score = sum(text_lower.count(keyword) for keyword in keywords)
            if score > 0:
                audience_scores[audience_type] = score
        
        # Return top audiences
        if audience_scores:
            sorted_audiences = sorted(audience_scores.items(), key=lambda x: x[1], reverse=True)
            return [audience.title() for audience, score in sorted_audiences[:3]]
        
        return ["Businesses", "Professionals"]
    
    def _analyze_tone(self, text):
        """Analyze the tone of the content"""
        
        text_lower = text.lower()
        tone_scores = {}
        
        # Score each tone
        for tone_type, keywords in self.tone_keywords.items():
            score = sum(text_lower.count(keyword) for keyword in keywords)
            if score > 0:
                tone_scores[tone_type] = score
        
        # Return primary tone
        if tone_scores:
            primary_tone = max(tone_scores, key=tone_scores.get)
            return primary_tone.title()
        
        return "Professional"
    
    def _extract_colors(self, text):
        """Extract hex color codes from text (likely CSS)"""
        
        colors = self.hex_color_pattern.findall(text)
        
        # Clean and deduplicate colors
        unique_colors = []
        seen = set()
        
        for color in colors:
            # Normalize 3-digit hex to 6-digit
            if len(color) == 3:
                color = ''.join([c*2 for c in color])
            
            color_upper = color.upper()
            if color_upper not in seen:
                seen.add(color_upper)
                unique_colors.append(f"#{color_upper}")
        
        # Filter out very common colors (black, white, etc.)
        common_colors = {'#000000', '#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333'}
        unique_colors = [c for c in unique_colors if c not in common_colors]
        
        return unique_colors[:6]  # Return up to 6 colors
    
    def _extract_fonts(self, text):
        """Extract font families from CSS"""
        
        fonts = []
        
        for pattern in self.font_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                # Clean font name
                font = match.strip().replace('"', '').replace("'", '')
                if ',' in font:
                    font = font.split(',')[0].strip()
                
                if font and len(font) > 2 and font not in fonts:
                    fonts.append(font)
        
        # Remove generic fonts and duplicates
        generic_fonts = {'arial', 'helvetica', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'}
        fonts = [f for f in fonts if f.lower() not in generic_fonts]
        
        return fonts[:4]  # Return up to 4 fonts
    
    def _extract_mission(self, text):
        """Extract or generate mission statement"""
        
        # Look for existing mission/vision statements
        mission_patterns = [
            r'(?:mission|vision|purpose)[:\s]*([^.!?]*[.!?])',
            r'(?:we believe|our goal|our mission)[:\s]*([^.!?]*[.!?])',
            r'(?:dedicated to|committed to)[:\s]*([^.!?]*[.!?])'
        ]
        
        for pattern in mission_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if 20 < len(match) < 200:
                    return match.strip()
        
        # Generate based on content analysis
        sentences = re.split(r'[.!?]+', text)
        
        # Look for sentences that describe what the company does
        for sentence in sentences:
            if any(phrase in sentence.lower() for phrase in ['we help', 'we provide', 'we create', 'we build']):
                if 20 < len(sentence) < 150:
                    return sentence.strip() + "."
        
        return "Delivering innovative solutions to help our clients achieve their goals and drive success."
    
    def _create_brand_brief(self, brand_name, tagline, services, audience, tone, colors, fonts, mission):
        """Create comprehensive brand brief"""
        
        brief = f"""# Brand Brief

## Brand Identity
**Brand Name:** {brand_name}
**Tagline:** {tagline}

## Mission Statement
{mission}

## Products/Services
"""
        
        for i, service in enumerate(services, 1):
            brief += f"{i}. {service}\n"
        
        brief += f"""
## Target Audience
"""
        for audience_type in audience:
            brief += f"- {audience_type}\n"
        
        brief += f"""
## Brand Tone
{tone}

## Visual Identity

### Primary Colors"""
        
        if colors:
            for i, color in enumerate(colors[:2], 1):
                brief += f"\n- Primary Color {i}: {color}"
        else:
            brief += "\n- Primary Color 1: #1E40AF\n- Primary Color 2: #059669"
        
        brief += "\n\n### Secondary Colors"
        
        if len(colors) > 2:
            for i, color in enumerate(colors[2:4], 1):
                brief += f"\n- Secondary Color {i}: {color}"
        else:
            brief += "\n- Secondary Color 1: #6B7280\n- Secondary Color 2: #F3F4F6"
        
        brief += "\n\n### Typography"
        
        if fonts:
            for i, font in enumerate(fonts, 1):
                brief += f"\n- Font {i}: {font}"
        else:
            brief += "\n- Primary Font: Inter\n- Secondary Font: Georgia"
        
        brief += f"""

## Brand Summary
{brand_name} is a {tone.lower()} brand that serves {', '.join(audience).lower()}. 
The company focuses on {', '.join(services[:3]).lower()} and maintains a {tone.lower()} 
approach to client relationships. The brand identity emphasizes trust, innovation, 
and delivering measurable value to clients.

---
*This brand brief was generated automatically from website content analysis.*
"""
        
        return brief
    
    def _save_brand_brief(self, brand_brief):
        """Save the brand brief to file"""
        
        brief_path = self.info_path / 'brand_brief.txt'
        
        with open(brief_path, 'w', encoding='utf-8') as f:
            f.write(brand_brief)
        
        if self.verbose:
            print(f"{Fore.GREEN}📋 Brand brief saved to: {brief_path}") 