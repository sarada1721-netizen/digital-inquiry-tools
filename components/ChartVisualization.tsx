'use client';

import React, { useMemo, useState } from 'react';
import { DataPoint } from '@/lib/types';
import { LineChart, Maximize2, RefreshCw } from 'lucide-react';

interface ChartVisualizationProps {
  data: DataPoint[];
  title: string;
  xLabel: string;
  yLabel: string;
  unit: string;
  lineColor?: string;
  onClear?: () => void;
}

export default function ChartVisualization({
  data,
  title,
  xLabel,
  yLabel,
  unit,
  lineColor = '#ec4899',
  onClear,
}: ChartVisualizationProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart Dimensions
  const width = 640;
  const height = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 55 };

  const chartBounds = useMemo(() => {
    if (data.length === 0) {
      return { minX: 0, maxX: 10, minY: 0, maxY: 14 };
    }

    const xs = data.map((d) => d.time);
    const ys = data.map((d) => d.value);

    let minX = Math.min(...xs);
    let maxX = Math.max(...xs);
    let minY = Math.min(...ys);
    let maxY = Math.max(...ys);

    if (minX === maxX) maxX += 1;
    if (minY === maxY) {
      minY -= 1;
      maxY += 1;
    }

    // Add 10% breathing room on Y-axis
    const yMargin = (maxY - minY) * 0.1 || 1;
    minY = Math.max(0, minY - yMargin);
    maxY = maxY + yMargin;

    return { minX, maxX, minY, maxY };
  }, [data]);

  // Coordinate scales
  const getX = (val: number) => {
    const range = chartBounds.maxX - chartBounds.minX || 1;
    return padding.left + ((val - chartBounds.minX) / range) * (width - padding.left - padding.right);
  };

  const getY = (val: number) => {
    const range = chartBounds.maxY - chartBounds.minY || 1;
    return height - padding.bottom - ((val - chartBounds.minY) / range) * (height - padding.top - padding.bottom);
  };

  // Generate SVG path string
  const pathD = useMemo(() => {
    if (data.length === 0) return '';
    return data.reduce((acc, pt, idx) => {
      const x = getX(pt.time);
      const y = getY(pt.value);
      return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, [data, chartBounds]);

  // Area under curve path
  const areaD = useMemo(() => {
    if (data.length === 0) return '';
    const firstX = getX(data[0].time);
    const lastX = getX(data[data.length - 1].time);
    const baseLineY = height - padding.bottom;
    return `${pathD} L ${lastX},${baseLineY} L ${firstX},${baseLineY} Z`;
  }, [data, pathD]);

  // Y-axis tick values (5 ticks)
  const yTicks = useMemo(() => {
    const count = 5;
    const step = (chartBounds.maxY - chartBounds.minY) / (count - 1);
    return Array.from({ length: count }, (_, i) => chartBounds.minY + step * i);
  }, [chartBounds]);

  const latestVal = data.length > 0 ? data[data.length - 1].value : null;

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl brutal-box p-4 flex flex-col justify-between">
      {/* Chart Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center border border-black dark:border-white">
            <LineChart className="w-4 h-4 text-pink-600 dark:text-pink-300" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-black dark:text-white">
              {title}
            </h4>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
              실시간 데이터 포인트: {data.length}개 수집됨
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {latestVal !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-300 dark:bg-yellow-400 text-black border-2 border-black font-mono font-black text-sm shadow-brutal-sm">
              <span className="text-[10px] text-gray-700">현재값:</span>
              <span>{latestVal.toFixed(2)}</span>
              <span className="text-xs">{unit}</span>
            </div>
          )}
          {onClear && (
            <button
              onClick={onClear}
              title="그래프 초기화"
              className="p-1.5 rounded-lg border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full aspect-[2.3/1] min-h-[220px] max-h-[320px] my-2 select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible font-sans text-[10px]"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-Ticks */}
          {yTicks.map((val, idx) => {
            const y = getY(val);
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-700/80"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-gray-400 dark:fill-gray-500 font-mono font-bold"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          {areaD && <path d={areaD} fill="url(#curveGradient)" />}

          {/* Data Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={lineColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Dots on points */}
          {data.map((pt, i) => {
            const cx = getX(pt.time);
            const cy = getY(pt.value);
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : data.length > 30 ? 2.5 : 4}
                  fill={isHovered ? '#FFE600' : '#ffffff'}
                  stroke={lineColor}
                  strokeWidth={isHovered ? 3 : 2}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {isHovered && (
                  <g>
                    <rect
                      x={cx - 35}
                      y={cy - 30}
                      width="70"
                      height="22"
                      rx="6"
                      fill="#111827"
                      className="drop-shadow-md"
                    />
                    <text
                      x={cx}
                      y={cy - 16}
                      textAnchor="middle"
                      fill="#ffffff"
                      className="font-mono font-bold text-[9px]"
                    >
                      {pt.value.toFixed(2)} {unit}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="currentColor"
            className="text-black dark:text-white"
            strokeWidth="2"
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="currentColor"
            className="text-black dark:text-white"
            strokeWidth="2"
          />

          {/* Axis Labels */}
          <text
            x={width / 2}
            y={height - 8}
            textAnchor="middle"
            className="fill-black dark:fill-white font-bold text-[11px]"
          >
            {xLabel}
          </text>
          <text
            x={16}
            y={padding.top - 10}
            textAnchor="start"
            className="fill-black dark:fill-white font-bold text-[11px]"
          >
            {yLabel} ({unit})
          </text>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-mono pt-2 border-t border-gray-100 dark:border-gray-700/60">
        <span>최소값: {chartBounds.minY.toFixed(2)} {unit}</span>
        <span>최대값: {chartBounds.maxY.toFixed(2)} {unit}</span>
        <span>샘플링 주기: 0.5s 자동 기록</span>
      </div>
    </div>
  );
}
