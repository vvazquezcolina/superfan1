#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import csv
import os
from pathlib import Path
from pexels_integration import get_relevant_image_for_page, generate_image_html, get_multiple_images_for_content, insert_images_in_content

# Content templates for specific topics
CITY_CONTENT = {
    'mexico-city': {
        'description': 'Ciudad de México, la capital de México, albergará partidos del Mundial 2026 en el icónico Estadio Azteca, uno de los estadios más emblemáticos del fútbol mundial.',
        'content': '''
        <p>Ciudad de México es una de las sedes más emocionantes del Mundial 2026, albergando partidos en el legendario Estadio Azteca. La capital de México tiene una rica tradición futbolística y será una experiencia única para cualquier fanático del mundial.</p>
        
        <h2>Estadio Azteca: El Templo del Fútbol</h2>
        
        <p>El Estadio Azteca es uno de los estadios más emblemáticos del fútbol mundial. Ha sido sede de dos finales de Copa del Mundo (1970 y 1986) y ha presenciado algunos de los momentos más históricos del fútbol. Con una capacidad de más de 87,000 espectadores, el Azteca ofrece una atmósfera única que ningún otro estadio puede igualar. El estadio tiene una historia rica que incluye la "Mano de Dios" de Diego Maradona y los goles históricos de Pelé. Para el Mundial 2026, el estadio ha sido modernizado para cumplir con los estándares más altos de FIFA, mientras mantiene su carácter único y su atmósfera legendaria.</p>
        
        <h2>Ubicación y Acceso al Estadio Azteca</h2>
        
        <p>El Estadio Azteca está ubicado en la zona sur de Ciudad de México, específicamente en la delegación Coyoacán. La ubicación es accesible desde diferentes partes de la ciudad mediante transporte público, incluyendo metro, metrobús y autobuses. Para los fanáticos que viajen desde el centro de la ciudad, el trayecto típico toma entre 30-45 minutos dependiendo del tráfico. También hay opciones de transporte privado y servicios de taxi o ride-sharing disponibles. Se recomienda llegar con anticipación debido al gran volumen de fanáticos que se espera para los partidos del mundial.</p>
        
        <h2>Dónde Alojarse en Ciudad de México</h2>
        
        <p>Ciudad de México ofrece una amplia gama de opciones de alojamiento para los fanáticos del Mundial 2026. Las zonas más recomendadas incluyen el Centro Histórico, Polanco, Roma Norte, y Condesa. El Centro Histórico es ideal para aquellos que quieren estar cerca de atracciones culturales y puntos de interés. Polanco ofrece opciones más lujosas y está bien conectado con el resto de la ciudad. Roma Norte y Condesa son conocidas por su ambiente bohemio y restaurantes de clase mundial. Todas estas zonas tienen buena conectividad con el Estadio Azteca mediante transporte público.</p>
        
        <h2>Qué Hacer en Ciudad de México</h2>
        
        <p>Ciudad de México es una de las ciudades más fascinantes del mundo, con una rica historia, cultura vibrante y gastronomía excepcional. Los fanáticos pueden explorar el Centro Histórico, declarado Patrimonio de la Humanidad por la UNESCO, visitar museos de clase mundial como el Museo Nacional de Antropología, y disfrutar de algunos de los mejores restaurantes del mundo. La ciudad también ofrece una vibrante escena nocturna, mercados tradicionales, y arquitectura colonial impresionante. Para los fanáticos del fútbol, hay varios estadios de clubes locales que vale la pena visitar, y la pasión por el fútbol es palpable en toda la ciudad.</p>
        
        <h2>Gastronomía y Cultura Local</h2>
        
        <p>La gastronomía de Ciudad de México es reconocida mundialmente, con una increíble variedad de opciones que van desde puestos callejeros tradicionales hasta restaurantes de alta cocina que han ganado reconocimiento internacional. Los fanáticos pueden disfrutar de tacos auténticos, mole, pozole, y otros platillos tradicionales mexicanos. La ciudad también tiene una rica escena cultural con teatros, galerías de arte, y festivales que se celebran durante todo el año. La combinación de historia antigua y cultura moderna hace de Ciudad de México un destino incomparable para los fanáticos del Mundial 2026.</p>
        
        <h2>Transporte y Movilidad</h2>
        
        <p>Ciudad de México tiene un sistema de transporte público extenso que incluye metro, metrobús, trolebús, y autobuses. El metro es la forma más eficiente de moverse por la ciudad y tiene conexiones directas a áreas cercanas al Estadio Azteca. También hay opciones de transporte privado, servicios de taxi y ride-sharing. Para los días de partido, se recomienda usar transporte público ya que el tráfico puede ser intenso. La ciudad también tiene una infraestructura de ciclovías que está creciendo, ofreciendo otra opción para moverse de manera sostenible.</p>
        
        <h2>Seguridad y Consejos para Fanáticos</h2>
        
        <p>Ciudad de México es generalmente segura para los turistas, especialmente en las zonas más turísticas. Sin embargo, como en cualquier gran ciudad, es importante tomar precauciones básicas. Se recomienda usar transporte oficial, evitar áreas menos conocidas por la noche, y mantener objetos de valor seguros. Para los días de partido, llegar temprano al estadio y seguir las instrucciones del personal de seguridad es crucial. La ciudad tiene una fuerte presencia policial durante eventos grandes como el Mundial, y los fanáticos pueden esperar un ambiente seguro y bien organizado.</p>
        '''
    },
    'monterrey': {
        'description': 'Monterrey, la capital industrial de México, albergará partidos del Mundial 2026 en el moderno Estadio BBVA.',
        'content': '''
        <p>Monterrey es una de las sedes más modernas del Mundial 2026, albergando partidos en el impresionante Estadio BBVA. La ciudad es conocida por su espíritu empresarial, montañas impresionantes, y pasión por el fútbol.</p>
        
        <h2>Estadio BBVA: Modernidad y Pasión</h2>
        
        <p>El Estadio BBVA es uno de los estadios más modernos de México, inaugurado en 2015. Con una capacidad de más de 53,000 espectadores, el estadio ofrece instalaciones de clase mundial y una atmósfera eléctrica. El estadio está diseñado con la última tecnología en seguridad, comodidad y experiencia del espectador. Su ubicación en las afueras de Monterrey ofrece vistas impresionantes de las montañas que rodean la ciudad, creando un ambiente único para los partidos del Mundial 2026.</p>
        
        <h2>Monterrey: La Capital Industrial de México</h2>
        
        <p>Monterrey es la tercera ciudad más grande de México y es conocida como la capital industrial del país. La ciudad combina un espíritu empresarial dinámico con belleza natural impresionante, rodeada por montañas que ofrecen oportunidades para actividades al aire libre. Monterrey tiene una fuerte tradición futbolística, con equipos locales que han tenido éxito en competiciones continentales. La ciudad ofrece una experiencia más moderna y cosmopolita comparada con otras ciudades mexicanas, mientras mantiene la calidez y hospitalidad característica de México.</p>
        
        <h2>Dónde Alojarse en Monterrey</h2>
        
        <p>Monterrey ofrece varias opciones de alojamiento para los fanáticos del Mundial 2026. San Pedro Garza García es conocida por sus opciones de lujo y es una de las áreas más exclusivas de México. El centro de Monterrey ofrece opciones más económicas y está bien conectado con el resto de la ciudad. Valle Oriente es otra zona popular con buena infraestructura hotelera y acceso conveniente al Estadio BBVA. Todas estas áreas tienen buena conectividad mediante transporte público y opciones de transporte privado.</p>
        
        <h2>Atracciones y Actividades en Monterrey</h2>
        
        <p>Monterrey ofrece una variedad de atracciones para los fanáticos del Mundial 2026. El Cerro de la Silla es un ícono de la ciudad y ofrece oportunidades para senderismo y vistas panorámicas. El Museo de Historia Mexicana y el MARCO (Museo de Arte Contemporáneo) son excelentes opciones culturales. La Plaza México y el Macroplaza son áreas centrales perfectas para explorar. Los fanáticos también pueden disfrutar de la gastronomía local, que incluye carne asada, cabrito, y otros platillos norteños. La ciudad tiene una vibrante escena nocturna y es conocida por su hospitalidad.</p>
        '''
    },
    'guadalajara': {
        'description': 'Guadalajara, la cuna del mariachi y el tequila, albergará partidos del Mundial 2026 en el Estadio Akron.',
        'content': '''
        <p>Guadalajara es una de las sedes más culturalmente ricas del Mundial 2026, albergando partidos en el moderno Estadio Akron. La ciudad es conocida como la cuna del mariachi, el tequila, y tiene una profunda tradición futbolística.</p>
        
        <h2>Estadio Akron: Tradición y Modernidad</h2>
        
        <p>El Estadio Akron, también conocido como Estadio Chivas, es la casa del Club Deportivo Guadalajara y uno de los estadios más modernos de México. Inaugurado en 2010, el estadio tiene una capacidad de más de 49,000 espectadores y ofrece instalaciones de clase mundial. El estadio es conocido por su atmósfera apasionada y su diseño arquitectónico impresionante. Para el Mundial 2026, el estadio será una de las sedes principales en México, ofreciendo una experiencia única para los fanáticos del mundial.</p>
        
        <h2>Guadalajara: La Perla de Occidente</h2>
        
        <p>Guadalajara es la segunda ciudad más grande de México y es conocida como "La Perla de Occidente". La ciudad tiene una rica historia cultural y es considerada el corazón cultural de México occidental. Guadalajara es famosa por ser la cuna del mariachi, el tequila, y el charro mexicano. La ciudad combina arquitectura colonial con modernidad, creando una experiencia única para los visitantes. La tradición futbolística de Guadalajara es legendaria, con equipos que han sido fundamentales en la historia del fútbol mexicano.</p>
        
        <h2>Dónde Alojarse en Guadalajara</h2>
        
        <p>Guadalajara ofrece varias opciones de alojamiento para los fanáticos del Mundial 2026. El Centro Histórico es ideal para aquellos que quieren estar cerca de atracciones culturales y la vida urbana. Zona Rosa y Chapalita ofrecen opciones más modernas con buena infraestructura hotelera. Tlaquepaque, aunque un poco más lejos, ofrece una experiencia cultural única con sus calles empedradas y artesanías tradicionales. Todas estas zonas tienen buena conectividad con el Estadio Akron mediante transporte público y opciones de transporte privado.</p>
        
        <h2>Cultura y Gastronomía en Guadalajara</h2>
        
        <p>Guadalajara es un paraíso cultural para los fanáticos del Mundial 2026. La ciudad es conocida por su música mariachi, que puedes disfrutar en la Plaza de los Mariachis. El tequila, originario de la región de Jalisco, es una experiencia esencial. La gastronomía tapatía incluye platillos como birria, tortas ahogadas, y pozole. La ciudad tiene una vibrante escena artística con galerías, teatros, y festivales culturales. Los fanáticos también pueden visitar Tlaquepaque y Tonalá para experiencias de artesanía tradicional mexicana.</p>
        '''
    },
    'toronto': {
        'description': 'Toronto, la ciudad más grande de Canadá, albergará partidos del Mundial 2026 en el BMO Field, combinando diversidad cultural con pasión futbolística.',
        'content': '''
        <p>Toronto es una de las sedes más vibrantes del Mundial 2026, albergando partidos en el BMO Field. Como la ciudad más grande de Canadá, Toronto ofrece una experiencia multicultural única para los fanáticos del mundial.</p>
        
        <h2>BMO Field: Fútbol en el Corazón de Toronto</h2>
        
        <p>El BMO Field es el estadio principal de fútbol en Toronto y ha sido sede de equipos de la MLS y la selección canadiense. El estadio ha sido expandido y modernizado para el Mundial 2026, aumentando su capacidad y mejorando sus instalaciones. Ubicado en Exhibition Place, el estadio ofrece vistas del lago Ontario y está bien conectado con el centro de la ciudad mediante transporte público. El BMO Field ofrece una experiencia moderna y cómoda para los fanáticos del mundial.</p>
        
        <h2>Toronto: Diversidad y Multiculturalismo</h2>
        
        <p>Toronto es una de las ciudades más diversas del mundo, con más de la mitad de su población nacida fuera de Canadá. Esta diversidad se refleja en la vibrante escena cultural, gastronomía internacional, y festivales que se celebran durante todo el año. Toronto combina la modernidad de una metrópolis norteamericana con la calidez de una ciudad internacional. Para el Mundial 2026, esta diversidad significa que los fanáticos de diferentes países encontrarán comunidades acogedoras y lugares para celebrar sus equipos.</p>
        
        <h2>Dónde Alojarse en Toronto</h2>
        
        <p>Toronto ofrece una amplia gama de opciones de alojamiento para los fanáticos del Mundial 2026. El centro de Toronto (Downtown) es ideal para aquellos que quieren estar cerca de atracciones principales y vida nocturna. Yorkville ofrece opciones de lujo con boutiques y restaurantes de alta cocina. The Distillery District y Queen West ofrecen experiencias más bohemias con galerías de arte y cafés únicos. Todas estas zonas tienen excelente conectividad mediante el sistema de transporte público de Toronto, incluyendo metro, tranvías y autobuses.</p>
        
        <h2>Atracciones y Actividades en Toronto</h2>
        
        <p>Toronto ofrece innumerables atracciones para los fanáticos del Mundial 2026. La CN Tower es un ícono de la ciudad y ofrece vistas panorámicas impresionantes. El Royal Ontario Museum y la Art Gallery of Ontario son museos de clase mundial. Los fanáticos pueden disfrutar de la escena gastronómica diversa de Toronto, desde puestos callejeros hasta restaurantes de clase mundial. Las islas de Toronto ofrecen un escape tranquilo del bullicio urbano. La ciudad también tiene una vibrante escena deportiva y de entretenimiento que complementa perfectamente la experiencia del Mundial.</p>
        '''
    },
    'vancouver': {
        'description': 'Vancouver, con su impresionante entorno natural, albergará partidos del Mundial 2026 en el BC Place, combinando belleza natural con pasión futbolística.',
        'content': '''
        <p>Vancouver es una de las sedes más hermosas del Mundial 2026, albergando partidos en el BC Place. La ciudad combina un entorno natural impresionante con una vibrante cultura urbana, creando una experiencia única para los fanáticos del mundial.</p>
        
        <h2>BC Place: Fútbol en la Costa del Pacífico</h2>
        
        <p>El BC Place es un estadio techado moderno con una capacidad de más de 54,000 espectadores. El estadio ha sido sede de importantes eventos deportivos y de entretenimiento, incluyendo los Juegos Olímpicos de Invierno 2010. Para el Mundial 2026, el BC Place ofrece instalaciones de clase mundial en un entorno espectacular. El estadio está ubicado en el centro de Vancouver, ofreciendo fácil acceso a restaurantes, bares, y atracciones de la ciudad. El diseño techado del estadio garantiza que los partidos se puedan jugar independientemente del clima.</p>
        
        <h2>Vancouver: Naturaleza y Urbanidad</h2>
        
        <p>Vancouver es conocida por su impresionante entorno natural, combinando montañas, océano y bosques en un solo lugar. La ciudad ha sido consistentemente clasificada como una de las ciudades más habitables del mundo debido a su alta calidad de vida, infraestructura moderna, y acceso a la naturaleza. Vancouver tiene una población multicultural diversa y es conocida por su estilo de vida activo al aire libre. Para el Mundial 2026, los fanáticos pueden combinar su experiencia futbolística con actividades como senderismo, playas, y exploración del entorno natural impresionante que rodea la ciudad.</p>
        
        <h2>Dónde Alojarse en Vancouver</h2>
        
        <p>Vancouver ofrece varias opciones de alojamiento para los fanáticos del Mundial 2026. El centro de Vancouver (Downtown) es ideal para aquellos que quieren estar cerca de atracciones principales, restaurantes, y vida nocturna. Gastown y Yaletown ofrecen experiencias más históricas y bohemias respectivamente. Kitsilano, aunque un poco más lejos, ofrece acceso cercano a playas y un ambiente más relajado. Todas estas zonas tienen excelente conectividad mediante el sistema de transporte público de Vancouver, incluyendo el SkyTrain y autobuses.</p>
        
        <h2>Actividades y Naturaleza en Vancouver</h2>
        
        <p>Vancouver ofrece oportunidades únicas para combinar el fútbol con experiencias naturales. Stanley Park es uno de los parques urbanos más grandes de Norteamérica y ofrece senderos, playas, y vistas impresionantes. Los fanáticos pueden disfrutar de deportes acuáticos, senderismo en las montañas cercanas, o simplemente relajarse en las playas. La gastronomía de Vancouver refleja su diversidad multicultural, con opciones que van desde mariscos frescos hasta comida asiática auténtica. La ciudad también tiene una vibrante escena artística y cultural que complementa perfectamente la experiencia del Mundial 2026.</p>
        '''
    },
    'los-angeles': {
        'description': 'Los Ángeles, la capital del entretenimiento mundial, albergará partidos del Mundial 2026 en múltiples estadios, ofreciendo una experiencia única para los fanáticos.',
        'content': '''
        <p>Los Ángeles es una de las sedes más emocionantes del Mundial 2026, con múltiples estadios disponibles para albergar partidos. La ciudad combina glamour, cultura, y pasión futbolística en una experiencia incomparable para los fanáticos del mundial.</p>
        
        <h2>Estadios de Los Ángeles para el Mundial 2026</h2>
        
        <p>Los Ángeles tiene varios estadios de clase mundial que potencialmente albergarán partidos del Mundial 2026. El SoFi Stadium, aunque principalmente para fútbol americano, podría albergar partidos importantes. El Rose Bowl en Pasadena tiene una rica historia futbolística y ha sido sede de eventos importantes. El Banc of California Stadium, casa del LAFC, es un estadio moderno diseñado específicamente para fútbol. La infraestructura deportiva de Los Ángeles es de clase mundial, garantizando que los fanáticos tengan una experiencia excepcional sin importar dónde se jueguen los partidos.</p>
        
        <h2>Los Ángeles: La Capital del Entretenimiento</h2>
        
        <p>Los Ángeles es mucho más que Hollywood; es una de las ciudades más diversas y vibrantes del mundo. La ciudad combina playas impresionantes, montañas, desiertos, y una cultura urbana única. Los Ángeles tiene una de las poblaciones más diversas del mundo, con comunidades de prácticamente todos los países, lo que significa que los fanáticos del Mundial 2026 encontrarán celebraciones culturales, restaurantes auténticos, y comunidades acogedoras para sus equipos nacionales. La ciudad también tiene una creciente pasión por el fútbol, con equipos de la MLS que han ganado popularidad significativa.</p>
        
        <h2>Dónde Alojarse en Los Ángeles</h2>
        
        <p>Los Ángeles ofrece opciones de alojamiento para todos los presupuestos y preferencias. Beverly Hills y West Hollywood ofrecen opciones de lujo con acceso a tiendas, restaurantes, y vida nocturna de alta gama. Santa Monica y Venice ofrecen acceso cercano a las playas con un ambiente más relajado. Downtown Los Angeles ha experimentado un renacimiento con nuevos hoteles y restaurantes. Hollywood ofrece una experiencia única con su historia cinematográfica. Dada la extensión de Los Ángeles, es importante elegir una ubicación que sea conveniente tanto para los estadios como para otras atracciones que quieras visitar.</p>
        
        <h2>Atracciones y Experiencias en Los Ángeles</h2>
        
        <p>Los Ángeles ofrece innumerables atracciones para los fanáticos del Mundial 2026. Desde las playas de Santa Monica y Venice hasta las montañas de Hollywood, hay algo para todos. Los fanáticos pueden explorar museos de clase mundial, disfrutar de la gastronomía diversa (desde comida callejera hasta restaurantes de clase mundial), y experimentar la vibrante escena artística y musical. Los estudios de Hollywood ofrecen tours fascinantes, y hay múltiples opciones de entretenimiento nocturno. La combinación de cultura, naturaleza, y entretenimiento hace de Los Ángeles un destino incomparable para el Mundial 2026.</p>
        '''
    }
}

