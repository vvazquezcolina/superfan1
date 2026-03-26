#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import csv
import os
from pathlib import Path

def generate_content(row):
    """Generate SEO-optimized content for each landing page"""
    tema = row['Página / Tema']
    h1 = row['H1 ejemplo']
    keywords_en, keywords_es = row['Keywords objetivo (EN/ES)'].split(' / ')
    intencion = row['Intención']
    nivel = row['Nivel']
    pilar = row['Pilar']
    
    # Base content templates based on intent
    if intencion == 'Informacional':
        content = f"""
        <p>Esta guía completa sobre {tema} te proporciona toda la información que necesitas para entender {tema.lower()} en el contexto del Mundial 2026. El Mundial 2026 representa un momento histórico en el fútbol mundial, y comprender {tema.lower()} es esencial para cualquier fanático que quiera disfrutar al máximo este evento. Esta guía está diseñada para ser tu recurso definitivo, proporcionando información detallada, precisa y actualizada sobre {tema.lower()}.</p>
        
        <h2>¿Qué es {tema} en el Mundial 2026?</h2>
        
        <p>{tema} es uno de los aspectos más importantes del Mundial 2026 que todo fanático debe conocer. Con la expansión del torneo a 48 equipos y la celebración del evento en tres países diferentes, {tema.lower()} adquiere una relevancia sin precedentes. Esta guía te explica todo lo que necesitas saber sobre {tema.lower()}, desde los aspectos básicos hasta los detalles más técnicos que pueden marcar la diferencia en tu experiencia como fanático del mundial.</p>
        
        <h2>Por Qué {tema} es Importante para el Mundial 2026</h2>
        
        <p>El Mundial 2026 no es solo otro torneo de fútbol; es un evento que redefinirá cómo experimentamos la Copa del Mundo. {tema} juega un papel crucial en esta experiencia, y entender sus matices puede mejorar significativamente cómo planeas y disfrutas del evento. Ya sea que estés planificando asistir en persona o siguiendo el torneo desde casa, la información sobre {tema.lower()} que proporcionamos aquí te ayudará a tomar decisiones informadas y maximizar tu disfrute del mundial.</p>
        
        <h2>Detalles Específicos sobre {tema}</h2>
        
        <p>Cuando se trata de {tema.lower()} en el Mundial 2026, hay varios factores clave que debes considerar. La expansión del torneo a 48 equipos introduce nuevos elementos en {tema.lower()} que no existían en ediciones anteriores. Además, la celebración del torneo en múltiples ciudades a través de tres países diferentes añade capas adicionales de complejidad e interés. Nuestra guía desglosa todos estos aspectos de manera clara y accesible, asegurándote de que tengas toda la información necesaria sobre {tema.lower()}.</p>
        
        <h2>Cómo Usar Esta Información sobre {tema}</h2>
        
        <p>La información sobre {tema.lower()} que proporcionamos aquí está diseñada para ser práctica y aplicable. Ya sea que estés en las etapas iniciales de planificación o ya tengas planes específicos para el Mundial 2026, esta guía te ayudará a navegar {tema.lower()} con confianza. Te recomendamos leer esta información cuidadosamente y usarla como punto de referencia mientras continúas planificando tu experiencia del mundial. Mantén esta guía cerca, ya que actualizamos regularmente la información para reflejar los últimos anuncios oficiales y cambios en el torneo.</p>
        
        <h2>Recursos Adicionales Relacionados con {tema}</h2>
        
        <p>Para complementar esta guía sobre {tema.lower()}, te recomendamos explorar nuestras otras secciones relacionadas con el Mundial 2026. Tenemos información detallada sobre el formato del torneo, el calendario de partidos, las sedes y estadios, y mucho más. Cada sección está diseñada para trabajar en conjunto, proporcionándote una comprensión completa del Mundial 2026 desde múltiples ángulos. Si tienes preguntas específicas sobre {tema.lower()} que no están cubiertas aquí, no dudes en explorar nuestras otras guías o contactarnos para obtener información adicional.</p>
        """
    elif intencion == 'Comercial':
        content = f"""
        <p>Planificar tu experiencia en el Mundial 2026 requiere consideraciones prácticas importantes, especialmente cuando se trata de {tema.lower()}. Esta guía completa te proporciona toda la información que necesitas para tomar decisiones informadas sobre {tema.lower()} para el Mundial 2026. Desde opciones económicas hasta alternativas premium, exploramos todas las posibilidades para ayudarte a encontrar la mejor solución según tus necesidades y presupuesto.</p>
        
        <h2>¿Por Qué {tema} es Crítico para el Mundial 2026?</h2>
        
        <p>{tema} es uno de los aspectos más importantes de la planificación para el Mundial 2026. Con el torneo expandiéndose a 48 equipos y celebrándose en múltiples ciudades a través de tres países, las decisiones sobre {tema.lower()} pueden afectar significativamente tu experiencia general del evento. Esta guía te ayuda a navegar todas las opciones disponibles, considerando factores como ubicación, precio, comodidad y conveniencia.</p>
        
        <h2>Opciones Disponibles para {tema}</h2>
        
        <p>Cuando se trata de {tema.lower()} para el Mundial 2026, hay múltiples opciones disponibles para diferentes presupuestos y preferencias. Ya sea que busques opciones económicas, opciones de gama media, o alternativas premium, nuestra guía cubre todo el espectro. Te proporcionamos información detallada sobre cada tipo de opción, incluyendo ventajas y desventajas, para que puedas tomar la mejor decisión según tus circunstancias específicas.</p>
        
        <h2>Consejos para Maximizar tu Presupuesto en {tema}</h2>
        
        <p>El Mundial 2026 puede ser una inversión significativa, y {tema.lower()} es a menudo uno de los componentes más costosos de la experiencia. Sin embargo, con planificación adecuada y conocimiento de las opciones disponibles, puedes encontrar soluciones que se ajusten a tu presupuesto sin comprometer la calidad de tu experiencia. Esta guía incluye consejos prácticos para ahorrar dinero en {tema.lower()}, identificar ofertas, y maximizar el valor de tu inversión.</p>
        
        <h2>Planificación Anticipada para {tema}</h2>
        
        <p>Dada la popularidad esperada del Mundial 2026, es crucial comenzar a planificar {tema.lower()} con mucha anticipación. La demanda probablemente será extremadamente alta, especialmente en las ciudades sede, lo que significa que las opciones pueden volverse limitadas y los precios pueden aumentar significativamente a medida que se acerca el evento. Te recomendamos comenzar a investigar y reservar {tema.lower()} al menos 12-18 meses antes del inicio del torneo para asegurar las mejores opciones y precios.</p>
        
        <h2>Comparación de Opciones para {tema}</h2>
        
        <p>Para ayudarte a tomar la mejor decisión sobre {tema.lower()}, esta guía incluye comparaciones detalladas entre diferentes opciones. Consideramos factores como ubicación, precio, calidad, comodidad, y acceso a los estadios y otros puntos de interés. Estas comparaciones están diseñadas para darte una visión clara de las opciones disponibles y ayudarte a identificar cuál se ajusta mejor a tus necesidades específicas y restricciones de presupuesto.</p>
        """
    else:  # Transaccional suave
        content = f"""
        <p>Esta herramienta práctica te ayuda a planificar {tema.lower()} para el Mundial 2026. Con la expansión del torneo a 48 equipos y la celebración del evento en múltiples ciudades, planificar {tema.lower()} puede ser un desafío. Esta guía y herramienta está diseñada para simplificar el proceso, proporcionándote toda la información y recursos que necesitas para tomar decisiones informadas sobre {tema.lower()}.</p>
        
        <h2>Cómo Funciona {tema}</h2>
        
        <p>{tema} está diseñado para ser intuitivo y fácil de usar, incluso si no tienes experiencia previa planificando viajes al Mundial. La herramienta te guía a través del proceso paso a paso, solicitando información relevante sobre tus preferencias, presupuesto y planes de viaje. Basándose en esta información, la herramienta genera recomendaciones personalizadas y opciones que se ajustan a tus necesidades específicas.</p>
        
        <h2>Beneficios de Usar {tema}</h2>
        
        <p>Usar {tema.lower()} para planificar tu experiencia en el Mundial 2026 ofrece múltiples ventajas. La herramienta puede ayudarte a identificar opciones que de otra manera podrías pasar por alto, comparar diferentes alternativas de manera eficiente, y tomar decisiones informadas basadas en datos y recomendaciones personalizadas. También puede ahorrarte tiempo significativo en la investigación y planificación, permitiéndote enfocarte en los aspectos más emocionantes de prepararte para el mundial.</p>
        
        <h2>Características Principales de {tema}</h2>
        
        <p>La herramienta {tema.lower()} incluye varias características diseñadas para hacer tu planificación más fácil y efectiva. Estas características incluyen comparaciones de opciones, filtros personalizables, recomendaciones basadas en tus preferencias, y recursos informativos sobre diferentes aspectos del Mundial 2026. La herramienta se actualiza regularmente para reflejar los últimos cambios y anuncios oficiales, asegurando que siempre tengas acceso a información actualizada y precisa.</p>
        
        <h2>Empezar con {tema}</h2>
        
        <p>Empezar a usar {tema.lower()} es simple y directo. La herramienta está diseñada para ser accesible para usuarios de todos los niveles de experiencia, con una interfaz intuitiva y guías paso a paso. Te recomendamos dedicar algo de tiempo para familiarizarte con las diferentes características y opciones disponibles, ya que esto te ayudará a maximizar el valor que obtienes de la herramienta. Una vez que comiences a usarla, descubrirás lo fácil que puede ser planificar {tema.lower()} para el Mundial 2026.</p>
        
        <h2>Recursos y Soporte para {tema}</h2>
        
        <p>Además de la herramienta principal de {tema.lower()}, proporcionamos recursos adicionales y soporte para ayudarte en tu planificación. Estos recursos incluyen guías detalladas, preguntas frecuentes, consejos de expertos, y acceso a información actualizada sobre el Mundial 2026. Si tienes preguntas o necesitas ayuda adicional mientras usas la herramienta, nuestros recursos están diseñados para proporcionarte la asistencia que necesitas para tener éxito en tu planificación.</p>
        """
    
    return content

