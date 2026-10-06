'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SensorSelector from '@/components/SensorSelector';
import ExperimentTopics from '@/components/ExperimentTopics';
import SimulationWorkbench from '@/components/SimulationWorkbench';
import CommunityBoard from '@/components/CommunityBoard';
import QuizRanking from '@/components/QuizRanking';
import DataHub from '@/components/DataHub';
import { EXPERIMENTS } from '@/lib/sensorsData';
import { SensorType, Experiment } from '@/lib/types';
import { Sparkles, Compass, Heart, Layers, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<'lab' | 'data' | 'community' | 'ranking'>('lab');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedSensor, setSelectedSensor] = useState<SensorType>('ph');
  const [currentExperiment, setCurrentExperiment] = useState<Experiment>(EXPERIMENTS[0]);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // When sensor changes, pick first experiment of that sensor
  const handleSensorChange = (sensor: SensorType) => {
    setSelectedSensor(sensor);
    const firstExp = EXPERIMENTS.find((e) => e.sensorType === sensor);
    if (firstExp) {
      setCurrentExperiment(firstExp);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden">
      {/* AURORA MESH BACKGROUND BLOBS */}
      <div className="aurora-blob w-[500px] h-[500px] -top-32 -left-32 bg-pink-400/30 animate-aurora"></div>
      <div className="aurora-blob w-[450px] h-[450px] top-64 -right-24 bg-purple-400/30 animate-aurora" style={{ animationDelay: '-5s' }}></div>
      <div className="aurora-blob w-[600px] h-[600px] -bottom-48 left-1/3 bg-cyan-400/25 animate-aurora" style={{ animationDelay: '-10s' }}></div>
      <div className="aurora-blob w-[400px] h-[400px] top-1/2 left-10 bg-amber-300/25 animate-aurora" style={{ animationDelay: '-15s' }}></div>

      {/* Main Wrapper */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Hero Section Banner (Compact, Swiss typography + Neo-brutalism) */}
        <div className="max-w-7xl mx-auto w-full px-4 pt-6 pb-2">
          <div className="bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-sky dark:from-indigo-950/60 dark:via-purple-950/60 dark:to-pink-950/60 rounded-3xl brutal-box p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-brutal">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-gray-800 border-2 border-black dark:border-white text-xs font-black shadow-brutal-sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>2022 개정 교육과정 고2 과학탐구실험 / 화학 I / 물리학 I 연계</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black dark:text-white tracking-tight leading-tight">
                가상 MBL 센서와 함께하는 <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-300 dark:to-cyan-300">
                  인터랙티브 과학 탐구 플랫폼
                </span>
              </h1>
              <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium max-w-2xl leading-relaxed">
                PASCO 무선 센서(pH, 온도, 기압, 전기전도도, 스마트 카트)를 마우스 클릭만으로 실시간 연동하고, 실험 데이터의 순간적인 수치 변화를 인터랙티브 그래프와 표로 직관적으로 분석해 보세요.
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="bg-white dark:bg-gray-800 p-3.5 rounded-2xl border-2 border-black dark:border-white shadow-brutal-sm text-center">
                <div className="font-mono text-2xl font-black text-pink-600 dark:text-pink-400">5+</div>
                <div className="text-[11px] font-bold text-gray-600 dark:text-gray-300">가상 MBL 센서</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3.5 rounded-2xl border-2 border-black dark:border-white shadow-brutal-sm text-center">
                <div className="font-mono text-2xl font-black text-purple-600 dark:text-purple-400">10+</div>
                <div className="text-[11px] font-bold text-gray-600 dark:text-gray-300">시뮬레이션 주제</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3.5 rounded-2xl border-2 border-black dark:border-white shadow-brutal-sm text-center">
                <div className="font-mono text-2xl font-black text-sky-600 dark:text-sky-400">100%</div>
                <div className="text-[11px] font-bold text-gray-600 dark:text-gray-300">실시간 데이터 시각화</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3.5 rounded-2xl border-2 border-black dark:border-white shadow-brutal-sm text-center">
                <div className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">icn1</div>
                <div className="text-[11px] font-bold text-gray-600 dark:text-gray-300">서울 리전 가속</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
          {currentTab === 'lab' && (
            <div className="space-y-6">
              {/* 1. MBL Sensor Selector */}
              <SensorSelector
                selectedSensor={selectedSensor}
                onSelectSensor={handleSensorChange}
              />

              {/* 2. Experiment Topics for selected sensor */}
              <ExperimentTopics
                selectedSensor={selectedSensor}
                selectedExperimentId={currentExperiment.id}
                onSelectExperiment={(exp) => setCurrentExperiment(exp)}
              />

              {/* 3. Interactive Simulation Workbench with Hardware Gauge, Graphs & Tables */}
              <SimulationWorkbench
                experiment={currentExperiment}
              />
            </div>
          )}

          {currentTab === 'data' && <DataHub />}

          {currentTab === 'community' && <CommunityBoard />}

          {currentTab === 'ranking' && <QuizRanking />}
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-black dark:border-white bg-white/80 dark:bg-gray-900/90 py-6 px-4 mt-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-black text-black dark:text-white">디지털 탐구 도구</span>
            <span>· PASCO MBL Simulation Engine</span>
            <span>· Vercel Seoul (icn1) Optimized</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-pink-600 font-bold">
              Made with <Heart className="w-3.5 h-3.5 fill-pink-500" /> for High School Science
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