def get_city_content(url):
    """Get specific content for a city based on URL"""
    # Extract city name from URL (e.g., /world-cup-2026/cities/mexico-city/ -> mexico-city)
    if '/cities/' in url:
        city_key = url.split('/cities/')[-1].split('/')[0]
        return CITY_CONTENT.get(city_key, None)
    return None

def get_content_section_images(tema: str, url: str, content: str) -> list:
    """
    Determina qué imágenes buscar para diferentes secciones del contenido.
    Analiza los H2 del contenido para determinar términos de búsqueda relevantes.
    """
    from pexels_integration import get_pexels_image
    
    # Extraer H2 del contenido
    import re
    h2_matches = re.findall(r'<h2>(.*?)</h2>', content)
    
    if not h2_matches:
        return []
    
    section_keywords = []
    
    # Mapeo de términos de búsqueda basados en palabras clave en los H2
    for h2_text in h2_matches[:4]:  # Máximo 4 imágenes adicionales
        h2_lower = h2_text.lower()
        
        # Estadio
        if 'estadio' in h2_lower or 'stadium' in h2_lower:
            if 'azteca' in h2_lower:
                section_keywords.append('Estadio Azteca Mexico City')
            elif 'bbva' in h2_lower:
                section_keywords.append('Monterrey stadium football')
            elif 'akron' in h2_lower:
                section_keywords.append('Guadalajara stadium soccer')
            else:
                section_keywords.append('football stadium')
        
        # Ciudad/ubicación
        elif 'ciudad' in h2_lower or 'ubicación' in h2_lower or 'location' in h2_lower:
            if '/cities/' in url:
                city = url.split('/cities/')[-1].split('/')[0]
                city_map = {
                    'mexico-city': 'Mexico City urban',
                    'monterrey': 'Monterrey Mexico',
                    'guadalajara': 'Guadalajara Mexico',
                    'toronto': 'Toronto Canada',
                    'vancouver': 'Vancouver Canada',
                    'los-angeles': 'Los Angeles California'
                }
                section_keywords.append(city_map.get(city, 'city urban'))
            else:
                section_keywords.append('city urban landscape')
        
        # Alojamiento
        elif 'alojarse' in h2_lower or 'alojamiento' in h2_lower or 'hotel' in h2_lower or 'stay' in h2_lower:
            section_keywords.append('hotel accommodation travel')
        
        # Transporte
        elif 'transporte' in h2_lower or 'transport' in h2_lower or 'movilidad' in h2_lower:
            section_keywords.append('public transport city')
        
        # Gastronomía/comida
        elif 'gastronomía' in h2_lower or 'gastronomy' in h2_lower or 'comida' in h2_lower or 'food' in h2_lower:
            section_keywords.append('food cuisine restaurant')
        
        # Cultura/actividades
        elif 'cultura' in h2_lower or 'culture' in h2_lower or 'hacer' in h2_lower or 'actividades' in h2_lower:
            section_keywords.append('culture city activities')
        
        # Seguridad
        elif 'seguridad' in h2_lower or 'safety' in h2_lower or 'consejos' in h2_lower:
            section_keywords.append('travel safety security')
        
        # Formato/grupos
        elif 'formato' in h2_lower or 'format' in h2_lower or 'grupos' in h2_lower or 'groups' in h2_lower:
            section_keywords.append('football tournament groups')
        
        # Calendario
        elif 'calendario' in h2_lower or 'schedule' in h2_lower or 'fechas' in h2_lower:
            section_keywords.append('calendar schedule sports')
        
        # Equipos/selecciones
        elif 'equipos' in h2_lower or 'teams' in h2_lower or 'selección' in h2_lower:
            section_keywords.append('football team national')
        
        # Vuelos
        elif 'vuelo' in h2_lower or 'flight' in h2_lower:
            section_keywords.append('airplane travel flight')
        
        # Entradas
        elif 'entrada' in h2_lower or 'ticket' in h2_lower:
            section_keywords.append('football match tickets')
        
        # Genérico para fútbol
        elif 'fútbol' in h2_lower or 'football' in h2_lower or 'soccer' in h2_lower:
            section_keywords.append('football soccer match')
        
        # Si no hay match específico, usar término genérico relacionado con el tema
        else:
            if 'mundial' in tema.lower() or 'world cup' in tema.lower():
                section_keywords.append('world cup football')
            else:
                section_keywords.append('sports championship')
    
    # Obtener imágenes para cada término, evitando duplicados
    images = []
    seen_urls = set()
    
    for keyword in section_keywords[:4]:  # Máximo 4 imágenes
        img = get_pexels_image(keyword)
        if img and img['url'] not in seen_urls:
            images.append(img)
            seen_urls.add(img['url'])
        if len(images) >= 4:
            break
    
    # Si no tenemos suficientes imágenes, buscar con términos alternativos
    if len(images) < 4:
        alternative_keywords = []
        if '/cities/' in url:
            city = url.split('/cities/')[-1].split('/')[0]
            alternative_keywords = [
                f'{city.replace("-", " ")} architecture',
                f'{city.replace("-", " ")} landmarks',
                f'{city.replace("-", " ")} tourism'
            ]
        elif 'stadium' in url or 'estadio' in url:
            alternative_keywords = ['soccer field', 'football pitch', 'stadium interior']
        elif 'travel' in url or 'viaje' in url:
            alternative_keywords = ['travel destination', 'vacation planning', 'trip planning']
        
        for keyword in alternative_keywords:
            if len(images) >= 4:
                break
            img = get_pexels_image(keyword)
            if img and img['url'] not in seen_urls:
                images.append(img)
                seen_urls.add(img['url'])
    
    return images

