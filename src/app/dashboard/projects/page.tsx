"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, FolderGit2, AlertTriangle, Trash2, Edit2 } from 'lucide-react';
import { Project } from '@/types/project';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [cloudProjects, setCloudProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects || []);
      setCloudProjects(data.cloudProjects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteClick = (id: number) => {
    setProjectToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete === null) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchProjects(); // Refresh the list
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const allProjects = [...projects, ...cloudProjects];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-playfair italic text-slate-500 animate-pulse">Loading projects...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-outfit flex items-center gap-2">
            <FolderGit2 size={24} className="text-slate-900" />
            Semua Proyek
          </h2>
          <p className="text-slate-500">Kelola daftar proyek website dan cloud Anda ({allProjects.length} total)</p>
        </div>
        <Link href="/dashboard/projects/create" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm">
          <Plus size={18} />
          Tambah Proyek
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-8 flex items-center">
        <div className="pl-4 text-slate-400">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Cari proyek berdasarkan nama..." 
          className="w-full bg-transparent border-none focus:ring-0 px-4 py-2 text-slate-700 outline-none"
        />
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Proyek</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teknologi / Tag</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 relative rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {project.image && (
                          <Image 
                            src={project.image} 
                            alt={project.title} 
                            fill 
                            className="object-cover" 
                            unoptimized
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{project.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      cloudProjects.some(c => c.id === project.id) 
                        ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {cloudProjects.some(c => c.id === project.id) ? 'Cloud' : 'Website'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md font-medium">
                          {tag}
                        </span>
                      ))}
                      {project.tags && project.tags.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md font-medium">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/dashboard/projects/edit/${project.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDeleteClick(project.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {allProjects.length === 0 && (
          <div className="py-12 text-center text-slate-500 font-medium">
            Belum ada proyek yang ditambahkan.
          </div>
        )}
      </div>

      {/* Custom Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2 font-outfit">Hapus Proyek?</h3>
            <p className="text-center text-slate-500 mb-8 text-sm leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Proyek ini akan dihapus secara permanen dari database Anda.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors flex justify-center items-center"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Ya, Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
