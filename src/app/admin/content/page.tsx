'use client';

import React, { useState, useEffect } from 'react';
import { FileEdit, Plus, Trash2, CheckCircle2, RefreshCw, HelpCircle, FileText } from 'lucide-react';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'faqs'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);

  const [newPost, setNewPost] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Caregiver Tips',
    type: 'Blog',
  });

  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: 'General',
  });

  const loadContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      if (data.success) {
        setPosts(data.contentPosts);
        setFaqs(data.faqs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: 'post', ...newPost }),
      });
      const data = await res.json();
      if (data.success) {
        setPostModalOpen(false);
        setNewPost({ title: '', summary: '', content: '', category: 'Caregiver Tips', type: 'Blog' });
        loadContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: 'faq', ...newFaq }),
      });
      const data = await res.json();
      if (data.success) {
        setFaqModalOpen(false);
        setNewFaq({ question: '', answer: '', category: 'General' });
        loadContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadContent();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Content Management System (CMS)</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage public health blog posts, caregiver guides, FAQs, announcements, and static pages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'posts' ? (
            <button
              onClick={() => setPostModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>New Blog Article</span>
            </button>
          ) : (
            <button
              onClick={() => setFaqModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'posts' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Blog Articles &amp; Guides ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'faqs' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Frequently Asked Questions ({faqs.length})
        </button>
      </div>

      {activeTab === 'posts' ? (
        <div className="space-y-4">
          {posts.map((p) => (
            <div key={p.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-teal-500/20 text-teal-300">
                    {p.category}
                  </span>
                  <h3 className="font-extrabold text-white text-lg mt-1">{p.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.summary}</p>
                </div>
                <button
                  onClick={() => handleDeleteItem(p.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <span>By: {p.author}</span>
                <span>Published: {new Date(p.publishedAt || p.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">Q: {f.question}</h4>
                <button
                  onClick={() => handleDeleteItem(f.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">A: {f.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* New Post Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreatePost} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">Create Blog Post</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Article Title"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Summary</label>
                <input
                  type="text"
                  required
                  value={newPost.summary}
                  onChange={(e) => setNewPost({ ...newPost, summary: e.target.value })}
                  placeholder="Brief summary..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Content Body</label>
                <textarea
                  required
                  rows={4}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Write complete article content..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPostModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg"
              >
                Publish Article
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New FAQ Modal */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateFaq} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">Add FAQ Question &amp; Answer</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  placeholder="e.g. How do I add a medicine reminder?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Answer</label>
                <textarea
                  required
                  rows={3}
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  placeholder="Provide clear answer..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFaqModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg"
              >
                Save FAQ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
