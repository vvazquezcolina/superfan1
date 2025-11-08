'use client';

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

const agendaHighlights = [
  {
    title: "Semana 1 · 17 al 23 de noviembre",
    items: [
      "Ceremonia inaugural y rally integrador en el campus.",
      "Encuentros deportivos amistosos entre universidades invitadas.",
      "Clínicas de liderazgo estudiantil y colaboración interuniversitaria.",
    ],
  },
  {
    title: "Semana 2 · 24 al 30 de noviembre",
    items: [
      "Laboratorios creativos guiados por la 45 Muestra Nacional de Teatro.",
      "Paneles con especialistas en sustentabilidad y cultura de paz de Unicaribe.",
      "Noches culturales con talento universitario nacional.",
    ],
  },
  {
    title: "Semana 3 · 1 al 7 de diciembre",
    items: [
      "Ruta gastronómica colaborativa con universidades invitadas.",
      "Foros de innovación educativa y vinculación social.",
      "Función estelar itinerante de la 45 Muestra Nacional de Teatro.",
    ],
  },
  {
    title: "Clausura · 8 al 12 de diciembre",
    items: [
      "Expo proyectos integradores y premiación Superfan 2025.",
      "Networking institucional con autoridades universitarias.",
      "Cierre artístico y despedida frente al Caribe mexicano.",
    ],
  },
];

const hotels = [
  {
    name: "Oh! The Urban Oasis Cancún",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/652128441.jpg?k=43c314f1ff392004596612cbc41db1cdfda51b39524a84288ad77e8118af8cde&o=",
    description:
      "Ubicación céntrica, piscina estilo lounge y traslados programados al campus para delegaciones universitarias.",
    url: "https://www.oasishoteles.com/es/hoteles/oh-the-urban-oasis",
  },
  {
    name: "Marriott Courtyard Cancún",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max500/745356220.jpg?k=6872d297bf8e29811e833994bd29dcb92cbb1990991fcfd75070398b0ec508bf&o=&hp=1",
    description:
      "Servicio ejecutivo, salas de juntas para equipos organizadores y transporte gratuito al aeropuerto.",
    url: "https://www.marriott.com/en-us/hotels/cunfy-courtyard-cancun-airport/overview/",
  },
  {
    name: "Terracaribe Cancún",
    image: "https://content.skyscnr.com/available/1981058945/1981058945_WxH.jpg",
    description:
      "Opción boutique amigable con grupos académicos, desayuno continental y convenios especiales para Superfan.",
    url: "https://terracaribecancun.com/",
  },
];

const faqs = [
  {
    question: "¿Qué universidades pueden participar?",
    answer:
      "Está abierta la invitación a universidades públicas y privadas de la República Mexicana. El cupo es limitado y se asigna por orden de confirmación.",
  },
  {
    question: "¿Hay costo de inscripción?",
    answer:
      "Superfan Cancún 2025 es un evento institucional sin costo; cada delegación cubre únicamente sus viáticos y hospedaje.",
  },
  {
    question: "¿Cómo registro a mi delegación?",
    answer:
      "Se enviarán instrucciones personalizadas a las universidades invitadas. Si todavía no recibes tu folio, escríbenos a superfaninfo@unicaribe.mx.",
  },
  {
    question: "¿Qué actividades incluye la 45 Muestra Nacional de Teatro?",
    answer:
      "Habrá talleres intensivos, conversatorios con compañías invitadas y una función estelar exclusiva para las delegaciones universitarias.",
  },
  {
    question: "¿Ofrecen opciones de transporte local?",
    answer:
      "Sí, coordinamos rutas recomendadas desde hoteles aliados y se compartirán horarios oficiales en la semana previa al evento.",
  },
];

const testimonials = [
  {
    name: "Andrea Fernández",
    role: "Coordinadora Cultural · Universidad de Guanajuato",
    quote:
      "Superfan nos permitió conectar a nuestros estudiantes con universidades de todo el país. La agenda cultural fue impecable.",
  },
  {
    name: "Luis Herrera",
    role: "Director Deportivo · UANL",
    quote:
      "La logística de Unicaribe es de primer nivel. Cada actividad integradora reforzó el trabajo en equipo entre delegaciones.",
  },
  {
    name: "María Ortiz",
    role: "Productora · 45 Muestra Nacional de Teatro",
    quote:
      "Un campus vibrante y receptivo para presentar teatro contemporáneo. La energía estudiantil hizo únicas nuestras funciones.",
  },
];

