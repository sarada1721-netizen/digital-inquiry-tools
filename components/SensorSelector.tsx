'use client';

import React from 'react';
import { SENSORS } from '@/lib/sensorsData';
import { SensorType } from '@/lib/types';
import { Droplet, Thermometer, Gauge, Zap, Activity, Radio, Cpu } from 'lucide-react';

interface SensorSelectorProps {
  selectedSensor: SensorType;
  onSelectSensor: (sensor: SensorType) => void;
}

export default function SensorSelector({
  selectedSensor,
  onSelectSensor,
}: SensorSelectorProps) {
  const getIcon = (type: SensorType) => {
    switch (type) {
      case 'ph':
        return <Droplet className="w-6 h-6 text-pink-600 dark:text-pink-400" />;
      case 'temperature':
        return <Thermometer className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'pressure':
        return <Gauge className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'conductivity':
        return <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'motion':
        return <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-500 animate-pulse" />
            <h2 className="text-xl font-extrabold text-black dark:text-white tracking-tight">
              PASCO 무선 MBL 센서 선택
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            센서를 클릭하면 고등학교 2학년 교육과정 맞춤 탐구 주제가 즉시 활성화됩니다.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-black dark:border-white shadow-brutal-sm">
          <Cpu className="w-3.5 h-3.5 text-blue-500" />
          <span>BLE 5.2 무선 동기화 지원</span>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {SENSORS.map((sensor) => {
          const isSelected = selectedSensor === sensor.id;
          return (
            <button
              key={sensor.id}
              onClick={() => onSelectSensor(sensor.id)}
              className={`group text-left p-3.5 rounded-2xl transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-white dark:bg-gray-800 brutal-box border-3 border-black dark:border-white scale-[1.03] shadow-brutal ring-2 ring-indigo-400'
                  : 'bg-white/70 dark:bg-gray-800/60 clay-card hover:translate-y-[-2px] hover:shadow-lg border-2 border-transparent hover:border-black dark:hover:border-gray-500'
              }`}
            >
              {/* Top Sensor Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sensor.bgColor} flex items-center justify-center border border-black/10 dark:border-white/10 shadow-inner`}>
                    {getIcon(sensor.id)}
                  </div>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    {sensor.unit}
                  </span>
                </div>

                <div className="font-extrabold text-sm text-black dark:text-white leading-tight">
                  {sensor.name}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                  {sensor.model.replace('PASCO ', '')}
                </div>
              </div>

              {/* Range & Selection status badge */}
              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px]">
                <span className="text-gray-500 dark:text-gray-400 font-mono">
                  {sensor.accuracy}
                </span>
                {isSelected && (
                  <span className="font-bold text-[9px] px-1.5 py-0.5 rounded-full bg-pink-500 text-white">
                    선택됨
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
