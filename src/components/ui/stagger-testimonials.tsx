"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const SQRT_5000 = Math.sqrt(5000);

const testimonialsID = [
  {
    tempId: 0,
    testimonial: "Kolaborasi bareng Radhiyya di proyek Jatim Innovator JYCC seru banget. Hasil kodingannya rapi, pengerjaan frontend-nya cepat, dan aplikasinya sangat responsif!",
    by: "Sandya Hafidudin, Kolaborator Web Jatim Innovator JYCC",
    imgSrc: "blank"
  },
  {
    tempId: 1,
    testimonial: "Website Posyandu Sedap Malam hasilnya sangat memuaskan. Sekarang sistem pencatatan data lansia dan balita jadi lebih praktis dan tertata rapi.",
    by: "Leo Karang Dalo, Klien Web Posyandu Sedap Malam",
    imgSrc: "blank"
  },
  {
    tempId: 2,
    testimonial: "Website Teffyla Motor tampilannya modern dan ringan banget saat diakses. Sangat membantu pelanggan kami cari informasi produk dengan mudah!",
    by: "Fredimus Kasang, Klien Web Teffyla Motor",
    imgSrc: "blank"
  },
  {
    tempId: 3,
    testimonial: "Pengerjaan website Apotik Lehan Farma sangat profesional. Fitur pencarian obat dan katalog produknya mudah dipakai oleh siapapun.",
    by: "Lehan Farma, Klien Web Apotik Lehan Farma",
    imgSrc: "blank"
  },
  {
    tempId: 4,
    testimonial: "Website NDJ Jok Mobil beneran bantu ningkatin kepercayaan pelanggan. Tampilan galeri jok mobilnya kelihatan sangat menarik dan profesional!",
    by: "Admin NJD Jok Mobil, Klien Web NDJ Jok Mobil",
    imgSrc: "blank"
  },
  {
    tempId: 5,
    testimonial: "Website portfolio buatan Radhiyya pengerjaannya cepat dan hasilnya sesuai ekspektasi. Tampilan visualnya bagus dan estetik!",
    by: "Iman Jihad, Klien Web Portfolio",
    imgSrc: "blank"
  },
  {
    tempId: 6,
    testimonial: "Puas banget sama hasil website portfolio saya. Transisi dan animasi UI-nya halus banget, kelihatan keren dan interaktif!",
    by: "Ammar Wicaksono, Klien Portfolio Ammar",
    imgSrc: "blank"
  },
  {
    tempId: 7,
    testimonial: "Website Harmonia Pharma dibuat dengan rapi, aman, dan aksesnya kencang. Komunikasi dan kerja samanya sangat menyenangkan!",
    by: "Cecilia Permata, Klien Web Harmonia Pharma",
    imgSrc: "blank"
  },
  {
    tempId: 8,
    testimonial: "Website Percetakan Yasin membantu sekali untuk terima pesanan online. Tampilannya simpel, responsif, dan mudah digunakan oleh pelanggan.",
    by: "Andi Mutawakal, Klien Web Percetakan Yasin",
    imgSrc: "blank"
  }
];

