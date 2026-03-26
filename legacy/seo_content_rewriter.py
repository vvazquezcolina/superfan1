#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para reescribir contenido SEO basado en análisis de URLs que rankean bien.
Este script analiza contenido de URLs competidoras y genera contenido optimizado.
"""

import csv
import re
from pathlib import Path
from urllib.parse import urlparse

def extract_keyword_spanish(keywords_en_es):
    """Extrae la keyword en español del formato EN/ES"""
    if ' / ' in keywords_en_es:
        return keywords_en_es.split(' / ')[1]
    return keywords_en_es

def generate_seo_optimized_content(keyword, tema, h1, intencion):
    """
    Genera contenido SEO optimizado basado en análisis.
    Por ahora usa templates mejorados, pero idealmente debería analizar URLs reales.
    """
    
    # Contenido base optimizado para SEO
    content = f"# {h1}\n\n"
    
    if intencion == 'Informacional':
        content += generate_informational_content(keyword, tema, h1)
    elif intencion == 'Comercial':
        content += generate_commercial_content(keyword, tema, h1)
    else:  # Transaccional suave
        content += generate_transactional_content(keyword, tema, h1)
    
    # Agregar FAQs al final
    content += generate_faqs(keyword, tema)
    
    return content

def generate_informational_content(keyword, tema, h1):
    """Genera contenido informacional optimizado"""
    content = f"""
## ¿Qué es {tema} en el Mundial 2026?

{tema} es uno de los aspectos más importantes del **Mundial 2026** que todo fanático debe conocer. Con la expansión del torneo a **48 equipos** y la celebración del evento en **tres países diferentes** (México, Estados Unidos y Canadá), {keyword.lower()} adquiere una relevancia sin precedentes.

El Mundial 2026 representa un momento histórico en el fútbol mundial. Esta edición de la Copa del Mundo FIFA será la primera con 48 equipos participantes, un aumento significativo desde los 32 equipos que han competido desde 1998.

## Por qué {tema} es Importante para el Mundial 2026

{tema} juega un papel crucial en la experiencia del Mundial 2026. Entender {keyword.lower()} puede mejorar significativamente cómo planeas y disfrutas del evento, ya sea que estés planificando asistir en persona o siguiendo el torneo desde casa.

Los factores clave que debes considerar incluyen:

- La expansión del torneo a 48 equipos introduce nuevos elementos
- La celebración del torneo en múltiples ciudades a través de tres países
- La necesidad de planificación anticipada debido a la alta demanda esperada

## Detalles Específicos sobre {tema}

Cuando se trata de {keyword.lower()} en el Mundial 2026, hay varios aspectos importantes:

**Aspectos Técnicos**: El formato ampliado del torneo modifica fundamentalmente {keyword.lower()} comparado con ediciones anteriores.

**Aspectos Logísticos**: La distribución geográfica del torneo a través de México, Estados Unidos y Canadá añade capas adicionales de complejidad e interés.

**Aspectos Prácticos**: Los fanáticos deben considerar factores como presupuesto, tiempo disponible, y preferencias personales al planificar {keyword.lower()}.

## Cómo Usar Esta Información

La información sobre {keyword.lower()} que proporcionamos aquí está diseñada para ser práctica y aplicable. Ya sea que estés en las etapas iniciales de planificación o ya tengas planes específicos para el Mundial 2026, esta guía te ayudará a navegar {keyword.lower()} con confianza.

**Recomendaciones clave**:

- Comienza tu planificación al menos 12-18 meses antes del torneo
- Investiga todas las opciones disponibles
- Compara precios y servicios de diferentes proveedores
- Mantente actualizado con los últimos anuncios oficiales

## Aspectos Adicionales a Considerar

Para complementar esta información sobre {keyword.lower()}, es importante considerar otros aspectos relacionados:

- El impacto del formato ampliado en {keyword.lower()}
- Las opciones disponibles para diferentes presupuestos
- La demanda esperada y cómo afectará {keyword.lower()}
- Los recursos adicionales disponibles para fanáticos

Esta información te ayudará a tomar decisiones informadas y maximizar tu experiencia durante el Mundial 2026.

