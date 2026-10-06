'use client';

import React from 'react';
import { EXPERIMENTS, SENSORS } from '@/lib/sensorsData';
import { SensorType, Experiment } from '@/lib/types';
import { Play, Sparkles, BookOpen, Atom, ArrowRight } from 'lucide-react';

interface ExperimentTopicsProps {
  selectedSensor: SensorType;
  selectedExperimentId: string;
  onSelectExperiment: (experiment: Experiment) => void;
}

export default function ExperimentTopics({
  selectedSensor,
  selectedExperimentId,
  onSelectExperiment,
}: ExperimentTopicsProps) {
  const currentSensor = SENSORS.find((s) => s.id === selectedSensor);
  const topics = EXPERIMENTS.filter((exp) => exp.sensorType === selectedSensor);

  return (
    <div className="w-full mt-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-500 animate-ping"></div>
          <h3 className="text-lg font-black text-black dark:text-white">
            {currentSensor?.name} 추천 탐구 주제 ({topics.length}개)
          </h3>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          측정 범위: {currentSensor?.range} · 정밀도: {currentSensor?.accuracy}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((exp) => {
          const isCurrent = selectedExperimentId === exp.id;
          return (
            <div
              key={exp.id}
              onClick={() => onSelectExperiment(exp)}
              className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between relative ${
                isCurrent
                  ? 'bg-white dark:bg-gray-800 brutal-box border-3 border-black dark:border-white shadow-brutal ring-2 ring-pink-400'
                  : 'bg-white/80 dark:bg-gray-800/80 clay-card border-2 border-transparent hover:border-black dark:hover:border-gray-400 hover:shadow-md'
              }`}
            >
              <div>
                {/* Badge & Curriculum tag */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800">
                    {exp.badge}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 font-mono">
                    <BookOpen className="w-3 h-3" />
                    {exp.curriculum.split(' - ')[0]}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h4 className="font-extrabold text-base text-black dark:text-white leading-snug">
                  {exp.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {exp.subtitle}
                </p>

                {/* Formula pill if available */}
                {exp.formula && (
                  <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 font-mono text-[11px] text-gray-700 dark:text-gray-300 flex items-center gap-1.5 overflow-x-auto">
                    <Atom className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{exp.formula}</span>
                  </div>
                )}
              </div>

              {/* Action footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {isCurrent ? '현재 실행 중인 시뮬레이션' : '시뮬레이션 불러오기'}
                </span>
                <button
                  type="button"
                  className={`flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl border-2 border-black dark:border-white transition-transform ${
                    isCurrent
                      ? 'bg-brutal-yellow text-black shadow-brutal-sm scale-105'
                      : 'bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-yellow-200'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  {isCurrent ? '실험 중' : '시작'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
