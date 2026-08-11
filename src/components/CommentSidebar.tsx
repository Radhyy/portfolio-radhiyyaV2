"use client";
import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, CornerDownLeft } from 'lucide-react';

interface Comment {
  id: number;
  name: string;
  content: string;
  created_at: string;
}

interface CommentSidebarProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded: () => void;
}

export default function CommentSidebar({ project, isOpen, onClose, onCommentAdded }: CommentSidebarProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && project?.id) {
      fetchComments();
    }
  }, [isOpen, project?.id]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/comments?projectId=${project.id}`);
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setError('Mohon isi nama dan komentar Anda.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/projects/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, name, content })
      });
      const data = await res.json();
      
      if (data.success) {
        setComments([data.comment, ...comments]);
        setName('');
        setContent('');
        onCommentAdded();
      } else {
        setError(data.error || 'Gagal mengirim komentar.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay (z-[999] so it is strictly on top of any floating navbar) */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[999] transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Sidebar Panel (z-[1000] to cover floating elements cleanly) */}
      <div className="fixed inset-y-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[1000] flex flex-col transform transition-transform duration-300 translate-x-0 font-outfit">
        
        {/* Mobile drag / close handle indicator */}
        <div className="md:hidden w-full pt-3 pb-1 flex justify-center bg-slate-50 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                Komentar Proyek
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
              {project?.title}
            </p>
          </div>

          {/* High-visibility Close Button */}
          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors shrink-0 border border-slate-200"
            title="Tutup Komentar"
          >
            <X size={16} />
            <span>Tutup</span>
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-48 text-slate-400 gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
              <span className="text-xs font-medium">Memuat komentar...</span>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700 text-base">Belum Ada Komentar</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                Jadilah yang pertama memberikan masukan untuk proyek ini!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900">{comment.name}</span>
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed break-words whitespace-pre-wrap font-outfit">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-5 border-t border-slate-100 bg-white shrink-0 shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && <div className="text-red-500 text-xs font-semibold px-1">{error}</div>}
            
            <input 
              type="text" 
              placeholder="Nama Anda *" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium placeholder:text-slate-400"
              maxLength={50}
              required
            />
            
            <textarea 
              placeholder="Tuliskan masukan atau masukan Anda..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all min-h-[85px] max-h-[140px] resize-none font-medium placeholder:text-slate-400"
              maxLength={500}
              required
            />
            
            <div className="flex items-center gap-2">
              <button 
                type="submit" 
                disabled={submitting}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
              >
                {submitting ? 'Mengirim...' : 'Kirim Komentar'}
                <Send size={15} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors border border-slate-200"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
