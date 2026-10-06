'use client';

import React, { useState, useEffect } from 'react';
import { ScoreItem } from '@/lib/types';
import { Trophy, Award, CheckCircle, HelpCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const QUIZ_QUESTIONS = [
  {
    q: 'PASCO 무선 pH 센서로 측정한 결과, 콜라(pH 2.5)와 생수(pH 7.0) 중 수소 이온 농도([H+])의 차이는 몇 배일까요?',
    options: ['약 4.5배', '약 100배', '약 31,600배 (10^4.5배)', '약 1,000배'],
    answer: 2,
    explanation: 'pH는 로그 스케일(-log[H+])이므로 pH 차이가 4.5이면 수소 이온 농도는 10^4.5 ≈ 31,622배 차이납니다!',
  },
  {
    q: '밀폐된 주사기를 압축하여 기체 부피(V)를 절반(1/2)으로 줄였을 때, 보일의 법칙에 따라 기압(P)은 어떻게 변할까요?',
    options: ['1/2로 감소한다', '2배로 증가한다', '4배로 증가한다', '온도가 일정하므로 변하지 않는다'],
    answer: 1,
    explanation: '보일의 법칙(P·V = k)에 의해 일정 온도에서 기체의 압력과 부피는 반비례하므로, 부피가 1/2이 되면 압력은 2배가 됩니다.',
  },
  {
    q: '고정밀 온도 센서로 염화칼슘(CaCl2) 용해 반응을 측정했을 때 온도가 22℃에서 46℃로 상승했습니다. 이 반응의 열역학적 특징은?',
    options: ['흡열 반응 (ΔH > 0)', '발열 반응 (ΔH < 0)', '단열 팽창 반응', '상태 변화 잠열 반응'],
    answer: 1,
    explanation: '주위로 열을 방출하여 용액의 온도가 올라가는 것은 전형적인 발열 반응(Exothermic, ΔH < 0)으로 핫팩의 원리입니다.',
  },
  {
    q: '0.1M HCl 수용액 50mL에 0.1M NaOH 수용액을 뷰렛으로 적하할 때, 완전 중화(당량점)가 일어나는 NaOH 부피는?',
    options: ['25 mL', '50 mL', '100 mL', '75 mL'],
    answer: 1,
    explanation: '1가 산(HCl)과 1가 염기(NaOH)의 몰농도가 0.1M로 동일하므로 정확히 50mL 적하되었을 때 H+와 OH-의 몰수가 같아져 당량점에 도달합니다.',
  },
  {
    q: '무선 스마트 카트에 가해지는 외력(F)을 2배로 늘리고, 카트의 질량(m)을 2배로 늘렸을 때 가속도(a)의 변화는?',
    options: ['4배가 된다', '2배가 된다', '변함없이 그대로이다', '1/2배가 된다'],
    answer: 2,
    explanation: '뉴턴 운동 제2법칙 a = F / m에 의해 힘과 질량이 모두 2배가 되면 (2F)/(2m) = F/m으로 가속도는 일정하게 유지됩니다.',
  },
];

export default function QuizRanking() {
  const [scores, setScores] = useState<ScoreItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/scores');
      const data = await res.json();
      if (data.scores) {
        setScores(data.scores);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === QUIZ_QUESTIONS[currentIdx].answer) {
      setScore((s) => s + 200); // 200 points per question
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsFinished(false);
    setScore(0);
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, score }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchScores();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl brutal-box p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-yellow-300 border-2 border-black flex items-center justify-center shadow-brutal-sm">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">
              MBL 사이언스 퀴즈 챌린지 & 실시간 랭킹
            </h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            직접 진행한 MBL 센서 실험 원리를 퀴즈로 풀고 최고 점수 명예의 전당에 이름을 올려보세요!
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pastel-butter text-black border-2 border-black font-mono font-black text-sm shadow-brutal-sm">
          <span>획득 점수:</span>
          <span className="text-pink-600 text-base">{score}점</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quiz Box (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl brutal-box p-6 flex flex-col justify-between">
          {!isFinished ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 mb-4">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-300">
                  문제 {currentIdx + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs font-mono text-gray-500">
                  배점: 각 200점 (총 1,000점 만점)
                </span>
              </div>

              <h3 className="font-extrabold text-base text-black dark:text-white leading-relaxed mb-4">
                {QUIZ_QUESTIONS[currentIdx].q}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {QUIZ_QUESTIONS[currentIdx].options.map((opt, i) => {
                  const isCorrect = i === QUIZ_QUESTIONS[currentIdx].answer;
                  const isSelected = selectedOption === i;
                  let btnStyle = 'bg-gray-50 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200';

                  if (showExplanation) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-300 text-black border-black shadow-brutal-sm font-black';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-200 text-black border-black font-bold';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-yellow-200 text-black border-black';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      disabled={showExplanation}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all font-medium text-xs flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{i + 1}. {opt}</span>
                      {showExplanation && isCorrect && <CheckCircle className="w-4 h-4 text-black" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs">
                  <div className="font-black text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    해설 및 핵심 개념
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {QUIZ_QUESTIONS[currentIdx].explanation}
                  </p>
                </div>
              )}

              {/* Next button */}
              {showExplanation && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-brutal-yellow text-black font-black text-xs brutal-btn border-2 border-black shadow-brutal-sm"
                  >
                    <span>{currentIdx + 1 === QUIZ_QUESTIONS.length ? '최종 결과 확인' : '다음 문제'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-yellow-300 mx-auto flex items-center justify-center border-3 border-black shadow-brutal">
                <Award className="w-9 h-9 text-black" />
              </div>
              <h3 className="text-2xl font-black text-black dark:text-white">
                축하합니다! 챌린지 완주
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                당신의 최종 과학 탐구 점수는 <strong className="text-pink-600 font-black text-lg">{score}점</strong> 입니다!
              </p>

              {/* Submit score form */}
              <form onSubmit={handleSubmitScore} className="max-w-xs mx-auto space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="명예의 전당 닉네임 입력"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-center font-bold text-sm"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-pink-400 text-black font-black text-xs brutal-btn border-2 border-black shadow-brutal-sm disabled:opacity-50"
                >
                  {isSubmitting ? '등록 중...' : '랭킹 보드에 등록하기 🏆'}
                </button>
              </form>

              <div className="pt-3">
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black dark:hover:text-white font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  다시 도전하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Leaderboard (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl brutal-box p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="font-black text-base text-black dark:text-white">
                전국 고2 명예의 전당
              </h3>
            </div>
            <span className="text-[11px] text-gray-400 font-mono">TOP 10</span>
          </div>

          <div className="space-y-2 mt-4 max-h-[360px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-xs text-gray-400">랭킹을 불러오는 중...</div>
            ) : scores.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">첫 득점자가 되어보세요!</div>
            ) : (
              scores.map((item, idx) => {
                let badge = `${idx + 1}`;
                let badgeStyle = 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
                if (idx === 0) {
                  badge = '🥇 1위';
                  badgeStyle = 'bg-yellow-300 text-black font-black border border-black shadow-[1px_1px_0px_#000]';
                } else if (idx === 1) {
                  badge = '🥈 2위';
                  badgeStyle = 'bg-slate-200 text-black font-black border border-black shadow-[1px_1px_0px_#000]';
                } else if (idx === 2) {
                  badge = '🥉 3위';
                  badgeStyle = 'bg-amber-200 text-black font-black border border-black shadow-[1px_1px_0px_#000]';
                }

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeStyle}`}>
                        {badge}
                      </span>
                      <span className="font-extrabold text-xs text-black dark:text-white truncate max-w-[120px]">
                        {item.nickname}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-pink-600 text-xs">
                        {item.score} pt
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-700 text-[10px] text-gray-400 font-mono text-center">
            Supabase 서울 리전(ap-northeast-2) 데이터베이스 연동
          </div>
        </div>
      </div>
    </div>
  );
}