def create_html_page(row, base_url="https://www.superfan.com"):
    """Create a complete HTML page from CSV row"""
    tema = row['Página / Tema']
    h1 = row['H1 ejemplo']
    keywords_en, keywords_es = row['Keywords objetivo (EN/ES)'].split(' / ')
    url = row['URL sugerida'].strip('/')
    intencion = row['Intención']
    
    # Generate title and description
    title = f"{h1} | Mundial 2026"
    description = f"Información completa sobre {tema.lower()} para el Mundial 2026. {h1}. Guía detallada con toda la información que necesitas sobre {keywords_es} en la Copa del Mundo 2026."
    
    # Build breadcrumb
    breadcrumb_parts = url.split('/')
    breadcrumb_html = '<div class="breadcrumb">\n            <a href="/">Inicio</a>'
    current_path = ""
    for part in breadcrumb_parts:
        if part:
            current_path += f"/{part}"
            part_name = part.replace('-', ' ').title()
            if part == breadcrumb_parts[-1]:
                breadcrumb_html += f' > <span>{part_name}</span>'
            else:
                breadcrumb_html += f' > <a href="{current_path}/">{part_name}</a>'
    breadcrumb_html += '\n        </div>'
    
    content = generate_content(row)
    
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{description}">
    <meta name="keywords" content="{keywords_en}, {keywords_es}, mundial 2026, world cup 2026">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{base_url}/{url}/">
    
    <meta property="og:title" content="{h1}">
    <meta property="og:description" content="{description[:200]}...">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{base_url}/{url}/">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{h1}">
    <meta name="twitter:description" content="{description[:200]}...">
    
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

        <h1>{h1}</h1>

        {content}
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 SuperFan Mundial 2026. Proyecto independiente no afiliado con FIFA.</p>
            <p><a href="/about/" style="color: #fff;">Sobre el Proyecto</a></p>
        </div>
    </footer>
</body>
</html>"""
    
    return html

def main():
    """Main function to generate all pages from CSV"""
    base_dir = Path(__file__).parent
    
    with open('seo_world_cup_structure.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            url = row['URL sugerida'].strip('/')
            if not url or url.startswith('['):  # Skip placeholder URLs
                continue
            
            # Create directory structure
            path_parts = url.split('/')
            if len(path_parts) > 1:
                dir_path = base_dir / '/'.join(path_parts[:-1])
                dir_path.mkdir(parents=True, exist_ok=True)
            
            # Generate HTML
            html = create_html_page(row)
            
            # Write file
            file_path = base_dir / f"{url}.html"
            file_path.write_text(html, encoding='utf-8')
            print(f"Generated: {url}.html")

if __name__ == '__main__':
    main()


