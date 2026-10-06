-- ========================================================
-- 디지털 탐구 도구: Supabase 데이터베이스 스키마 및 RLS 정책
-- 리전: Seoul (ap-northeast-2)
-- ========================================================

-- 1. 게시물 테이블 (Posts)
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    likes INTEGER DEFAULT 0
);

-- 2. 점수 랭킹 테이블 (Scores)
CREATE TABLE IF NOT EXISTS public.scores (
    id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    score INTEGER NOT NULL,
    played_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- 누구나 읽고 쓸 수 있는 공개 정책 생성 (익명 키 허용)
CREATE POLICY "Allow public read on posts" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on posts" ON public.posts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on posts" ON public.posts
    FOR UPDATE USING (true);

CREATE POLICY "Allow public read on scores" ON public.scores
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on scores" ON public.scores
    FOR INSERT WITH CHECK (true);

-- 초기 샘플 탐구 보고서 데이터 삽입
INSERT INTO public.posts (id, title, content, author, created_at, likes)
VALUES 
    ('post-1', '콜라 vs 오렌지주스 치아 부식 탐구 결과 공유!', 'pH 센서로 측정해 봤는데 콜라는 무려 pH 2.5까지 떨어지네요... 탄산수보다 훨씬 산성이 강해서 법랑질 부식 위험이 높다는 걸 MBL 그래프로 직접 확인했습니다! 다들 탄산음료 마시고 바로 양치하지 말고 물로 헹구세요!', '화학탐구러_지우', NOW() - INTERVAL '2 hours', 18),
    ('post-2', '보일의 법칙 주사기 실험: P-V 반비례 곡선 대박', '무선 압력센서에 60mL 주사기 연결해서 부피를 20mL까지 압축하니까 기압이 101.3kPa에서 280kPa 가까이 치솟았어요! P*V 곱이 거의 일정하게 나오는 거 보고 교과서 수식이 그대로 맞아서 소름 돋았습니다.', '물리만점_서연', NOW() - INTERVAL '5 hours', 24),
    ('post-3', '염화칼슘 핫팩 발열 반응과 질산암모늄 쿨팩 흡열 반응 비교', '온도센서 반응속도가 빨라서 용해되자마자 온도가 48도까지 올라가는 발열 피크가 확연히 보이네요. 반대로 질산암모늄은 11도까지 뚝 떨어짐! 흡열 반응 엔탈피 변화(ΔH > 0) 완벽 이해 완료!', '실험실요정_하은', NOW() - INTERVAL '12 hours', 31)
ON CONFLICT (id) DO NOTHING;

-- 초기 샘플 랭킹 데이터 삽입
INSERT INTO public.scores (id, nickname, score, played_at)
VALUES 
    ('score-1', '사이언스퀸_민서', 980, NOW() - INTERVAL '30 minutes'),
    ('score-2', '화학마스터_예린', 950, NOW() - INTERVAL '75 minutes'),
    ('score-3', 'MBL탐험가_채원', 920, NOW() - INTERVAL '2 hours'),
    ('score-4', '뉴턴의사과_수아', 880, NOW() - INTERVAL '4 hours'),
    ('score-5', '센서장인_유진', 840, NOW() - INTERVAL '6 hours')
ON CONFLICT (id) DO NOTHING;
