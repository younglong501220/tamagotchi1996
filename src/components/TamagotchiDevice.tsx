import React, { useState, useEffect } from 'react';
import { TamagotchiState, MenuType, ShellStyle } from '../types/tamagotchi';
import { DeviceScreen } from './DeviceScreen';

interface TamagotchiDeviceProps {
  state: TamagotchiState;
  shell: ShellStyle;
  isBacklit: boolean;
  selectedIcon: number;
  activeMenu: MenuType;
  menuIndex: number;
  statusPageIndex: number;
  gameRound: number;
  gameScore: number;
  gamePetChoice: number;
  gamePlayerChoice: number | null;
  gamePhase: 'guessing' | 'revealing' | 'final';
  animType: string | null;
  animTimer: number;
  onPressA: () => void;
  onPressB: () => void;
  onPressC: () => void;
}

export const TamagotchiDevice: React.FC<TamagotchiDeviceProps> = ({
  state,
  shell,
  isBacklit,
  selectedIcon,
  activeMenu,
  menuIndex,
  statusPageIndex,
  gameRound,
  gameScore,
  gamePetChoice,
  gamePlayerChoice,
  gamePhase,
  animType,
  animTimer,
  onPressA,
  onPressB,
  onPressC,
}) => {
  const [pressedBtn, setPressedBtn] = useState<'A' | 'B' | 'C' | null>(null);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setPressedBtn('A');
        onPressA();
      } else if (e.key === 's' || e.key === 'S' || e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setPressedBtn('B');
        onPressB();
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        setPressedBtn('C');
        onPressC();
      }
    };

    const handleKeyUp = () => {
      setPressedBtn(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onPressA, onPressB, onPressC]);

  const triggerA = () => {
    setPressedBtn('A');
    onPressA();
    setTimeout(() => setPressedBtn(null), 120);
  };

  const triggerB = () => {
    setPressedBtn('B');
    onPressB();
    setTimeout(() => setPressedBtn(null), 120);
  };

  const triggerC = () => {
    setPressedBtn('C');
    onPressC();
    setTimeout(() => setPressedBtn(null), 120);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Top Keychain Loop & Chain Ring */}
      <div className="flex flex-col items-center -mb-3 z-10">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-400 bg-zinc-700 shadow-inner flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-500 shadow-inner" />
        </div>
        <div className="w-3 h-4 border-2 border-zinc-400 rounded-sm bg-zinc-300 shadow-sm -mt-1" />
      </div>

      {/* Egg-Shaped Shell Body */}
      <div
        className="w-[330px] sm:w-[360px] h-[440px] sm:h-[470px] rounded-[50%_50%_48%_48%/60%_60%_40%_40%] shadow-[inset_0_12px_22px_rgba(255,255,255,0.45),inset_0_-14px_28px_rgba(0,0,0,0.5),0_25px_45px_rgba(0,0,0,0.55)] flex flex-col items-center pt-8 pb-10 px-6 relative border-4 transition-all duration-300 select-none"
        style={{
          background: shell.bodyGradient,
          borderColor: shell.borderColor,
        }}
      >
        {/* Keychain Hole accent */}
        <div className="absolute top-3.5 w-6 h-6 rounded-full bg-zinc-900/80 border-2 border-zinc-400 shadow-inner flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-black" />
        </div>

        {/* Vintage Golden Foil Brand Title */}
        <div className="font-extrabold tracking-[0.25em] text-xs sm:text-sm text-amber-200 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] mt-1 mb-2 font-mono flex items-center gap-1.5">
          <span className="text-[10px] text-amber-300/70">★</span>
          <span>TAMAGOTCHI</span>
          <span className="text-[10px] text-amber-300/70">★</span>
        </div>

        {/* Screen Bezel & LCD */}
        <DeviceScreen
          state={state}
          selectedIcon={selectedIcon}
          activeMenu={activeMenu}
          menuIndex={menuIndex}
          statusPageIndex={statusPageIndex}
          gameRound={gameRound}
          gameScore={gameScore}
          gamePetChoice={gamePetChoice}
          gamePlayerChoice={gamePlayerChoice}
          gamePhase={gamePhase}
          animType={animType}
          animTimer={animTimer}
          isBacklit={isBacklit}
        />

        {/* 3 Physical Tactile Buttons (A, B, C) */}
        <div className="w-[260px] flex justify-between items-center mt-7 sm:mt-8 px-2">
          {/* Button A (Select) */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={triggerA}
              aria-label="按鈕 A: 選擇"
              className={`w-12 h-12 rounded-full cursor-pointer transition-all duration-75 outline-none flex items-center justify-center font-bold text-sm text-zinc-800 ${
                pressedBtn === 'A'
                  ? 'translate-y-1 shadow-[0_1px_0_#b33939,0_2px_4px_rgba(0,0,0,0.4)]'
                  : 'shadow-[0_5px_0_#b33939,0_8px_12px_rgba(0,0,0,0.45)] active:translate-y-1'
              }`}
              style={{
                background: shell.btnColor,
                boxShadow: pressedBtn === 'A' ? `0 1px 0 ${shell.btnShadow}, 0 2px 4px rgba(0,0,0,0.4)` : `0 5px 0 ${shell.btnShadow}, 0 8px 12px rgba(0,0,0,0.45)`,
              }}
            >
              <span className="opacity-75 font-mono text-xs">A</span>
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-wider">
              A 選擇
            </span>
          </div>

          {/* Button B (Confirm) - Slightly offset lower in authentic egg layout */}
          <div className="flex flex-col items-center gap-1.5 mt-5">
            <button
              type="button"
              onClick={triggerB}
              aria-label="按鈕 B: 確定"
              className={`w-12 h-12 rounded-full cursor-pointer transition-all duration-75 outline-none flex items-center justify-center font-bold text-sm text-zinc-800 ${
                pressedBtn === 'B'
                  ? 'translate-y-1 shadow-[0_1px_0_#b33939,0_2px_4px_rgba(0,0,0,0.4)]'
                  : 'shadow-[0_5px_0_#b33939,0_8px_12px_rgba(0,0,0,0.45)] active:translate-y-1'
              }`}
              style={{
                background: shell.btnColor,
                boxShadow: pressedBtn === 'B' ? `0 1px 0 ${shell.btnShadow}, 0 2px 4px rgba(0,0,0,0.4)` : `0 5px 0 ${shell.btnShadow}, 0 8px 12px rgba(0,0,0,0.45)`,
              }}
            >
              <span className="opacity-75 font-mono text-xs">B</span>
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-wider">
              B 確定
            </span>
          </div>

          {/* Button C (Cancel) */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={triggerC}
              aria-label="按鈕 C: 取消"
              className={`w-12 h-12 rounded-full cursor-pointer transition-all duration-75 outline-none flex items-center justify-center font-bold text-sm text-zinc-800 ${
                pressedBtn === 'C'
                  ? 'translate-y-1 shadow-[0_1px_0_#b33939,0_2px_4px_rgba(0,0,0,0.4)]'
                  : 'shadow-[0_5px_0_#b33939,0_8px_12px_rgba(0,0,0,0.45)] active:translate-y-1'
              }`}
              style={{
                background: shell.btnColor,
                boxShadow: pressedBtn === 'C' ? `0 1px 0 ${shell.btnShadow}, 0 2px 4px rgba(0,0,0,0.4)` : `0 5px 0 ${shell.btnShadow}, 0 8px 12px rgba(0,0,0,0.45)`,
              }}
            >
              <span className="opacity-75 font-mono text-xs">C</span>
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-wider">
              C 取消
            </span>
          </div>
        </div>

        {/* Vintage Bandai / 1996 Bottom Stamp */}
        <div className="mt-4 text-[9px] font-mono text-white/50 tracking-widest uppercase">
          1996 BANDAI RECREATION
        </div>
      </div>
    </div>
  );
};