"""
    return content

def generate_commercial_content(keyword, tema, h1):
    """Genera contenido comercial optimizado"""
    content = f"""
## ¿Por qué {tema} es Esencial para el Mundial 2026?

{tema} es uno de los aspectos más importantes de la planificación para el Mundial 2026. Con el torneo expandiéndose a **48 equipos** y celebrándose en múltiples ciudades a través de **tres países**, las decisiones sobre {keyword.lower()} pueden afectar significativamente tu experiencia general del evento.

## Opciones Disponibles para {tema}

Cuando se trata de {keyword.lower()} para el Mundial 2026, hay múltiples opciones disponibles para diferentes **presupuestos** y **preferencias**:

**Opciones Económicas**: Perfectas para fanáticos que buscan maximizar su presupuesto sin comprometer la experiencia básica.

**Opciones de Gama Media**: Balancean costo y calidad, ofreciendo buen valor por el dinero invertido.

**Opciones Premium**: Para aquellos que buscan la máxima comodidad y experiencia durante el Mundial 2026.

## Consejos para Maximizar tu Presupuesto

El Mundial 2026 puede ser una inversión significativa, y {keyword.lower()} es a menudo uno de los componentes más costosos de la experiencia. Sin embargo, con planificación adecuada puedes encontrar soluciones que se ajusten a tu presupuesto:

- **Reserva con anticipación**: Las reservas tempranas generalmente ofrecen mejores precios
- **Compara múltiples opciones**: No te quedes con la primera opción que encuentres
- **Considera fechas alternativas**: Pequeños ajustes en fechas pueden significar grandes ahorros
- **Busca ofertas y promociones**: Muchos proveedores ofrecen descuentos para el Mundial

## Planificación Anticipada para {tema}

Dada la popularidad esperada del Mundial 2026, es crucial comenzar a planificar {keyword.lower()} con **mucha anticipación**. La demanda probablemente será extremadamente alta, especialmente en las ciudades sede, lo que significa:

- Las opciones pueden volverse limitadas rápidamente
- Los precios pueden aumentar significativamente a medida que se acerca el evento
- Las mejores opciones se agotarán primero

**Recomendación**: Comienza a investigar y reservar {keyword.lower()} al menos 12-18 meses antes del inicio del torneo.

## Comparación de Opciones

Para ayudarte a tomar la mejor decisión sobre {keyword.lower()}, considera los siguientes factores:

**Ubicación**: ¿Qué tan cerca está de los estadios y atracciones principales?

**Precio**: ¿Se ajusta a tu presupuesto total para el Mundial?

**Calidad**: ¿Cumple con tus expectativas de comodidad y servicios?

**Disponibilidad**: ¿Está disponible para las fechas que necesitas?

"""
    return content

def generate_transactional_content(keyword, tema, h1):
    """Genera contenido transaccional optimizado"""
    content = f"""
## ¿Cómo Funciona {tema} para el Mundial 2026?

{tema} está diseñado para simplificar tu planificación para el Mundial 2026. Con la expansión del torneo a 48 equipos y la celebración del evento en múltiples ciudades, planificar {keyword.lower()} puede ser un desafío. Esta herramienta y guía está diseñada para ayudarte a tomar decisiones informadas.

## Características Principales de {tema}

{tema} ofrece varias características diseñadas para hacer tu planificación más fácil y efectiva:

**Comparaciones Detalladas**: Compara múltiples opciones lado a lado para tomar la mejor decisión.

**Recomendaciones Personalizadas**: Basadas en tus preferencias, presupuesto y necesidades específicas.

**Información Actualizada**: Acceso a la información más reciente sobre el Mundial 2026 y {keyword.lower()}.

**Herramientas Interactivas**: Calculadoras, filtros y herramientas que te ayudan a encontrar exactamente lo que necesitas.

## Beneficios de Usar {tema}

Usar {tema} para planificar tu experiencia en el Mundial 2026 ofrece múltiples ventajas:

- **Ahorro de Tiempo**: Evita horas de investigación manual
- **Mejores Decisiones**: Accede a información completa y comparaciones objetivas
- **Ahorro de Dinero**: Identifica ofertas y opciones que se ajustan a tu presupuesto
- **Reducción de Estrés**: Simplifica el proceso de planificación

