"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, Award, AlertTriangle, Trash2, Edit2, FileText } from 'lucide-react';

interface Certificate {
  id: number;
  original_id: number;
  title: string;
  file_url: string;
  type: 'image' | 'pdf';
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      setCertificates(data.certificates || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDeleteClick = (id: number) => {
    setCertificateToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (certificateToDelete === null) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/certificates/${certificateToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchCertificates(); // Refresh the list
      } else {
        console.error("Failed to delete certificate");
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setCertificateToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-playfair italic text-slate-500 animate-pulse">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-outfit flex items-center gap-2">
            <Award size={24} className="text-slate-900" />
            Semua Sertifikat
          </h2>
          <p className="text-slate-500">Kelola daftar sertifikat penghargaan Anda ({certificates.length} total)</p>
        </div>
        <Link href="/dashboard/certificates/create" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm">
          <Plus size={18} />
          Tambah Sertifikat
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-8 flex items-center">
        <div className="pl-4 text-slate-400">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Cari sertifikat berdasarkan nama..." 
          className="w-full bg-transparent border-none focus:ring-0 px-4 py-2 text-slate-700 outline-none"
        />
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sertifikat</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {certificates.map((cert) => (
                <tr key={cert.original_id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 relative rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {cert.type === 'image' && cert.file_url ? (
                          <Image 
                            src={cert.file_url} 
                            alt={cert.title} 
                            fill 
                            className="object-cover" 
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                            <FileText size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{cert.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      cert.type === 'pdf'
                        ? 'bg-orange-50 text-orange-700 border border-orange-100' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {cert.type === 'pdf' ? 'PDF' : 'Image'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/dashboard/certificates/edit/${cert.original_id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Certificate"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDeleteClick(cert.original_id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Certificate"
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
        
        {certificates.length === 0 && (
          <div className="py-12 text-center text-slate-500 font-medium">
            Belum ada sertifikat yang ditambahkan.
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
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2 font-outfit">Hapus Sertifikat?</h3>
            <p className="text-center text-slate-500 mb-8 text-sm leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Sertifikat ini akan dihapus secara permanen dari database Anda.
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
