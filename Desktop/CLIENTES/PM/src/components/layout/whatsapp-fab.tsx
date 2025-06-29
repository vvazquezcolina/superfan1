
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function WhatsappFab() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Link
      href="https://wa.me/5219982252064" // Replace with your actual WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 overflow-hidden"
      aria-label={t('whatsapp.fab.ariaLabel')}
    >
      <Image
        src="/images/misc/whatsapp-icon.svg"
        alt="WhatsApp"
        fill
        style={{ objectFit: 'cover' }}
        sizes="56px"
        className="rounded-full"
      />
    </Link>
  );
}
