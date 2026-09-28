import React, { useRef, useEffect } from 'react';
import { TamagotchiState, MenuType } from '../types/tamagotchi';
import { renderLCD } from '../graphics/renderer';

interface DeviceScreenProps {
  state: TamagotchiState;
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
  isBacklit: boolean;
}

export const DeviceScreen: React.FC<DeviceScreenProps> = ({
  state,
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
  isBacklit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tickCountRef = useRef<number>(0);

  useEffect(() => {
    let animId: number;

    const loop = () => {
      tickCountRef.current += 1;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          renderLCD({
            canvas,
            ctx,
            state,
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
            tickCount: tickCountRef.current,
            isBacklit,
          });
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    state,
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
    isBacklit,
  ]);

  const topIcons = [
    { id: 0, icon: '🍴', label: '餵食 (Food)' },
    { id: 1, icon: '💡', label: '電燈 (Light)' },
    { id: 2, icon: '⚽', label: '遊戲 (Game)' },
    { id: 3, icon: '💊', label: '吃藥 (Medicine)' },
  ];

  const bottomIcons = [
    { id: 4, icon: '🛁', label: '打掃 (Clean)' },
    { id: 5, icon: '📊', label: '數值 (Status)' },
    { id: 6, icon: '⚡', label: '訓話 (Discipline)' },
    { id: 7, icon: '🚨', label: '呼叫 (Alert)' },
  ];

  return (
    <div className="w-[260px] sm:w-[280px] h-[210px] sm:h-[220px] rounded-2xl p-2.5 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6),0_2px_4px_rgba(255,255,255,0.4)] flex flex-col justify-between bg-zinc-300 border-2 border-zinc-400">
      {/* Top 4 Icons */}
      <div className="flex justify-around items-center h-6 px-1.5 rounded-t bg-black/10">
        {topIcons.map((item) => {
          const isSelected = selectedIcon === item.id;
          return (
            <div
              key={item.id}
              title={item.label}
              className={`text-sm select-none transition-all duration-150 ${
                isSelected
                  ? 'opacity-100 scale-125 filter drop-shadow-[0_0_2px_#000] text-black font-extrabold'
                  : 'opacity-25 hover:opacity-40 text-zinc-800'
              }`}
            >
              {item.icon}
            </div>
          );
        })}
      </div>

      {/* Screen Canvas with Retro LCD Scanlines & Border */}
      <div
        className={`relative flex-1 rounded-sm overflow-hidden border border-black/40 shadow-[inset_0_3px_8px_rgba(0,0,0,0.45)] transition-colors duration-300 ${
          isBacklit
            ? state.isSleeping
              ? 'bg-[#1b4d3e]'
              : 'bg-[#68d8d6]'
            : state.isSleeping
            ? 'bg-[#4a5b40]'
            : 'bg-[#9cad84]'
        }`}
      >
        <canvas
          ref={canvasRef}
          width={160}
          height={100}
          className="w-full h-full block pixelated"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Authentic LCD dot grid & glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '3px 3px',
          }}
        />
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/20" />
      </div>

      {/* Bottom 4 Icons */}
      <div className="flex justify-around items-center h-6 px-1.5 rounded-b bg-black/10">
        {bottomIcons.map((item) => {
          const isSelected = selectedIcon === item.id;
          const isAlertActive = item.id === 7 && state.needsCall;
          return (
            <div
              key={item.id}
              title={item.label}
              className={`text-sm select-none transition-all duration-150 ${
                isSelected || isAlertActive
                  ? 'opacity-100 scale-125 filter drop-shadow-[0_0_2px_#000] text-black font-extrabold'
                  : 'opacity-25 hover:opacity-40 text-zinc-800'
              } ${isAlertActive ? 'animate-bounce text-red-800' : ''}`}
            >
              {item.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};
