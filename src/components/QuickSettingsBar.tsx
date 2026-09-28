import React from 'react';
import { Volume2, VolumeX, Lightbulb, Sun, Zap, RotateCcw, BookOpen, Clock, Palette } from 'lucide-react';
import { SHELL_THEMES } from '../constants/shells';
import { ShellTheme, TamagotchiState } from '../types/tamagotchi';
import { sound } from '../audio/synth';

interface QuickSettingsBarProps {
  currentShell: ShellTheme;
  onSelectShell: (shell: ShellTheme) => void;
  isBacklit: boolean;
  onToggleBacklight: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  timeSpeed: number;
  onSetTimeSpeed: (speed: number) => void;
  state: TamagotchiState;
  onHatchInstantly: () => void;
  onResetPet: () => void;
  onOpenEvolution: () => void;
  onOpenDiary: () => void;
}

export const QuickSettingsBar: React.FC<QuickSettingsBarProps> = ({
  currentShell,
  onSelectShell,
  isBacklit,
  onToggleBacklight,
  isMuted,
  onToggleMute,
  timeSpeed,
  onSetTimeSpeed,
  state,
  onHatchInstantly,
  onResetPet,
  onOpenEvolution,
  onOpenDiary,
}) => {
  return (
    <div className="w-full max-w-xl bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col gap-3.5">
      {/* Top row: Main Tool buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isMuted
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-zinc-600'
            }`}
            title={isMuted ? '開啟 8-bit 音效' : '靜音'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isMuted ? '靜音中' : '音效開啟'}</span>
          </button>

          {/* LCD Backlight Toggle */}
          <button
            type="button"
            onClick={onToggleBacklight}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isBacklit
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600'
            }`}
            title="切換 LCD 螢幕背光 (復古灰綠 / 現代背光青藍)"
          >
            {isBacklit ? <Sun size={14} /> : <Lightbulb size={14} />}
            <span>{isBacklit ? '夜光背光' : '原祖灰綠'}</span>
          </button>
        </div>

        {/* Modal Triggers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenEvolution}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-xs font-medium text-amber-300 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <BookOpen size={14} />
            <span>成長圖鑑</span>
          </button>

          <button
            type="button"
            onClick={onOpenDiary}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-xs font-medium text-blue-300 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Clock size={14} />
            <span>生活日記</span>
          </button>
        </div>
      </div>

      {/* Middle row: Shell Casing Swatches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Palette size={14} className="text-zinc-400" />
          <span className="text-xs text-zinc-300 font-medium">機身外殼款式：</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(SHELL_THEMES).map(([key, style]) => {
            const isSelected = currentShell === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  sound.soundSelect();
                  onSelectShell(key as ShellTheme);
                }}
                className={`group relative px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-white text-white shadow-md ring-2 ring-white/20'
                    : 'border-zinc-700/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 bg-zinc-800/60'
                }`}
                style={{
                  background: isSelected ? style.bodyGradient : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/30"
                  style={{ background: style.borderColor }}
                />
                <span>{style.name.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Time Speed Simulation & Instant Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
        {/* Speed Controls */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-zinc-400">成長速度：</span>
          <button
            type="button"
            onClick={() => onSetTimeSpeed(1)}
            className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
              timeSpeed === 1
                ? 'bg-zinc-200 text-zinc-900'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            1x 標準
          </button>
          <button
            type="button"
            onClick={() => onSetTimeSpeed(5)}
            className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
              timeSpeed === 5
                ? 'bg-amber-400 text-zinc-950'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            5x 快速
          </button>
          <button
            type="button"
            onClick={() => onSetTimeSpeed(20)}
            className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
              timeSpeed === 20
                ? 'bg-rose-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            20x 極速展示
          </button>
        </div>

        {/* Special Actions */}
        <div className="flex items-center gap-2">
          {state.stage === 'EGG' && (
            <button
              type="button"
              onClick={onHatchInstantly}
              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shadow"
            >
              <Zap size={12} />
              <span>立即破殼</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (window.confirm('確定要重新開始培育一顆新的拓麻歌子蛋嗎？當前的進度將會被清除。')) {
                onResetPet();
              }
            }}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-red-950/60 border border-zinc-700 hover:border-red-800/60 text-zinc-400 hover:text-red-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title="重新開始新生命"
          >
            <RotateCcw size={12} />
            <span>重新投胎</span>
          </button>
        </div>
      </div>
    </div>
  );
};
