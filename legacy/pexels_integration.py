#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Módulo para integrar imágenes de Pexels en las páginas generadas.
Busca imágenes relevantes basadas en el contenido de cada página.
"""
import urllib.request
import urllib.parse
import urllib.error
import json
import time
from typing import Optional, Dict, List

PEXELS_API_KEY = "AAuzTZW64ErFYinHTbZudW68lFcQQOE7dr2T6zzOUxVLptY1ZWQeo4LU"
PEXELS_API_URL = "https://api.pexels.com/v1/search"

# Cache para evitar múltiples llamadas para el mismo término
_image_cache = {}

def get_pexels_image(query: str, per_page: int = 1, orientation: str = "landscape") -> Optional[Dict]:
    """
    Busca una imagen en Pexels basada en una consulta.
    
    Args:
        query: Término de búsqueda
        per_page: Número de resultados por página (default: 1)
        orientation: Orientación de la imagen (landscape, portrait, square)
    
    Returns:
        Dict con información de la imagen o None si no se encuentra
    """
    # Verificar cache
    cache_key = f"{query}_{orientation}"
    if cache_key in _image_cache:
        return _image_cache[cache_key]
    
    # Construir URL con parámetros
    params = {
        "query": query,
        "per_page": per_page,
        "orientation": orientation
    }
    url_with_params = f"{PEXELS_API_URL}?{urllib.parse.urlencode(params)}"
    
    try:
        # Crear request con headers
        req = urllib.request.Request(url_with_params)
        req.add_header("Authorization", PEXELS_API_KEY)
        req.add_header("User-Agent", "Mozilla/5.0")
        
        # Realizar la petición
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status != 200:
                print(f"Error HTTP {response.status} al buscar imagen en Pexels para '{query}'")
                return None
                
            data = json.loads(response.read().decode('utf-8'))
            
            if data.get("photos") and len(data["photos"]) > 0:
                photo = data["photos"][0]
                image_data = {
                    "url": photo["src"]["large"],
                    "photographer": photo["photographer"],
                    "photographer_url": photo["photographer_url"],
                    "alt": f"Foto de {photo['photographer']} en Pexels - {query}",
                    "width": photo["width"],
                    "height": photo["height"]
                }
                
                # Guardar en cache
                _image_cache[cache_key] = image_data
                
                # Rate limiting: esperar un poco para no exceder límites
                time.sleep(0.1)
                
                return image_data
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if hasattr(e, 'read') else ''
        print(f"Error HTTP {e.code} al buscar imagen en Pexels para '{query}': {e.reason}")
        if error_body:
            print(f"Detalles: {error_body[:200]}")
        return None
    except Exception as e:
        print(f"Error al buscar imagen en Pexels para '{query}': {e}")
        return None
    
    return None

def get_relevant_image_for_page(tema: str, url: str, intencion: str) -> Optional[Dict]:
    """
    Determina la mejor imagen para una página basándose en su tema, URL e intención.
    
    Args:
        tema: Tema de la página
        url: URL de la página
        intencion: Intención de la página (Informacional, Transaccional, etc.)
    
    Returns:
        Dict con información de la imagen o None
    """
    # Mapeo de términos de búsqueda basados en el contenido
    search_terms = []
    
    # Extraer ciudad de la URL si es una página de ciudad
    if '/cities/' in url:
        city = url.split('/cities/')[-1].split('/')[0]
        city_map = {
            'mexico-city': 'Mexico City skyline urban',
            'monterrey': 'Monterrey Mexico city mountains',
            'guadalajara': 'Guadalajara Mexico city',
            'toronto': 'Toronto Canada cityscape skyline',
            'vancouver': 'Vancouver Canada city mountains',
            'los-angeles': 'Los Angeles California city skyline'
        }
        if city in city_map:
            search_terms.append(city_map[city])
        # También agregar términos alternativos
        search_terms.append(f'{city.replace("-", " ")} city')
    
    # Mapeo para estadios
    if '/stadiums/' in url or 'estadio' in tema.lower() or 'stadium' in tema.lower():
        if 'azteca' in url or 'azteca' in tema.lower():
            search_terms.append('Estadio Azteca Mexico City football')
            search_terms.append('Mexico City stadium soccer')
        elif 'bbva' in url or 'bbva' in tema.lower():
            search_terms.append('Monterrey stadium football')
            search_terms.append('modern football stadium')
        elif 'akron' in url or 'akron' in tema.lower():
            search_terms.append('Guadalajara stadium soccer')
            search_terms.append('football stadium Mexico')
        else:
            search_terms.append('football stadium world cup')
            search_terms.append('soccer stadium')
    
    # Mapeo para equipos/selecciones
    if '/teams/' in url or 'seleccion' in tema.lower() or 'team' in tema.lower():
        if 'mexico' in url or 'méxico' in tema.lower():
            search_terms.append('Mexico national football team')
            search_terms.append('Mexico soccer team')
        else:
            search_terms.append('football team world cup')
            search_terms.append('national soccer team')
    
    # Mapeo para viajes
    if '/travel/' in url or 'viaje' in tema.lower() or 'travel' in tema.lower():
        if '/flights/' in url or 'vuelo' in tema.lower():
            search_terms.append('airplane travel flight')
            search_terms.append('airport travel')
        elif '/stay/' in url or 'alojamiento' in tema.lower() or 'hotel' in tema.lower():
            search_terms.append('hotel accommodation travel')
            search_terms.append('modern hotel room')
        elif '/transport/' in url or 'transporte' in tema.lower():
            search_terms.append('public transport travel')
            search_terms.append('city transportation')
        else:
            search_terms.append('travel world cup')
            search_terms.append('travel adventure')
    
    # Mapeo para entradas
    if '/tickets/' in url or 'entrada' in tema.lower() or 'ticket' in tema.lower():
        search_terms.append('football match tickets stadium')
        search_terms.append('soccer match fans')
        search_terms.append('football stadium crowd')
    
    # Mapeo para formato/calendario
    if 'formato' in url or 'format' in url:
        search_terms.append('world cup football tournament')
        search_terms.append('football championship')
    elif 'schedule' in url or 'calendario' in url:
        search_terms.append('world cup schedule calendar')
        search_terms.append('sports calendar schedule')
    
    # Mapeo para historia/récords
    if '/history/' in url or 'historia' in tema.lower() or 'record' in tema.lower():
        search_terms.append('world cup history football')
        search_terms.append('football trophy history')
        search_terms.append('soccer championship')
    
    # Mapeo genérico basado en el tema
    if not search_terms:
        # Extraer palabras clave del tema
        tema_clean = tema.lower()
        if 'mundial' in tema_clean or 'world cup' in tema_clean:
            search_terms.append('world cup football')
            search_terms.append('football championship')
        elif 'futbol' in tema_clean or 'football' in tema_clean or 'soccer' in tema_clean:
            search_terms.append('football soccer match')
            search_terms.append('soccer game')
        else:
            # Usar el tema directamente
            search_terms.append(tema)
            search_terms.append('world cup 2026')
    
    # Intentar buscar con cada término hasta encontrar una imagen
    for term in search_terms:
        image = get_pexels_image(term)
        if image:
            return image
    
    # Si no se encuentra nada, intentar con términos genéricos como fallback
    fallback_terms = ["world cup football", "soccer match", "football stadium", "sports championship"]
    for term in fallback_terms:
        image = get_pexels_image(term)
        if image:
            return image
    
    return None

def generate_image_html(image_data: Dict, class_name: str = "featured-image", size: str = "large") -> str:
    """
    Genera el HTML para una imagen de Pexels.
    
    Args:
        image_data: Dict con información de la imagen
        class_name: Clase CSS para la imagen
        size: Tamaño de la imagen (large, medium, small)
    
    Returns:
        String con el HTML de la imagen
    """
    if not image_data:
        return ""
    
    # Seleccionar tamaño de imagen
    if size == "medium":
        img_url = image_data['url'].replace('large', 'medium') if 'large' in image_data['url'] else image_data['url']
    elif size == "small":
        img_url = image_data['url'].replace('large', 'small') if 'large' in image_data['url'] else image_data['url']
    else:
        img_url = image_data['url']
    
    return f'''
        <figure class="{class_name}">
            <img src="{img_url}" 
                 alt="{image_data['alt']}" 
                 width="{image_data.get('width', 1200)}" 
                 height="{image_data.get('height', 800)}"
                 loading="lazy"
                 style="max-width: 100%; height: auto; border-radius: 8px; margin: 2rem 0;">
            <figcaption style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
                Foto de <a href="{image_data['photographer_url']}" target="_blank" rel="noopener noreferrer" style="color: #1a472a;">{image_data['photographer']}</a> en <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" style="color: #1a472a;">Pexels</a>
            </figcaption>
        </figure>
    '''

def get_multiple_images_for_content(tema: str, url: str, section_keywords: List[str]) -> List[Dict]:
    """
    Obtiene múltiples imágenes relevantes para diferentes secciones del contenido.
    
    Args:
        tema: Tema de la página
        url: URL de la página
        section_keywords: Lista de términos de búsqueda para cada sección
    
    Returns:
        Lista de dicts con información de imágenes
    """
    images = []
    for keyword in section_keywords:
        image = get_pexels_image(keyword)
        if image:
            images.append(image)
        # Limitar a máximo 5 imágenes para no exceder límites de API
        if len(images) >= 5:
            break
    return images

def insert_images_in_content(content: str, images: List[Dict], insert_after_h2: bool = True) -> str:
    """
    Inserta imágenes estratégicamente en el contenido HTML.
    
    Args:
        content: Contenido HTML
        images: Lista de imágenes a insertar
        insert_after_h2: Si True, inserta después de H2, si False, después de párrafos
    
    Returns:
        Contenido HTML con imágenes insertadas
    """
    if not images:
        return content
    
    import re
    
    # Dividir contenido en secciones basadas en H2
    # Buscar todos los H2 y sus posiciones
    h2_pattern = r'(<h2>.*?</h2>)'
    parts = re.split(h2_pattern, content)
    
    result_parts = []
    image_index = 0
    
    for i, part in enumerate(parts):
        result_parts.append(part)
        
        # Si es un H2 y hay imágenes disponibles, insertar imagen después
        if re.match(r'<h2>.*?</h2>', part) and image_index < len(images):
            # Buscar el siguiente párrafo después del H2 para insertar la imagen
            # Insertar después del H2 y antes del siguiente contenido
            if image_index < len(images):
                image_html = generate_image_html(images[image_index], class_name="content-image", size="medium")
                result_parts.append(image_html)
                image_index += 1
    
    # Si no se insertaron todas las imágenes con H2, intentar insertarlas después de párrafos
    if image_index < len(images) and not insert_after_h2:
        # Dividir por párrafos
        p_pattern = r'(<p>.*?</p>)'
        parts = re.split(p_pattern, ''.join(result_parts))
        result_parts = []
        
        for i, part in enumerate(parts):
            result_parts.append(part)
            # Insertar imagen después de cada segundo párrafo
            if re.match(r'<p>.*?</p>', part) and i % 2 == 1 and image_index < len(images):
                image_html = generate_image_html(images[image_index], class_name="content-image", size="medium")
                result_parts.append(image_html)
                image_index += 1
    
    return ''.join(result_parts)

