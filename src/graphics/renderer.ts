import { SPRITES } from './sprites';
import { TamagotchiState, MenuType } from '../types/tamagotchi';

export interface RenderContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  state: TamagotchiState;
  activeMenu: MenuType;
  menuIndex: number;
  statusPageIndex: number;
  gameRound: number;
  gameScore: number;
  gamePetChoice: number; // 0: left, 1: right
  gamePlayerChoice: number | null;
  gamePhase: 'guessing' | 'revealing' | 'final';
  animType: string | null;
  animTimer: number;
  tickCount: number;
  isBacklit: boolean;
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  spriteKey: string,
  startX: number,
  startY: number,
  scale: number = 3,
  color: string = '#1e272e'
) {
  const rows = SPRITES[spriteKey];
  if (!rows) return;
  ctx.fillStyle = color;
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === 'X') {
        ctx.fillRect(
          Math.floor(startX + c * scale),
          Math.floor(startY + r * scale),
          scale,
          scale
        );
      }
    }
  }
}

export function getPetCurrentSprite(
  state: TamagotchiState,
  frameToggle: boolean,
  action?: 'lookLeft' | 'lookRight' | 'neutral'
): string {
  const { stage, characterId } = state;

  if (stage === 'EGG') {
    return frameToggle ? 'egg1' : 'egg2';
  }

  if (stage === 'BABY') {
    if (action === 'lookLeft') return 'babyLookLeft';
    if (action === 'lookRight') return 'babyLookRight';
    return frameToggle ? 'baby1' : 'baby2';
  }

  if (stage === 'CHILD') {
    if (action === 'lookLeft') return 'childLookLeft';
    if (action === 'lookRight') return 'childLookRight';
    return frameToggle ? 'child1' : 'child2';
  }

  if (stage === 'TEEN') {
    if (action === 'lookLeft') return 'teenLookLeft';
    if (action === 'lookRight') return 'teenLookRight';
    return frameToggle ? 'teen1' : 'teen2';
  }

  if (stage === 'ADULT') {
    if (characterId === 'GINJIROTCHI') {
      return frameToggle ? 'ginjirotchi1' : 'ginjirotchi2';
    }
    if (characterId === 'KUCHIPATCHI') {
      return frameToggle ? 'kuchipatchi1' : 'kuchipatchi2';
    }
    if (characterId === 'MASKTCHI') {
      return frameToggle ? 'masktchi1' : 'masktchi2';
    }
    if (characterId === 'OYAJITCHI') {
      return frameToggle ? 'oyajitchi1' : 'oyajitchi2';
    }
    // Default Mametchi
    if (action === 'lookLeft') return 'mametchiLookLeft';
    if (action === 'lookRight') return 'mametchiLookRight';
    return frameToggle ? 'mametchi1' : 'mametchi2';
  }

  if (stage === 'DEAD') {
    return 'grave';
  }

  return 'egg1';
}

export function renderLCD(rc: RenderContext) {
  const { canvas, ctx, state, activeMenu, animType, isBacklit } = rc;
  const w = canvas.width;
  const h = canvas.height;

  // Background
  const bgColor = state.isSleeping
    ? (isBacklit ? '#1b4d3e' : '#4a5b40')
    : (isBacklit ? '#68d8d6' : '#9cad84');
  const pixelColor = state.isSleeping ? '#131b14' : '#1e272e';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  const frameToggle = Math.floor(rc.tickCount / 14) % 2 === 0;

  // If Lights out & sleeping
  if (state.isSleeping && !animType && activeMenu === 'NONE') {
    ctx.fillStyle = pixelColor;
    ctx.font = 'bold 9px monospace';
    ctx.fillText('Z Z Z . . .', 52, 22);

    const petSprite = getPetCurrentSprite(state, frameToggle);
    drawSprite(ctx, petSprite, 54, 42, 2.8, pixelColor);

    // Animated floating Zzz
    const zOffset = (rc.tickCount % 30) < 15 ? 0 : -3;
    drawSprite(ctx, 'zzz', 104, 30 + zOffset, 1.8, pixelColor);
    return;
  }

  // Animation overrides
  if (animType) {
    renderAnimation(rc, pixelColor, frameToggle);
    return;
  }

  // Menus
  if (activeMenu === 'STATUS') {
    renderStatusScreen(rc, pixelColor);
    return;
  }
  if (activeMenu === 'MEAL_SELECT') {
    renderMealMenu(rc, pixelColor);
    return;
  }
  if (activeMenu === 'GAME') {
    renderGameScreen(rc, pixelColor);
    return;
  }

  // Regular idle / state screen
  if (state.stage === 'EGG') {
    const isWobblingFast = state.eggTimer <= 3;
    const eggSprite = isWobblingFast
      ? (Math.floor(rc.tickCount / 6) % 2 === 0 ? 'eggCrack' : 'egg2')
      : (frameToggle ? 'egg1' : 'egg2');

    const wobbleX = isWobblingFast ? ((rc.tickCount % 4) - 2) : 0;
    drawSprite(ctx, eggSprite, 56 + wobbleX, 26, 3, pixelColor);

    ctx.fillStyle = pixelColor;
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`HATCHING: ${Math.max(0, state.eggTimer)}s`, 38, 88);
  } else if (state.stage === 'DEAD') {
    drawSprite(ctx, 'grave', 40, 32, 2.6, pixelColor);
    // Floating angel
    const floatY = 20 + Math.sin(rc.tickCount / 8) * 4;
    drawSprite(ctx, 'ghost', 94, floatY, 2.2, pixelColor);

    ctx.fillStyle = pixelColor;
    ctx.font = 'bold 9px monospace';
    ctx.fillText('R.I.P.', 65, 18);
    ctx.font = 'bold 8px monospace';
    ctx.fillText('[C] TO RESTART', 42, 90);
  } else {
    // Normal Living Pet
    const petSprite = getPetCurrentSprite(state, frameToggle);
    // Idle walk / bounce
    const swayX = frameToggle ? 58 : 54;
    const swayY = frameToggle ? 32 : 30;
    drawSprite(ctx, petSprite, swayX, swayY, 2.9, pixelColor);

    // Draw Poops
    if (state.poopCount > 0) {
      const poopSprite = frameToggle ? 'poop' : 'poop2';
      for (let i = 0; i < state.poopCount; i++) {
        const px = 118 + (i % 2) * 16 - Math.floor(i / 2) * 6;
        const py = 35 + (i % 2) * 20;
        drawSprite(ctx, poopSprite, px, py, 1.8, pixelColor);
      }
    }

    // Draw Sick Skull
    if (state.isSick) {
      const skullY = 16 + (frameToggle ? 1 : -1);
      drawSprite(ctx, 'skull', 14, skullY, 2.0, pixelColor);
    }
  }
}

