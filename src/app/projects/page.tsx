"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight, X, Search } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import CommentSidebar from '@/components/CommentSidebar';
import SkeletonGrid from '@/components/SkeletonGrid';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { useLanguage } from '@/context/LanguageContext';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  detailImage?: string;
  description: string;
  tags: string[];
  techStack: { name: string; icon: string }[];
  reactions: { [key: string]: number };
  commentCount: number;
  original_id: number;
  collaborators?: any[];
}

function ProjectsContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') === 'cloud' ? 'cloud' : 'website';
  
  const [activeTab, setActiveTab] = useState<"website" | "cloud">(initialCategory);
  const [projects, setProjects] = useState<Project[]>([]);
  const [cloudProjects, setCloudProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCommentProject, setActiveCommentProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data.projects || []);
        setCloudProjects(data.cloudProjects || []);
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
  }, [activeTab, isLoading, projects.length, searchQuery]);

  const currentProjects = activeTab === "website" ? projects : cloudProjects;
  const filteredProjects = currentProjects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-[#f4f7f6] pt-24 md:pt-32 flex flex-col relative z-0">
      {/* Header Section (Light Theme) */}
      <div className="w-full max-w-[1300px] px-6 lg:px-16 mx-auto mb-12 relative z-10">
        {/* Breadcrumbs */}
        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 mb-6 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200">
          <Link href="/" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <Home size={16} />
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-blue-600 font-semibold">{t('navProjects')}</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-5xl md:text-6xl font-outfit font-bold text-slate-900 mb-4 tracking-tight">
          {t('allProjectsTitle')}
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
          {t('allProjectsSubtitle')}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-[1300px] px-6 lg:px-16 mx-auto pb-32 relative z-10 font-outfit">
        {/* Category Tabs & Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab("website")}
              className={`px-8 py-3 rounded-full font-outfit font-medium transition-all duration-300 ${activeTab === "website" ? "bg-slate-900 text-white shadow-[0_8px_30px_rgb(0,0,0,0.15)]" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
            >
              {t('filterWeb')}
            </button>
            <button 
              onClick={() => setActiveTab("cloud")}
              className={`px-8 py-3 rounded-full font-outfit font-medium transition-all duration-300 ${activeTab === "cloud" ? "bg-slate-900 text-white shadow-[0_8px_30px_rgb(0,0,0,0.15)]" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
            >
              {t('filterCloud')}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-slate-200 text-slate-700 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Project Grid */}
        {isLoading ? (
          <SkeletonGrid />
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filteredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index}
                onClick={() => router.push(`/projects/${project.id}`)} 
                onOpenComments={() => setActiveCommentProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <Search className="text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No projects found</h3>
            <p className="text-slate-500">We couldn't find any projects matching "{searchQuery}".</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      <CTASection />

      <Footer />

      {/* Comment Sidebar */}
      <CommentSidebar 
        project={activeCommentProject} 
        isOpen={!!activeCommentProject} 
        onClose={() => setActiveCommentProject(null)} 
        onCommentAdded={() => {
          if (activeCommentProject) {
            const updateCount = (p: Project) => p.id === activeCommentProject.id ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p;
            setProjects(projects.map(updateCount));
            setCloudProjects(cloudProjects.map(updateCount));
          }
        }}
      />

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
                {selectedProject.tags?.map((tag: string, i: number) => (
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
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f7f6] pt-32 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>}>
      <ProjectsContent />
    </Suspense>
  );
}
