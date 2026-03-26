#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import csv
from datetime import datetime
from pathlib import Path

def generate_sitemap():
    """Generate sitemap.xml from CSV"""
    base_url = "https://www.superfan.com"
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url>
        <loc>{base_url}/</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
'''
    
    with open('seo_world_cup_structure.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            url = row['URL sugerida'].strip('/')
            if not url or url.startswith('['):
                continue
            
            nivel = row['Nivel']
            # Priority based on level
            if nivel == 'L1':
                priority = '0.9'
                changefreq = 'weekly'
            elif nivel == 'L2':
                priority = '0.8'
                changefreq = 'monthly'
            else:
                priority = '0.7'
                changefreq = 'monthly'
            
            sitemap += f'''    <url>
        <loc>{base_url}/{url}/</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>{changefreq}</changefreq>
        <priority>{priority}</priority>
    </url>
'''
    
    sitemap += '</urlset>'
    return sitemap

if __name__ == '__main__':
    sitemap_xml = generate_sitemap()
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_xml)
    print("Sitemap.xml generated successfully!")