def generate_specific_content(row):
    """Generate specific, unique content based on page type"""
    tema = row['Página / Tema']
    url = row['URL sugerida'].strip('/')
    intencion = row['Intención']
    
    # Check if it's a city page
    city_content = get_city_content(url)
    if city_content:
        return city_content['content']
    
    # Format page
    if 'formato' in url or 'format' in url:
        return '''
        <p>El formato del Mundial 2026 representa un cambio histórico en la estructura de la Copa del Mundo. Por primera vez en la historia, el torneo contará con 48 equipos participantes, un aumento significativo desde los 32 equipos que han competido desde 1998. Este cambio no solo amplía la participación global, sino que también modifica fundamentalmente cómo funciona el torneo desde la fase de grupos hasta la final.</p>
        
        <h2>Estructura del Formato con 48 Equipos</h2>
        
        <p>Con la expansión a 48 equipos, el Mundial 2026 introduce 12 grupos de 4 equipos cada uno, en lugar de los 8 grupos tradicionales. Esta estructura significa que habrá más partidos en la fase de grupos, extendiendo esta etapa del torneo y brindando más oportunidades para que los equipos demuestren su calidad. Los dos primeros equipos de cada grupo avanzarán automáticamente a los octavos de final, lo que significa que 24 equipos pasarán a la siguiente fase directamente. Además, los 8 mejores terceros lugares también avanzarán, lo que significa que un total de 32 equipos llegarán a la fase eliminatoria.</p>
        
        <h2>Fase de Grupos: Más Partidos, Más Emoción</h2>
        
        <p>La fase de grupos del Mundial 2026 será más extensa que nunca. Con 12 grupos de 4 equipos, cada equipo jugará 3 partidos en la fase de grupos, para un total de 72 partidos solo en esta etapa. Esto compara con los 48 partidos de la fase de grupos en el formato anterior. La extensión de la fase de grupos permite más días de fútbol, más oportunidades para que los fanáticos vean partidos, y más tiempo para que los equipos encuentren su forma durante el torneo. Para los fanáticos que asisten en persona, esto significa más días para planificar viajes entre ciudades sede.</p>
        
        <h2>Fase Eliminatoria: Sistema de Eliminación Directa</h2>
        
        <p>La fase eliminatoria del Mundial 2026 sigue el formato tradicional de eliminación directa, pero con más equipos participando. Con 32 equipos avanzando desde la fase de grupos (24 equipos clasificados automáticamente más 8 mejores terceros), la fase eliminatoria comenzará con 16 partidos de octavos de final. Los ganadores avanzarán a los cuartos de final (8 partidos), luego semifinales (4 partidos), y finalmente la gran final. En total, habrá 32 partidos en la fase eliminatoria, comparado con los 16 partidos del formato anterior.</p>
        
        <h2>Impacto del Nuevo Formato</h2>
        
        <p>El nuevo formato del Mundial 2026 tiene implicaciones significativas para equipos, jugadores y fanáticos. Para los equipos, especialmente aquellos de confederaciones menos representadas, el formato ampliado ofrece más oportunidades para participar en el torneo más importante del mundo. Para los jugadores, significa más partidos y más oportunidades para demostrar su calidad en el escenario mundial más grande. Para los fanáticos, el formato ampliado significa más días de fútbol, más partidos para ver, y más oportunidades para asistir al mundial en persona.</p>
        
        <h2>Calendario y Duración del Torneo</h2>
        
        <p>Con el formato ampliado, el Mundial 2026 será más largo que ediciones anteriores. El torneo completo incluirá 104 partidos en total (72 en fase de grupos, 32 en fase eliminatoria), comparado con los 64 partidos del formato anterior. Esto significa que el torneo probablemente durará aproximadamente un mes completo, similar a ediciones anteriores, pero con más partidos distribuidos a lo largo de ese período. La extensión permite que los equipos tengan más días de descanso entre partidos, lo que puede resultar en fútbol de mayor calidad y menos lesiones por fatiga.</p>
        
        <h2>Distribución Geográfica del Formato</h2>
        
        <p>El formato del Mundial 2026 también refleja la naturaleza trinacional del torneo. Con sedes distribuidas a través de México, Estados Unidos y Canadá, los partidos se distribuirán estratégicamente para minimizar el viaje de los equipos mientras maximizan la accesibilidad para los fanáticos. Los grupos pueden organizarse geográficamente para reducir el desplazamiento de equipos durante la fase de grupos, mientras que las fases eliminatorias pueden organizarse para crear rutas lógicas hacia la final. Esta distribución geográfica también ofrece a los fanáticos oportunidades para experimentar diferentes ciudades y culturas durante el torneo.</p>
        
        <h2>Comparación con Formatos Anteriores</h2>
        
        <p>El formato del Mundial 2026 marca un retorno a un formato más amplio, similar a lo que existía antes de 1998 cuando el torneo tenía 24 equipos. Sin embargo, el formato de 2026 es único en su estructura de 12 grupos. Comparado con el formato de 32 equipos que ha sido estándar desde 1998, el nuevo formato ofrece un equilibrio interesante: más equipos participan, pero la fase de grupos sigue siendo manejable con 4 equipos por grupo. Esto mantiene la emoción y competitividad de la fase de grupos mientras aumenta las oportunidades de participación global.</p>
        '''
    
    # Schedule page
    if 'schedule' in url or 'calendario' in url:
        return '''
        <p>El calendario del Mundial 2026 está diseñado para maximizar la experiencia tanto de los fanáticos locales como de los visitantes internacionales. Con el formato ampliado a 48 equipos y 104 partidos en total, el calendario requiere una planificación cuidadosa para distribuir partidos a través de múltiples ciudades en tres países diferentes. Esta guía te proporciona toda la información que necesitas sobre el calendario del Mundial 2026, desde las fechas específicas hasta cómo planificar tu asistencia a los partidos.</p>
        
        <h2>Fases del Calendario del Mundial 2026</h2>
        
        <p>El calendario del Mundial 2026 se divide en varias fases claramente definidas. La fase de grupos será la más extensa, con 72 partidos distribuidos a lo largo de aproximadamente dos semanas. Durante esta fase, los equipos competirán en sus respectivos grupos, con cada equipo jugando 3 partidos. La fase de grupos determinará qué equipos avanzan a los octavos de final. Después de la fase de grupos, la fase eliminatoria comenzará con los octavos de final, seguidos por cuartos de final, semifinales, el partido por el tercer lugar, y finalmente la gran final.</p>
        
        <h2>Fechas y Horarios de Partidos</h2>
        
        <p>Las fechas específicas del Mundial 2026 serán anunciadas por FIFA más cerca del evento, pero basándose en el formato y las tradiciones de ediciones anteriores, el torneo probablemente comenzará a finales de mayo o principios de junio de 2026. Los partidos se distribuirán a lo largo de cada día, con múltiples partidos jugándose simultáneamente o en horarios escalonados. Esto permite que los fanáticos vean múltiples partidos en un solo día si lo desean, especialmente durante la fase de grupos. Los horarios de los partidos considerarán las zonas horarias de las sedes y los mercados de televisión globales.</p>
        
        <h2>Distribución por Sedes</h2>
        
        <p>El calendario del Mundial 2026 distribuirá partidos a través de las 16 ciudades sede en México, Estados Unidos y Canadá. Cada ciudad sede albergará múltiples partidos a lo largo del torneo, con algunas ciudades posiblemente albergando partidos de fases eliminatorias más avanzadas. La distribución de partidos está diseñada para maximizar el uso de la infraestructura disponible mientras proporciona acceso amplio para fanáticos en diferentes regiones. Las ciudades que albergan partidos de fases avanzadas, especialmente semifinales y la final, probablemente sean anunciadas con anticipación para permitir planificación adecuada.</p>
        
        <h2>Planificación de Viajes Durante el Torneo</h2>
        
        <p>El calendario extendido del Mundial 2026 ofrece oportunidades únicas para los fanáticos de viajar entre diferentes ciudades sede durante el torneo. Con partidos distribuidos a lo largo de varias semanas, los fanáticos pueden planificar rutas que les permitan experimentar múltiples ciudades y ver partidos de diferentes equipos o fases del torneo. Sin embargo, esto requiere planificación cuidadosa, especialmente considerando la demanda esperada en vuelos, alojamiento y transporte entre ciudades. Te recomendamos comenzar a planificar tus viajes tan pronto como se anuncien las fechas específicas de los partidos que quieres ver.</p>
        
        <h2>Partidos Clave del Calendario</h2>
        
        <p>Mientras que todos los partidos del Mundial 2026 serán emocionantes, ciertos partidos destacarán en el calendario. El partido inaugural marcará el comienzo del torneo y tradicionalmente incluye al país anfitrión. Los partidos de fase de grupos entre equipos tradicionalmente fuertes generarán expectativa particular. Los partidos eliminatorios, especialmente cuartos de final, semifinales y la final, representarán momentos culminantes del torneo. Estos partidos clave probablemente tendrán mayor demanda de entradas y requerirán planificación anticipada significativa.</p>
        
        <h2>Calendario y Zonas Horarias</h2>
        
        <p>Con sedes distribuidas a través de tres países y múltiples zonas horarias, el calendario del Mundial 2026 debe considerar las diferencias horarias para maximizar la audiencia televisiva global. Los partidos probablemente se programarán en horarios que funcionen bien tanto para la audiencia local como para los mercados televisivos internacionales. Esto significa que los fanáticos que asisten en persona pueden necesitar planificar para partidos en diferentes horarios del día, mientras que los fanáticos que siguen desde casa pueden disfrutar de una programación extendida que cubre prácticamente todo el día durante la fase de grupos.</p>
        
        <h2>Recursos para Seguir el Calendario</h2>
        
        <p>Mantenerte actualizado con el calendario del Mundial 2026 será crucial para planificar tu experiencia, ya sea que asistas en persona o sigas el torneo desde casa. Te recomendamos marcar esta página y verificar regularmente para actualizaciones sobre fechas y horarios específicos. También puedes configurar alertas para recibir notificaciones cuando se anuncien detalles adicionales del calendario. Nuestras herramientas de planificación pueden ayudarte a organizar tus viajes y asistencia a partidos basándote en el calendario del torneo.</p>
        '''
    
    # Teams page
    if 'teams' in url and 'mexico' not in url:
        return '''
        <p>El Mundial 2026 será el torneo más grande de la historia, con 48 equipos participantes compitiendo por el título más prestigioso del fútbol mundial. Esta expansión histórica significa que más países que nunca tendrán la oportunidad de participar en el torneo más importante del mundo, creando un evento verdaderamente global que celebrará la diversidad y la pasión del fútbol en todos los continentes.</p>
        
        <h2>Expansión a 48 Equipos: Un Cambio Histórico</h2>
        
        <p>La expansión del Mundial de 32 a 48 equipos representa uno de los cambios más significativos en la historia del torneo. Esta expansión no solo aumenta el número de equipos participantes, sino que también modifica cómo se distribuyen los lugares entre las diferentes confederaciones. Cada confederación verá un aumento en su representación, lo que significa que más países tendrán la oportunidad de vivir la experiencia única de participar en un Mundial. Esta expansión refleja el crecimiento global del fútbol y el deseo de hacer el torneo más inclusivo y representativo de la diversidad futbolística mundial.</p>
        
        <h2>Distribución de Plazas por Confederación</h2>
        
        <p>Con la expansión a 48 equipos, la distribución de plazas entre las confederaciones se ajustará significativamente. La UEFA (Europa) tradicionalmente ha tenido la mayor representación y continuará teniendo el mayor número de plazas, pero otras confederaciones verán aumentos proporcionales importantes. La CONCACAF (América del Norte, Central y Caribe) se beneficiará especialmente, ya que los tres países anfitriones (México, Estados Unidos y Canadá) ya están clasificados automáticamente. La CONMEBOL (América del Sur), CAF (África), AFC (Asia), y OFC (Oceanía) también verán aumentos en sus representaciones, haciendo del Mundial 2026 el torneo más diverso geográficamente en la historia.</p>
        
        <h2>Proceso de Clasificación</h2>
        
        <p>El proceso de clasificación para el Mundial 2026 comenzará años antes del torneo, con equipos de todo el mundo compitiendo en torneos de clasificación organizados por sus respectivas confederaciones. Cada confederación tiene su propio formato de clasificación, que varía en duración y estructura. Los procesos de clasificación típicamente duran aproximadamente dos años y culminan con partidos decisivos que determinan qué equipos se unirán a los países anfitriones en el torneo final. El proceso de clasificación en sí mismo genera emoción y drama significativo, ya que los equipos luchan por uno de los lugares codiciados en el Mundial.</p>
        
        <h2>Equipos Debutantes Esperados</h2>
        
        <p>Con la expansión a 48 equipos, es probable que veamos varios equipos debutantes en el Mundial 2026. Estos equipos debutantes representan el crecimiento global del fútbol y las nuevas oportunidades creadas por el formato ampliado. Para estos equipos, participar en el Mundial representa un logro histórico y una oportunidad para mostrar su fútbol en el escenario mundial más grande. Los fanáticos pueden esperar ver nuevas historias de éxito, equipos subestimados que superan expectativas, y la pasión única que los equipos debutantes traen al torneo.</p>
        
        <h2>Equipos Tradicionales y Favoritos</h2>
        
        <p>Además de los nuevos participantes, el Mundial 2026 incluirá todos los equipos tradicionalmente fuertes que los fanáticos esperan ver. Brasil, Argentina, Alemania, Francia, España, Italia, y otros equipos con historias ricas en Copas del Mundo competirán por el título. Estos equipos traen consigo expectativas altas, jugadores estrella, y pasión de sus fanáticos. El formato ampliado no diluye la calidad del torneo; en cambio, añade más oportunidades para partidos emocionantes entre equipos de diferentes niveles y estilos de juego.</p>
        
        <h2>Los Países Anfitriones</h2>
        
        <p>México, Estados Unidos y Canadá automáticamente están clasificados como países anfitriones del Mundial 2026. México tiene una rica historia en Copas del Mundo, habiendo participado en múltiples ediciones y llegando hasta los cuartos de final en varias ocasiones. Estados Unidos ha estado mejorando consistentemente en el escenario mundial y tiene una infraestructura futbolística en crecimiento. Canadá, después de calificar para el Mundial 2022, trae entusiasmo renovado y crecimiento futbolístico significativo. Los tres países anfitriones tendrán la ventaja de jugar en casa, lo que puede ser un factor significativo en su desempeño durante el torneo.</p>
        
        <h2>Agrupación y Fase de Grupos</h2>
        
        <p>Los 48 equipos se dividirán en 12 grupos de 4 equipos cada uno. El sorteo de grupos, típicamente realizado meses antes del torneo, determinará qué equipos se enfrentarán en la fase de grupos. El sorteo está diseñado para distribuir equipos de diferentes niveles y confederaciones de manera equilibrada, creando grupos competitivos pero justos. Los dos primeros equipos de cada grupo avanzarán automáticamente, junto con los 8 mejores terceros lugares, para un total de 32 equipos en la fase eliminatoria.</p>
        
        <h2>Seguimiento de los Equipos</h2>
        
        <p>Con 48 equipos participantes, seguir a todos los equipos durante el Mundial 2026 será una experiencia rica y diversa. Nuestras guías detalladas por equipo proporcionan información sobre plantillas, estilos de juego, jugadores clave, y historias de cada selección nacional. Ya sea que estés siguiendo a tu equipo nacional, explorando equipos de otras confederaciones, o simplemente disfrutando del fútbol de clase mundial, tener información sobre los diferentes equipos mejorará significativamente tu experiencia del torneo.</p>
        '''
    
    # Add more specific content templates as needed
    # For now, return generic content
    return generate_generic_content(row)

