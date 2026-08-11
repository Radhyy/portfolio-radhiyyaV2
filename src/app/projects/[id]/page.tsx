"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight, ArrowLeft, ExternalLink, Calendar, Layers, Users, MessageSquare, ThumbsUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { getTechIcon } from '@/components/ProjectCard';
import CommentSidebar from '@/components/CommentSidebar';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { Project } from '@/types/project';

// Simple Markdown / Rich Text parser for formatted descriptions
function FormattedDescription({ text }: { text: string }) {
  if (!text) return null;

  // Split into paragraphs or line blocks
  const lines = text.split('\n');

  return (
    <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed font-outfit">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2" />;

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const listContent = parseInlineFormatting(trimmed.substring(2));
          return (
            <ul key={index} className="list-disc list-inside pl-4 space-y-1 text-slate-800 font-medium">
              <li>{listContent}</li>
            </ul>
          );
        }

        // Headers (e.g. ### Header or ## Header)
        if (trimmed.startsWith('### ')) {
          return <h4 key={index} className="text-xl font-bold text-slate-900 mt-6 mb-2">{parseInlineFormatting(trimmed.substring(4))}</h4>;
        }
        if (trimmed.startsWith('## ')) {
          return <h3 key={index} className="text-2xl font-bold text-slate-900 mt-6 mb-3">{parseInlineFormatting(trimmed.substring(3))}</h3>;
        }

        return (
          <p key={index} className="text-slate-700 leading-relaxed font-medium">
            {parseInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
}

// Inline formatting for **bold** and *italic*
function parseInlineFormatting(text: string) {
  const parts: (string | React.ReactNode)[] = [];
  let remaining = text;
  let keyIdx = 0;

  // Pattern for **bold** and *italic*
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      parts.push(
        <strong key={keyIdx++} className="font-bold text-slate-900 bg-slate-100 px-1 py-0.5 rounded">
          {matchedStr.slice(2, -2)}
        </strong>
      );
    } else if ((matchedStr.startsWith('*') && matchedStr.endsWith('*')) || (matchedStr.startsWith('_') && matchedStr.endsWith('_'))) {
      parts.push(
        <em key={keyIdx++} className="italic text-slate-800 font-semibold">
          {matchedStr.slice(1, -1)}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Gallery active image
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Reactions & Comments
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchProjectDetail() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        
        const allProjects = [...(data.projects || []), ...(data.cloudProjects || [])];
        const found = allProjects.find((p: Project) => p.id === parseInt(id));

        if (found) {
          setProject(found);
          setReactions(found.reactions || {});

          // LocalStorage for user reactions
          try {
            const stored = localStorage.getItem(`reactions_${found.id}`);
            if (stored) setUserReactions(JSON.parse(stored));
          } catch (e) {}
        } else {
          setError('Proyek tidak ditemukan.');
        }
      } catch (err) {
        setError('Gagal memuat detail proyek.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjectDetail();
  }, [id]);

  useEffect(() => {
    if (isLoading) return;
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
  }, [isLoading]);

  const handleReaction = async (emoji: string) => {
    if (!project) return;
    const hasReacted = userReactions[emoji];
    const action = hasReacted ? 'remove' : 'add';

    setReactions(prev => ({
      ...prev,
      [emoji]: Math.max(0, (prev[emoji] || 0) + (hasReacted ? -1 : 1))
    }));

    const newUserReactions = { ...userReactions, [emoji]: !hasReacted };
    setUserReactions(newUserReactions);
    localStorage.setItem(`reactions_${project.id}`, JSON.stringify(newUserReactions));

    try {
      await fetch('/api/projects/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, emoji, action })
      });
    } catch (err) {
      console.error('Failed to react', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] pt-32 flex flex-col items-center justify-center font-outfit">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Memuat detail proyek...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] pt-32 px-6 font-outfit flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ops! Proyek Tidak Ditemukan</h2>
          <p className="text-slate-500 text-sm mb-6">{error || 'Proyek yang Anda cari tidak tersedia.'}</p>
          <Link href="/projects" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all">
            <ArrowLeft size={16} />
            Kembali ke Daftar Proyek
          </Link>
        </div>
      </div>
    );
  }

  // Build image list (Cover + Detail Image + Gallery Images)
  const allImages: string[] = [];
  if (project.image) allImages.push(project.image);
  if (project.detailImage && !allImages.includes(project.detailImage)) {
    allImages.push(project.detailImage);
  }
  if (project.gallery_images && Array.isArray(project.gallery_images)) {
    project.gallery_images.forEach(imgUrl => {
      if (imgUrl && !allImages.includes(imgUrl)) {
        allImages.push(imgUrl);
      }
    });
  }

  return (
    <main className="min-h-screen bg-[#f4f7f6] pt-24 md:pt-32 flex flex-col font-outfit relative z-0">
      <div className="w-full max-w-[1200px] px-6 lg:px-12 mx-auto mb-16 relative z-10">
        
        {/* Breadcrumb Pill (Matching User Screenshot) */}
        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 mb-8 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200">
          <Link href="/" className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors">
            <Home size={16} />
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link href="/projects" className="text-slate-600 hover:text-slate-900 transition-colors">
            Projects
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-blue-600 font-semibold truncate max-w-[200px] sm:max-w-[300px]">
            {project.title}
          </span>
        </div>

        {/* Project Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
              {project.detailImage ? 'Cloud Project' : 'Website Project'}
            </span>
            {project.tags?.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-full shadow-2xs flex items-center gap-1.5">
                <img src={getTechIcon(tag)} alt={tag} className="w-3.5 h-3.5 object-contain" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            {project.title}
          </h1>
        </div>

        {/* Gallery / Images Showcase (Max 5 Images) */}
        {allImages.length > 0 && (
          <div className="mb-12 space-y-4">
            {/* Main Featured Display Image */}
            <div 
              onClick={() => setLightboxOpen(true)}
              className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden bg-slate-900 shadow-xl border border-slate-200 cursor-pointer group"
            >
              <Image 
                src={allImages[activeImageIndex]} 
                alt={`${project.title} preview ${activeImageIndex + 1}`}
                fill 
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-2.5 rounded-full font-semibold text-xs shadow-md">
                  Perbesar Foto (Lightbox)
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails List (If > 1 image) */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-slate-900 scale-105 shadow-md'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" unoptimized />
                  </button>
                ))}
                <span className="text-xs text-slate-400 font-semibold px-2 shrink-0">
                  {allImages.length} Bukti Foto
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content Grid: Description & Collaborators / Tech details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column (Main Description) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                <Sparkles size={20} className="text-slate-900" />
                Deskripsi & Details
              </h2>
              <FormattedDescription text={project.description} />
            </div>

            {/* Reactions & Comment Action */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Sukai Proyek Ini?</h3>
                <p className="text-xs text-slate-500">Beri reaksi emoji atau tinggalkan komentar masukan Anda.</p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                {/* Emoji Reactions */}
                {['❤️','👍','🔥','🚀'].map((em) => (
                  <button
                    key={em}
                    onClick={() => handleReaction(em)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                      userReactions[em]
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{em}</span>
                    <span>{reactions[em] || 0}</span>
                  </button>
                ))}

                <button
                  onClick={() => setCommentSidebarOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs shrink-0 whitespace-nowrap"
                >
                  <MessageSquare size={16} className="shrink-0" />
                  <span className="whitespace-nowrap">Komentar ({project.commentCount || 0})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Collaborators & Details Sidebar) */}
          <div className="space-y-6">
            
            {/* Collaborators Card */}
            {project.collaborators && project.collaborators.length > 0 && (
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users size={16} className="text-slate-500" />
                  Collaborators ({project.collaborators.length})
                </h3>

                <div className="space-y-3">
                  {project.collaborators.map((col) => (
                    <div key={col.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 relative rounded-full overflow-hidden border border-slate-200 shrink-0 bg-white">
                          <img 
                            src={col.avatar_url?.includes('i.ibb.co') ? `https://wsrv.nl/?url=${encodeURIComponent(col.avatar_url)}` : col.avatar_url} 
                            alt={col.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-slate-900 text-sm truncate">{col.name}</span>
                      </div>

                      {col.portfolio_url ? (
                        <a
                          href={col.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-all shrink-0 shadow-2xs"
                          title={`Lihat portofolio ${col.name}`}
                        >
                          <span>Portofolio</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium px-2 py-1 bg-slate-100 rounded-lg shrink-0">
                          No Link
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Summary Card */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers size={16} className="text-slate-500" />
                Teknologi Digunakan
              </h3>

              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                    <div className="w-4 h-4 bg-white rounded flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                      <img src={getTechIcon(tag)} alt={tag} className="w-3 h-3 object-contain" />
                    </div>
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <Link 
              href="/projects" 
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-2xs"
            >
              <ArrowLeft size={16} />
              Kembali ke Daftar Proyek
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Gallery Images */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4" onClick={() => setLightboxOpen(false)}>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <img 
              src={allImages[activeImageIndex]} 
              alt="Full Preview" 
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" 
            />
            <p className="text-white text-xs mt-4 font-semibold">
              Foto {activeImageIndex + 1} dari {allImages.length} (Klik di mana saja untuk menutup)
            </p>
          </div>
        </div>
      )}

      {/* Comment Sidebar */}
      <CommentSidebar
        project={{
          ...project,
          techStack: [],
          category: project.detailImage ? 'cloud' : 'website',
          commentCount: project.commentCount || 0,
          original_id: project.id
        }}
        isOpen={commentSidebarOpen}
        onClose={() => setCommentSidebarOpen(false)}
        onCommentAdded={() => {
          setProject(prev => prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : prev);
        }}
      />

      <CTASection />
      <Footer />
    </main>
  );
}
