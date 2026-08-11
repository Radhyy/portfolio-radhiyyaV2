"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';

export default function CreateCertificatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    type: 'image',
    file_url: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadToImgBB = async (file: File) => {
    setUploadingImage(true);
    setError('');

    try {
      const imgData = new FormData();
      imgData.append('image', file);
      
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key ImgBB belum diatur di .env (NEXT_PUBLIC_IMGBB_API_KEY). Silakan tambahkan terlebih dahulu.");
      }

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: imgData,
      });

      const data = await res.json();
      
      if (data.success) {
        const url = data.data.url;
        setFormData(prev => ({ ...prev, file_url: url }));
      } else {
        throw new Error("Gagal mengupload gambar ke ImgBB");
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengupload gambar.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/dashboard/certificates');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create certificate');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/certificates" 
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold font-outfit text-slate-900">Tambah Sertifikat Baru</h2>
          <p className="text-slate-500 text-sm">Isi detail sertifikat di bawah ini untuk menambahkannya ke portofolio Anda.</p>
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
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Judul Sertifikat *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                placeholder="Misal: Juara 1 Web Design Nasional"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Kategori (Tipe) *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all appearance-none"
              >
                <option value="image">Gambar (JPG/PNG)</option>
                <option value="pdf">Dokumen (PDF)</option>
              </select>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                {formData.type === 'image' ? 'Upload Gambar (ImgBB) *' : 'URL File PDF *'}
              </label>
              
              <div className="flex items-center gap-4">
                {formData.type === 'image' && (
                  formData.file_url ? (
                    <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <Image 
                        src={formData.file_url.includes('i.ibb.co') ? `https://wsrv.nl/?url=${encodeURIComponent(formData.file_url)}` : formData.file_url} 
                        alt="Certificate Preview" 
                        fill 
                        className="object-cover" 
                        unoptimized 
                      />
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, file_url: '' }))}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full md:w-auto md:px-8 h-24 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors relative overflow-hidden shrink-0">
                      {uploadingImage ? (
                        <div className="flex flex-col items-center text-blue-500">
                          <Loader2 size={24} className="animate-spin mb-1" />
                          <span className="text-xs font-semibold">Mengupload...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-500">
                          <Upload size={24} className="mb-1" />
                          <span className="text-xs font-semibold">Pilih File</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        disabled={uploadingImage}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            uploadToImgBB(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  )
                )}
                
                <div className="flex-1">
                  <input
                    type="url"
                    name="file_url"
                    value={formData.file_url}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm"
                    placeholder={formData.type === 'image' ? "Atau tempel link ImgBB di sini (https://i.ibb.co/...)" : "Masukkan URL file PDF (/Sertifikat/file.pdf)"}
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {loading ? 'Menyimpan...' : 'Simpan Sertifikat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