def generate_generic_content(row):
    """Generate generic but SEO-optimized content"""
    tema = row['Página / Tema']
    intencion = row['Intención']
    
    if intencion == 'Informacional':
        return f'''
        <p>Esta guía completa sobre {tema} te proporciona toda la información que necesitas para entender {tema.lower()} en el contexto del Mundial 2026. El Mundial 2026 representa un momento histórico en el fútbol mundial, y comprender {tema.lower()} es esencial para cualquier fanático que quiera disfrutar al máximo este evento.</p>
        
        <h2>¿Qué es {tema} en el Mundial 2026?</h2>
        
        <p>{tema} es uno de los aspectos más importantes del Mundial 2026 que todo fanático debe conocer. Con la expansión del torneo a 48 equipos y la celebración del evento en tres países diferentes, {tema.lower()} adquiere una relevancia sin precedentes. Esta guía te explica todo lo que necesitas saber sobre {tema.lower()}, desde los aspectos básicos hasta los detalles más técnicos que pueden marcar la diferencia en tu experiencia como fanático del mundial.</p>
        
        <h2>Importancia de {tema} para el Mundial 2026</h2>
        
        <p>El Mundial 2026 no es solo otro torneo de fútbol; es un evento que redefinirá cómo experimentamos la Copa del Mundo. {tema} juega un papel crucial en esta experiencia, y entender sus matices puede mejorar significativamente cómo planeas y disfrutas del evento. Ya sea que estés planificando asistir en persona o siguiendo el torneo desde casa, la información sobre {tema.lower()} que proporcionamos aquí te ayudará a tomar decisiones informadas.</p>
        
        <h2>Detalles Específicos sobre {tema}</h2>
        
        <p>Cuando se trata de {tema.lower()} en el Mundial 2026, hay varios factores clave que debes considerar. La expansión del torneo a 48 equipos introduce nuevos elementos en {tema.lower()} que no existían en ediciones anteriores. Además, la celebración del torneo en múltiples ciudades a través de tres países diferentes añade capas adicionales de complejidad e interés. Nuestra guía desglosa todos estos aspectos de manera clara y accesible.</p>
        
        <h2>Cómo Usar Esta Información</h2>
        
        <p>La información sobre {tema.lower()} que proporcionamos aquí está diseñada para ser práctica y aplicable. Ya sea que estés en las etapas iniciales de planificación o ya tengas planes específicos para el Mundial 2026, esta guía te ayudará a navegar {tema.lower()} con confianza. Te recomendamos leer esta información cuidadosamente y usarla como punto de referencia mientras continúas planificando tu experiencia del mundial.</p>
        
        <h2>Recursos Adicionales</h2>
        
        <p>Para complementar esta guía sobre {tema.lower()}, te recomendamos explorar nuestras otras secciones relacionadas con el Mundial 2026. Tenemos información detallada sobre el formato del torneo, el calendario de partidos, las sedes y estadios, y mucho más. Cada sección está diseñada para trabajar en conjunto, proporcionándote una comprensión completa del Mundial 2026.</p>
        '''
    else:
        return f'''
        <p>Planificar tu experiencia en el Mundial 2026 requiere consideraciones prácticas importantes, especialmente cuando se trata de {tema.lower()}. Esta guía completa te proporciona toda la información que necesitas para tomar decisiones informadas sobre {tema.lower()} para el Mundial 2026.</p>
        
        <h2>¿Por Qué {tema} es Crítico?</h2>
        
        <p>{tema} es uno de los aspectos más importantes de la planificación para el Mundial 2026. Con el torneo expandiéndose a 48 equipos y celebrándose en múltiples ciudades, las decisiones sobre {tema.lower()} pueden afectar significativamente tu experiencia general del evento.</p>
        
        <h2>Opciones Disponibles</h2>
        
        <p>Cuando se trata de {tema.lower()} para el Mundial 2026, hay múltiples opciones disponibles para diferentes presupuestos y preferencias. Ya sea que busques opciones económicas, opciones de gama media, o alternativas premium, nuestra guía cubre todo el espectro.</p>
        
        <h2>Consejos para Maximizar tu Presupuesto</h2>
        
        <p>El Mundial 2026 puede ser una inversión significativa, y {tema.lower()} es a menudo uno de los componentes más costosos. Sin embargo, con planificación adecuada y conocimiento de las opciones disponibles, puedes encontrar soluciones que se ajusten a tu presupuesto sin comprometer la calidad de tu experiencia.</p>
        
        <h2>Planificación Anticipada</h2>
        
        <p>Dada la popularidad esperada del Mundial 2026, es crucial comenzar a planificar {tema.lower()} con mucha anticipación. La demanda probablemente será extremadamente alta, especialmente en las ciudades sede, lo que significa que las opciones pueden volverse limitadas y los precios pueden aumentar significativamente.</p>
        
        <h2>Recursos y Herramientas</h2>
        
        <p>Además de esta guía, proporcionamos recursos adicionales y herramientas para ayudarte en tu planificación. Estos recursos incluyen comparaciones detalladas, consejos de expertos, y acceso a información actualizada sobre el Mundial 2026.</p>
        '''

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
    for i, part in enumerate(breadcrumb_parts):
        if part:
            current_path += f"/{part}"
            part_name = part.replace('-', ' ').title()
            if part == breadcrumb_parts[-1] or '[' in part:
                breadcrumb_html += f' > <span>{part_name}</span>'
            else:
                breadcrumb_html += f' > <a href="{current_path}/">{part_name}</a>'
    breadcrumb_html += '\n        </div>'
    
    content = generate_specific_content(row)
    
    # Obtener imagen principal relevante de Pexels
    image_data = get_relevant_image_for_page(tema, url, intencion)
    image_html = generate_image_html(image_data) if image_data else ""
    
    # Obtener imágenes adicionales para insertar en el contenido
    content_images = get_content_section_images(tema, url, content)
    if content_images:
        content = insert_images_in_content(content, content_images)
    
    # Meta tags para Open Graph y Twitter Card con imagen
    og_image_tag = f'    <meta property="og:image" content="{image_data["url"]}">' if image_data else ""
    og_image_width_tag = f'    <meta property="og:image:width" content="{image_data["width"]}">' if image_data else ""
    og_image_height_tag = f'    <meta property="og:image:height" content="{image_data["height"]}">' if image_data else ""
    twitter_image_tag = f'    <meta name="twitter:image" content="{image_data["url"]}">' if image_data else ""
    
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
    {og_image_tag}
    {og_image_width_tag}
    {og_image_height_tag}
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{h1}">
    <meta name="twitter:description" content="{description[:200]}">
    {twitter_image_tag}
    
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

        {image_html}

        {content}
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

