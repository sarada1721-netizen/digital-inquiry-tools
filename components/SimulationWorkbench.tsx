'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Experiment, DataPoint, SensorType } from '@/lib/types';
import { SENSORS } from '@/lib/sensorsData';
import ChartVisualization from './ChartVisualization';
import DataTable from './DataTable';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Info,
  Flame,
  Snowflake,
  Beaker,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface SimulationWorkbenchProps {
  experiment: Experiment;
  onDataCollected?: (data: DataPoint[]) => void;
}

export default function SimulationWorkbench({
  experiment,
  onDataCollected,
}: SimulationWorkbenchProps) {
  const sensor = SENSORS.find((s) => s.id === experiment.sensorType)!;

  // Live state
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [currentValue, setCurrentValue] = useState<number>(7.0);
  const [activeView, setActiveView] = useState<'both' | 'chart' | 'table'>('both');
  const [samplingHz, setSamplingHz] = useState<number>(2); // 2 points per sec

  // Sub-experiment parameters
  // pH Beverage
  const [selectedBeverage, setSelectedBeverage] = useState<'cola' | 'juice' | 'sparkling' | 'milk' | 'water' | 'baking' | 'soap'>('cola');
  
  // pH Titration
  const [naohVolume, setNaohVolume] = useState<number>(0);
  
  // pH Antacid
  const [antacidType, setAntacidType] = useState<'none' | 'caco3' | 'mgoh2' | 'nahco3'>('none');
  
  // Temp Reaction
  const [solute, setSolute] = useState<'cacl2' | 'nh4no3' | 'none'>('cacl2');
  
  // Temp Greenhouse
  const [lampOn, setLampOn] = useState<boolean>(true);
  const [gasType, setGasType] = useState<'air' | 'co2'>('co2');

  // Temp Latent
  const [liquidType, setLiquidType] = useState<'water' | 'ethanol'>('water');
  const [heaterPower, setHeaterPower] = useState<number>(100);

  // Boyle's Law
  const [syringeVolume, setSyringeVolume] = useState<number>(40); // 20 to 60 mL

  // H2O2 decomposition
  const [catalystAdded, setCatalystAdded] = useState<boolean>(false);

  // Conductivity
  const [condLiquid, setCondLiquid] = useState<'distilled' | 'sugar' | 'tap' | 'vinegar' | 'sports' | 'salt'>('salt');

  // Motion Newton
  const [cartMass, setCartMass] = useState<number>(500); // grams
  const [pullForce, setPullForce] = useState<number>(2.0); // N

  // Simulation time
  const timeRef = useRef<number>(0);

  // Reset experiment data when experiment changes
  useEffect(() => {
    setDataPoints([]);
    timeRef.current = 0;
    setIsRunning(true);

    if (experiment.id === 'ph-beverage') {
      setCurrentValue(2.5);
    } else if (experiment.id === 'ph-titration') {
      setNaohVolume(0);
      setCurrentValue(1.0);
    } else if (experiment.id === 'ph-antacid') {
      setAntacidType('none');
      setCurrentValue(1.5);
    } else if (experiment.id === 'temp-reaction') {
      setSolute('cacl2');
      setCurrentValue(22.0);
    } else if (experiment.id === 'temp-greenhouse') {
      setCurrentValue(20.0);
    } else if (experiment.id === 'temp-latent') {
      setCurrentValue(20.0);
    } else if (experiment.id === 'pressure-boyle') {
      setSyringeVolume(40);
      setCurrentValue(101.3);
    } else if (experiment.id === 'pressure-decomposition') {
      setCatalystAdded(false);
      setCurrentValue(101.3);
    } else if (experiment.id === 'conductivity-electrolyte') {
      setCurrentValue(8500);
    } else if (experiment.id === 'motion-newton') {
      setCurrentValue(pullForce / (cartMass / 1000));
    }
  }, [experiment.id]);

  // Periodic simulation tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      timeRef.current += 1 / samplingHz;
      const t = timeRef.current;
      let val = currentValue;
      let label = '';

      // Experiment 1: pH Beverage
      if (experiment.id === 'ph-beverage') {
        const beverageValues: Record<string, { ph: number; label: string }> = {
          cola: { ph: 2.5, label: '콜라 (pH 2.5 - 법랑질 급속 부식 위험)' },
          juice: { ph: 3.5, label: '오렌지주스 (pH 3.5 - 구연산 함유)' },
          sparkling: { ph: 4.5, label: '탄산수 (pH 4.5 - 탄산 H2CO3)' },
          milk: { ph: 6.6, label: '우유 (pH 6.6 - 약산성/중성)' },
          water: { ph: 7.0, label: '순수한 물 (pH 7.0 - 중성 안전)' },
          baking: { ph: 8.5, label: '베이킹소다수 (pH 8.5 - 약염기성)' },
          soap: { ph: 10.0, label: '비눗물 (pH 10.0 - 강한 염기성)' },
        };
        const target = beverageValues[selectedBeverage].ph;
        // smooth sensor drift + small noise
        val = Number((val + (target - val) * 0.35 + (Math.random() - 0.5) * 0.04).toFixed(2));
        label = beverageValues[selectedBeverage].label;
      }

      // Experiment 2: pH Titration
      else if (experiment.id === 'ph-titration') {
        // Equivalence point at 50mL
        const v = naohVolume;
        if (v < 48) {
          val = 1.0 + Math.log10(50 / (50 - v + 0.1)) * 0.35;
        } else if (v >= 48 && v <= 52) {
          // Sharp inflection around pH 7
          val = 1.0 + (v - 48) * 3.0;
        } else {
          val = 12.0 + Math.min(1.5, Math.log10(v - 50 + 1) * 0.4);
        }
        val = Number(Math.max(1.0, Math.min(13.5, val + (Math.random() - 0.5) * 0.05)).toFixed(2));
        label = `NaOH ${v.toFixed(1)}mL 적하 (당량점 50mL 기준)`;
      }

      // Experiment 3: pH Antacid
      else if (experiment.id === 'ph-antacid') {
        let target = 1.5;
        if (antacidType === 'caco3') target = 4.2;
        if (antacidType === 'mgoh2') target = 5.0;
        if (antacidType === 'nahco3') target = 6.2;
        val = Number((val + (target - val) * 0.2 + (Math.random() - 0.5) * 0.03).toFixed(2));
        label = antacidType === 'none' ? '인공 위산만 존재' : `제산제(${antacidType.toUpperCase()}) 중화 완충 작용`;
      }

      // Experiment 4: Temp Reaction
      else if (experiment.id === 'temp-reaction') {
        let target = 22.0;
        if (solute === 'cacl2') target = 46.5; // Exothermic hot pack
        if (solute === 'nh4no3') target = 11.2; // Endothermic ice pack
        val = Number((val + (target - val) * 0.25 + (Math.random() - 0.5) * 0.1).toFixed(1));
        label = solute === 'cacl2' ? '염화칼슘 용해 발열 반응(ΔH < 0)' : '질산암모늄 용해 흡열 반응(ΔH > 0)';
      }

      // Experiment 5: Temp Greenhouse
      else if (experiment.id === 'temp-greenhouse') {
        let equilibrium = 22.0;
        if (lampOn) {
          equilibrium = gasType === 'co2' ? 38.5 : 29.0;
        }
        val = Number((val + (equilibrium - val) * 0.15 + (Math.random() - 0.5) * 0.08).toFixed(1));
        label = lampOn ? `${gasType.toUpperCase()} 충진 + 할로겐 복사 가열` : '램프 소등 (복사 냉각 중)';
      }

      // Experiment 6: Temp Latent
      else if (experiment.id === 'temp-latent') {
        // Ethanol heats up much faster than water due to lower specific heat
        const rate = (heaterPower / 100) * (liquidType === 'ethanol' ? 1.8 : 0.9);
        val = Number(Math.min(liquidType === 'ethanol' ? 78.3 : 100, val + rate * 0.3 + (Math.random() - 0.5) * 0.05).toFixed(1));
        label = `${liquidType === 'water' ? '물 (비열 4.18 J/g·℃)' : '에탄올 (비열 2.44 J/g·℃)'} 가열 중`;
      }

      // Experiment 7: Boyle's Law
      else if (experiment.id === 'pressure-boyle') {
        // P * V = 4052 (at 40mL, P = 101.3 kPa)
        const targetP = (101.3 * 40) / syringeVolume;
        val = Number((val + (targetP - val) * 0.4 + (Math.random() - 0.5) * 0.2).toFixed(1));
        label = `주사기 실린더 부피 ${syringeVolume}mL (P·V = ${(val * syringeVolume).toFixed(0)} kPa·mL)`;
      }

      // Experiment 8: H2O2 decomposition
      else if (experiment.id === 'pressure-decomposition') {
        if (catalystAdded) {
          const maxP = 210;
          val = Number(Math.min(maxP, val + 3.5 * Math.exp(-t * 0.08) + (Math.random() - 0.5) * 0.3).toFixed(1));
          label = 'MnO2 촉매 산소(O2) 기체 방출 압력 급상승 중';
        } else {
          val = 101.3;
          label = '과산화수소 용액 밀폐 (촉매 미투입 대기)';
        }
      }

      // Experiment 9: Conductivity
      else if (experiment.id === 'conductivity-electrolyte') {
        const condMap: Record<string, { val: number; label: string }> = {
          distilled: { val: 2.1, label: '증류수 (비전해질, 이온 극소)' },
          sugar: { val: 5.4, label: '설탕물 (비전해질, 분자 상태 용해)' },
          tap: { val: 180, label: '수돗물 (미네랄 이온 약간 포함)' },
          vinegar: { val: 860, label: '식초 (약전해질, 아세트산 일부 이온화)' },
          sports: { val: 2450, label: '이온음료 (전해질 Na+, K+ 풍부)' },
          salt: { val: 8900, label: '소금물 1% (강전해질 NaCl 100% 완전 전리)' },
        };
        const target = condMap[condLiquid].val;
        val = Number((val + (target - val) * 0.4 + (Math.random() - 0.5) * 1.5).toFixed(1));
        label = condMap[condLiquid].label;
      }

      // Experiment 10: Motion Newton
      else if (experiment.id === 'motion-newton') {
        // a = F / m
        const a = pullForce / (cartMass / 1000);
        val = Number((a + (Math.random() - 0.5) * 0.05).toFixed(2));
        label = `카트 질량 ${cartMass}g, 당기는 힘 ${pullForce}N (a = F/m)`;
      }

      setCurrentValue(val);

      setDataPoints((prev) => {
        const updated = [...prev, { time: Number(t.toFixed(1)), value: val, label }];
        // Limit to 60 points max
        if (updated.length > 60) return updated.slice(updated.length - 60);
        return updated;
      });
    }, 1000 / samplingHz);

    return () => clearInterval(interval);
  }, [
    isRunning,
    samplingHz,
    experiment.id,
    currentValue,
    selectedBeverage,
    naohVolume,
    antacidType,
    solute,
    lampOn,
    gasType,
    liquidType,
    heaterPower,
    syringeVolume,
    catalystAdded,
    condLiquid,
    cartMass,
    pullForce,
  ]);

  const handleClear = () => {
    setDataPoints([]);
    timeRef.current = 0;
  };

  // Helper for pH color
  const getUniversalIndicatorColor = (ph: number) => {
    if (ph < 3.0) return '#ef4444'; // deep red
    if (ph < 5.0) return '#f97316'; // orange
    if (ph < 6.5) return '#eab308'; // yellow
    if (ph < 7.5) return '#22c55e'; // green (neutral)
    if (ph < 9.0) return '#06b6d4'; // cyan
    if (ph < 11.0) return '#3b82f6'; // blue
    return '#8b5cf6'; // purple
  };

  return (
    <div className="w-full mt-6 space-y-6">
      {/* Top Banner: Experiment Title & Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl brutal-box p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-pink-400 text-black border border-black shadow-[1px_1px_0px_#000]">
                {experiment.badge}
              </span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 font-mono">
                {sensor.model}
              </span>
            </div>
            <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">
              {experiment.title}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {experiment.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-sm brutal-btn border-2 border-black ${
                isRunning
                  ? 'bg-amber-300 text-black shadow-brutal-sm'
                  : 'bg-emerald-400 text-black shadow-brutal-sm'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              {isRunning ? '측정 일시정지' : '실시간 측정 재개'}
            </button>

            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-bold text-xs brutal-btn border-2 border-black dark:border-white"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </button>

            {/* View switcher */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl border-2 border-black dark:border-white">
              <button
                onClick={() => setActiveView('both')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  activeView === 'both' ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm' : 'text-gray-500'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setActiveView('chart')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  activeView === 'chart' ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm' : 'text-gray-500'
                }`}
              >
                그래프
              </button>
              <button
                onClick={() => setActiveView('table')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  activeView === 'table' ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm' : 'text-gray-500'
                }`}
              >
                표
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Virtual MBL Hardware + Interactive Experiment Rig */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: PASCO Virtual Hardware Sensor (4 Cols) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-gray-900 to-gray-950 text-white rounded-3xl p-5 border-3 border-black shadow-brutal flex flex-col justify-between relative overflow-hidden">
          {/* Subtle sensor background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <div>
            {/* Sensor Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-extrabold text-xs tracking-wider text-emerald-400 uppercase">
                  PASCO WIRELESS MBL
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                <span>BAT: 98%</span>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </div>
            </div>

            {/* High-Precision LCD Readout Screen */}
            <div className="mt-4 p-4 rounded-2xl bg-black border-2 border-gray-700 shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mb-1">
                <span>CHANNEL 1: {sensor.name}</span>
                <span className="text-yellow-400 animate-pulse font-bold">● LIVE</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-5xl font-black text-cyan-400 tracking-tight drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
                  {currentValue.toFixed(2)}
                </span>
                <span className="text-xl font-black text-cyan-200 font-mono ml-2">
                  {sensor.unit}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>범위: {sensor.range}</span>
                <span>오차: {sensor.accuracy}</span>
              </div>
            </div>

            {/* Sampling Frequency Controls */}
            <div className="mt-4 p-3 rounded-xl bg-gray-900/80 border border-gray-800">
              <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-2">
                <span>센서 샘플링 속도</span>
                <span className="font-mono text-cyan-400">{samplingHz} Hz ({samplingHz}회/초)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 5].map((hz) => (
                  <button
                    key={hz}
                    onClick={() => setSamplingHz(hz)}
                    className={`py-1 rounded-lg text-xs font-bold transition border ${
                      samplingHz === hz
                        ? 'bg-cyan-500 text-black border-cyan-400 font-black'
                        : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                    }`}
                  >
                    {hz} Hz
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Curriculum Tip Card */}
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-700/50 text-xs">
            <div className="flex items-center gap-1.5 text-pink-300 font-extrabold mb-1">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>고2 탐구 팁</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              {experiment.curriculum} 연계: 실제 MBL 센서는 화학 반응이나 역학 운동의 순간 변화를 초당 수십 회 기록하여 육안으로 볼 수 없는 미세한 과학적 원리를 밝혀냅니다.
            </p>
          </div>
        </div>

        {/* Right: Interactive Experiment Rig (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-3xl brutal-box p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-pink-500" />
              <h3 className="font-black text-base text-black dark:text-white">
                가상 실험 반응대 및 조작 제어기
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pastel-butter text-black border border-black shadow-[1px_1px_0px_#000]">
              인터랙티브 시뮬레이터
            </span>
          </div>

          {/* DYNAMIC EXPERIMENT CONTROLS */}
          <div className="py-4">
            {/* 1. pH Beverage Experiment */}
            {experiment.id === 'ph-beverage' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  아래 음료를 클릭하여 비커에 붓고 무선 pH 전극을 담가보세요:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'cola', name: '콜라', ph: 2.5, danger: '매우 위험' },
                    { id: 'juice', name: '오렌지주스', ph: 3.5, danger: '위험' },
                    { id: 'sparkling', name: '탄산수', ph: 4.5, danger: '주의' },
                    { id: 'milk', name: '우유', ph: 6.6, danger: '안전' },
                    { id: 'water', name: '생수', ph: 7.0, danger: '안전' },
                    { id: 'baking', name: '베이킹소다수', ph: 8.5, danger: '알칼리' },
                    { id: 'soap', name: '비눗물', ph: 10.0, danger: '강알칼리' },
                  ].map((bev) => (
                    <button
                      key={bev.id}
                      onClick={() => setSelectedBeverage(bev.id as any)}
                      className={`p-2.5 rounded-xl text-left border-2 transition-all ${
                        selectedBeverage === bev.id
                          ? 'bg-pink-300 text-black border-black shadow-brutal-sm scale-105'
                          : 'bg-gray-50 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="font-black text-xs">{bev.name}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                        기준 pH {bev.ph} · {bev.danger}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Beaker and Teeth Erosion Risk Display */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-pink-50 dark:from-gray-900/60 dark:to-pink-950/30 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4">
                  {/* Virtual Beaker */}
                  <div className="relative w-24 h-28 border-3 border-gray-600 rounded-b-2xl overflow-hidden bg-white/40 dark:bg-black/40 flex items-end justify-center shadow-md">
                    <div
                      className="w-full transition-all duration-500 rounded-b-xl flex items-center justify-center text-[10px] font-bold text-white shadow-inner"
                      style={{
                        height: '75%',
                        backgroundColor: getUniversalIndicatorColor(currentValue),
                      }}
                    >
                      pH {currentValue.toFixed(1)}
                    </div>
                    {/* Electrode stem */}
                    <div className="absolute top-0 w-2.5 h-16 bg-gray-800 dark:bg-gray-300 rounded-b-full shadow"></div>
                  </div>

                  {/* Scientific Evaluation */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-black dark:text-white mb-1">
                      {currentValue < 5.5 ? (
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                      <span>
                        치아 법랑질 임계 부식 판정: {currentValue < 5.5 ? '⚠️ 법랑질 탈회(부식) 진행!' : '✅ 치아 법랑질 안전'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      입안 pH가 5.5 이하로 내려가면 치아를 보호하는 하이드록시아파타이트 결정이 이온화되어 녹기 시작합니다. 콜라(pH 2.5)는 강한 산성으로 섭취 후 즉시 칫솔질하기보다 물로 헹구는 것이 과학적 권장사항입니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. pH Titration Experiment */}
            {experiment.id === 'ph-titration' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  0.1M HCl 50mL 삼각플라스크에 0.1M NaOH를 뷰렛으로 적하하세요 (당량점 = 50mL):
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setNaohVolume((v) => Math.min(100, v + 0.5))}
                    className="px-3 py-2 rounded-xl bg-pastel-butter text-black font-extrabold text-xs brutal-btn border-2 border-black"
                  >
                    + 0.5 mL 미세 적하
                  </button>
                  <button
                    onClick={() => setNaohVolume((v) => Math.min(100, v + 2.0))}
                    className="px-3 py-2 rounded-xl bg-pastel-butter text-black font-extrabold text-xs brutal-btn border-2 border-black"
                  >
                    + 2.0 mL 적하
                  </button>
                  <button
                    onClick={() => setNaohVolume((v) => Math.min(100, v + 10.0))}
                    className="px-3 py-2 rounded-xl bg-pink-300 text-black font-extrabold text-xs brutal-btn border-2 border-black"
                  >
                    + 10.0 mL 쾌속 주입
                  </button>
                  <button
                    onClick={() => setNaohVolume(0)}
                    className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-bold text-xs brutal-btn border-2 border-black dark:border-white"
                  >
                    뷰렛 리셋
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">누적 적하량</div>
                    <div className="text-2xl font-black text-rose-500 font-mono">{naohVolume.toFixed(1)} mL</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">페놀프탈레인 지시약</div>
                    <div className="text-sm font-black" style={{ color: naohVolume >= 49.5 ? '#e11d48' : '#6b7280' }}>
                      {naohVolume >= 49.5 ? '🌸 붉은색 (염기성 전환)' : '무색 (산성 유지)'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. pH Antacid Experiment */}
            {experiment.id === 'ph-antacid' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  인공 위산(pH 1.5)에 투여할 제산제 성분을 선택하여 중화 및 완충 곡선을 관찰하세요:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'caco3', name: '탄산칼슘 (CaCO3)', note: '속효성 + CO2 발생' },
                    { id: 'mgoh2', name: '수산화마그네슘 (Mg(OH)2)', note: '지속성 완충' },
                    { id: 'nahco3', name: '탄산수소나트륨 (NaHCO3)', note: '즉각 중화' },
                  ].map((ant) => (
                    <button
                      key={ant.id}
                      onClick={() => setAntacidType(ant.id as any)}
                      className={`p-3 rounded-2xl text-left border-2 transition-all ${
                        antacidType === ant.id
                          ? 'bg-fuchsia-300 text-black border-black shadow-brutal-sm scale-105'
                          : 'bg-gray-50 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="font-black text-xs">{ant.name}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{ant.note}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Temperature Reaction Experiment */}
            {experiment.id === 'temp-reaction' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  단열 열량계 속 물에 투입할 용질을 선택하여 화학 반응열(용해열)을 측정하세요:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSolute('cacl2')}
                    className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                      solute === 'cacl2'
                        ? 'bg-amber-200 text-black border-black shadow-brutal-sm scale-102'
                        : 'bg-gray-50 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-black text-sm">
                        <Flame className="w-4 h-4 text-orange-600" />
                        염화칼슘 (CaCl2)
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        발열 반응 · 핫팩 원리 (최대 46.5℃ 도달)
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSolute('nh4no3')}
                    className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                      solute === 'nh4no3'
                        ? 'bg-sky-200 text-black border-black shadow-brutal-sm scale-102'
                        : 'bg-gray-50 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-black text-sm">
                        <Snowflake className="w-4 h-4 text-sky-600" />
                        질산암모늄 (NH4NO3)
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        흡열 반응 · 아이스팩 원리 (11.2℃로 냉각)
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 5. Temperature Greenhouse Experiment */}
            {experiment.id === 'temp-greenhouse' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  밀폐 플라스크 내 온실기체와 할로겐 램프 복사열에 의한 지구 온난화 모델링:
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setGasType(gasType === 'air' ? 'co2' : 'air')}
                    className={`px-4 py-2.5 rounded-2xl font-black text-xs brutal-btn border-2 border-black ${
                      gasType === 'co2' ? 'bg-orange-300 text-black shadow-brutal-sm' : 'bg-gray-100 text-black'
                    }`}
                  >
                    충진 기체: {gasType === 'co2' ? '이산화탄소 (CO2 100%)' : '일반 공기 (대기 400ppm)'}
                  </button>

                  <button
                    onClick={() => setLampOn(!lampOn)}
                    className={`px-4 py-2.5 rounded-2xl font-black text-xs brutal-btn border-2 border-black ${
                      lampOn ? 'bg-yellow-300 text-black shadow-brutal-sm' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    할로겐 복사 램프: {lampOn ? '☀️ 점등 중' : '소등 상태'}
                  </button>
                </div>
              </div>
            )}

            {/* 6. Pressure Boyle's Law */}
            {experiment.id === 'pressure-boyle' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    60mL 주사기 피스톤을 드래그하여 기체 부피(V)를 조절하세요:
                  </span>
                  <span className="font-mono font-black text-sm text-sky-600 dark:text-sky-400">
                    부피: {syringeVolume} mL
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="1"
                  value={syringeVolume}
                  onChange={(e) => setSyringeVolume(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer h-3 bg-gray-200 rounded-lg"
                />
                <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                  <span>20 mL (고압)</span>
                  <span>40 mL (대기압 101.3 kPa)</span>
                  <span>60 mL (감압)</span>
                </div>

                <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-300 dark:border-sky-800 flex items-center justify-between">
                  <div className="font-mono text-xs">
                    <span className="text-gray-500">P × V 계산치: </span>
                    <strong className="text-black dark:text-white font-black text-sm">
                      {(currentValue * syringeVolume).toFixed(1)} kPa·mL
                    </strong>
                  </div>
                  <span className="text-xs text-sky-600 dark:text-sky-300 font-bold">
                    상수(Constant) 불변 검증 완료
                  </span>
                </div>
              </div>
            )}

            {/* 7. Pressure H2O2 decomposition */}
            {experiment.id === 'pressure-decomposition' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  과산화수소(3% H2O2)에 이산화망가니즈(MnO2) 촉매를 투하하면 생성되는 산소 기체에 의해 밀폐 용기 내 압력이 급증합니다:
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCatalystAdded(true)}
                    disabled={catalystAdded}
                    className="px-4 py-2.5 rounded-2xl bg-sky-300 text-black font-black text-xs brutal-btn border-2 border-black disabled:opacity-50"
                  >
                    🧪 MnO2 촉매 분말 투하하기
                  </button>
                  <button
                    onClick={() => {
                      setCatalystAdded(false);
                      setCurrentValue(101.3);
                      handleClear();
                    }}
                    className="px-3 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-bold text-xs brutal-btn border-2 border-black dark:border-white"
                  >
                    반응 용기 환기 리셋
                  </button>
                </div>
              </div>
            )}

            {/* 8. Conductivity Electrolyte */}
            {experiment.id === 'conductivity-electrolyte' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  수용액을 선택하여 전해질의 이온 해리도와 연결된 전구의 밝기 반응을 관찰하세요:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'distilled', name: '증류수', cond: '2 μS/cm' },
                    { id: 'sugar', name: '설탕물', cond: '5 μS/cm' },
                    { id: 'tap', name: '수돗물', cond: '180 μS/cm' },
                    { id: 'vinegar', name: '식초 (아세트산)', cond: '860 μS/cm' },
                    { id: 'sports', name: '이온음료', cond: '2450 μS/cm' },
                    { id: 'salt', name: '소금물 (NaCl)', cond: '8900 μS/cm' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCondLiquid(item.id as any)}
                      className={`p-2.5 rounded-xl text-left border-2 transition-all ${
                        condLiquid === item.id
                          ? 'bg-emerald-300 text-black border-black shadow-brutal-sm scale-105'
                          : 'bg-gray-50 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="font-black text-xs">{item.name}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">{item.cond}</div>
                    </button>
                  ))}
                </div>

                {/* Light bulb visualization */}
                <div className="p-3 bg-gray-900 rounded-2xl text-white flex items-center justify-between border border-gray-700">
                  <div className="flex items-center gap-2">
                    <Lightbulb
                      className="w-6 h-6 transition-all"
                      style={{
                        color: currentValue > 1000 ? '#fde047' : currentValue > 100 ? '#ca8a04' : '#4b5563',
                        filter: currentValue > 1000 ? 'drop-shadow(0 0 10px #fde047)' : 'none',
                      }}
                    />
                    <span className="text-xs font-bold">
                      탐구 전구 상태: {currentValue > 1000 ? '강렬하게 점등 (강전해질)' : currentValue > 100 ? '희미하게 점등 (약전해질)' : '소등 (비전해질)'}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-black">
                    {currentValue.toFixed(0)} μS/cm
                  </span>
                </div>
              </div>
            )}

            {/* 9. Motion Smart Cart */}
            {experiment.id === 'motion-newton' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  스마트 카트의 질량(m)과 가해지는 외력(F)을 조정하여 가속도(a = F/m)를 검증하세요:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
                      카트 질량 (m): {cartMass} g
                    </label>
                    <div className="flex gap-2">
                      {[250, 500, 1000].map((mass) => (
                        <button
                          key={mass}
                          onClick={() => setCartMass(mass)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold border ${
                            cartMass === mass ? 'bg-purple-300 text-black border-black font-black' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {mass}g
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
                      당기는 외력 (F): {pullForce.toFixed(1)} N
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.5"
                      value={pullForce}
                      onChange={(e) => setPullForce(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theoretical equation footer */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-500 font-mono">
            <span>공식: {experiment.formula || '센서 시뮬레이션 모델'}</span>
            <span>신호 상태: 100% 무결성</span>
          </div>
        </div>
      </div>

      {/* Real-time Data Visualizations: Graph & Table */}
      <div className="space-y-6">
        {(activeView === 'both' || activeView === 'chart') && (
          <ChartVisualization
            data={dataPoints}
            title={`${experiment.title} - 실시간 ${sensor.name} 곡선`}
            xLabel="실험 경과 시간 (t / sec)"
            yLabel={sensor.name}
            unit={sensor.unit}
            lineColor={experiment.accentColor}
            onClear={handleClear}
          />
        )}

        {(activeView === 'both' || activeView === 'table') && (
          <DataTable
            data={dataPoints}
            unit={sensor.unit}
            xLabel="시간 (초)"
            yLabel={sensor.name}
            onClear={handleClear}
          />
        )}
      </div>
    </div>
  );
}
