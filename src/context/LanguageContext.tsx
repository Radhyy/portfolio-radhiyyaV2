"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ID' | 'EN';

export const translations = {
  ID: {
    // Navbar
    navHome: "Beranda",
    navProjects: "Proyek",
    navAchievements: "Prestasi",
    navAbout: "Tentang",
    viewCv: "Lihat CV",

    // Hero Section
    heroGreeting: "Halo, Saya Radhiyya",
    heroRole: "Web & Cloud Engineer", // KEPT AS "Web & Cloud Engineer"
    heroStatus: "Terbuka untuk pekerjaan freelance & full-time",
    heroSubtext: "Saya merancang produk digital intuitif yang menyelesaikan masalah nyata dan memberikan pengalaman pengguna yang bermakna.",
    heroTrust: "Dipercaya oleh 100+ klien puas dari berbagai industri.",
    heroViewProjects: "Lihat Proyek",

    // Principals & Process Section
    myPrincipals: "Prinsip Kerja Saya",
    scrollRevealText: "Saya merancang aplikasi web yang scalable dan infrastruktur cloud yang tangguh dengan menggabungkan kode yang bersih, arsitektur modern, serta pemecahan masalah yang kuat untuk memberikan solusi digital yang handal dan berdampak.",
    
    pillFrontend: "Pengembangan Frontend",
    pillBackend: "Pengembangan Backend",
    pillCloud: "Arsitektur Cloud",
    pillCicd: "Pipeline CI/CD",
    pillDb: "Desain Basis Data",
    pillApi: "Pengembangan API",

    processDesignTitle: "Desain",
    processDesignDesc: "Merancang antarmuka bersih yang mengutamakan estetika visual, hierarki intuitif, dan pengalaman pengguna yang luar biasa.",
    processBuildTitle: "Pengembangan",
    processBuildDesc: "Menulis kode frontend dan backend yang bersih, efisien, serta scalable menggunakan teknologi modern.",
    processDeployTitle: "Peluncuran",
    processDeployDesc: "Menerapkan aplikasi ke platform cloud modern, mengoptimalkan kinerja, dan memastikan ketersediaan tinggi.",

    // Who Am I / About Me Section
    whoAmI: "Siapa Saya",
    gettingToKnowMe: "Mengenal Saya Lebih Dekat",
    aboutBioMain: "Saya adalah seorang Web & Cloud Engineer yang memiliki passion tinggi untuk belajar, mengeksplorasi ide-ide baru, dan membangun pengalaman digital yang menyelesaikan masalah nyata.",
    aboutBioSub: "Dengan fondasi yang kuat dalam teknologi web modern dan infrastruktur cloud, saya berusaha menciptakan aplikasi yang scalable, efisien, dan berdesain indah. Tujuan saya adalah menjembatani desain dan rekayasa perangkat lunak, memastikan setiap proyek yang saya sentuh berfokus pada pengalaman pengguna yang luar biasa.",

    // Experience Section
    contributionsLabel: "KONTRIBUSI :",
    keyFocusLabel: "FOKUS UTAMA :",
    elevraContrib1: "Membangun solusi aplikasi web lengkap mencakup arsitektur frontend dan backend.",
    elevraContrib2: "Berkolaborasi erat dengan klien untuk menerjemahkan kebutuhan bisnis menjadi kode berkualitas tinggi dan scalable.",
    elevraContrib3: "Memastikan stabilitas melalui pengujian ketat, perbaikan bug, optimasi performa, dan desain responsif.",
    
    dataIntiContrib1: "Mengembangkan situs web Helpdesk Fasilitas dari awal sebagai bagian dari proyek magang sekolah.",
    dataIntiContrib2: "Membangun infrastruktur backend menggunakan Node.js dan Next.js yang terintegrasi dengan basis data PostgreSQL.",
    dataIntiContrib3: "Memanfaatkan framework Restforge untuk mempercepat pengembangan API dan mengelola data secara efisien.",

    smkTelkomFocus1: "Konsep dasar cloud computing dan teknik pengembangan web modern.",
    smkTelkomFocus2: "Desain infrastruktur jaringan, pemeliharaan, dan protokol keamanan.",
    smkTelkomFocus3: "Integrasi aplikasi, manajemen basis data, dan praktik terbaik rekayasa perangkat lunak standar industri.",

    // Elevra Promotion Section
    elevraPromoHeading: "Wujudkan Ide Anda Bersama Elevra Digitalera",
    elevraPromoDesc: "Butuh website profesional, modern, dan berkinerja tinggi? Elevra Digitalera menyediakan layanan pengembangan web premium yang disesuaikan dengan kebutuhan bisnis Anda. Tingkatkan kehadiran digital brand Anda hari ini.",
    elevraPromoBtn: "Kunjungi Elevra Digitalera",

    // Selected Works / Projects
    selectedWorks: "Karya Terpilih",
    recentProjects: "Proyek Terbaru Saya",
    filterWeb: "Aplikasi Web",
    filterCloud: "Arsitektur Cloud",
    showAll: "Lihat Semua",

    // Scroll Morph Hero
    morphScrollTip: "SCROLL UNTUK EKSPLOR",
    morphBadge: "GALERI KARYA",
    morphArcHeading: "Jelajahi Galeri Karya & Proyek",
    morphArcSubheading: "Koleksi aplikasi web, arsitektur cloud, dan pengalaman digital interaktif yang dirancang oleh Radhiyya Alea.",

    // Section Titles
    achievements: "Prestasi",
    myCertificates: "Sertifikat Saya",
    featuredProjectsTitle: "Proyek Unggulan",
    featuredProjectsSubtitle: "Pilihan aplikasi web terbaik yang dirancang dan dibangun dengan teknologi modern.",
    cloudProjectsTitle: "Proyek Arsitektur Cloud",
    cloudProjectsSubtitle: "Solusi infrastruktur cloud terdistribusi, VPS, dan otomasi DevOps.",
    viewAllProjects: "Lihat Semua Proyek",

    certificatesTitle: "Sertifikat & Prestasi",
    certificatesSubtitle: "Bukti kompetensi resmi dalam pengembangan perangkat lunak, cloud, dan teknologi.",
    showAllCertificates: "Tampilkan Semua Sertifikat",
    showLessCertificates: "Tampilkan Lebih Sedikit",

    experienceTitle: "Pengalaman Kerja",
    educationTitle: "Pendidikan",

    testimonialsTitle: "Apa Kata Kolaborator & Klien",
    testimonialsSubtitle: "Testimoni jujur dari rekan tim, klien, dan mentor yang telah bekerja sama.",

    ctaTitle: "Tertarik Bekerja Sama atau Mengembangkan Proyek?",
    ctaSubtitle: "Saya selalu terbuka untuk berdiskusi tentang proyek web, infrastruktur cloud, atau peluang kolaborasi baru.",
    ctaButton: "Hubungi via Email",

    // Footer
    footerRights: "Hak Cipta Dilindungi.",
    footerLocation: "Sidoarjo, Jawa Timur, Indonesia",

    // Projects Page
    allProjectsTitle: "Semua Karya & Proyek",
    allProjectsSubtitle: "Eksplorasi seluruh portofolio web dan arsitektur cloud yang telah saya kerjakan.",
    searchPlaceholder: "Cari proyek berdasarkan nama, teknologi, atau deskripsi...",
    filterAll: "Semua",
    noProjectsFound: "Tidak ada proyek yang sesuai dengan pencarian Anda.",

    // Detail Page
    backToProjects: "Kembali ke Proyek",
    projectDetails: "Rincian Proyek",
    techStackUsed: "Teknologi yang Digunakan",
    collaboratorsLabel: "Kolaborator & Kontributor",
    visitLiveProject: "Kunjungi Aplikasi Live",
    viewRepository: "Lihat Source Code",
    commentsSection: "Diskusi & Komentar",
    leaveComment: "Tinggalkan Komentar",
    commentsPlaceholder: "Tuliskan tanggapan, pertanyaan, atau masukan Anda...",
    submitComment: "Kirim Komentar",

    // CV Modal
    cvModalTitle: "Curriculum Vitae - Radhiyya Alea",
    downloadPdf: "Unduh PDF",
    close: "Tutup",
  },
  EN: {
    // Navbar
    navHome: "Home",
    navProjects: "Projects",
    navAchievements: "Achievements",
    navAbout: "About",
    viewCv: "View CV",

    // Hero Section
    heroGreeting: "Hi I'm Radhiyya",
    heroRole: "Web & Cloud Engineer",
    heroStatus: "Open for freelance & full-time work",
    heroSubtext: "I design intuitive digital products that solve real problems and deliver meaningful user experiences.",
    heroTrust: "Trusted by 100+ happy clients across industries.",
    heroViewProjects: "View Projects",

    // Principals & Process Section
    myPrincipals: "My Principals",
    scrollRevealText: "I engineer scalable web applications and robust cloud infrastructures by combining clean code, modern architecture, and strong problem-solving to deliver reliable and impactful digital solutions.",

    pillFrontend: "Frontend Dev",
    pillBackend: "Backend Dev",
    pillCloud: "Cloud Architecture",
    pillCicd: "CI/CD Pipelines",
    pillDb: "Database Design",
    pillApi: "API Development",

    processDesignTitle: "Design",
    processDesignDesc: "Crafting clean interfaces prioritizing visual aesthetics, intuitive hierarchy, and exceptional user experiences.",
    processBuildTitle: "Build",
    processBuildDesc: "Writing clean, performant, scalable frontend and backend code utilizing state-of-the-art modern stacks.",
    processDeployTitle: "Deploy",
    processDeployDesc: "Deploying to modern cloud platforms, monitoring performance, optimizing resources, and ensuring high availability.",

    // Who Am I / About Me Section
    whoAmI: "Who am i",
    gettingToKnowMe: "Getting to Know me",
    aboutBioMain: "I'm a Web & Cloud Engineer passionate about learning, exploring ideas, and building digital experiences that solve real problems.",
    aboutBioSub: "With a strong foundation in modern web technologies and cloud infrastructure, I strive to create scalable, efficient, and beautifully designed applications. My goal is to bridge the gap between design and engineering, ensuring that every project I touch is not only functional but also delivers an exceptional user experience.",

    // Experience Section
    contributionsLabel: "CONTRIBUTIONS :",
    keyFocusLabel: "KEY FOCUS :",
    elevraContrib1: "Developing complete web application solutions spanning both frontend and backend architectures.",
    elevraContrib2: "Collaborating closely with clients to translate business requirements into high-quality, scalable code.",
    elevraContrib3: "Ensuring stability through rigorous testing, bug fixes, performance optimizations, and responsive design implementations.",

    dataIntiContrib1: "Developed a robust Facility Helpdesk website from scratch as part of a school internship project.",
    dataIntiContrib2: "Built the backend infrastructure using Node.js and Next.js, integrating with a PostgreSQL database.",
    dataIntiContrib3: "Leveraged the Restforge framework to accelerate API development and streamline data management.",

    smkTelkomFocus1: "Cloud computing fundamentals and modern web development techniques.",
    smkTelkomFocus2: "Network infrastructure design, maintenance, and security protocols.",
    smkTelkomFocus3: "Application integration, database management, and industry-standard best practices for software engineering.",

    // Elevra Promotion Section
    elevraPromoHeading: "Bring Your Ideas to Life with Elevra Digitalera",
    elevraPromoDesc: "Need a professional, modern, and high-performing website? Elevra Digitalera offers premium web development services tailored to your business needs. Elevate your brand's digital presence today.",
    elevraPromoBtn: "Visit Elevra Digitalera",

    // Selected Works / Projects
    selectedWorks: "Selected Works",
    recentProjects: "My Recent Projects",
    filterWeb: "Website",
    filterCloud: "Cloud",
    showAll: "Show All",

    // Scroll Morph Hero
    morphScrollTip: "SCROLL TO EXPLORE",
    morphBadge: "SHOWCASE GALLERY",
    morphArcHeading: "Explore Works & Project Gallery",
    morphArcSubheading: "A collection of web applications, cloud architecture, and interactive digital experiences crafted by Radhiyya Alea.",

    // Section Titles
    achievements: "Achievements",
    myCertificates: "My Certificates",
    featuredProjectsTitle: "Featured Projects",
    featuredProjectsSubtitle: "A curated selection of top web applications designed and built with modern tech stacks.",
    cloudProjectsTitle: "Cloud Architecture Projects",
    cloudProjectsSubtitle: "Distributed cloud infrastructure solutions, VPS deployments, and DevOps automation.",
    viewAllProjects: "View All Projects",

    certificatesTitle: "Certificates & Achievements",
    certificatesSubtitle: "Official proof of competence in software engineering, cloud computing, and IT.",
    showAllCertificates: "Show All Certificates",
    showLessCertificates: "Show Less",

    experienceTitle: "Work Experience",
    educationTitle: "Education",

    testimonialsTitle: "What Collaborators & Clients Say",
    testimonialsSubtitle: "Genuine feedback from teammates, clients, and mentors I have collaborated with.",

    ctaTitle: "Interested in Collaborating or Building a Project?",
    ctaSubtitle: "I am always open to discussing web projects, cloud infrastructure, or new collaboration opportunities.",
    ctaButton: "Get in Touch via Email",

    // Footer
    footerRights: "All Rights Reserved.",
    footerLocation: "Sidoarjo, East Java, Indonesia",

    // Projects Page
    allProjectsTitle: "All Projects & Works",
    allProjectsSubtitle: "Explore the full collection of web portfolios and cloud architecture projects.",
    searchPlaceholder: "Search projects by title, technology, or description...",
    filterAll: "All",
    noProjectsFound: "No projects match your search query.",

    // Detail Page
    backToProjects: "Back to Projects",
    projectDetails: "Project Details",
    techStackUsed: "Tech Stack Used",
    collaboratorsLabel: "Collaborators & Contributors",
    visitLiveProject: "Visit Live App",
    viewRepository: "View Source Code",
    commentsSection: "Discussion & Comments",
    leaveComment: "Leave a Comment",
    commentsPlaceholder: "Write your feedback, questions, or comments...",
    submitComment: "Submit Comment",

    // CV Modal
    cvModalTitle: "Curriculum Vitae - Radhiyya Alea",
    downloadPdf: "Download PDF",
    close: "Close",
  }
};

type TranslationKey = keyof typeof translations.ID;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('portfolio_lang') as Language;
      if (savedLang === 'ID' || savedLang === 'EN') {
        setLanguageState(savedLang);
      }
    } catch (e) {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('portfolio_lang', lang);
    } catch (e) {}
  };

  const toggleLanguage = () => {
    const nextLang = language === 'EN' ? 'ID' : 'EN';
    setLanguage(nextLang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'EN' as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: TranslationKey) => translations['EN'][key] || key,
    };
  }
  return context;
}
