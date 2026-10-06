'use client';

import React, { useState, useEffect } from 'react';
import { Post } from '@/lib/types';
import { MessageSquare, Heart, PlusCircle, User, Clock, Send, Sparkles } from 'lucide-react';

export default function CommunityBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !author) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, author }),
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPosts((prev) => [data.post, ...prev]);
        setTitle('');
        setContent('');
        setAuthor('');
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    // optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );

    try {
      await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl brutal-box p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-300 border-2 border-black flex items-center justify-center shadow-brutal-sm">
              <MessageSquare className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">
              실험 탐구 및 관측 보고서 게시판
            </h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            MBL 센서로 직접 측정한 과학적 발견과 그래프 분석 내용을 친구들과 공유하고 토론하세요.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-400 text-black font-extrabold text-sm brutal-btn border-2 border-black shadow-brutal-sm"
        >
          <PlusCircle className="w-4 h-4" />
          {showForm ? '작성 취소' : '새 보고서 작성'}
        </button>
      </div>

      {/* Post creation form */}
      {showForm && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white dark:bg-gray-800 rounded-3xl brutal-box p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center gap-2 font-black text-base text-black dark:text-white">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span>새로운 실험 탐구 기록 남기기</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                탐구 보고서 제목
              </label>
              <input
                type="text"
                placeholder="예: pH 센서로 측정한 치아 부식 위험도 분석 결과"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                작성자 닉네임
              </label>
              <input
                type="text"
                placeholder="예: 화학탐구반_수아"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              실험 관측 내용 및 분석 결론
            </label>
            <textarea
              rows={4}
              placeholder="MBL 센서로 측정한 그래프 곡선 특징, 변인 통제, 과학적 결론을 자세히 기록해 주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-black dark:border-white"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-400 text-black font-extrabold text-xs brutal-btn border-2 border-black shadow-brutal-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? '저장 중...' : '보고서 등록하기'}
            </button>
          </div>
        </form>
      )}

      {/* Posts list */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-sm text-gray-500 font-mono">
            데이터베이스에서 탐구 보고서를 불러오는 중입니다...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl brutal-box text-sm text-gray-500">
            등록된 탐구 보고서가 없습니다. 첫 번째 탐구 결과를 남겨보세요!
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-3xl brutal-box p-5 transition hover:shadow-brutal-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-black dark:text-white">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(post.created_at).toLocaleString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Like button */}
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-950/50 hover:bg-pink-200 border-2 border-black text-black dark:text-white font-extrabold text-xs brutal-btn shadow-brutal-sm"
                >
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                  <span>{post.likes}</span>
                </button>
              </div>

              <p className="mt-3 text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-sans whitespace-pre-line">
                {post.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
