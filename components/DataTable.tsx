'use client';

import React from 'react';
import { DataPoint } from '@/lib/types';
import { Table, Download, Trash2, ArrowUpDown } from 'lucide-react';

interface DataTableProps {
  data: DataPoint[];
  unit: string;
  xLabel: string;
  yLabel: string;
  onClear: () => void;
}

export default function DataTable({
  data,
  unit,
  xLabel,
  yLabel,
  onClear,
}: DataTableProps) {
  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = `${xLabel},${yLabel} (${unit}),비고\n`;
    const rows = data
      .map((d) => `${d.time},${d.value},${d.label || ''}`)
      .join('\n');
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MBL_실험데이터_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl brutal-box p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center border border-black dark:border-white">
            <Table className="w-4 h-4 text-sky-600 dark:text-sky-300" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-black dark:text-white">
              실시간 측정 데이터 로그 표
            </h4>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
              총 {data.length}개 행 수집됨
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={data.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pastel-mint dark:bg-emerald-900/40 text-black dark:text-white font-bold text-xs brutal-btn border-2 border-black dark:border-white disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            CSV 내보내기
          </button>
          <button
            onClick={onClear}
            disabled={data.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold text-xs brutal-btn border-2 border-black dark:border-white disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            초기화
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-h-[260px] overflow-y-auto my-2 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700/60 sticky top-0 border-b border-gray-200 dark:border-gray-700 z-10">
            <tr>
              <th className="py-2.5 px-3 font-black text-gray-700 dark:text-gray-200">
                #
              </th>
              <th className="py-2.5 px-3 font-black text-gray-700 dark:text-gray-200">
                {xLabel}
              </th>
              <th className="py-2.5 px-3 font-black text-gray-700 dark:text-gray-200">
                {yLabel} ({unit})
              </th>
              <th className="py-2.5 px-3 font-black text-gray-700 dark:text-gray-200">
                상태 및 관측 사항
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400 font-sans">
                  측정된 데이터가 없습니다. 상단에서 시뮬레이션 인터랙션을 시작해 보세요!
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-pink-50/50 dark:hover:bg-gray-700/40 transition-colors"
                >
                  <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                  <td className="py-2 px-3 font-bold text-gray-800 dark:text-gray-200">
                    {typeof row.time === 'number' ? row.time.toFixed(1) : row.time}s
                  </td>
                  <td className="py-2 px-3 font-black text-pink-600 dark:text-pink-400">
                    {row.value.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-300 font-sans text-[11px]">
                    {row.label || '정상 측정 수집'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-mono pt-2 border-t border-gray-100 dark:border-gray-700/60">
        <span>최신 기록: {data.length > 0 ? `${data[data.length - 1].value.toFixed(2)} ${unit}` : '-'}</span>
        <span>교과서 과학 보고서용 데이터 포맷 지원</span>
      </div>
    </div>
  );
}
