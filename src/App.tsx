import React, { useState } from 'react';
import { useTamagotchi } from './hooks/useTamagotchi';
import { TamagotchiDevice } from './components/TamagotchiDevice';
import { QuickSettingsBar } from './components/QuickSettingsBar';
import { EvolutionModal } from './components/EvolutionModal';
import { DiaryModal } from './components/DiaryModal';
import { SHELL_THEMES } from './constants/shells';
import { ShellTheme } from './types/tamagotchi';
import { sound } from './audio/synth';
import { Sparkles, Gamepad2, Info } from 'lucide-react';

export default function App() {
  const {
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
    pressA,
    pressB,
    pressC,
    resetPet,
    hatchInstantly,
    setTimeSpeed,
  } = useTamagotchi();

  const [currentShell, setCurrentShell] = useState<ShellTheme>('pink');
  const [isBacklit, setIsBacklit] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());
  const [isEvolutionOpen, setIsEvolutionOpen] = useState<boolean>(false);
  const [isDiaryOpen, setIsDiaryOpen] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.soundConfirm();
    }
  };

  const handleToggleBacklight = () => {
    sound.soundSelect();
    setIsBacklit((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-neutral-950 text-zinc-100 flex flex-col items-center justify-between p-3 sm:p-6 overflow-x-hidden select-none font-sans">
      {/* Top Retro Branding Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center font-bold text-white shadow-lg text-sm font-mono border border-pink-400">
            蛋
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-300 to-rose-300 font-mono">
              TAMAGOTCHI 1996
            </h1>
            <p className="text-[11px] text-zinc-400">
              元祖初代電子雞 · LCD 灰綠點陣液晶 · 三鍵經典復刻
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Info size={14} className="text-amber-400" />
            <span>玩法指南</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center py-4 w-full max-w-4xl gap-6">
        {/* Tamagotchi Physical Egg Unit */}
        <div className="relative">
          <TamagotchiDevice
            state={state}
            shell={SHELL_THEMES[currentShell]}
            isBacklit={isBacklit}
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
            onPressA={pressA}
            onPressB={pressB}
            onPressC={pressC}
          />

          {/* Quick Status Pill beside device on desktop */}
          <div className="hidden lg:flex flex-col gap-2 absolute -right-44 top-24 w-36 bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400 backdrop-blur-sm">
            <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">即時生理狀態</span>
            <div className="flex justify-between items-center text-zinc-300">
              <span>飽食度:</span>
              <span className="font-mono text-amber-400">{'♥'.repeat(state.hunger)}{'♡'.repeat(4 - state.hunger)}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-300">
              <span>快樂度:</span>
              <span className="font-mono text-pink-400">{'♥'.repeat(state.happiness)}{'♡'.repeat(4 - state.happiness)}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-300">
              <span>便便:</span>
              <span className="font-mono">{state.poopCount > 0 ? `${state.poopCount} 個` : '乾淨'}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-300">
              <span>狀態:</span>
              <span className="font-mono text-emerald-400">
                {state.stage === 'DEAD' ? '已往生' : state.isSick ? '生病中' : state.isSleeping ? '睡夢中' : '健康活潑'}
              </span>
            </div>
          </div>
        </div>

        {/* Keyboard Quick Controls Ribbon */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs text-zinc-400 bg-zinc-900/60 px-4 py-2 rounded-full border border-zinc-800/80 shadow-inner">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-amber-300 font-bold">A</kbd>
            <span>切換選單 / 左猜</span>
          </div>
          <span className="text-zinc-600">·</span>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-emerald-300 font-bold">S / Enter</kbd>
            <span>確定執行 / 右猜</span>
          </div>
          <span className="text-zinc-600">·</span>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-rose-300 font-bold">D / Esc</kbd>
            <span>取消 / 重開</span>
          </div>
        </div>

        {/* Quick Settings & Tool Bar */}
        <QuickSettingsBar
          currentShell={currentShell}
          onSelectShell={setCurrentShell}
          isBacklit={isBacklit}
          onToggleBacklight={handleToggleBacklight}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          timeSpeed={state.timeSpeed}
          onSetTimeSpeed={setTimeSpeed}
          state={state}
          onHatchInstantly={hatchInstantly}
          onResetPet={resetPet}
          onOpenEvolution={() => setIsEvolutionOpen(true)}
          onOpenDiary={() => setIsDiaryOpen(true)}
        />
      </main>

      {/* Guide Drawer / Dropdown */}
      {showGuide && (
        <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 space-y-2.5 mb-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Gamepad2 size={14} />
              <span>1996 經典 8 大功能圖示使用指南</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] leading-relaxed">
            <div>
              <span className="font-bold text-zinc-100">🍴 餵食：</span>
              正餐增加飽食度 (+1g)，點心增加快樂度 (+2g，注意容易發胖！)。
            </div>
            <div>
              <span className="font-bold text-zinc-100">💡 電燈：</span>
              晚上寵物入睡時請手動關燈，隔天醒來再開燈。
            </div>
            <div>
              <span className="font-bold text-zinc-100">⚽ 猜左右小遊戲：</span>
              猜測寵物轉頭方向（[A]左 / [B]右），5局3勝可大增心情並減輕1克體重。
            </div>
            <div>
              <span className="font-bold text-zinc-100">💊 醫療：</span>
              出現骷髏符號時代表染病，請即刻注射藥物治療。
            </div>
            <div>
              <span className="font-bold text-zinc-100">🛁 打掃：</span>
              畫面上累積便便時沖水洗淨，避免滋生細菌生病。
            </div>
            <div>
              <span className="font-bold text-zinc-100">📊 數值：</span>
              按 A 鍵輪播查看年齡、體重、飽食度愛心、快樂度愛心與紀律百分比。
            </div>
            <div>
              <span className="font-bold text-zinc-100">⚡ 管教訓話：</span>
              在寵物滿腹胡亂叫喚或頑皮時適時訓話，是培育頂級天才兔的關鍵！
            </div>
            <div>
              <span className="font-bold text-zinc-100">🚨 呼叫燈：</span>
              需要照顧或飢餓時右下角會急促閃爍並響起雙音嗶嗶聲。
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-2 text-[11px] text-zinc-500 flex flex-wrap items-center justify-center gap-3">
        <span>© 1996 BANDAI Recreation</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Sparkles size={11} className="text-amber-400" />
          <span>支援 LocalStorage 本地存檔，隨時回來寵物依然活著</span>
        </span>
      </footer>

      {/* Modals */}
      <EvolutionModal
        isOpen={isEvolutionOpen}
        onClose={() => setIsEvolutionOpen(false)}
        currentState={state}
      />

      <DiaryModal
        isOpen={isDiaryOpen}
        onClose={() => setIsDiaryOpen(false)}
        state={state}
      />
    </div>
  );
}