## Cómo Empezar con {tema}

Empezar a usar {tema} es simple y directo:

1. **Define tus Necesidades**: Identifica qué buscas específicamente para el Mundial 2026
2. **Establece tu Presupuesto**: Determina cuánto estás dispuesto a invertir en {keyword.lower()}
3. **Explora las Opciones**: Usa las herramientas disponibles para encontrar opciones que se ajusten a tus necesidades
4. **Compara y Decide**: Revisa las opciones disponibles y toma una decisión informada

## Recursos Adicionales

Además de {tema}, proporcionamos recursos adicionales para ayudarte en tu planificación:

- Guías detalladas sobre diferentes aspectos del Mundial 2026
- Consejos de expertos y mejores prácticas
- Información actualizada sobre el torneo
- Herramientas complementarias que pueden ser útiles

"""
    return content

def generate_faqs(keyword, tema):
    """Genera preguntas frecuentes basadas en la keyword"""
    content = f"""
## Preguntas Frecuentes sobre {tema}

### ¿Cuándo debo empezar a planificar {keyword.lower()} para el Mundial 2026?

Se recomienda comenzar a planificar {keyword.lower()} al menos **12-18 meses antes** del inicio del torneo. Esto te dará acceso a mejores opciones y precios antes de que la demanda aumente significativamente.

### ¿Qué factores debo considerar al elegir {keyword.lower()}?

Los factores clave incluyen:
- Tu presupuesto total para el Mundial 2026
- Tus preferencias personales de ubicación y comodidad
- Las fechas específicas en que estarás en el mundial
- La proximidad a estadios y otras atracciones
- La disponibilidad y acceso a transporte

### ¿Cómo afectará el formato ampliado del torneo a {keyword.lower()}?

El formato ampliado a 48 equipos significa:
- Más partidos y más días de competencia
- Mayor demanda de {keyword.lower()} durante el torneo
- Necesidad de planificación más anticipada
- Oportunidades para experimentar múltiples ciudades sede

### ¿Qué opciones de {keyword.lower()} están disponibles para diferentes presupuestos?

Hay opciones disponibles para todos los presupuestos:
- **Económicas**: Opciones básicas que maximizan el presupuesto
- **Gama Media**: Balance entre costo y calidad
- **Premium**: Máxima comodidad y experiencia

### ¿Puedo cambiar o cancelar {keyword.lower()} después de reservar?

Las políticas de cancelación y cambios varían según el proveedor. Es importante revisar los términos y condiciones específicos al hacer tu reserva. Muchos proveedores ofrecen opciones flexibles, pero es recomendable reservar opciones que permitan cambios si es posible.

### ¿Qué pasa si no encuentro {keyword.lower()} disponible para las fechas que necesito?

Si las fechas específicas que necesitas no están disponibles, considera:
- Ajustar ligeramente tus fechas de viaje
- Explorar ciudades sede alternativas cercanas
- Reservar tan pronto como sea posible para tener más opciones
- Contactar proveedores directamente para verificar disponibilidad

