"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, Zap, Sparkles, Plus, X, Mail, Briefcase, GraduationCap, Calendar, MapPin, ChevronDown } from 'lucide-react';
import ScrollRevealText from "../components/ScrollRevealText";
import SkeletonGrid from "@/components/SkeletonGrid";
import ProjectCard from "@/components/ProjectCard";
import CommentSidebar from "@/components/CommentSidebar";
import Footer from "@/components/Footer";
import LocalTime from "@/components/LocalTime";
import CTASection from "@/components/CTASection";
import PixelReveal from "@/components/PixelReveal";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

interface Project {
  id: number;
  title: string;
  image: string;
  detailImage?: string;
  tags: string[];
  description: string;
  collaborators?: any[];
  commentCount?: number;
  reactions?: Record<string, number>;
}

interface Certificate {
  id: number;
  title: string;
  file: string;
  type: "image" | "pdf";
}

// Projects and Certificates are now fetched from the database

export default function Home() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCommentProject, setActiveCommentProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"website" | "cloud">("website");
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [cloudProjects, setCloudProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch projects
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data.projects || []);
        setCloudProjects(data.cloudProjects || []);
        
        // Fetch certificates
        const certRes = await fetch('/api/certificates');
        const certData = await certRes.json();
        if (certData.certificates) {
          const mappedCerts = certData.certificates.map((c: any) => ({
            id: c.original_id,
            title: c.title,
            file: c.file_url,
            type: c.type as 'image' | 'pdf'
          }));
          setCertificates(mappedCerts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-12");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab, showAllCertificates, isLoading, projects.length]);

  const displayedProjects = projects.slice(0, 6);
  const displayedCloudProjects = cloudProjects.slice(0, 6);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, 6);

  const techStack = [
    { name: "HTML", icon: "https://cdn.simpleicons.org/html5/E34F26" },
    { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
    { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
    { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
    { name: "PHP", icon: "https://cdn.simpleicons.org/php/777BB4" },
    { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/FF2D20" },
    { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
    { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
    { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
    { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
    { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
    { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/3ECF8E" },
    { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
    { name: "Ubuntu", icon: "https://cdn.simpleicons.org/ubuntu/E95420" },
    { name: "Debian", icon: "https://cdn.simpleicons.org/debian/A81D33" },
    { name: "Docker", icon: "https://cdn.simpleicons.org/docker/2496ED" },
    { name: "Apache", icon: "https://cdn.simpleicons.org/apache/D22128" },
    { name: "Nginx", icon: "https://cdn.simpleicons.org/nginx/009639" },
    { name: "GitHub", icon: "https://cdn.simpleicons.org/github/181717" },
    { name: "Claude", icon: "https://cdn.simpleicons.org/claude/D97757" }
  ];

  return (
    <PixelReveal>
    <main className="relative min-h-screen w-full bg-[#f4f7f6] flex flex-col items-center pt-8 font-sans overflow-x-hidden">
      {/* Main Hero Content */}
      <div id="home" className="relative flex-1 w-full max-w-[1300px] px-6 lg:px-16 mx-auto flex flex-col items-center mt-24 md:mt-24 z-10">
        
        {/* Large Text */}
        <div className="animate-fade-in-up opacity-0 [animation-delay:200ms] text-center z-20 flex flex-col items-center gap-2 mb-2 md:mb-0 relative md:-bottom-12">
          <h2 className="text-5xl md:text-[5rem] font-outfit font-medium tracking-tight text-slate-900 leading-none">
            Hi I&apos;m Radhiyya
          </h2>
          <h3 className="text-5xl md:text-[5.5rem] font-playfair italic font-medium text-slate-900 leading-none">
            Web & Cloud Engineer
          </h3>
        </div>

        {/* Center Container for Image and Background Blur */}
        <div className="animate-fade-in-up opacity-0 [animation-delay:400ms] relative flex justify-center w-full max-w-[900px] mt-0 md:mt-0 flex-1 min-h-[320px] md:min-h-[500px]">
          
          {/* U-Shape Background Blur (Hollow circle border placed upwards) */}
          <div className="absolute top-[-700px] md:top-[-1050px] left-1/2 -translate-x-1/2 w-[900px] md:w-[1300px] h-[900px] md:h-[1300px] rounded-full border-[80px] md:border-[120px] border-[#00B4FF] blur-[60px] md:blur-[100px] opacity-75 pointer-events-none -z-10" />

          {/* User Photo */}
          <div className="relative z-10 h-full flex items-end">
            <Image
              src="/fotoku.png"
              alt="Radhiyya"
              width={600}
              height={700}
              className="object-contain max-h-[55vh] md:max-h-[65vh] object-bottom grayscale transition-all duration-500 hover:grayscale-0"
              priority
            />
            {/* Fade at bottom to blend into background */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f4f7f6] to-transparent z-20 pointer-events-none" />
          </div>

          {/* Absolute Floating Elements - Desktop */}
          
          {/* 1. Open for work badge (Left Middle) */}
          <div className="hidden md:flex absolute left-[-60px] top-[30%] bg-white/90 backdrop-blur-md border border-white/50 rounded-full px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] items-center gap-3 animate-fade-in-up opacity-0 [animation-delay:600ms] z-30">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c8ff72]"></span>
            </div>
            <span className="text-sm font-medium text-slate-800">
              Open for freelance & full-time work
            </span>
          </div>

          {/* 2. Text paragraph (Right Middle) */}
          <div className="hidden md:block absolute right-[-40px] top-[35%] max-w-[220px] animate-fade-in-up opacity-0 [animation-delay:700ms] z-30">
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              I design intuitive digital products that solve real problems and deliver meaningful user experiences.
            </p>
          </div>
          
          {/* 3. Clients (Bottom Left) */}
          <div className="hidden md:flex absolute left-[-40px] bottom-[15%] flex-row items-center gap-4 animate-fade-in-up opacity-0 [animation-delay:800ms] z-30">
            <div className="flex -space-x-3">
              <img src="https://ui-avatars.com/api/?name=A&background=random" alt="Client" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <img src="https://ui-avatars.com/api/?name=B&background=random" alt="Client" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <img src="https://ui-avatars.com/api/?name=C&background=random" alt="Client" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            </div>
            <p className="text-xs font-medium text-slate-600 leading-snug max-w-[120px]">
              Trusted by <span className="font-bold text-black">100+ happy clients</span> across industries.
            </p>
          </div>

          {/* 4. Get in Touch button (Bottom Right) */}
          <div className="hidden md:block absolute right-[20px] bottom-[20%] z-30 animate-fade-in-up opacity-0 [animation-delay:900ms]">
            <a href="#projects" className="group flex items-center gap-3 bg-[#0f0f0f] text-white px-6 py-4 rounded-[2rem] text-sm font-medium hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-2xl">
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-white/70 group-hover:text-white" />
              View Project
            </a>
          </div>
          
        </div>
      </div>
      
      {/* Mobile Floating Elements */}
      <div className="w-full md:hidden flex flex-col items-center gap-6 pb-12 z-20 mt-4 animate-fade-in-up opacity-0 [animation-delay:1000ms]">
         <div className="bg-white/90 backdrop-blur-md border border-white/50 rounded-full px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c8ff72]"></span>
            </div>
            <span className="text-sm font-medium text-slate-800">
              Open for freelance & full-time work
            </span>
          </div>

          <p className="text-sm font-medium text-slate-800 leading-relaxed text-center max-w-[280px]">
            I design intuitive digital products that solve real problems and deliver meaningful user experiences.
          </p>

          <div className="flex flex-col items-center gap-3 mt-2">
            <div className="flex -space-x-3">
              <img src="https://ui-avatars.com/api/?name=A&background=random" alt="Client" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <img src="https://ui-avatars.com/api/?name=B&background=random" alt="Client" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <img src="https://ui-avatars.com/api/?name=C&background=random" alt="Client" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            </div>
            <p className="text-xs font-medium text-slate-600 leading-tight text-center max-w-[200px]">
              Trusted by <span className="font-bold text-black">100+ happy clients</span> across industries.
            </p>
          </div>

          <a href="#projects" className="mt-4 flex items-center justify-center gap-2 bg-[#0f0f0f] text-white px-6 py-4 rounded-[2rem] text-sm font-medium hover:bg-slate-800 transition-all active:scale-95 shadow-2xl w-full max-w-[280px]">
            <ArrowRight size={18} className="text-white/70" />
            View Project
          </a>
      </div>

      {/* Principals Section */}
      <section id="about" className="relative w-full max-w-[1300px] mx-auto pt-16 md:pt-24 pb-12 md:pb-16 px-6 flex flex-col items-center justify-center z-20">
        <h3 className="text-4xl md:text-5xl font-playfair italic font-medium text-slate-800 mb-8 md:mb-12">
          My Principals
        </h3>
        
        {/* Floating Badges Container */}
        <div className="relative w-full flex justify-center items-center">
          
          {/* Left Badges */}
          <div className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col gap-10">
            <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[100ms]">
              <div className="bg-white/80 backdrop-blur-md rounded-full px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3 transform -rotate-3 transition-transform hover:rotate-0 hover:scale-105 duration-300">
                 <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white"><Zap size={14} fill="currentColor"/></div>
                 <span className="font-semibold text-sm text-slate-800">Frontend Dev</span>
              </div>
            </div>
            <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[300ms]">
              <div className="bg-white/80 backdrop-blur-md rounded-full px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3 transform rotate-2 -ml-8 transition-transform hover:rotate-0 hover:scale-105 duration-300">
                 <div className="bg-blue-400 rounded-full w-8 h-8 flex items-center justify-center text-white"><Zap size={14} fill="currentColor"/></div>
                 <span className="font-semibold text-sm text-slate-800">Backend Dev</span>
              </div>
            </div>
            <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[500ms]">
              <div className="bg-white/80 backdrop-blur-md rounded-full px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3 transform -rotate-2 transition-transform hover:rotate-0 hover:scale-105 duration-300">
                 <div className="bg-black rounded-full w-8 h-8 flex items-center justify-center text-white"><Zap size={14} fill="currentColor"/></div>
                 <span className="font-semibold text-sm text-slate-800">Cloud Architecture</span>
              </div>
            </div>
          </div>

          {/* Right Badges */}
          <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-10 items-end">
            <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[200ms]">
              <div className="bg-white/80 backdrop-blur-md rounded-full px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3 transform rotate-3 transition-transform hover:rotate-0 hover:scale-105 duration-300">
                 <div className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-white"><Sparkles size={14} fill="currentColor"/></div>
                 <span className="font-semibold text-sm text-slate-800">CI/CD Pipelines</span>
              </div>
            </div>
            <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[400ms]">
              <div className="bg-white/80 backdrop-blur-md rounded-full px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3 transform -rotate-2 -mr-8 transition-transform hover:rotate-0 hover:scale-105 duration-300">
                 <div className="bg-pink-500 rounded-full w-8 h-8 flex items-center justify-center text-white"><Sparkles size={14} fill="currentColor"/></div>
                 <span className="font-semibold text-sm text-slate-800">Database Design</span>
              </div>
            </div>
            <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[600ms]">
              <div className="bg-white/80 backdrop-blur-md rounded-full px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3 transform rotate-2 transition-transform hover:rotate-0 hover:scale-105 duration-300">
                 <div className="bg-green-400 rounded-full w-8 h-8 flex items-center justify-center text-white"><Plus size={16} strokeWidth={3}/></div>
                 <span className="font-semibold text-sm text-slate-800">API Development</span>
              </div>
            </div>
          </div>

          {/* Center Scroll Reveal Text */}
          <ScrollRevealText />

          {/* Mobile Badges */}
          <div className="lg:hidden absolute bottom-[-20px] left-0 right-0 flex justify-between px-2 md:px-12 w-full">
            <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[200ms]">
              <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-2 transform -rotate-6 transition-transform hover:rotate-0">
                 <div className="bg-orange-500 rounded-full w-7 h-7 flex items-center justify-center text-white"><Zap size={14} fill="currentColor"/></div>
                 <span className="font-semibold text-xs text-slate-800">Frontend Dev</span>
              </div>
            </div>
            <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[400ms] relative top-8">
              <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-2 transform rotate-6 transition-transform hover:rotate-0">
                 <div className="bg-yellow-400 rounded-full w-7 h-7 flex items-center justify-center text-white"><Sparkles size={14} fill="currentColor"/></div>
                 <span className="font-semibold text-xs text-slate-800">CI/CD Pipelines</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative w-full max-w-[1300px] px-6 lg:px-16 mx-auto pt-16 pb-24 flex flex-col items-center justify-center z-20">
        <h3 className="text-3xl md:text-4xl font-playfair italic font-medium text-slate-800 mb-4 reveal-animate opacity-0 translate-y-12 transition-all duration-1000">
          Tech Stack & Tools
        </h3>
        <p className="text-slate-500 mb-12 text-center max-w-xl font-medium reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[200ms]">
          A constantly expanding toolkit that I use to build robust, scalable, and beautiful digital products.
        </p>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] bg-blue-300/20 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[400ms]">
          {techStack.map((tech, index) => (
            <div 
              key={index}
              className="group relative flex items-center justify-center bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-full w-14 h-14 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] transition-all duration-300 cursor-default"
            >
              <img src={tech.icon} alt={tech.name} className="w-6 h-6 object-contain flex-shrink-0" />
              
              {/* Tooltip */}
              <div className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-[13px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {tech.name}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Process Section */}
      <section className="relative w-full max-w-[1300px] px-6 lg:px-16 mx-auto pt-8 md:pt-12 pb-48 flex flex-col items-center justify-center z-20">
        
        {/* Background Blue Glows (between cards) */}
        <div className="absolute top-[60%] left-[33%] -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute top-[60%] left-[66%] -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-sky-300/20 rounded-full blur-[100px] pointer-events-none z-0" />

        <h3 className="text-2xl md:text-3xl font-playfair italic font-medium text-slate-800 mb-2 relative z-10">
          My Process
        </h3>
        <h2 className="text-4xl md:text-[3.5rem] font-outfit font-medium tracking-tight text-slate-900 mb-16 md:mb-24 relative z-10">
          Here&apos;s how I work
        </h2>
        
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 w-full z-10">
          
          {/* Card 1: Architect */}
          <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[200ms] relative bg-[#f6f7f9] border border-white rounded-[2rem] p-10 w-full max-w-[380px] h-[360px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transform md:-rotate-[4deg] hover:!rotate-0 hover:!scale-105 z-30 flex flex-col">
            
            {/* SVG Connector to Card 2 (Desktop) */}
            <svg className="hidden md:block absolute right-[-60px] top-[25%] w-[120px] h-[60px] overflow-visible z-[50]" viewBox="0 0 120 60">
              <path d="M0,40 C 50,40 70,10 120,10" stroke="#3b82f6" strokeWidth="3" fill="none" />
              <circle cx="0" cy="40" r="6" fill="#3b82f6" />
              <circle cx="120" cy="10" r="6" fill="#3b82f6" />
            </svg>

            {/* SVG Connector to Card 2 (Mobile) */}
            <svg className="md:hidden absolute bottom-[-40px] left-[30%] w-[40px] h-[60px] overflow-visible z-[50]" viewBox="0 0 40 60">
              <path d="M10,0 C 10,30 30,30 30,60" stroke="#3b82f6" strokeWidth="3" fill="none" />
              <circle cx="10" cy="0" r="6" fill="#3b82f6" />
              <circle cx="30" cy="60" r="6" fill="#3b82f6" />
            </svg>

            <span className="text-[3.5rem] font-outfit font-medium text-slate-800 mb-auto leading-none">01</span>
            <div>
              <h4 className="text-3xl font-outfit font-medium text-slate-900 mb-4">Architect</h4>
              <p className="text-[15px] text-slate-600 leading-relaxed">
                Designing scalable web architectures, database schemas, and robust cloud infrastructures tailored to business needs.
              </p>
            </div>
          </div>

          {/* Card 2: Develop */}
          <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[400ms] relative bg-[#f6f7f9] border border-white rounded-[2rem] p-10 w-full max-w-[380px] h-[360px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transform md:rotate-[3deg] md:translate-y-6 hover:!rotate-0 hover:!scale-105 z-20 flex flex-col">
            
            {/* SVG Connector to Card 3 (Desktop) */}
            <svg className="hidden md:block absolute right-[-90px] bottom-[-10px] w-[130px] h-[80px] overflow-visible z-[50]" viewBox="0 0 130 80">
              <path d="M10,10 C 30,100 100,100 120,40" stroke="#3b82f6" strokeWidth="3" fill="none" />
              <circle cx="10" cy="10" r="6" fill="#3b82f6" />
              <circle cx="120" cy="40" r="6" fill="#3b82f6" />
            </svg>

            {/* SVG Connector to Card 3 (Mobile) */}
            <svg className="md:hidden absolute bottom-[-40px] right-[30%] w-[40px] h-[60px] overflow-visible z-[50]" viewBox="0 0 40 60">
              <path d="M30,0 C 30,30 10,30 10,60" stroke="#3b82f6" strokeWidth="3" fill="none" />
              <circle cx="30" cy="0" r="6" fill="#3b82f6" />
              <circle cx="10" cy="60" r="6" fill="#3b82f6" />
            </svg>

            <span className="text-[3.5rem] font-outfit font-medium text-slate-800 mb-auto leading-none">02</span>
            <div>
              <h4 className="text-3xl font-outfit font-medium text-slate-900 mb-4">Develop</h4>
              <p className="text-[15px] text-slate-600 leading-relaxed">
                Writing clean, maintainable code for frontend and backend systems, integrating APIs, and setting up CI/CD pipelines.
              </p>
            </div>
          </div>

          {/* Card 3: Deploy */}
          <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[600ms] relative bg-[#f6f7f9] border border-white rounded-[2rem] p-10 w-full max-w-[380px] h-[360px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transform md:-rotate-[2deg] hover:!rotate-0 hover:!scale-105 z-10 flex flex-col">
            <span className="text-[3.5rem] font-outfit font-medium text-slate-800 mb-auto leading-none">03</span>
            <div>
              <h4 className="text-3xl font-outfit font-medium text-slate-900 mb-4">Deploy</h4>
              <p className="text-[15px] text-slate-600 leading-relaxed">
                Deploying to modern cloud platforms, monitoring performance, optimizing resources, and ensuring high availability.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Selected Works Section */}
      <section id="projects" className="relative w-full max-w-[1300px] px-6 lg:px-16 mx-auto pt-12 pb-32 flex flex-col items-center justify-center z-20">
        <h3 className="text-2xl md:text-3xl font-playfair italic font-medium text-slate-800 mb-2 reveal-animate opacity-0 translate-y-12 transition-all duration-1000">
          Selected Works
        </h3>
        <h2 className="text-4xl md:text-[3.5rem] font-outfit font-medium tracking-tight text-slate-900 mb-8 reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[200ms]">
          My Recent Project
        </h2>

        {/* Category Tabs */}
        <div className="flex items-center gap-4 mb-16 md:mb-20 reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[300ms]">
          <button 
            onClick={() => setActiveTab("website")}
            className={`px-8 py-3 rounded-full font-outfit font-medium transition-all duration-300 ${activeTab === "website" ? "bg-slate-900 text-white shadow-[0_8px_30px_rgb(0,0,0,0.15)]" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
          >
            Website
          </button>
          <button 
            onClick={() => setActiveTab("cloud")}
            className={`px-8 py-3 rounded-full font-outfit font-medium transition-all duration-300 ${activeTab === "cloud" ? "bg-slate-900 text-white shadow-[0_8px_30px_rgb(0,0,0,0.15)]" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
          >
            Cloud
          </button>
        </div>
        
        {activeTab === "website" ? (
          isLoading ? <SkeletonGrid /> : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {displayedProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                  onClick={() => router.push(`/projects/${project.id}`)} 
                  onOpenComments={() => setActiveCommentProject(project)}
                />
              ))}
            </div>

            {/* View All Button */}
            {projects.length > 6 && (
              <div className="mt-16 flex justify-center w-full">
                <a 
                  href="/projects?category=website"
                  className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[400ms] px-8 py-4 bg-slate-900 text-white rounded-full font-outfit font-medium hover:bg-blue-600 hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                  Show All
                  <ArrowRight size={18} />
                </a>
              </div>
            )}
          </>
          )
        ) : (
          isLoading ? <SkeletonGrid /> : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {displayedCloudProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                  onClick={() => router.push(`/projects/${project.id}`)} 
                  onOpenComments={() => setActiveCommentProject(project)}
                />
              ))}
            </div>

            {/* Show All Cloud Button */}
            {cloudProjects.length > 6 && (
              <div className="mt-16 flex justify-center w-full">
                <a
                  href="/projects?category=cloud"
                  className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[400ms] px-8 py-4 bg-slate-900 text-white rounded-full font-outfit font-medium hover:bg-blue-600 hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:-translate-y-1 flex items-center gap-2"
                >
                  Show All
                  <ArrowRight size={18} />
                </a>
              </div>
            )}
          </>
          )
        )}
      </section>

      {/* About Me Section */}
      {/* Certificates Section */}
      <section id="certificates" className="relative w-full max-w-[1300px] px-6 lg:px-16 mx-auto pt-12 pb-32 flex flex-col items-center justify-center z-20">
        <h3 className="text-2xl md:text-3xl font-playfair italic font-medium text-slate-800 mb-2 reveal-animate opacity-0 translate-y-12 transition-all duration-1000">
          Achievements
        </h3>
        <h2 className="text-4xl md:text-[3.5rem] font-outfit font-medium tracking-tight text-slate-900 mb-16 reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[200ms]">
          My Certificates
        </h2>

        {isLoading ? (
          <SkeletonGrid />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {displayedCertificates.map((cert, index) => (
                <div 
                  key={cert.id} 
                  onClick={() => setSelectedCertificate(cert)}
                  className={`reveal-animate opacity-0 translate-y-12 transition-all duration-1000 cursor-pointer group flex flex-col`}
                  style={{ transitionDelay: `${(index % 3) * 150 + 100}ms` }}
                >
                  <div className="relative bg-[#f6f7f9] border border-white/60 p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group-hover:-translate-y-2 overflow-hidden">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200">
                      {cert.type === "image" ? (
                        <Image unoptimized 
                          src={cert.file} 
                          alt={cert.title} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 group-hover:scale-105 transition-transform duration-700 text-slate-400">
                          <FileText size={48} strokeWidth={1.5} className="mb-2 text-blue-400/70" />
                          <span className="text-sm font-medium text-slate-500">PDF Document</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 z-20 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white text-slate-900 px-6 py-3 rounded-full font-medium text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          View Certificate
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 px-2 text-center">
                    <h4 className="text-lg font-outfit font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cert.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {!showAllCertificates && certificates.length > 6 && (
              <div className="mt-16 flex justify-center w-full">
                <button 
                  onClick={() => setShowAllCertificates(true)}
                  className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[400ms] px-8 py-4 bg-slate-900 text-white rounded-full font-outfit font-medium hover:bg-blue-600 hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                  Show All
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section id="about" className="relative w-full max-w-[1300px] px-6 lg:px-16 mx-auto pt-12 pb-32 flex flex-col items-center justify-center z-20">
        <h3 className="text-2xl md:text-3xl font-playfair italic font-medium text-slate-800 mb-2 reveal-animate opacity-0 translate-y-12 transition-all duration-1000">
          Who am i
        </h3>
        <h2 className="text-4xl md:text-[3.5rem] font-outfit font-medium tracking-tight text-slate-900 mb-16 md:mb-24 reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[200ms]">
          Getting to Know me
        </h2>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-24 w-full max-w-[1000px] mx-auto">
          {/* Left: Photo Frame */}
          <div className="w-full lg:w-[45%] reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[300ms]">
            <div className="relative p-2 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] transform md:-rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="relative p-1 border-2 border-slate-100 rounded-2xl bg-white overflow-hidden">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-200">
                  <Image unoptimized src="/fotoformal2.png" alt="Radhiyya Alea" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              </div>
            </div>
            
            {/* Name & Socials */}
            <div className="flex flex-row items-center justify-between mt-8 px-2">
              <div className="flex gap-4 text-slate-800">
                <a href="#" className="hover:text-blue-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="#" className="hover:text-pink-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="hover:text-green-600 transition-colors"><Mail size={20} /></a>
              </div>
              <div className="text-right">
                <h4 className="font-outfit font-bold text-slate-900 text-[17px]">Radhiyya Alea</h4>
                <p className="text-[13px] font-medium text-slate-500 mt-0.5">Web & Cloud Engineer</p>
              </div>
            </div>
          </div>

          {/* Right: Description */}
          <div className="w-full lg:w-[55%] reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[500ms] pt-4 flex flex-col justify-center">
            <p className="text-[18px] md:text-[20px] text-slate-800 leading-relaxed font-outfit mb-6 font-medium">
              I&apos;m a Web & Cloud Engineer passionate about learning, exploring ideas, and building digital experiences that solve real problems.
            </p>
            <p className="text-[16px] md:text-[17px] text-slate-600 leading-relaxed font-outfit">
              With a strong foundation in modern web technologies and cloud infrastructure, I strive to create scalable, efficient, and beautifully designed applications. My goal is to bridge the gap between design and engineering, ensuring that every project I touch is not only functional but also delivers an exceptional user experience.
            </p>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience" className="relative w-full max-w-[1000px] mx-auto pt-16 pb-8 px-6 flex flex-col z-20">
        <h3 className="text-3xl md:text-4xl font-outfit font-bold text-slate-900 mb-8 tracking-tight reveal-animate opacity-0 translate-y-8 transition-all duration-1000">
          Work experience
        </h3>

        <div className="flex flex-col gap-5 reveal-animate opacity-0 translate-y-8 transition-all duration-1000 delay-[200ms]">
          
          {/* Experience Item 1: Elevra Digitalera */}
          <div className="group bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl md:rounded-[2rem] p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-slate-300 transition-all duration-500 flex flex-col cursor-pointer overflow-hidden">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 md:gap-7">
                {/* Logo Box */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-slate-50/50 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-sm p-1.5 md:p-2">
                  <Image 
                    unoptimized 
                    src="/work/Elevra Digital Era Logo.png" 
                    alt="Elevra Digitalera" 
                    width={80} 
                    height={80} 
                    className="object-contain w-full h-full"
                  />
                </div>
                {/* Info */}
                <div>
                  <h4 className="text-[20px] md:text-[22px] font-bold text-slate-900 mb-1">Fullstack Developer</h4>
                  <h5 className="text-[15px] md:text-[16px] font-semibold text-blue-600 mb-4">Elevra Digitalera</h5>
                  
                  <div className="flex flex-wrap items-center gap-3 md:gap-5 text-[13px] md:text-[14px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400" /> 2025 - Present</div>
                    <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> Remote, Indonesia</div>
                    <div className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400" /> Freelance</div>
                  </div>
                </div>
              </div>
              <div className="text-slate-400 group-hover:text-slate-800 transition-transform duration-300 group-hover:rotate-180 hidden sm:block">
                <ChevronDown size={20} />
              </div>
            </div>

            {/* Hover Content */}
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
              <div className="overflow-hidden">
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <h6 className="text-[12px] font-bold text-slate-800 tracking-wider mb-3 uppercase">Contributions :</h6>
                  <ul className="list-disc pl-5 space-y-2 text-[14px] text-slate-600 leading-relaxed">
                    <li>Developing complete web application solutions spanning both frontend and backend architectures.</li>
                    <li>Collaborating closely with clients to translate business requirements into high-quality, scalable code.</li>
                    <li>Ensuring stability through rigorous testing, bug fixes, performance optimizations, and responsive design implementations.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Item 2: PT Data Inti Prima */}
          <div className="group bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl md:rounded-[2rem] p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-slate-300 transition-all duration-500 flex flex-col cursor-pointer overflow-hidden">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 md:gap-7">
                {/* Logo Box */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-slate-50/50 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-sm p-1.5 md:p-2">
                  <Image 
                    unoptimized 
                    src="/work/logo-dataintiprima-2.png" 
                    alt="PT Data Inti Prima" 
                    width={80} 
                    height={80} 
                    className="object-contain w-full h-full"
                  />
                </div>
                {/* Info */}
                <div>
                  <h4 className="text-[20px] md:text-[22px] font-bold text-slate-900 mb-1">Backend Developer Intern</h4>
                  <h5 className="text-[15px] md:text-[16px] font-semibold text-blue-600 mb-4">PT Data Inti Prima</h5>
                  
                  <div className="flex flex-wrap items-center gap-3 md:gap-5 text-[13px] md:text-[14px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400" /> 1 Month</div>
                    <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> Indonesia</div>
                    <div className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400" /> Internship</div>
                  </div>
                </div>
              </div>
              <div className="text-slate-400 group-hover:text-slate-800 transition-transform duration-300 group-hover:rotate-180 hidden sm:block">
                <ChevronDown size={20} />
              </div>
            </div>

            {/* Hover Content */}
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
              <div className="overflow-hidden">
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <h6 className="text-[12px] font-bold text-slate-800 tracking-wider mb-3 uppercase">Contributions :</h6>
                  <ul className="list-disc pl-5 space-y-2 text-[14px] text-slate-600 leading-relaxed">
                    <li>Developed a robust Facility Helpdesk website from scratch as part of a school internship project.</li>
                    <li>Built the backend infrastructure using Node.js and Next.js, integrating with a PostgreSQL database.</li>
                    <li>Leveraged the Restforge framework to accelerate API development and streamline data management.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="relative w-full max-w-[1000px] mx-auto pt-8 pb-24 px-6 flex flex-col z-20">
        <h3 className="text-3xl md:text-4xl font-outfit font-bold text-slate-900 mb-8 tracking-tight reveal-animate opacity-0 translate-y-8 transition-all duration-1000 delay-[100ms]">
          Education
        </h3>

        <div className="flex flex-col gap-5 reveal-animate opacity-0 translate-y-8 transition-all duration-1000 delay-[300ms]">
          
          {/* Education Item */}
          <div className="group bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl md:rounded-[2rem] p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-slate-300 transition-all duration-500 flex flex-col cursor-pointer overflow-hidden">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 md:gap-7">
                {/* Logo Box */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-slate-50/50 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:scale-105 transition-transform duration-500 overflow-hidden p-1.5 md:p-2 shadow-sm">
                  <Image 
                    unoptimized 
                    src="/smktelkomlogo.jpg" 
                    alt="SMK Telkom Sidoarjo" 
                    width={80} 
                    height={80} 
                    className="object-contain w-full h-full"
                  />
                </div>
                {/* Info */}
                <div>
                  <h4 className="text-[20px] md:text-[22px] font-bold text-slate-900 mb-1">SMK Telkom Sidoarjo</h4>
                  <h5 className="text-[15px] md:text-[16px] font-semibold text-slate-700 mb-4">Vocational High School, Sistem Informasi Jaringan Aplikasi (SIJA)</h5>
                  
                  <div className="flex flex-wrap items-center gap-3 md:gap-5 text-[13px] md:text-[14px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400" /> 4 Year Program</div>
                    <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> Sidoarjo, Indonesia</div>
                  </div>
                </div>
              </div>
              <div className="text-slate-400 group-hover:text-slate-800 transition-transform duration-300 group-hover:rotate-180 hidden sm:block">
                <ChevronDown size={20} />
              </div>
            </div>

            {/* Hover Content */}
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
              <div className="overflow-hidden">
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <h6 className="text-[12px] font-bold text-slate-800 tracking-wider mb-3 uppercase">Key Focus :</h6>
                  <ul className="list-disc pl-5 space-y-2 text-[14px] text-slate-600 leading-relaxed">
                    <li>Cloud computing fundamentals and modern web development techniques.</li>
                    <li>Network infrastructure design, maintenance, and security protocols.</li>
                    <li>Application integration, database management, and industry-standard best practices for software engineering.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Elevra Promotion Section */}
      <section id="services" className="relative w-full max-w-[1300px] px-6 lg:px-16 mx-auto pt-16 pb-32 flex flex-col items-center justify-center z-20 border-t border-slate-200/50">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24 w-full max-w-[1100px] mx-auto">
          
          {/* Left: Text Promotion */}
          <div className="w-full lg:w-[50%] reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[200ms] flex flex-col items-start text-left">
            <h2 className="text-4xl md:text-5xl font-outfit font-medium tracking-tight text-slate-900 mb-6 leading-tight">
              Bring Your Ideas to Life with <span className="font-playfair italic">Elevra Digitalera</span>
            </h2>
            <p className="text-[17px] md:text-lg text-slate-600 leading-relaxed font-outfit mb-10">
              Need a professional, modern, and high-performing website? Elevra Digitalera offers premium web development services tailored to your business needs. Elevate your brand&apos;s digital presence today.
            </p>
            
            <a 
              href="https://elevra-digitalera.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-outfit font-medium hover:bg-blue-600 hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:-translate-y-1 transition-all duration-300"
            >
              Visit Elevra Digitalera
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Right: Tilted Photo Frame */}
          <div className="w-full lg:w-[50%] reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[400ms] lg:delay-[400ms]">
            <a 
              href="https://elevra-digitalera.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative p-3 bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgb(0,0,0,0.06)] transform rotate-3 hover:rotate-0 active:rotate-0 hover:shadow-[0_20px_50px_rgb(59,130,246,0.3)] active:shadow-[0_20px_50px_rgb(59,130,246,0.3)] transition-all duration-500 group"
            >
              <div className="relative p-2 border-2 border-slate-100 rounded-3xl bg-white overflow-hidden">
                <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-2xl overflow-hidden bg-slate-200">
                  <Image unoptimized 
                    src="/ELEVRA-LANDINGPAGE.png" 
                    alt="Elevra Digitalera Landing Page" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  {/* Subtle Glow Overlay */}
                  <div className="absolute inset-0 bg-blue-400/0 group-hover:bg-blue-400/10 transition-colors duration-500"></div>
                </div>
              </div>
            </a>
          </div>

        </div>
      </section>


      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedProject(null)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-[2rem] overflow-hidden shadow-2xl z-10 animate-fade-in-up flex flex-col max-h-[90vh]">
            <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white backdrop-blur-md p-2 rounded-full transition-all shadow-sm">
              <X size={20} className="text-slate-800" />
            </button>
            <div className="w-full relative bg-slate-900 shrink-0 flex items-center justify-center">
              <Image
                src={selectedProject.detailImage ?? selectedProject.image}
                alt={selectedProject.title}
                width={900}
                height={600}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>
            <div className="p-8 sm:p-10 overflow-y-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-3xl sm:text-4xl font-outfit font-semibold text-slate-900 mb-6">{selectedProject.title}</h3>
              <p className="text-slate-600 text-[15px] leading-relaxed max-w-2xl mb-6">{selectedProject.description}</p>
              
              {selectedProject.collaborators && selectedProject.collaborators.length > 0 && (
                <div className="pt-6 border-t border-slate-100 flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Collaborators</span>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.collaborators.map((col: any) => {
                      const pillContent = (
                        <>
                          <div className="w-5 h-5 relative rounded-full overflow-hidden border border-slate-200 shrink-0">
                            <img src={col.avatar_url?.includes('i.ibb.co') ? `https://wsrv.nl/?url=${encodeURIComponent(col.avatar_url)}` : col.avatar_url} alt={col.name} className="w-full h-full object-cover" />
                          </div>
                          <span>{col.name}</span>
                          {col.portfolio_url && (
                            <svg className="w-3 h-3 text-slate-400 group-hover/collink:text-blue-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                        </>
                      );

                      return col.portfolio_url ? (
                        <a 
                          key={col.id} 
                          href={col.portfolio_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all rounded-full text-xs font-semibold text-slate-700 group/collink"
                          title={`Buka portofolio ${col.name}`}
                        >
                          {pillContent}
                        </a>
                      ) : (
                        <div key={col.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700">
                          {pillContent}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCertificate(null)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl z-10 animate-fade-in-up flex flex-col max-h-[90vh]">
            <button onClick={() => setSelectedCertificate(null)} className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white backdrop-blur-md p-2 rounded-full transition-all shadow-sm">
              <X size={20} className="text-slate-800" />
            </button>
            <div className="w-full relative bg-slate-100 shrink-0 flex items-center justify-center p-8 min-h-[50vh]">
              {selectedCertificate.type === "image" ? (
                <Image
                  src={selectedCertificate.file}
                  alt={selectedCertificate.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[75vh] object-contain shadow-md rounded-xl"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <iframe 
                    src={`${selectedCertificate.file}#view=FitH`} 
                    className="w-full h-[75vh] rounded-xl shadow-md bg-white border-0 hidden md:block" 
                    title={selectedCertificate.title}
                  />
                  <div className="w-full md:hidden flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl shadow-sm border border-slate-200">
                    <FileText size={64} className="text-blue-500 mb-4" />
                    <h4 className="text-xl font-semibold text-slate-800 mb-2 text-center">PDF Document</h4>
                    <p className="text-slate-500 mb-8 text-center text-sm px-4">Tap the button below to open and view the PDF document in your browser.</p>
                    <a href={selectedCertificate.file} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 active:scale-95">
                      <FileText size={18} />
                      Open PDF Document
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 sm:p-8 bg-white border-t border-slate-100 text-center">
              <h3 className="text-2xl sm:text-3xl font-outfit font-semibold text-slate-900">{selectedCertificate.title}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <StaggerTestimonials />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* Comment Sidebar */}
      <CommentSidebar 
        project={activeCommentProject} 
        isOpen={!!activeCommentProject} 
        onClose={() => setActiveCommentProject(null)} 
        onCommentAdded={() => {
          // Increment the comment count visually for the active project
          if (activeCommentProject) {
            const updateCount = (p: Project) => p.id === activeCommentProject.id ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p;
            setProjects(projects.map(updateCount));
            setCloudProjects(cloudProjects.map(updateCount));
          }
        }}
      />

    </main>
    </PixelReveal>
  );
}