const logos = {
  unicaribe: "https://www.unicaribe.mx/static/img/logo.184cad1780d2.png",
  mnt: "https://mnt.inba.gob.mx/front/img/logoactividades.jpg",
};

const news = [
  {
    title:
      "Titular de SEMA, Lic. Óscar Rébora, urge desde la Unicaribe a crear la agenda de adaptación al cambio climático",
    image:
      "https://www.unicaribe.mx/media/images/Rebora2.2e16d0ba.fill-720x480.format-webp.webp",
    href: "https://www.unicaribe.mx/noticias/titular-de-sema-urge-desde-la-unicaribe-a-crear-la-agenda-de-adaptacion-al-cambio-climatico",
    alt: "Titular de SEMA en conferencia en la Universidad del Caribe",
    category: "Sostenibilidad",
  },
  {
    title:
      "Impulsa la Unicaribe la preservación, inclusiva y sostenible, de nuestra tradiciones",
    image:
      "https://www.unicaribe.mx/media/images/Janal_Pixan_2.2e16d0ba.fill-720x480.format-webp.webp",
    href: "https://www.unicaribe.mx/noticias/impulsa-la-unicaribe-la-preservacion-inclusiva-y-sostenible-de-nuestra-tradiciones",
    alt: "Celebración cultural en la Universidad del Caribe",
    category: "Cultura",
  },
  {
    title:
      "La Unicaribe refuerza la colaboración con la Universidad Sun Yat sen de China",
    image:
      "https://www.unicaribe.mx/media/images/Confucio4_2wbWvg1.2e16d0ba.fill-720x480.format-webp.webp",
    href: "https://www.unicaribe.mx/noticias/la-unicaribe-refuerza-la-colaboracion-con-la-universidad-sun-yat-sen-de-china",
    alt: "Representantes de Unicaribe y Sun Yat sen estrechando manos",
    category: "Vinculación",
  },
];