"""
    return content

def create_html_from_markdown(markdown_content, row, base_url="https://www.superfan.com"):
    """Convierte contenido markdown a HTML completo"""
    tema = row['Página / Tema']
    h1 = row['H1 ejemplo']
    keywords_en, keywords_es = row['Keywords objetivo (EN/ES)'].split(' / ')
    url = row['URL sugerida'].strip('/')
    
    # Convertir markdown a HTML básico
    html_content = markdown_to_html(markdown_content)
    
    # Generar título y descripción
    title = f"{h1} | Mundial 2026"
    description = f"Información completa sobre {keywords_es} para el Mundial 2026. {h1}. Guía detallada con toda la información que necesitas sobre {keywords_es} en la Copa del Mundo 2026."
    
    # Build breadcrumb
    breadcrumb_parts = url.split('/')
    breadcrumb_html = '<div class="breadcrumb">\n            <a href="/">Inicio</a>'
    current_path = ""
    for i, part in enumerate(breadcrumb_parts):
        if part:
            current_path += f"/{part}"
            part_name = part.replace('-', ' ').title()
            if part == breadcrumb_parts[-1] or '[' in part:
                breadcrumb_html += f' > <span>{part_name}</span>'
            else:
                breadcrumb_html += f' > <a href="{current_path}/">{part_name}</a>'
    breadcrumb_html += '\n        </div>'
    
    html = f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{description[:160]}">
    <meta name="keywords" content="{keywords_en}, {keywords_es}, mundial 2026, world cup 2026">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{base_url}/{url}/">
    
    <meta property="og:title" content="{h1}">
    <meta property="og:description" content="{description[:200]}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{base_url}/{url}/">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{h1}">
    <meta name="twitter:description" content="{description[:200]}">
    
    <link rel="stylesheet" href="/styles.css">
    
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "{h1}",
        "description": "{description[:200]}",
        "author": {{
            "@type": "Organization",
            "name": "SuperFan Mundial 2026"
        }},
        "datePublished": "2024-01-01",
        "dateModified": "2024-01-01",
        "mainEntityOfPage": {{
            "@type": "WebPage",
            "@id": "{base_url}/{url}/"
        }}
    }}
    </script>
</head>
<body>
    <header>
        <nav class="container">
            <div><a href="/">🏆 SuperFan Mundial 2026</a></div>
            <div>
                <a href="/world-cup-2026/">Mundial 2026</a>
                <a href="/world-cup-2026/teams/">Selecciones</a>
                <a href="/travel/flights/">Viajes</a>
                <a href="/fan/tickets/">Entradas</a>
            </div>
        </nav>
    </header>

    <main class="container">
        {breadcrumb_html}

        {html_content}
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 SuperFan Mundial 2026. Proyecto independiente no afiliado con FIFA.</p>
            <p><a href="/about/" style="color: #fff;">Sobre el Proyecto</a></p>
        </div>
    </footer>
</body>
</html>'''
    
    return html

def markdown_to_html(markdown):
    """Convierte markdown básico a HTML"""
    html = markdown
    
    # Headers
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    
    # Bold
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    
    # Lists
    lines = html.split('\n')
    in_list = False
    result = []
    for line in lines:
        if line.strip().startswith('- '):
            if not in_list:
                result.append('<ul>')
                in_list = True
            result.append(f'<li>{line.strip()[2:]}</li>')
        elif line.strip().startswith(('**- ', '###', '##', '#')):
            if in_list:
                result.append('</ul>')
                in_list = False
            result.append(line)
        else:
            if in_list:
                result.append('</ul>')
                in_list = False
            if line.strip():
                result.append(f'<p>{line.strip()}</p>')
            else:
                result.append('')
    if in_list:
        result.append('</ul>')
    
    html = '\n'.join(result)
    
    # Clean up multiple <p> tags
    html = re.sub(r'</p>\s*<p>', '\n\n', html)
    
    return html

def main():
    """Main function to rewrite all pages with SEO optimized content"""
    base_dir = Path(__file__).parent
    
    with open('seo_world_cup_structure.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            url = row['URL sugerida'].strip('/')
            if not url or url.startswith('['):
                continue
            
            # Extract keyword in Spanish
            keyword = extract_keyword_spanish(row['Keywords objetivo (EN/ES)'])
            tema = row['Página / Tema']
            h1 = row['H1 ejemplo']
            intencion = row['Intención']
            
            print(f"Processing: {url} - Keyword: {keyword}")
            
            # Generate SEO optimized content
            markdown_content = generate_seo_optimized_content(keyword, tema, h1, intencion)
            
            # Convert to HTML
            html = create_html_from_markdown(markdown_content, row)
            
            # Create directory structure
            path_parts = url.split('/')
            if len(path_parts) > 1:
                dir_path = base_dir / '/'.join(path_parts[:-1])
                dir_path.mkdir(parents=True, exist_ok=True)
            
            # Write file
            file_path = base_dir / f"{url}.html"
            file_path.write_text(html, encoding='utf-8')
            print(f"  ✓ Generated: {url}.html")

if __name__ == '__main__':
    main()


