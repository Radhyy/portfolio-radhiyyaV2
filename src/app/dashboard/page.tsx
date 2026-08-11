"use client";

import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { FolderGit2, Cloud, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [cloudProjects, setCloudProjects] = useState<Project[]>([]);
  const [certificatesCount, setCertificatesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, certRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/certificates')
        ]);
        
        const projData = await projRes.json();
        setProjects(projData.projects || []);
        setCloudProjects(projData.cloudProjects || []);
        
        const certData = await certRes.json();
        setCertificatesCount(certData.certificates?.length || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalProjects = projects.length + cloudProjects.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-playfair italic text-slate-500 animate-pulse">Loading overview...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Selamat Datang di Dasbor Admin! 👋</h1>
          <p className="text-slate-300 text-lg leading-relaxed font-light">
            Di sini Anda dapat mengelola seluruh konten website portofolio, mulai dari Publikasi Proyek Website, Proyek Cloud, hingga Sertifikat dan pencapaian lainnya.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat Card 1 */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Website Projects</p>
            <h3 className="text-4xl font-bold text-slate-900">{projects.length}</h3>
          </div>
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FolderGit2 size={24} />
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Cloud Projects</p>
            <h3 className="text-4xl font-bold text-slate-900">{cloudProjects.length}</h3>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Cloud size={24} />
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Certificates</p>
            <h3 className="text-4xl font-bold text-slate-900">{certificatesCount}</h3>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award size={24} />
          </div>
        </div>

      </div>

      {/* Quick Actions / Recent Activity layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Recent Projects */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FolderGit2 size={18} className="text-red-500" />
              Proyek Terbaru
            </h3>
            <Link href="/dashboard/projects" className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            {projects.slice(0, 3).map((project, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-900">{project.title}</h4>
                  <p className="text-xs text-slate-500 truncate max-w-xs">{project.description}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-md">
                    Published
                  </span>
                </div>
              </div>
            ))}
            
            {projects.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
                Belum ada proyek.
              </div>
            )}
          </div>
        </div>

        {/* Recent Cloud Projects */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Cloud size={18} className="text-blue-500" />
              Proyek Cloud Terbaru
            </h3>
            <Link href="/dashboard/projects" className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            {cloudProjects.slice(0, 3).map((project, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-900">{project.title}</h4>
                  <p className="text-xs text-slate-500 truncate max-w-xs">{project.description}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-md">
                    Published
                  </span>
                </div>
              </div>
            ))}
            
            {cloudProjects.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
                Belum ada proyek cloud.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
