import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, INITIAL_POSTS } from '@/lib/supabase';
import { Post } from '@/lib/types';

// In-memory store for fallback if Supabase is not yet populated
let memoryPosts: Post[] = [...INITIAL_POSTS];

export const runtime = 'nodejs';

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, posts: data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('Supabase fetch error, using memory fallback:', err);
    }
  }

  return NextResponse.json({ success: true, posts: memoryPosts, source: 'memory' });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, author } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { success: false, error: '모든 항목(제목, 내용, 작성자)을 입력해 주세요.' },
        { status: 400 }
      );
    }

    const newPost: Post = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `post-${Date.now()}`,
      title,
      content,
      author,
      created_at: new Date().toISOString(),
      likes: 0,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .insert([newPost])
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ success: true, post: data, source: 'supabase' });
        }
      } catch (err) {
        console.warn('Supabase insert error, saving to memory:', err);
      }
    }

    memoryPosts.unshift(newPost);
    return NextResponse.json({ success: true, post: newPost, source: 'memory' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '서버 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      try {
        // Increment likes
        const { data: current } = await supabase.from('posts').select('likes').eq('id', id).single();
        if (current) {
          const { data } = await supabase
            .from('posts')
            .update({ likes: (current.likes || 0) + 1 })
            .eq('id', id)
            .select()
            .single();
          if (data) {
            return NextResponse.json({ success: true, post: data });
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }

    const post = memoryPosts.find((p) => p.id === id);
    if (post) {
      post.likes += 1;
      return NextResponse.json({ success: true, post });
    }

    return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Error updating likes' }, { status: 500 });
  }
}
