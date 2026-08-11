"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Upload, X, Users, Check, Bold, Italic, List, Image as ImageIcon, Plus } from 'lucide-react';
import { Project } from '@/types/project';
import { Collaborator } from '@/types/collaborator';
import Image from 'next/image';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGalleryIdx, setUploadingGalleryIdx] = useState<number | null>(null);
  const [error, setError] = useState('');

  const [availableCollaborators, setAvailableCollaborators] = useState<Collaborator[]>([]);
  const [selectedCollaboratorIds, setSelectedCollaboratorIds] = useState<number[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'normal',
    image_url: '',
    detail_image_url: '',
    tags: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch collaborators
        const colRes = await fetch('/api/collaborators');
        const colData = await colRes.json();
        setAvailableCollaborators(colData.collaborators || []);

        // Fetch projects
        const res = await fetch('/api/projects');
        const data = await res.json();
        
        const allProjects = [...(data.projects || []), ...(data.cloudProjects || [])];
        const project = allProjects.find((p: Project) => p.id === parseInt(id));

        if (project) {
          let rawImageUrl = project.image || '';
          if (rawImageUrl.includes('wsrv.nl/?url=')) {
            rawImageUrl = decodeURIComponent(rawImageUrl.split('url=')[1]);
          } else if (rawImageUrl.includes('/api/image-proxy?url=')) {
            rawImageUrl = decodeURIComponent(rawImageUrl.split('url=')[1]);
          }

          let rawDetailImageUrl = project.detailImage || '';
          if (rawDetailImageUrl.includes('wsrv.nl/?url=')) {
            rawDetailImageUrl = decodeURIComponent(rawDetailImageUrl.split('url=')[1]);
          } else if (rawDetailImageUrl.includes('/api/image-proxy?url=')) {
            rawDetailImageUrl = decodeURIComponent(rawDetailImageUrl.split('url=')[1]);
          }

          const rawGallery: string[] = (project.gallery_images || []).map((imgUrl: string) => {
            if (imgUrl.includes('wsrv.nl/?url=')) return decodeURIComponent(imgUrl.split('url=')[1]);
            return imgUrl;
          });

          setFormData({
            title: project.title || '',
            description: project.description || '',
            type: data.cloudProjects?.some((c: Project) => c.id === project.id) ? 'cloud' : 'normal',
            image_url: rawImageUrl,
            detail_image_url: rawDetailImageUrl,
            tags: (project.tags || []).join(', '),
          });

          setGalleryImages(rawGallery);

          if (project.collaborators && Array.isArray(project.collaborators)) {
            setSelectedCollaboratorIds(project.collaborators.map((c: Collaborator) => c.id));
          }
        } else {
          setError('Proyek tidak ditemukan.');
        }
      } catch (err) {
        setError('Gagal memuat data proyek.');
      } finally {
        setFetching(false);
      }
    }

    loadData();
  }, [id]);

  const toggleCollaborator = (colId: number) => {
    setSelectedCollaboratorIds(prev =>
      prev.includes(colId) ? prev.filter(item => item !== colId) : [...prev, colId]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const insertFormatting = (syntax: string) => {
    setFormData(prev => {
      const current = prev.description;
      if (syntax === 'bold') return { ...prev, description: current + ' **teks tebal** ' };
      if (syntax === 'italic') return { ...prev, description: current + ' *teks miring* ' };
      if (syntax === 'list') return { ...prev, description: current + '\n- Poin 1\n- Poin 2\n' };
      return prev;
    });
  };

  const uploadCoverToImgBB = async (file: File) => {
    setUploadingCover(true);
    setError('');

    try {
      const imgData = new FormData();
      imgData.append('image', file);
      
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error("API Key ImgBB belum diatur di .env (NEXT_PUBLIC_IMGBB_API_KEY).");
      }

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: imgData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image_url: data.data.url }));
      } else {
        throw new Error("Gagal mengupload foto cover ke ImgBB");
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengupload gambar.');
    } finally {
      setUploadingCover(false);
    }
  };

  const uploadGalleryToImgBB = async (file: File, targetIndex: number) => {
    setUploadingGalleryIdx(targetIndex);
    setError('');

    try {
      const imgData = new FormData();
      imgData.append('image', file);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error("API Key ImgBB belum diatur di .env (NEXT_PUBLIC_IMGBB_API_KEY).");
      }

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: imgData,
      });

      const data = await res.json();
      if (data.success) {
        const url = data.data.url;
        setGalleryImages(prev => {
          const updated = [...prev];
          updated[targetIndex] = url;
          return updated;
        });
      } else {
        throw new Error("Gagal mengupload foto galeri ke ImgBB");
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengupload foto galeri.');
    } finally {
      setUploadingGalleryIdx(null);
    }
  };

  const addGallerySlot = () => {
    if (galleryImages.length < 4) {
      setGalleryImages(prev => [...prev, '']);
    }
  };

  const removeGallerySlot = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateGalleryUrl = (index: number, url: string) => {
    setGalleryImages(prev => {
      const updated = [...prev];
      updated[index] = url;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const validGallery = galleryImages.filter(img => img.trim().length > 0);

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          gallery_images: validGallery,
          tags: tagsArray,
          collaborator_ids: selectedCollaboratorIds
        }),
      });

      if (res.ok) {
        router.push('/dashboard/projects');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update project');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64 font-outfit">
        <div className="text-xl italic text-slate-500 animate-pulse">Loading data proyek...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto font-outfit">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/projects" 
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Edit Proyek</h2>
          <p className="text-slate-500 text-sm">Ubah detail proyek Anda di bawah ini.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Judul Proyek */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Judul Proyek *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
            </div>

            {/* Deskripsi Proyek */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 ml-1">Deskripsi Detail Proyek *</label>
                
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => insertFormatting('bold')}
                    className="p-1.5 hover:bg-white rounded text-slate-700 hover:shadow-2xs text-xs flex items-center gap-1 font-semibold"
                    title="Tambah Teks Tebal (**teks**)"
                  >
                    <Bold size={14} />
                    <span>Bold</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('italic')}
                    className="p-1.5 hover:bg-white rounded text-slate-700 hover:shadow-2xs text-xs flex items-center gap-1 font-semibold"
                    title="Tambah Teks Miring (*teks*)"
                  >
                    <Italic size={14} />
                    <span>Italic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('list')}
                    className="p-1.5 hover:bg-white rounded text-slate-700 hover:shadow-2xs text-xs flex items-center gap-1 font-semibold"
                    title="Tambah Daftar Poin (- item)"
                  >
                    <List size={14} />
                    <span>Bullet List</span>
                  </button>
                </div>
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none font-outfit"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Kategori (Tipe) *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all appearance-none"
              >
                <option value="normal">Proyek Website (Normal)</option>
                <option value="cloud">Proyek Cloud</option>
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Teknologi / Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                placeholder="Pisahkan dengan koma (Misal: Next.js, Tailwind, AWS)"
              />
            </div>

            {/* Kolaborator Proyek */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1.5">
                <Users size={16} className="text-slate-500" />
                Kolaborator Proyek (Opsional)
              </label>
              {availableCollaborators.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                  Belum ada kolaborator di sistem. Anda dapat menambahkan kolaborator terlebih dahulu melalui menu <Link href="/dashboard/collaborators" className="text-blue-600 font-semibold underline">Collaborators</Link>.
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  {availableCollaborators.map((col) => {
                    const isSelected = selectedCollaboratorIds.includes(col.id);
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => toggleCollaborator(col.id)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-6 h-6 relative rounded-full overflow-hidden border border-white/30 shrink-0">
                          <Image
                            src={col.avatar_url.includes('i.ibb.co') ? `https://wsrv.nl/?url=${encodeURIComponent(col.avatar_url)}` : col.avatar_url}
                            alt={col.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span>{col.name}</span>
                        {isSelected && <Check size={14} className="text-emerald-400 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cover Image (Required - Image 1) */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1.5">
                <ImageIcon size={16} className="text-slate-500" />
                Foto Cover Utama (Wajib - Foto 1) *
              </label>
              
              <div className="flex items-center gap-4">
                {formData.image_url ? (
                  <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <Image 
                      src={formData.image_url.includes('i.ibb.co') ? `https://wsrv.nl/?url=${encodeURIComponent(formData.image_url)}` : formData.image_url} 
                      alt="Cover Preview" 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full md:w-auto md:px-8 h-24 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors relative overflow-hidden shrink-0">
                    {uploadingCover ? (
                      <div className="flex flex-col items-center text-blue-500">
                        <Loader2 size={24} className="animate-spin mb-1" />
                        <span className="text-xs font-semibold">Mengupload...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-500">
                        <Upload size={24} className="mb-1" />
                        <span className="text-xs font-semibold">Ganti Foto Cover</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={uploadingCover}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          uploadCoverToImgBB(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
                
                <div className="flex-1">
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm"
                    placeholder="Atau tempel link ImgBB di sini (https://i.ibb.co/...)"
                  />
                </div>
              </div>
            </div>

            {/* Additional Gallery Images (Opsional - Up to 4 images, total 5 max) */}
            <div className="space-y-4 md:col-span-2 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1.5">
                    <ImageIcon size={16} className="text-slate-500" />
                    Foto Bukti Tambahan / Galeri (Opsional - Max 4 Tambahan)
                  </label>
                  <p className="text-xs text-slate-400 ml-1">Tambahkan bukti foto pendukung proyek Anda (Total maksimal 5 foto termasuk cover).</p>
                </div>

                {galleryImages.length < 4 && (
                  <button
                    type="button"
                    onClick={addGallerySlot}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Plus size={14} />
                    <span>Tambah Slot Foto</span>
                  </button>
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="space-y-3">
                  {galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                      <span className="text-xs font-bold text-slate-400 shrink-0 w-16">Foto #{idx + 2}</span>
                      
                      {imgUrl ? (
                        <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0">
                          <Image 
                            src={imgUrl.includes('i.ibb.co') ? `https://wsrv.nl/?url=${encodeURIComponent(imgUrl)}` : imgUrl} 
                            alt={`Gallery ${idx + 2}`} 
                            fill 
                            className="object-cover" 
                            unoptimized 
                          />
                        </div>
                      ) : (
                        <label className="flex items-center justify-center px-4 py-2 bg-white border border-dashed border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer text-xs font-medium shrink-0">
                          {uploadingGalleryIdx === idx ? (
                            <Loader2 size={16} className="animate-spin text-blue-500" />
                          ) : (
                            <Upload size={16} />
                          )}
                          <span className="ml-1.5">Upload ImgBB</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                uploadGalleryToImgBB(e.target.files[0], idx);
                              }
                            }}
                          />
                        </label>
                      )}

                      <input
                        type="url"
                        value={imgUrl}
                        onChange={(e) => updateGalleryUrl(idx, e.target.value)}
                        placeholder="Atau tempel link ImgBB di sini..."
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none text-xs"
                      />

                      <button
                        type="button"
                        onClick={() => removeGallerySlot(idx)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                        title="Hapus Foto"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link
              href="/dashboard/projects"
              className="px-6 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
