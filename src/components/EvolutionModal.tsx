import React, { useRef, useEffect } from 'react';
import { EVOLUTION_GUIDE, EvolutionNode } from '../constants/evolution';
import { drawSprite } from '../graphics/renderer';
import { TamagotchiState } from '../types/tamagotchi';

interface EvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: TamagotchiState;
}

const EvolutionPreviewCard: React.FC<{
  node: EvolutionNode;
  isCurrent: boolean;
}> = ({ node, isCurrent }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#9cad84';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSprite(ctx, node.spriteKey, 6, 6, 2.4, '#1e272e');
  }, [node]);

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all ${
        isCurrent
          ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/40'
          : 'bg-zinc-800/80 border-zinc-700/80 hover:border-zinc-600'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Pixel Sprite Thumbnail */}
        <div className="w-14 h-14 rounded-lg bg-[#9cad84] border-2 border-zinc-600 p-1 flex items-center justify-center shrink-0 shadow-inner">
          <canvas
            ref={canvasRef}
            width={50}
            height={50}
            className="w-full h-full pixelated block"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="font-bold text-sm text-zinc-100 truncate">
              {node.name}
            </h4>
            {isCurrent && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-zinc-950 uppercase tracking-wider">
                當前形態
              </span>
            )}
          </div>
          <p className="text-xs text-amber-300 font-mono mt-0.5">{node.stageName}</p>
          <p className="text-xs text-zinc-300 mt-1 line-clamp-2">{node.description}</p>
          <div className="mt-2 text-[11px] bg-zinc-900/60 p-1.5 rounded border border-zinc-700 text-zinc-400">
            <span className="text-zinc-200 font-medium">培育條件：</span>
            {node.condition}
          </div>
        </div>
      </div>
    </div>
  );
};

export const EvolutionModal: React.FC<EvolutionModalProps> = ({
  isOpen,
  onClose,
  currentState,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>📖</span>
              <span>1996 拓麻歌子成長進化圖鑑</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              依照你的照料用心程度、管教次數與體重，將會蛻變為不同性格的成年雞！
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EVOLUTION_GUIDE.map((node) => {
              const isCurrent =
                (node.id === 'EGG' && currentState.stage === 'EGG') ||
                (node.id === 'BABYTCHI' && currentState.characterId === 'BABYTCHI' && currentState.stage === 'BABY') ||
                (node.id === 'MARUTCHI' && currentState.characterId === 'MARUTCHI') ||
                (node.id === 'TAMATCHI' && currentState.characterId === 'TAMATCHI') ||
                (node.id === currentState.characterId);

              return (
                <EvolutionPreviewCard
                  key={node.id}
                  node={node}
                  isCurrent={isCurrent}
                />
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-zinc-200 transition-colors cursor-pointer"
          >
            關閉圖鑑
          </button>
        </div>
      </div>
    </div>
  );
};