function renderStatusScreen(rc: RenderContext, color: string) {
  const { ctx, state, statusPageIndex } = rc;

  ctx.fillStyle = color;
  ctx.font = 'bold 9px monospace';

  if (statusPageIndex === 0) {
    // Age, Weight, Discipline
    ctx.fillText('--- STATUS 1/4 ---', 28, 16);
    ctx.fillText(`AGE:    ${state.age} yr`, 26, 36);
    ctx.fillText(`WEIGHT: ${state.weight} g`, 26, 54);
    ctx.fillText(`DISC.:  ${state.discipline}%`, 26, 72);
    ctx.font = '8px monospace';
    ctx.fillText(`[A]NEXT [B/C]EXIT`, 32, 92);
  } else if (statusPageIndex === 1) {
    // Hunger Hearts
    ctx.fillText('-- HUNGER (飽食) --', 24, 18);
    ctx.fillText('2/4', 138, 18);
    for (let i = 0; i < 4; i++) {
      const isFilled = i < state.hunger;
      const hSprite = isFilled ? 'heartFull' : 'heartEmpty';
      drawSprite(ctx, hSprite, 26 + i * 28, 38, 1.8, color);
    }
    ctx.font = '8px monospace';
    ctx.fillText(`${state.hunger} OF 4 HEARTS`, 45, 74);
    ctx.fillText(`[A]NEXT [B/C]EXIT`, 32, 92);
  } else if (statusPageIndex === 2) {
    // Happy Hearts
    ctx.fillText('-- HAPPY (快樂) --', 26, 18);
    ctx.fillText('3/4', 138, 18);
    for (let i = 0; i < 4; i++) {
      const isFilled = i < state.happiness;
      const hSprite = isFilled ? 'heartFull' : 'heartEmpty';
      drawSprite(ctx, hSprite, 26 + i * 28, 38, 1.8, color);
    }
    ctx.font = '8px monospace';
    ctx.fillText(`${state.happiness} OF 4 HEARTS`, 45, 74);
    ctx.fillText(`[A]NEXT [B/C]EXIT`, 32, 92);
  } else {
    // Discipline bar & Evolution Stage
    ctx.fillText('-- DISCIPLINE --', 32, 18);
    ctx.fillText('4/4', 138, 18);
    
    // Draw bar
    ctx.strokeRect(26, 36, 108, 14);
    const fillWidth = Math.floor((state.discipline / 100) * 104);
    if (fillWidth > 0) {
      ctx.fillRect(28, 38, fillWidth, 10);
    }
    ctx.fillText(`TRAINED: ${state.discipline}%`, 42, 66);
    ctx.fillText(`STAGE: ${state.stage}`, 42, 78);
    ctx.font = '8px monospace';
    ctx.fillText(`[A]FIRST [B/C]EXIT`, 32, 92);
  }
}

function renderMealMenu(rc: RenderContext, color: string) {
  const { ctx, menuIndex } = rc;

  ctx.fillStyle = color;
  ctx.font = 'bold 9px monospace';
  ctx.fillText('--- SELECT FOOD ---', 24, 18);

  ctx.font = 'bold 10px monospace';
  ctx.fillText(menuIndex === 0 ? '► MEAL  (正餐)' : '  MEAL  (正餐)', 24, 45);
  ctx.fillText(menuIndex === 1 ? '► SNACK (點心)' : '  SNACK (點心)', 24, 70);

  // Preview sprite on right
  if (menuIndex === 0) {
    drawSprite(ctx, 'meal', 118, 32, 2.2, color);
  } else {
    drawSprite(ctx, 'snack', 118, 56, 2.2, color);
  }

  ctx.font = '8px monospace';
  ctx.fillText('[A]SELECT  [B]FEED  [C]BACK', 16, 92);
}

