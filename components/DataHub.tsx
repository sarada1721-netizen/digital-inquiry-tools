'use client';

import React, { useState } from 'react';
import { EXPERIMENTS, SENSORS } from '@/lib/sensorsData';
import { BookOpen, BarChart3, Download, Layers, CheckCircle2, Sparkles, Filter } from 'lucide-react';

export default function DataHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredExperiments = selectedCategory === 'all'
    ? EXPERIMENTS
    : EXPERIMENTS.filter((e) => e.sensorType === selectedCategory);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl brutal-box p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-sky-300 border-2 border-black flex items-center justify-center shadow-brutal-sm">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">
              MBL 과학 데이터 분석 허브
            </h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            고2 화학, 물리, 지구과학 교과서에 수록된 핵심 탐구 데이터셋과 수치 해석 모델
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 dark:bg-gray-700/60 p-1.5 rounded-2xl border-2 border-black dark:border-white">
          {[
            { id: 'all', label: '전체 센서' },
            { id: 'ph', label: 'pH' },
            { id: 'temperature', label: '온도' },
            { id: 'pressure', label: '기압' },
            { id: 'conductivity', label: '전도도' },
            { id: 'motion', label: '운동' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedCategory(item.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                selectedCategory === item.id
                  ? 'bg-sky-400 text-black border border-black shadow-[1px_1px_0px_#000] font-black'
                  : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Experiment Cards with Scientific Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExperiments.map((exp) => {
          const sensor = SENSORS.find((s) => s.id === exp.sensorType);
          return (
            <div
              key={exp.id}
              className="bg-white dark:bg-gray-800 rounded-3xl brutal-box p-5 flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-brutal-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300">
                    {sensor?.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {exp.curriculum.split(' - ')[0]}
                  </span>
                </div>

                <h3 className="font-black text-base text-black dark:text-white leading-snug">
                  {exp.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-3 leading-relaxed">
                  {exp.description}
                </p>

                {exp.formula && (
                  <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900/60 rounded-xl font-mono text-[11px] text-gray-700 dark:text-gray-300 border border-dashed border-gray-300 dark:border-gray-700">
                    <strong>관계식:</strong> {exp.formula}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-500 font-mono">
                  {sensor?.accuracy}
                </span>
                <span className="font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  실시간 연동 가능
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
