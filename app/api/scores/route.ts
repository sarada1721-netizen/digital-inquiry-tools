import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, INITIAL_SCORES } from '@/lib/supabase';
import { ScoreItem } from '@/lib/types';

let memoryScores: ScoreItem[] = [...INITIAL_SCORES];

export const runtime = 'nodejs';

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, scores: data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('Supabase fetch scores error:', err);
    }
  }

  // Sort memory scores
  const sorted = [...memoryScores].sort((a, b) => b.score - a.score).slice(0, 20);
  return NextResponse.json({ success: true, scores: sorted, source: 'memory' });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nickname, score } = body;

    if (!nickname || score === undefined) {
      return NextResponse.json(
        { success: false, error: '닉네임과 점수가 필요합니다.' },
        { status: 400 }
      );
    }

    const newScoreItem: ScoreItem = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `score-${Date.now()}`,
      nickname,
      score: Number(score),
      played_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('scores')
          .insert([newScoreItem])
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ success: true, item: data, source: 'supabase' });
        }
      } catch (err) {
        console.warn('Supabase score insert error:', err);
      }
    }

    memoryScores.push(newScoreItem);
    return NextResponse.json({ success: true, item: newScoreItem, source: 'memory' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '서버 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
}
