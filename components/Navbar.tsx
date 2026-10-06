'use client';

import React from 'react';
import { Sparkles, Sun, Moon, Database, Activity, BookOpen, Trophy, MessageSquare } from 'lucide-react';

interface NavbarProps {
  currentTab: 'lab' | 'data' | 'community' | 'ranking';
  setCurrentTab: (tab: 'lab' | 'data' | 'community' | 'ranking') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  isDarkMode,
  setIsDarkMode,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 px-4 py-3 backdrop-blur-md bg-white/75 dark:bg-gray-900/80 border-b-2 border-black dark:border-white transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and Identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-400 via-purple-400 to-cyan-400 p-0.5 brutal-box flex items-center justify-center shadow-brutal-sm">
            <Activity className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-black dark:text-white">
                디지털 탐구 도구
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brutal-yellow text-black border border-black shadow-[1px_1px_0px_#000]">
                MBL LAB
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
              고2 맞춤 가상 센서 인터랙티브 과학 교구
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border-2 border-black dark:border-white shadow-brutal-sm">
          <button
            onClick={() => setCurrentTab('lab')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              currentTab === 'lab'
                ? 'bg-pink-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            가상 센서 실험실
          </button>

          <button
            onClick={() => setCurrentTab('data')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              currentTab === 'data'
                ? 'bg-sky-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            데이터 분석 허브
          </button>

          <button
            onClick={() => setCurrentTab('community')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              currentTab === 'community'
                ? 'bg-emerald-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            탐구 보고서 게시판
          </button>

          <button
            onClick={() => setCurrentTab('ranking')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              currentTab === 'ranking'
                ? 'bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            사이언스 챌린지
          </button>
        </nav>

        {/* Right side: Region indicator & Dark mode toggle */}
        <div className="flex items-center gap-2">
          {/* Region Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Seoul (icn1) RTT 5ms</span>
          </div>

          {/* Dark Mode Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="테마 전환"
            className="w-10 h-10 rounded-xl bg-pastel-butter dark:bg-gray-800 flex items-center justify-center brutal-btn border-2 border-black dark:border-white text-black dark:text-white"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-700" />}
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden items-center justify-around gap-1 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setCurrentTab('lab')}
          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg ${
            currentTab === 'lab' ? 'bg-pink-300 text-black border border-black' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          실험실
        </button>
        <button
          onClick={() => setCurrentTab('data')}
          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg ${
            currentTab === 'data' ? 'bg-sky-300 text-black border border-black' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          데이터
        </button>
        <button
          onClick={() => setCurrentTab('community')}
          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg ${
            currentTab === 'community' ? 'bg-emerald-300 text-black border border-black' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          게시판
        </button>
        <button
          onClick={() => setCurrentTab('ranking')}
          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg ${
            currentTab === 'ranking' ? 'bg-yellow-300 text-black border border-black' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          챌린지
        </button>
      </div>
    </header>
  );
}
