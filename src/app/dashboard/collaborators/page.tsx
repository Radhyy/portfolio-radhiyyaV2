"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Search, Users, AlertTriangle, Trash2, Edit2, Upload, Loader2, X, CheckCircle2, ExternalLink } from 'lucide-react';
import { Collaborator } from '@/types/collaborator';

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [formData, setFormData] = useState({ name: '', avatar_url: '', portfolio_url: '' });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [collaboratorToDelete, setCollaboratorToDelete] = useState<Collaborator | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCollaborators = async () => {
    try {
      const res = await fetch('/api/collaborators');
      const data = await res.json();
      setCollaborators(data.collaborators || []);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const openAddModal = () => {
    setEditingCollaborator(null);
    setFormData({ name: '', avatar_url: '', portfolio_url: '' });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const openEditModal = (col: Collaborator) => {
    setEditingCollaborator(col);
    setFormData({ name: col.name, avatar_url: col.avatar_url, portfolio_url: col.portfolio_url || '' });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const uploadToImgBB = async (file: File) => {
    setUploadingAvatar(true);
    setFormError('');

    try {
      const imgData = new FormData();
      imgData.append('image', file);
      
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error('API Key ImgBB belum diatur di .env (NEXT_PUBLIC_IMGBB_API_KEY). Silakan tambahkan terlebih dahulu.');
      }

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: imgData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, avatar_url: data.data.url }));
      } else {
        throw new Error('Gagal mengupload foto profile ke ImgBB');
      }
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan saat mengupload gambar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.avatar_url.trim()) {
      setFormError('Nama dan foto profile wajib diisi.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      const url = editingCollaborator ? `/api/collaborators/${editingCollaborator.id}` : '/api/collaborators';
      const method = editingCollaborator ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsFormModalOpen(false);
        fetchCollaborators();
      } else {
        const data = await res.json();
        setFormError(data.error || 'Gagal menyimpan kolaborator');
      }
    } catch (err) {
      setFormError('Terjadi kesalahan koneksi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (col: Collaborator) => {
    setCollaboratorToDelete(col);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!collaboratorToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/collaborators/${collaboratorToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchCollaborators();
      }
    } catch (error) {
      console.error('Error deleting collaborator:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setCollaboratorToDelete(null);
    }
  };

  const filteredCollaborators = collaborators.filter(col =>
    col.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-playfair italic text-slate-500 animate-pulse">Memuat data kolaborator...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-outfit flex items-center gap-2">
            <Users size={24} className="text-slate-900" />
            Daftar Kolaborator
          </h2>
          <p className="text-slate-500">Kelola anggota kolaborator ({collaborators.length} total)</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          <Plus size={18} />
          Tambah Kolaborator
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-8 flex items-center">
        <div className="pl-4 text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari kolaborator berdasarkan nama..."
          className="w-full bg-transparent border-none focus:ring-0 px-4 py-2 text-slate-700 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Foto Profile</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Kolaborator</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Link Portfolio (Opsional)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Link Avatar (ImgBB)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCollaborators.map((col) => (
                <tr key={col.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <Image
                        src={col.avatar_url.includes('i.ibb.co') ? `https://wsrv.nl/?url=${encodeURIComponent(col.avatar_url)}` : col.avatar_url}
                        alt={col.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{col.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    {col.portfolio_url ? (
                      <a
                        href={col.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline max-w-[200px] truncate"
                      >
                        <span className="truncate">{col.portfolio_url}</span>
                        <ExternalLink size={12} className="shrink-0" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Tidak ada</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500 font-mono line-clamp-1 max-w-xs">{col.avatar_url}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(col)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Kolaborator"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(col)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Kolaborator"
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

        {filteredCollaborators.length === 0 && (
          <div className="py-12 text-center text-slate-500 font-medium">
            Belum ada kolaborator yang ditambahkan.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-outfit text-slate-900">
                {editingCollaborator ? 'Edit Kolaborator' : 'Tambah Kolaborator Baru'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-medium rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kolaborator *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Misal: John Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Link Portfolio Kolaborator (Opsional)</label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                  placeholder="https://portfolio-teman-anda.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Foto Profile (Direct Link ImgBB) *</label>
                <div className="flex items-center gap-3 mb-2">
                  {formData.avatar_url ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <Image
                        src={formData.avatar_url.includes('i.ibb.co') ? `https://wsrv.nl/?url=${encodeURIComponent(formData.avatar_url)}` : formData.avatar_url}
                        alt="Avatar Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatar_url: '' }))}
                        className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer text-xs font-medium w-full">
                      {uploadingAvatar ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-blue-500" />
                          <span>Mengupload ke ImgBB...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>Pilih Foto (Upload ImgBB)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingAvatar}
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            uploadToImgBB(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                  required
                  placeholder="Atau tempel URL ImgBB (https://i.ibb.co/...)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs font-mono"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  <span>{editingCollaborator ? 'Simpan Edit' : 'Tambah'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2 font-outfit">Hapus Kolaborator?</h3>
            <p className="text-center text-slate-500 mb-8 text-sm leading-relaxed">
              Tindakan ini akan menghapus kolaborator &quot;{collaboratorToDelete?.name}&quot; dari daftar.
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
