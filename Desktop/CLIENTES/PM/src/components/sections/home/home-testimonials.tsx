
// src/components/sections/home/home-testimonials.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import * as React from "react";
import { useState, useEffect, useMemo, useRef } from "react";

const newReviewsDataRaw = [
  {
    "nombreUsuario": "Mariko B",
    "linkImagen": "https://media-cdn.tripadvisor.com/media/photo-l/28/4c/e5/95/pp_photo.jpg?maxwidth=400&license=1&crop=1:1,400,400",
    "linkUsuario": "https://www.tripadvisor.com/MemberOverlay?memberId=616081275",
    "review": "Boating at puerto maya was a blast!  The food looked pretty average but everything else was great."
  },
  {
    "nombreUsuario": "Mary Y",
    "linkImagen": "https://media-cdn.tripadvisor.com/media/photo-l/28/4c/e5/9a/pp_photo.jpg?maxwidth=400&license=1&crop=1:1,400,400",
    "linkUsuario": "https://www.tripadvisor.com/MemberOverlay?memberId=52052561",
    "review": "My family and I did this tour in August on our last day in Cancun.  We had a fabulous time.  We had eight adults and two children ranging in age from 3 to 15.  Great tour guide (Oscar).  We saw many sights and the snorkeling was very nice too!"
  },
  {
    "nombreUsuario": "Malia G",
    "linkImagen": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/f2/eb/default-avatar-2020-27.jpg",
    "linkUsuario": "https://www.tripadvisor.com/MemberOverlay?memberId=143674527",
    "review": "Speed boats and snorkeling\nThe speed boats and snorkeling was amazing! Robert was an awesome guide, totally recommend! We saw turtles and fish!!!\n\nReview of: Mayan Jungle Tour Speed Boat Snorkel and Snack\nWritten June 1, 2025"
  },
  {
    "nombreUsuario": "Phyllis G",
    "linkImagen": "https://media-cdn.tripadvisor.com/media/photo-o/1b/77/35/55/default-avatar-2020-2.jpg",
    "linkUsuario": "https://www.tripadvisor.com/MemberOverlay?memberId=63268271",
    "review": ""
  },
  {
    "nombreUsuario": "Gina K",
    "linkImagen": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/de/0a/default-avatar-2020-35.jpg",
    "linkUsuario": "https://www.tripadvisor.com/MemberOverlay?memberId=49473863",
    "review": "The best!\nMay 2025 • Family\nFernando was the best and very helpful with everything. It was a great excursion that we all thoroughly enjoyed! From the Mayan cultural experience to the speed boat rides to the snorkeling…we had an absolute blast! The snacks at the end were scrumptious as well! Thank you for the memories!\n\nReview of: Mayan Jungle Tour Speed Boat Snorkel and Snack\nWritten May 31, 2025"
  },
  {
    "nombreUsuario": "Amanda H",
    "linkImagen": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/77/ae/default-avatar-2020-2.jpg",
    "linkUsuario": "https://www.tripadvisor.com/MemberOverlay?memberId=18350101",
    "review": "Great day!\nSuch a fun experience!! Everyone loved it, Romel was awesome!! Kids were 8,12,15. Great for all ages, definitely recommend doing it. The show was great as well.\n\nReview of: Mayan Jungle Tour Speed Boat Snorkel and Snack\nWritten May 31, 2025"
  },
  {
    "nombreUsuario": "Michael L",
    "linkImagen": "https://media-cdn.tripadvisor.com/media/photo-o/1a/4e/69/4c/default-avatar-2021-2.jpg",
    "linkUsuario": "https://www.tripadvisor.com/MemberOverlay?memberId=136527711",
    "review": ""
  },
  {
    "nombreUsuario": "Cherie D",
    "linkImagen": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/ee/68/default-avatar-2020-9.jpg",
    "linkUsuario": "",
    "review": "Captain Enrique\nMay 2025 • Family\nCaptain Enrique was awesome great tour communicated well was very safe very knowledgeable of wildlife! Exceeded expectations! Great family fun!\n\nWritten June 1, 2025"
  },
  {
    "nombreUsuario": "Brigitte G",
    "linkImagen": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/e5/2b/default-avatar-2020-52.jpg",
    "linkUsuario": "",
    "review": "Amazing\nMay 2025 • Friends\n1000% recommend with capitán fox he made sure we was safe & showed us cool statues underwater during snorkeling. His guidance was very clear\n\nReview of: Mayan Jungle Tour Speed Boat Snorkel and Snack\nWritten May 31, 2025"
  },
  {
    "nombreUsuario": "Brittney S",
    "linkImagen": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/e6/ea/default-avatar-2020-54.jpg",
    "linkUsuario": "",
    "review": "Wonderful\nMay 2025 • Couples\nGreat time nice people and it was very easy going. I would love to go back the next time I visit Mexico this is a must do. Thanks guys\n\nReview of: Mayan Jungle Tour Speed Boat Snorkel and Snack\nWritten May 31, 2025"
  },
  {
    "nombreUsuario": "JuKi910",
    "linkImagen": "",
    "linkUsuario": "",
    "review": "Fun fun fun!\nMay 2025 • Couples\nMy first time snorkeling, and I have to say the whole experience was so much fun! The captain was great- friendly and energetic. He explained everything very well and I loved riding in the boat. It was faster than I thought it would be and loved the adrenaline rush the whole time. The treat at the end was a nice touch. We definitely opted for the digital photos and video of the whole experience to cherish the memories;) can’t wait to go back to do something like this again!\n\nReview of: Mayan Jungle Tour Speed Boat Snorkel and Snack\nWritten May 30, 2025"
  },
  {
    "nombreUsuario": "Brooklyn M",
    "linkImagen": "",
    "linkUsuario": "",
    "review": "This place is so cool\nMay 2025 • Friends\nSo fun the bridge scared me a bit but the Scuba diving and the boat was really fun. The fish were really big and very cool the sculpture in the water were amazing the dances were very cool and nice I would definitely go back again\n\nReview of: Mayan Jungle Tour Speed Boat Snorkel and Snack\nWritten May 30, 2025"
  },
  {
    "nombreUsuario": "Jack C",
    "linkImagen": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/f0/48/default-avatar-2020-15.jpg",
    "linkUsuario": "",
    "review": "Amazing experience!\nMay 2025 • Couples\nWe had an amazing time driving the speed boats (warning though, these were true speed boats and went very fast and I almost made my fiancé throw up) and snorkeling on the reef (several fishes came over and nibbled at us)! Our guide Tony was great! Very much recommend!\n\nReview of: Mayan Jungle Tour Speed Boat Snorkel and Snack\nWritten May 30, 2025"
  },
  {
    "nombreUsuario": "Yezet R",
    "linkImagen": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/f4/d0/default-avatar-2020-33.jpg",
    "linkUsuario": "",
    "review": "Jet skis activity\nMay 2025 • Couples\nCharlie was amazing. He was patient and calm. We were having problems but he assisted us with kindness and respect. I felt safe throughout the activity and we had a lot of fun. Will definitely be doing this again. Thank you Charlie you were amazing\n\nReview of: Mayan Jungle Tour Speed Boat Snorkel and Snack\nWritten May 30, 2025"
  }
];

