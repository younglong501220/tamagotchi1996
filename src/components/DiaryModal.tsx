import React from 'react';
import { TamagotchiState } from '../types/tamagotchi';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: TamagotchiState;
}

export const DiaryModal: React.FC<DiaryModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  if (!isOpen) return null;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  const getLogBadge = (type: TamagotchiState['eventLogs'][0]['type']) => {
    switch (type) {
      case 'birth':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'evolve':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'feed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'clean':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'heal':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'sick':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'game':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'discipline':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'death':
        return 'bg-zinc-700/50 text-zinc-400 border-zinc-600';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>📝</span>
              <span>電子雞成長照顧日記</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              累計數據：餵食 {state.stats.mealsEaten + state.stats.snacksEaten} 次 · 打掃 {state.stats.poopsCleaned} 次便便 · 遊戲獲勝 {state.stats.gamesWon} 回
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Lifetime Stats bar */}
        <div className="grid grid-cols-4 gap-2 p-4 bg-zinc-950/60 border-b border-zinc-800 text-center">
          <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <span className="text-xs text-zinc-500 block">年齡 (歲)</span>
            <span className="text-base font-bold font-mono text-zinc-200">{state.age}</span>
          </div>
          <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <span className="text-xs text-zinc-500 block">體重 (g)</span>
            <span className="text-base font-bold font-mono text-zinc-200">{state.weight}</span>
          </div>
          <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <span className="text-xs text-zinc-500 block">紀律訓話</span>
            <span className="text-base font-bold font-mono text-amber-300">{state.discipline}%</span>
          </div>
          <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <span className="text-xs text-zinc-500 block">打針康復</span>
            <span className="text-base font-bold font-mono text-emerald-400">{state.stats.medicinesGiven}</span>
          </div>
        </div>

        {/* Event Logs List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {state.eventLogs.length === 0 ? (
            <p className="text-center text-sm text-zinc-500 py-8">尚無任何照顧事件紀錄。</p>
          ) : (
            state.eventLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-800/60 border border-zinc-800 text-xs"
              >
                <span className="font-mono text-zinc-500 shrink-0 pt-0.5">
                  {formatTime(log.timestamp)}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono border shrink-0 ${getLogBadge(
                    log.type
                  )}`}
                >
                  {log.type.toUpperCase()}
                </span>
                <span className="text-zinc-200 leading-relaxed flex-1">
                  {log.text}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-zinc-200 transition-colors cursor-pointer"
          >
            關閉日記
          </button>
        </div>
      </div>
    </div>
  );
};