const events = [
  {
    title: "Ofrendas",
    image:
      "https://www.unicaribe.mx/media/images/catrin-02_copia_2.max-480x680.format-webp.webp",
    fullImage:
      "https://www.unicaribe.mx/media/images/catrin-02_copia_2.width-800.jpg",
    caption: "Ofrendas · Festival Superfan",
  },
  {
    title: "Catrines",
    image:
      "https://www.unicaribe.mx/media/images/catrin-01_copia.max-480x680.format-webp.webp",
    fullImage:
      "https://www.unicaribe.mx/media/images/catrin-01_copia.width-800.jpg",
    caption: "Catrines · Pasarela cultural",
  },
  {
    title: "Congreso CBEI",
    image:
      "https://www.unicaribe.mx/media/images/DIGITAL_CEI_2025_copia.max-480x680.format-webp.webp",
    fullImage:
      "https://www.unicaribe.mx/media/images/DIGITAL_CEI_2025_copia.width-800.jpg",
    caption: "Congreso CBEI 2025",
  },
];

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Superfan Cancún 2025",
  description:
    "Encuentro universitario con actividades integradoras y participación especial de la 45 Muestra Nacional de Teatro en la Universidad del Caribe.",
  startDate: "2025-11-17",
  endDate: "2025-12-12",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Universidad del Caribe",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carr. a Cancún Aeropuerto Km. 11.5, SM 78",
      addressLocality: "Cancún",
      addressRegion: "Quintana Roo",
      postalCode: "77528",
      addressCountry: "MX",
    },
  },
  organizer: {
    "@type": "CollegeOrUniversity",
    name: "Universidad del Caribe",
    url: "https://www.unicaribe.mx/",
  },
  performer: {
    "@type": "TheaterGroup",
    name: "45 Muestra Nacional de Teatro",
    url: "https://mnt.inba.gob.mx/",
  },
  image: [
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/652128441.jpg?k=43c314f1ff392004596612cbc41db1cdfda51b39524a84288ad77e8118af8cde&o=",
  ],
  audience: {
    "@type": "Audience",
    audienceType: ["Estudiantes universitarios", "Coordinadores académicos"],
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "MXN",
    availability: "https://schema.org/InStock",
    url: "https://superfan.unicaribe.mx/",
  },
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => setMenuOpen((prev) => !prev);

  const handleAnchorClick =
    (hash: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setMenuOpen(false);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", hash);
      }
    };

  return (
    <>
      <Script
        id="event-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <main id="contenido" className="flex flex-col">
        <header className="relative isolate overflow-hidden bg-white text-neutral-900">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24 sm:px-10 lg:px-12">
            <nav
              aria-label="Navegación principal"
              className="flex items-center justify-between"
            >
              <Link
                href="#contenido"
                onClick={handleAnchorClick("#contenido")}
                className="text-base font-semibold text-brand transition hover:text-brand-dark"
                aria-label="Superfan Cancún 2025"
              >
                Superfan Cancún 2025
              </Link>
              <div className="hidden items-center gap-4 text-sm font-semibold text-brand sm:flex">
                <Link
                  href="#agenda"
                  onClick={handleAnchorClick("#agenda")}
                  className="transition hover:text-brand-dark"
                >
                  Agenda
                </Link>
                <Link
                  href="#logistica"
                  onClick={handleAnchorClick("#logistica")}
                  className="transition hover:text-brand-dark"
                >
                  Logística
                </Link>
                <Link
                  href="#hospedaje"
                  onClick={handleAnchorClick("#hospedaje")}
                  className="transition hover:text-brand-dark"
                >
                  Hospedaje
                </Link>
                <Link
                  href="#faq"
                  onClick={handleAnchorClick("#faq")}
                  className="transition hover:text-brand-dark"
                >
                  FAQ
                </Link>
                <Link
                  href="#contacto"
                  onClick={handleAnchorClick("#contacto")}
                  className="transition hover:text-brand-dark"
                >
                  Contacto
                </Link>
              </div>
              <button
                type="button"
                onClick={handleToggleMenu}
                className="flex items-center gap-2 rounded-full border border-brand/40 px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:hidden"
                aria-controls="mobile-menu"
                aria-expanded={menuOpen}
              >
                <span>{menuOpen ? "Cerrar" : "Menú"}</span>
                <span aria-hidden="true" className="text-lg leading-none">
                  ☰
                </span>
              </button>
            </nav>
            <div
              id="mobile-menu"
              className={`sm:hidden ${
                menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden rounded-2xl border border-brand/20 bg-brand/5 transition-all duration-300`}
            >
              <div className="flex flex-col gap-2 px-6 py-4 text-sm font-semibold text-brand">
                <Link
                  href="#agenda"
                  onClick={handleAnchorClick("#agenda")}
                  className="rounded-xl px-4 py-3 transition hover:bg-brand/10"
                >
                  Agenda
                </Link>
                <Link
                  href="#logistica"
                  onClick={handleAnchorClick("#logistica")}
                  className="rounded-xl px-4 py-3 transition hover:bg-brand/10"
                >
                  Logística
                </Link>
                <Link
                  href="#hospedaje"
                  onClick={handleAnchorClick("#hospedaje")}
                  className="rounded-xl px-4 py-3 transition hover:bg-brand/10"
                >
                  Hospedaje
                </Link>
                <Link
                  href="#faq"
                  onClick={handleAnchorClick("#faq")}
                  className="rounded-xl px-4 py-3 transition hover:bg-brand/10"
                >
                  FAQ
                </Link>
                <Link
                  href="#contacto"
                  onClick={handleAnchorClick("#contacto")}
                  className="rounded-xl px-4 py-3 transition hover:bg-brand/10"
                >
                  Contacto
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-soft backdrop-blur">
              <div className="relative w-full">
                <div className="relative aspect-[2220/840] w-full">
                  <Image
                    src="https://www.unicaribe.mx/media/images/carruselaniv25.2e16d0ba.fill-2220x840.format-webp.webp"
                    alt="Banner aniversario Universidad del Caribe"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          <div className="flex flex-col gap-6 sm:max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-medium uppercase tracking-wider text-brand">
              Superfan Cancún 2025 · 17 nov – 12 dic
            </span>
            <h1 className="text-4xl font-semibold text-neutral-900 sm:text-5xl">
              El encuentro universitario que conecta a México desde la
              Universidad del Caribe.
            </h1>
            <p className="text-lg text-neutral-700 sm:text-xl">
              Vive cuatro semanas de actividades integradoras, experiencias
              culturales frente al mar y la participación especial de la 45
              Muestra Nacional de Teatro. Cancún se convierte en el punto de
              reunión para delegaciones de todo el país.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Link
                href="#agenda"
                className="rounded-full bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Explorar agenda
              </Link>
              <Link
                href="#logistica"
                className="rounded-full border border-brand px-6 py-3 text-base font-semibold text-brand transition hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Información logística
              </Link>
            </div>
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-brand/10 bg-brand/5 p-6 shadow-soft">
              <dt className="text-sm uppercase tracking-widest text-brand-dark/70">
                Universidades confirmadas
              </dt>
              <dd className="mt-3 text-3xl font-semibold text-brand-dark">32</dd>
              <p className="mt-2 text-sm text-neutral-600">
                Delegaciones de 18 estados ya preparan su participación.
              </p>
            </div>
            <div className="rounded-2xl border border-brand/10 bg-brand/5 p-6 shadow-soft">
              <dt className="text-sm uppercase tracking-widest text-brand-dark/70">
                Actividades integradoras
              </dt>
              <dd className="mt-3 text-3xl font-semibold text-brand-dark">45+</dd>
              <p className="mt-2 text-sm text-neutral-600">
                Labs de innovación, deporte, liderazgo y experiencias
                colaborativas.
              </p>
            </div>
            <div className="rounded-2xl border border-brand/10 bg-brand/5 p-6 shadow-soft">
              <dt className="text-sm uppercase tracking-widest text-brand-dark/70">
                Funciones teatrales
              </dt>
              <dd className="mt-3 text-3xl font-semibold text-brand-dark">12</dd>
              <p className="mt-2 text-sm text-neutral-600">
                Cartelera curada por la 45 Muestra Nacional de Teatro INBAL.
              </p>
            </div>
          </dl>
        </div>
      </header>

      <section
        id="alianzas"
        className="bg-white py-16 shadow-[0_1px_0_rgba(0,0,0,0.05)]"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand">
              Confianza institucional
            </p>
            <h2 className="text-3xl font-semibold text-neutral-800">
              Respaldado por líderes culturales y académicos
            </h2>
            <p className="mx-auto max-w-3xl text-base text-neutral-600">
              La Universidad del Caribe y la 45 Muestra Nacional de Teatro
              suman esfuerzos para ofrecer una experiencia que combina
              integración universitaria, excelencia académica y arte nacional.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 px-6 py-5 shadow-soft">
              <Image
                src={logos.unicaribe}
                alt="Universidad del Caribe"
                width={160}
                height={80}
                className="h-16 w-auto object-contain"
              />
              <p className="text-sm text-neutral-600">
                Excelencia académica, desarrollo humano y compromiso con el
                Caribe mexicano.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 px-6 py-5 shadow-soft">
              <Image
                src={logos.mnt}
                alt="45 Muestra Nacional de Teatro"
                width={160}
                height={80}
                className="h-16 w-auto object-contain"
              />
              <p className="text-sm text-neutral-600">
                La plataforma teatral más importante del país llega a Cancún con
                programación especial.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 px-6 py-5 shadow-soft">
              <span className="text-3xl font-semibold text-brand">25 años</span>
              <p className="text-sm text-neutral-600">
                Celebrando la trayectoria de Unicaribe con eventos de impacto
                nacional.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 px-6 py-5 shadow-soft">
              <span className="text-3xl font-semibold text-brand">+12,000</span>
              <p className="text-sm text-neutral-600">
                Estudiantes impactados por iniciativas culturales y deportivas.
              </p>
            </div>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="flex flex-col gap-5 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 shadow-soft">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                25 años de impacto
              </span>
              <h3 className="text-2xl font-semibold text-neutral-800">
                Conoce nuestros 25 años de historia
              </h3>
              <p className="text-sm text-neutral-600">
                Desde 2000, la Universidad del Caribe ha impulsado iniciativas
                académicas, ambientales y culturales que conectan al Caribe
                mexicano con universidades de todo el país. Superfan Cancún 2025
                forma parte de esta celebración.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>• Reconocimientos nacionales en innovación educativa.</li>
                <li>• Comunidad estudiantil comprometida con el desarrollo sostenible.</li>
                <li>• Alianzas estratégicas con instituciones culturales y académicas.</li>
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-900 shadow-soft">
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute left-0 top-0 h-full w-full"
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/hddNZAG9JcM?si=xQ_i-uZdFJWo__wk&rel=0"
                  title="¡La Universidad del Caribe cumple 25 años!"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="noticias" className="bg-neutral-50 py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Noticias
              </p>
              <h2 className="text-3xl font-semibold text-neutral-800">
                Actualidad desde la Universidad del Caribe
              </h2>
            </div>
            <Link
              href="https://www.unicaribe.mx/noticias"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand px-5 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Ver más
            </Link>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="group flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_25px_70px_-45px_rgba(0,88,161,0.45)]">
              <Link href={news[0].href} target="_blank" rel="noopener noreferrer">
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={news[0].image}
                    alt={news[0].alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <span className="inline-flex w-fit items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
                    {news[0].category}
                  </span>
                  <h3 className="text-xl font-semibold text-neutral-800">
                    {news[0].title}
                  </h3>
                </div>
              </Link>
            </article>
            <div className="grid gap-6">
              {news.slice(1).map((item) => (
                <article
                  key={item.href}
                  className="group flex gap-5 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_25px_70px_-45px_rgba(0,88,161,0.45)]"
                >
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full gap-5"
                  >
                    <div className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded-2xl">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="inline-flex w-fit items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
                        {item.category}
                      </span>
                      <h3 className="text-base font-semibold text-neutral-800">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="eventos" className="bg-white py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Eventos
              </p>
              <h2 className="text-3xl font-semibold text-neutral-800">
                Conoce más eventos
              </h2>
            </div>
            <Link
              href="https://www.unicaribe.mx/eventos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand px-5 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Ver calendario completo
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {events.map((evento) => (
              <article
                key={evento.fullImage}
                className="group flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 shadow-soft transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_25px_70px_-45px_rgba(0,88,161,0.45)]"
              >
                <Link
                  href={evento.fullImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col"
                >
                  <div className="relative h-80 w-full overflow-hidden bg-neutral-200">
                    <Image
                      src={evento.image}
                      alt={evento.caption}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-6">
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                      {evento.title}
                    </span>
                    <p className="text-xs text-neutral-500">
                      {evento.caption}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="empathy" className="bg-neutral-50 py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-semibold text-neutral-800">
                ¿Coordinar a tu delegación te quita el sueño?
              </h2>
              <p className="text-lg text-neutral-600">
                Sabemos que organizar viajes académicos implica asegurar
                hospedaje, movilidad, actividades significativas y experiencias
                memorables. Superfan Cancún 2025 condensa toda la información en
                un solo lugar para que te concentres en acompañar a tu comunidad.
              </p>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-soft">
                <p className="text-sm font-semibold text-brand">Retos comunes</p>
                <ul className="mt-2 space-y-2 text-sm text-neutral-600">
                  <li>• Coordinar grupos numerosos con tiempos ajustados.</li>
                  <li>• Encontrar actividades que integren perfiles académicos diversos.</li>
                  <li>• Garantizar seguridad y bienestar durante toda la estadía.</li>
                </ul>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-soft">
                  <p className="text-sm font-semibold text-brand">
                    Información clara
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">
                    Agenda semanal, contactos clave y recomendaciones logísticas
                    curadas por el comité organizador.
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-soft">
                  <p className="text-sm font-semibold text-brand">
                    Experiencia segura
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">
                    Protocolos de acompañamiento estudiantil y rutas oficiales
                    hacia el campus.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-brand/15 bg-white p-8 shadow-[0_30px_80px_-45px_rgba(0,88,161,0.5)]">
              <h3 className="text-xl font-semibold text-brand">
                Costos de no asistir
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                <li>
                  • Tu comunidad pierde oportunidades de intercambio con 30+
                  universidades.
                </li>
                <li>
                  • Se reduce la visibilidad de tus proyectos culturales y
                  sociales.
                </li>
                <li>
                  • Tus estudiantes se quedan sin vivir experiencias teatrales
                  nacionales en el Caribe.
                </li>
              </ul>
              <Link
                href="#agenda"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2"
              >
                Suma a tu universidad
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="agenda" className="bg-white py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand">
              Agenda Superfan
            </p>
            <h2 className="text-3xl font-semibold text-neutral-800">
              Cuatro semanas de integración, innovación y teatro nacional
            </h2>
            <p className="mx-auto max-w-3xl text-base text-neutral-600">
              Cada bloque combina actividades deportivas, culturales y
              académicas para que las delegaciones construyan vínculos reales y
              compartan proyectos con impacto en sus comunidades.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {agendaHighlights.map((week) => (
              <div
                key={week.title}
                className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-soft transition hover:border-brand/40 hover:shadow-[0_25px_70px_-50px_rgba(0,88,161,0.6)]"
              >
                <h3 className="text-xl font-semibold text-brand">{week.title}</h3>
                <ul className="space-y-3 text-sm text-neutral-600">
                  {week.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-light" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-brand text-white shadow-soft">
            <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-semibold text-white">
                  Participación especial · 45 Muestra Nacional de Teatro
                </h3>
                <p className="text-base text-white/85">
                  Curaduría del Instituto Nacional de Bellas Artes y Literatura
                  con compañías invitadas que recorren el país antes de llegar a
                  Cancún. Talleres escénicos, residencias creativas y una función
                  estelar se integran a Superfan 2025 para reforzar la
                  colaboración artística. Consulta la cartelera completa en el
                  programa oficial.
                </p>
                <ul className="space-y-3 text-sm text-white/85">
                  <li>• Taller «Escena viva» para líderes culturales.</li>
                  <li>• Dramaturgia con enfoque comunitario y perspectiva de género.</li>
                  <li>• Encuentro con directores y elenco en el foro principal de Unicaribe.</li>
                </ul>
              </div>
              <div className="flex flex-col justify-between gap-6 rounded-2xl bg-white/10 p-6 backdrop-blur">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                    Sedes teatrales
                  </p>
                  <p className="mt-2 text-lg text-white">
                    Auditorio Nikte-Ha, Foro Cultural de Cancún y espacios al
                    aire libre dentro del campus.
                  </p>
                </div>
                <Link
                  href="https://mnt.inba.gob.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Conoce la Muestra Nacional de Teatro
                </Link>
                <Link
                  href="https://mnt.inba.gob.mx/downloads/Programa.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
                >
                  Descargar programa oficial (PDF)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="logistica" className="bg-neutral-50 py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:px-10 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand">
                Sede oficial
              </p>
              <h2 className="text-3xl font-semibold text-neutral-800">
                Universidad del Caribe · Cancún, Quintana Roo
              </h2>
              <p className="text-base text-neutral-600">
                Campus ubicado sobre la avenida Kabah, rodeado del Parque Urbano
                Kabah y del Ombligo Verde, con instalaciones académicas,
                deportivas y culturales certificadas. A 15 minutos del centro de
                Cancún y a 20 minutos del Aeropuerto Internacional.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-soft">
                  <p className="text-sm font-semibold text-brand">
                    Recomendaciones de transporte
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">
                    Traslados programados desde hoteles aliados, taxis
                    autorizados y rutas de autobús R-27 disponibles cada 12
                    minutos.
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-soft">
                  <p className="text-sm font-semibold text-brand">
                    Atención a delegaciones
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">
                    Equipo de Acompañamiento Estudiantil disponible 24/7 en el
                    módulo central del campus.
                  </p>
                </div>
              </div>
              <Link
                href="https://www.unicaribe.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-brand px-5 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                Conoce más sobre Unicaribe
              </Link>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white shadow-[0_30px_80px_-40px_rgba(0,88,161,0.5)]">
              <iframe
                title="Ubicación Universidad del Caribe Cancún"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4765.983927872895!2d-86.826036088242!3d21.2004069804109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c2c298cab405b%3A0xc7ce34485e9b3b8!2sUniversidad%20Del%20Caribe!5e1!3m2!1sen!2smx!4v1762585633051!5m2!1sen!2smx"
                className="h-[360px] w-full"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="hospedaje" className="bg-white py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand">
              Hospedaje aliado
            </p>
            <h2 className="text-3xl font-semibold text-neutral-800">
              Hoteles patrocinadores con tarifas preferenciales
            </h2>
            <p className="mx-auto max-w-3xl text-base text-neutral-600">
              Selecciona la opción que mejor se adapte a tu delegación. Todos
              los hoteles ofrecen convenios especiales para Superfan Cancún 2025
              y asesoría para grupos.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <article
                key={hotel.name}
                className="flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 shadow-soft transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_25px_70px_-45px_rgba(0,88,161,0.55)]"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <h3 className="text-xl font-semibold text-brand">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{hotel.description}</p>
                  <Link
                    href={hotel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-dark"
                  >
                    Ver detalles →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-brand bg-brand/5 px-8 py-10 text-center shadow-soft">
            <h3 className="text-2xl font-semibold text-brand">
              ¿Quieres ser hotel patrocinador?
            </h3>
            <p className="max-w-2xl text-sm text-neutral-600">
              Súmate al programa de hospedaje oficial y recibe promoción directa
              con las delegaciones. Escríbenos y te enviamos los lineamientos de
              participación.
            </p>
            <Link
              href="mailto:2025@superfaninfo.com"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2"
            >
              Enviar correo
            </Link>
          </div>
        </div>
      </section>

      <section id="testimonios" className="bg-neutral-50 py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand">
              Historias Superfan
            </p>
            <h2 className="text-3xl font-semibold text-neutral-800">
              Testimonios que respaldan la experiencia
            </h2>
            <p className="mx-auto max-w-3xl text-base text-neutral-600">
              Voces que han vivido el encuentro y confirman el impacto en sus
              comunidades educativas.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 text-left shadow-soft"
              >
                <blockquote className="text-base text-neutral-700">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="text-sm font-semibold text-brand">
                  {testimonial.name}
                  <span className="mt-1 block font-normal text-neutral-500">
                    {testimonial.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand">
              Preguntas frecuentes
            </p>
            <h2 className="text-3xl font-semibold text-neutral-800">
              Resolvemos tus dudas antes del viaje
            </h2>
            <p className="mx-auto max-w-3xl text-base text-neutral-600">
              Si necesitas detalles adicionales, nuestro equipo de la Dirección
              de Vinculación de Unicaribe te apoyará personalmente.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-soft"
              >
                <h3 className="text-lg font-semibold text-brand">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm text-neutral-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="bg-brand text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70">
                Contacto directo
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Estamos listos para recibir a tu delegación
              </h2>
              <p className="text-base text-white/85">
                Escríbenos para coordinar detalles, recibir materiales de
                difusión o resolver cualquier duda sobre la experiencia Superfan
                Cancún 2025.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="mailto:2025@superfaninfo.com"
                  className="rounded-2xl bg-white/10 p-5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  2025@superfaninfo.com
                  <span className="mt-1 block text-xs font-normal text-white/70">
                    Dirección logística
                  </span>
                </Link>
                <Link
                  href="mailto:superfaninfo@unicaribe.mx"
                  className="rounded-2xl bg-white/10 p-5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  superfaninfo@unicaribe.mx
                  <span className="mt-1 block text-xs font-normal text-white/70">
                    Coordinación Unicaribe
                  </span>
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-white/30 bg-white/10 p-8 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">
                También puedes seguir la conversación:
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li>
                  • Instagram:{" "}
                  <a
                    href="https://www.instagram.com/ucaribeoficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    @ucaribeoficial
                  </a>
                </li>
                <li>
                  • Facebook:{" "}
                  <a
                    href="https://www.facebook.com/UniversidadDelCaribe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    Universidad del Caribe
                  </a>
                </li>
                <li>
                  • X (Twitter):{" "}
                  <a
                    href="https://twitter.com/teatroinbal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    @teatroinbal
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

        <footer className="border-t border-neutral-200 bg-white text-neutral-800">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
              <Image
                src={logos.unicaribe}
                alt="Universidad del Caribe"
                width={160}
                height={80}
                className="h-14 w-auto object-contain"
              />
              <Image
                src={logos.mnt}
                alt="45 Muestra Nacional de Teatro"
                width={150}
                height={80}
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="text-sm text-neutral-600">
              <p>Universidad del Caribe · Cancún, Quintana Roo</p>
              <p>Superfan Cancún 2025 — Todas las actividades sujetas a cambios.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Universidad del Caribe. Todos los derechos reservados.</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#agenda"
                className="transition hover:text-neutral-800"
              >
                Agenda
              </Link>
              <Link
                href="#hospedaje"
                className="transition hover:text-neutral-800"
              >
                Hospedaje
              </Link>
              <Link
                href="#faq"
                className="transition hover:text-neutral-800"
              >
                FAQ
              </Link>
              <Link
                href="#contacto"
                className="transition hover:text-neutral-800"
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
        </footer>
      </main>
    </>
  );
}