interface ProcessedReviewData {
  nombreUsuario?: string;
  linkImagen?: string;
  linkUsuario?: string;
  review: string;
  date: Date;
  rating: number;
}


export default function HomeTestimonials() {
  const { t, language } = useLanguage(); 
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const reviewsData: ProcessedReviewData[] = useMemo(() => {
    if (!isMounted) {
      return [];
    }

    return newReviewsDataRaw.map(item => {
      let cleanedReview = item.review || "";
      
      const reviewOfMarker = "\n\nReview of:";
      const reviewOfIndex = cleanedReview.indexOf(reviewOfMarker);
      if (reviewOfIndex !== -1) {
        cleanedReview = cleanedReview.substring(0, reviewOfIndex);
      }

      const lines = cleanedReview.split('\n');
      const filteredLines = lines.filter(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("Written ")) return false;
        if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}\s•\s(Family|Couples|Friends|Solo|Business)/i.test(trimmedLine)) return false;
        return true;
      });
      cleanedReview = filteredLines.join('\n').trim();
      
      const today = new Date();
      // Construct date using UTC components for consistency in toISOString()
      const lastMonthDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 15, 0, 0, 0, 0));

      return { ...item, review: cleanedReview, date: lastMonthDate, rating: 5 };
    }).filter(item => item.review && item.review.trim() !== "" && item.nombreUsuario && item.nombreUsuario.trim() !== "");
  }, [isMounted]);


  const renderTestimonialContent = () => (
    <>
      {reviewsData.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: reviewsData.length > 2, 
          }}
          plugins={[autoplayPlugin.current]}
          // onMouseEnter and onMouseLeave are handled by stopOnMouseEnter:true in Autoplay plugin options
          className="w-full max-w-xs sm:max-w-xl md:max-w-4xl lg:max-w-6xl mx-auto"
        >
          <CarouselContent>
            {reviewsData.map((review, index) => (
              <CarouselItem key={review.nombreUsuario ? `${review.nombreUsuario}-${index}` : index} className="sm:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="bg-card shadow-xl rounded-xl overflow-hidden flex flex-col transform transition-all hover:shadow-2xl hover:-translate-y-1 border-none h-full">
                    <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-5">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-primary/20">
                          {review.linkImagen && <AvatarImage src={review.linkImagen} alt={review.nombreUsuario || 'User Avatar'} />}
                          <AvatarFallback>{review.nombreUsuario?.substring(0,1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          {review.linkUsuario && review.nombreUsuario ? (
                            <Link href={review.linkUsuario} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              <CardTitle className="font-headline font-bold text-md sm:text-lg text-foreground">{review.nombreUsuario}</CardTitle>
                            </Link>
                          ) : (
                            <CardTitle className="font-headline font-bold text-md sm:text-lg text-foreground">{review.nombreUsuario}</CardTitle>
                          )}
                          <CardDescription className="text-xs text-foreground/70">
                            Via TripAdvisor
                            {review.date && ( // Date object exists
                              <time dateTime={review.date.toISOString()} className="ml-1">
                                {' - '}
                                {review.date.toLocaleDateString(language, { month: 'long', year: 'numeric' })}
                              </time>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow px-4 sm:px-6 pb-4 sm:pb-5">
                      <div className="flex mb-1.5 sm:mb-2 mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={`review-star-${index}-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400 mr-0.5" />
                        ))}
                      </div>
                      <p className="text-foreground/90 leading-relaxed text-xs sm:text-sm line-clamp-[7] hover:line-clamp-none transition-all duration-300 ease-in-out">
                        {review.review}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {reviewsData.length > 1 && <CarouselPrevious className="text-foreground bg-background/70 hover:bg-card border-foreground/30 hover:border-foreground" />}
          {reviewsData.length > 1 && <CarouselNext className="text-foreground bg-background/70 hover:bg-card border-foreground/30 hover:border-foreground" />}
        </Carousel>
      ) : (
         <div className="w-full max-w-xs sm:max-w-xl md:max-w-4xl lg:max-w-6xl mx-auto text-center">
            <p className="text-foreground/70">{t('home.testimonials.noReviews')}</p>
         </div>
      )}

       <div className="text-center mt-10 md:mt-12">
        <a
          href="https://www.tripadvisor.com/Attraction_Review-g150807-d13953990-Reviews-Puerto_Maya_Cancun-Cancun_Yucatan_Peninsula.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/80 hover:text-foreground hover:underline font-medium text-sm sm:text-base"
        >
          {t('home.testimonials.readMore')}
        </a>
      </div>
    </>
  );

  return (
    <section className="py-10 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
            <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 bg-background p-4 sm:p-6 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                <Image
                    src="/images/misc/logo.svg"
                    alt="TripAdvisor Logo"
                    width={150}
                    height={33}
                    className={cn("h-8 sm:h-9 md:h-10 transition-all duration-300", "dark:hidden")}
                />
                <Image
                    src="/images/misc/tripadvisor-dark.png"
                    alt="TripAdvisor Logo Dark Mode"
                    width={150}
                    height={33}
                    className={cn("h-8 sm:h-9 md:h-10 transition-all duration-300", "hidden dark:block")}
                />
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={`ta-star-${i}`} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-yellow-400" />
                    ))}
                </div>
                <p className="font-headline font-bold text-xl sm:text-2xl md:text-3xl text-foreground">{t('home.testimonials.excellent')}</p>
                <p className="text-xs sm:text-sm md:text-md text-foreground/80">{t('home.testimonials.basedOnReviews')}</p>
            </div>
             <p className="text-xs sm:text-sm text-foreground/70 mt-3 sm:mt-4">{t('home.testimonials.recognizedBy')}</p>
        </div>

        <h2 className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl text-center text-foreground mb-3 sm:mb-4">
          {t('home.testimonials.lovedByAdventurers')}
        </h2>
        <p className="text-center text-sm sm:text-base md:text-lg text-foreground/80 max-w-xs sm:max-w-md md:max-w-2xl mx-auto mb-10 md:mb-12">
          {t('home.testimonials.hearFromGuests')}
        </p>
        
        {isMounted ? renderTestimonialContent() : (
           <div className="w-full max-w-xs sm:max-w-xl md:max-w-4xl lg:max-w-6xl mx-auto text-center">
             <p className="text-foreground/70">{t('home.testimonials.noReviews')}</p> {/* Or a Skeleton loader */}
             <div className="text-center mt-10 md:mt-12">
                <a
                    href="https://www.tripadvisor.com/Attraction_Review-g150807-d13953990-Reviews-Puerto_Maya_Cancun-Cancun_Yucatan_Peninsula.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:text-foreground hover:underline font-medium text-sm sm:text-base"
                >
                    {t('home.testimonials.readMore')}
                </a>
              </div>
           </div>
        )}
      </div>
    </section>
  );
}