const testimonialsEN = [
  {
    tempId: 0,
    testimonial: "Collaborating with Radhiyya on the Jatim Innovator JYCC project was amazing. Clean code, fast frontend execution, and extremely responsive application!",
    by: "Sandya Hafidudin, Web Collaborator Jatim Innovator JYCC",
    imgSrc: "blank"
  },
  {
    tempId: 1,
    testimonial: "The Posyandu Sedap Malam website exceeded expectations. Now recording data for elderly and toddlers is much more practical and organized.",
    by: "Leo Karang Dalo, Client Posyandu Sedap Malam Web",
    imgSrc: "blank"
  },
  {
    tempId: 2,
    testimonial: "Teffyla Motor's website is sleek, modern, and loads incredibly fast. It tremendously helps our customers find product details easily!",
    by: "Fredimus Kasang, Client Teffyla Motor Web",
    imgSrc: "blank"
  },
  {
    tempId: 3,
    testimonial: "The development of Apotik Lehan Farma website was handled very professionally. Medicine search and product catalog are intuitive for everyone.",
    by: "Lehan Farma, Client Apotik Lehan Farma Web",
    imgSrc: "blank"
  },
  {
    tempId: 4,
    testimonial: "NDJ Jok Mobil website really boosted our customers' trust. The car seat gallery showcase looks visually striking and professional!",
    by: "Admin NJD Jok Mobil, Client NDJ Jok Mobil Web",
    imgSrc: "blank"
  },
  {
    tempId: 5,
    testimonial: "The portfolio website built by Radhiyya was delivered quickly and met all expectations. Outstanding aesthetics and visual presentation!",
    by: "Iman Jihad, Client Portfolio Web",
    imgSrc: "blank"
  },
  {
    tempId: 6,
    testimonial: "Extremely pleased with my portfolio website. The UI transitions and animations are buttery smooth, looking super cool and interactive!",
    by: "Ammar Wicaksono, Client Ammar Portfolio",
    imgSrc: "blank"
  },
  {
    tempId: 7,
    testimonial: "Harmonia Pharma website is crafted neatly, securely, and with fast load times. Communication and collaboration were delightful!",
    by: "Cecilia Permata, Client Harmonia Pharma Web",
    imgSrc: "blank"
  },
  {
    tempId: 8,
    testimonial: "Percetakan Yasin website helped us immensely in receiving online orders. Clean, responsive design that is easy for customers to navigate.",
    by: "Andi Mutawakal, Client Percetakan Yasin Web",
    imgSrc: "blank"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonialsID[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out font-outfit rounded-2xl shadow-xl",
        isCenter 
          ? "z-10 bg-slate-900 text-white border-slate-900 scale-105" 
          : "z-0 bg-white text-slate-800 border-slate-200 hover:border-slate-400 opacity-90 hover:opacity-100"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(40px 0%, calc(100% - 40px) 0%, 100% 40px, 100% 100%, calc(100% - 40px) 100%, 40px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -30 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 12px 30px rgba(15, 23, 42, 0.25)" : "0px 6px 15px rgba(0, 0, 0, 0.05)"
      }}
    >
      <span
        className={cn(
          "absolute block origin-top-right rotate-45",
          isCenter ? "bg-slate-700" : "bg-slate-200"
        )}
        style={{
          right: -2,
          top: 38,
          width: SQRT_5000,
          height: 2
        }}
      />
      <div className="flex items-center gap-3 mb-4">
        {/* WhatsApp-style blank profile avatar icon */}
        <div className={cn(
          "h-12 w-12 rounded-full border-2 flex items-center justify-center shadow-md shrink-0 transition-colors",
          isCenter 
            ? "bg-slate-800 border-slate-700 text-slate-300" 
            : "bg-slate-100 border-white text-slate-400"
        )}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        <div className="min-w-0">
          <p className={cn(
            "text-sm font-bold truncate",
            isCenter ? "text-white" : "text-slate-900"
          )}>
            {testimonial.by.split(',')[0]}
          </p>
          <p className={cn(
            "text-xs truncate",
            isCenter ? "text-slate-300" : "text-slate-500"
          )}>
            {testimonial.by.split(',')[1] || ''}
          </p>
        </div>
      </div>

      <h3 className={cn(
        "text-base sm:text-lg font-medium leading-relaxed line-clamp-4",
        isCenter ? "text-slate-100" : "text-slate-700"
      )}>
        "{testimonial.testimonial}"
      </h3>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const { t, language } = useLanguage();
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(language === 'EN' ? testimonialsEN : testimonialsID);

  useEffect(() => {
    setTestimonialsList(language === 'EN' ? testimonialsEN : testimonialsID);
  }, [language]);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = 0; i < steps; i++) {
        const item = newList.shift();
        if (item) newList.push(item);
      }
    } else {
      for (let i = 0; i < Math.abs(steps); i++) {
        const item = newList.pop();
        if (item) newList.unshift(item);
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) setCardSize(280);
      else if (width < 1024) setCardSize(320);
      else setCardSize(365);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <section className="relative w-full py-20 bg-[#f4f7f6] overflow-hidden font-outfit">
      
      {/* Header Section */}
      <div className="text-center max-w-xl mx-auto px-6 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs mb-4">
          <MessageSquareQuote size={14} className="text-blue-600" />
          <span>TESTIMONIALS</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          {t('testimonialsTitle')}
        </h2>
      </div>

      {/* Testimonials Carousel */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 480 }}
      >
        {testimonialsList.map((testimonial, index) => {
          const position = testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;
          return (
            <TestimonialCard
              key={testimonial.tempId}
              testimonial={testimonial}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-3 z-20">
          <button
            onClick={() => handleMove(-1)}
            className={cn(
              "flex h-12 w-12 items-center justify-center text-xl transition-all rounded-full shadow-md",
              "bg-white text-slate-900 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900"
            )}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handleMove(1)}
            className={cn(
              "flex h-12 w-12 items-center justify-center text-xl transition-all rounded-full shadow-md",
              "bg-white text-slate-900 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900"
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};
