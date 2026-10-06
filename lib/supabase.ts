import { createClient } from '@supabase/supabase-js';
import { Post, ScoreItem } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial mock data
export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: '콜라 vs 오렌지주스 치아 부식 탐구 결과 공유!',
    content: 'pH 센서로 측정해 봤는데 콜라는 무려 pH 2.5까지 떨어지네요... 탄산수보다 훨씬 산성이 강해서 법랑질 부식 위험이 높다는 걸 MBL 그래프로 직접 확인했습니다! 다들 탄산음료 마시고 바로 양치하지 말고 물로 헹구세요!',
    author: '화학탐구러_지우',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 18,
  },
  {
    id: 'post-2',
    title: '보일의 법칙 주사기 실험: P-V 반비례 곡선 대박',
    content: '무선 압력센서에 60mL 주사기 연결해서 부피를 20mL까지 압축하니까 기압이 101.3kPa에서 280kPa 가까이 치솟았어요! P*V 곱이 거의 일정하게 나오는 거 보고 교과서 수식이 그대로 맞아서 소름 돋았습니다.',
    author: '물리만점_서연',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes: 24,
  },
  {
    id: 'post-3',
    title: '염화칼슘 핫팩 발열 반응과 질산암모늄 쿨팩 흡열 반응 비교',
    content: '온도센서 반응속도가 빨라서 용해되자마자 온도가 48도까지 올라가는 발열 피크가 확연히 보이네요. 반대로 질산암모늄은 11도까지 뚝 떨어짐! 흡열 반응 엔탈피 변화(ΔH > 0) 완벽 이해 완료!',
    author: '실험실요정_하은',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    likes: 31,
  },
];

export const INITIAL_SCORES: ScoreItem[] = [
  { id: 'score-1', nickname: '사이언스퀸_민서', score: 980, played_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'score-2', nickname: '화학마스터_예린', score: 950, played_at: new Date(Date.now() - 1000 * 60 * 75).toISOString() },
  { id: 'score-3', nickname: 'MBL탐험가_채원', score: 920, played_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 'score-4', nickname: '뉴턴의사과_수아', score: 880, played_at: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
  { id: 'score-5', nickname: '센서장인_유진', score: 840, played_at: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
];