function renderGameScreen(rc: RenderContext, color: string) {
  const { ctx, state, gameRound, gameScore, gamePetChoice, gamePlayerChoice, gamePhase } = rc;

  ctx.fillStyle = color;
  ctx.font = 'bold 8px monospace';
  ctx.fillText('GAME: GUESS DIRECTION', 24, 15);
  ctx.fillText(`ROUND ${Math.min(5, gameRound + 1)}/5   SCORE ${gameScore}`, 28, 28);

  if (gamePhase === 'final') {
    ctx.font = 'bold 10px monospace';
    const isWin = gameScore >= 3;
    ctx.fillText(isWin ? '★ YOU WIN! ★' : 'GAME OVER!', 40, 52);
    ctx.font = '9px monospace';
    ctx.fillText(`FINAL: ${gameScore} OF 5`, 42, 68);
    const cheerSprite = getPetCurrentSprite(state, true);
    drawSprite(ctx, cheerSprite, 70, 72, 1.8, color);
    return;
  }

  // Pet turn look
  let action: 'lookLeft' | 'lookRight' | 'neutral' = 'neutral';
  let posX = 58;

  if (gamePhase === 'revealing' && gamePlayerChoice !== null) {
    action = gamePetChoice === 0 ? 'lookLeft' : 'lookRight';
    posX = gamePetChoice === 0 ? 38 : 78;
  }

  const petSprite = getPetCurrentSprite(state, true, action);
  drawSprite(ctx, petSprite, posX, 36, 2.6, color);

  // Result symbol for round
  if (gamePhase === 'revealing' && gamePlayerChoice !== null) {
    const isMatch = gamePlayerChoice === gamePetChoice;
    ctx.font = 'bold 12px monospace';
    ctx.fillText(isMatch ? '○ NICE!' : '✕ MISS', 52, 30);
  }

  ctx.font = 'bold 8px monospace';
  ctx.fillText('◄ [A] LEFT      [B] RIGHT ►', 18, 90);
}

function renderAnimation(rc: RenderContext, color: string, frameToggle: boolean) {
  const { ctx, state, animType, animTimer } = rc;

  ctx.fillStyle = color;
  ctx.font = 'bold 9px monospace';

  if (animType === 'EATING') {
    ctx.fillText('MUNCH MUNCH...', 42, 20);
    const petSprite = getPetCurrentSprite(state, frameToggle);
    drawSprite(ctx, petSprite, 38, 34, 2.8, color);

    // Food disappearing in bites
    const biteStep = Math.min(3, Math.floor(animTimer / 8));
    if (biteStep < 3) {
      drawSprite(ctx, 'meal', 92 - biteStep * 4, 40, 2.2, color);
    }
  } else if (animType === 'CLEANING') {
    ctx.fillText('WASHING AWAY...', 40, 20);
    const petSprite = getPetCurrentSprite(state, frameToggle);
    drawSprite(ctx, petSprite, 36, 34, 2.6, color);

    // Flushing water wave moving across screen
    const waveX = 140 - (animTimer * 6) % 150;
    ctx.fillRect(waveX, 26, 16, 56);
    ctx.fillRect(waveX + 6, 20, 8, 68);
  } else if (animType === 'MEDICINE') {
    ctx.fillText('HEALING TREATMENT...', 24, 20);
    const petSprite = getPetCurrentSprite(state, frameToggle);
    drawSprite(ctx, petSprite, 62, 34, 2.8, color);

    // Syringe pushing in
    const sX = 16 + Math.min(30, animTimer * 2.5);
    drawSprite(ctx, 'syringe', sX, 36, 2.2, color);
  } else if (animType === 'DISCIPLINE') {
    ctx.fillText('BE GOOD! NO NONSENSE!', 22, 20);
    const petSprite = getPetCurrentSprite(state, false);
    drawSprite(ctx, petSprite, 58, 36, 2.8, color);
    drawSprite(ctx, 'scold', 24, 26, 2.2, color);
  } else if (animType === 'HATCHING') {
    ctx.fillText('IT IS HATCHING!', 38, 20);
    const crackCycle = frameToggle ? 'eggCrack' : 'egg2';
    drawSprite(ctx, crackCycle, 56, 32, 3.2, color);
  } else if (animType === 'EVOLVING') {
    ctx.fillText('★ EVOLVING! ★', 42, 20);
    const alternateSprite = frameToggle
      ? getPetCurrentSprite(state, true)
      : 'sparkle';
    if (alternateSprite === 'sparkle') {
      drawSprite(ctx, 'heartFull', 48, 30, 2.5, color);
      drawSprite(ctx, 'heartFull', 88, 30, 2.5, color);
    } else {
      drawSprite(ctx, alternateSprite, 58, 32, 3.0, color);
    }
  }
}
