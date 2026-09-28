import { useState, useEffect, useRef, useCallback } from 'react';
import { TamagotchiState, MenuType, AdultCharacter } from '../types/tamagotchi';
import { sound } from '../audio/synth';

const STORAGE_KEY = 'tamagotchi_save_v1';

const INITIAL_STATE: TamagotchiState = {
  stage: 'EGG',
  characterId: 'BABYTCHI',
  name: '小拓麻',
  age: 0,
  weight: 5,
  hunger: 2,
  happiness: 2,
  discipline: 0,
  isSleeping: false,
  isSick: false,
  poopCount: 0,
  needsCall: false,
  callReason: '',
  eggTimer: 10, // 10 seconds default hatch time
  bornTime: Date.now(),
  lastTick: Date.now(),
  timeSpeed: 1,
  mistakesCount: 0,
  stats: {
    mealsEaten: 0,
    snacksEaten: 0,
    gamesWon: 0,
    gamesPlayed: 0,
    poopsCleaned: 0,
    medicinesGiven: 0,
    scoldsGiven: 0,
  },
  eventLogs: [
    {
      id: 'init-1',
      timestamp: Date.now(),
      text: '神秘蛋落到了手中，正靜靜地等待破殼...',
      type: 'birth',
    },
  ],
};

export function useTamagotchi() {
  const [state, setState] = useState<TamagotchiState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...INITIAL_STATE,
            ...parsed,
            stats: { ...INITIAL_STATE.stats, ...(parsed.stats || {}) },
            eventLogs: parsed.eventLogs || INITIAL_STATE.eventLogs,
          };
        }
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }
    return INITIAL_STATE;
  });

  const [selectedIcon, setSelectedIcon] = useState<number>(-1);
  const [activeMenu, setActiveMenu] = useState<MenuType>('NONE');
  const [menuIndex, setMenuIndex] = useState<number>(0);
  const [statusPageIndex, setStatusPageIndex] = useState<number>(0);

  // Minigame state
  const [gameRound, setGameRound] = useState<number>(0);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gamePetChoice, setGamePetChoice] = useState<number>(0);
  const [gamePlayerChoice, setGamePlayerChoice] = useState<number | null>(null);
  const [gamePhase, setGamePhase] = useState<'guessing' | 'revealing' | 'final'>('guessing');

  // Animation state
  const [animType, setAnimType] = useState<string | null>(null);
  const [animTimer, setAnimTimer] = useState<number>(0);

  const stateRef = useRef(state);
  stateRef.current = state;

  const logEvent = useCallback((text: string, type: TamagotchiState['eventLogs'][0]['type']) => {
    setState((prev) => ({
      ...prev,
      eventLogs: [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          text,
          type,
        },
        ...prev.eventLogs.slice(0, 49),
      ],
    }));
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  // Trigger animations
  const triggerAnimation = useCallback((type: string, durationMs: number = 1800) => {
    setActiveMenu('NONE');
    setSelectedIcon(-1);
    setAnimType(type);
    setAnimTimer(0);

    const timer = setTimeout(() => {
      setAnimType(null);
      setAnimTimer(0);
    }, durationMs);

    return () => clearTimeout(timer);
  }, []);

  // Main simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.stage === 'DEAD') return prev;

        const now = Date.now();
        const multiplier = prev.timeSpeed;
        const next = { ...prev, lastTick: now };

        // 1. Egg Hatching
        if (next.stage === 'EGG') {
          next.eggTimer = Math.max(0, next.eggTimer - 1 * multiplier);
          if (next.eggTimer === 0) {
            next.stage = 'BABY';
            next.characterId = 'BABYTCHI';
            next.hunger = 4;
            next.happiness = 4;
            next.bornTime = now;
            sound.soundHatch();
            setTimeout(() => {
              logEvent('🥚 蛋孵化了！一隻活潑的嬰兒雞 (Babytchi) 破殼而出！', 'birth');
            }, 0);
          }
          return next;
        }

        // 2. Age progression (1 year every 120 seconds * multiplier)
        const elapsedSeconds = (now - next.bornTime) / 1000;
        const currentAge = Math.floor((elapsedSeconds * multiplier) / 120);
        if (currentAge > next.age) {
          next.age = currentAge;
        }

        // 3. Natural Hunger & Happiness decline
        // Roughly every 35-50 ticks with probability
        if (!next.isSleeping) {
          if (Math.random() < 0.08 * multiplier) {
            next.hunger = Math.max(0, next.hunger - 1);
          }
          if (Math.random() < 0.07 * multiplier) {
            next.happiness = Math.max(0, next.happiness - 1);
          }
        }

        // 4. Poop generation
        if (Math.random() < 0.04 * multiplier && next.poopCount < 4) {
          next.poopCount += 1;
        }

        // 5. Sickness chance (high poops or starving)
        if (!next.isSick) {
          if (next.poopCount >= 2 && Math.random() < 0.08 * multiplier) {
            next.isSick = true;
            sound.soundAlert();
            logEvent('⚠️ 寵物周圍便便太多，染上疾病了！請盡速吃藥！', 'sick');
          } else if (next.hunger === 0 && Math.random() < 0.06 * multiplier) {
            next.isSick = true;
            sound.soundAlert();
            logEvent('⚠️ 寵物過於飢餓而生病了！', 'sick');
          }
        }

        // 6. Attention / Needs Call
        const needsAttention =
          next.hunger <= 1 ||
          next.happiness <= 1 ||
          next.isSick ||
          next.poopCount >= 2;

        if (needsAttention && !next.needsCall) {
          sound.soundAlert();
        }
        next.needsCall = needsAttention;

        // 7. Evolution Logic
        if (next.stage === 'BABY' && next.age >= 1) {
          next.stage = 'CHILD';
          next.characterId = 'MARUTCHI';
          sound.soundEvolve();
          setTimeout(() => {
            logEvent('✨ 進化了！成長為圓滾滾的幼童雞 (Marutchi)！', 'evolve');
          }, 0);
        } else if (next.stage === 'CHILD' && next.age >= 3) {
          next.stage = 'TEEN';
          next.characterId = 'TAMATCHI';
          sound.soundEvolve();
          setTimeout(() => {
            logEvent('✨ 踏入青春期！成長為活力充沛的少年雞 (Tamatchi)！', 'evolve');
          }, 0);
        } else if (next.stage === 'TEEN' && next.age >= 5) {
          next.stage = 'ADULT';
          let adultType: AdultCharacter = 'KUCHIPATCHI';
          if (next.discipline >= 75 && next.mistakesCount <= 1) {
            adultType = 'MAMETCHI'; // High IQ model pet
          } else if (next.discipline >= 50) {
            adultType = 'GINJIROTCHI'; // Active penguin
          } else if (next.discipline < 25) {
            adultType = 'MASKTCHI'; // Ninja
          } else if (next.stats.mealsEaten >= 25 && next.weight >= 40) {
            adultType = 'OYAJITCHI'; // Secret uncle
          }
          next.characterId = adultType;
          sound.soundEvolve();
          setTimeout(() => {
            logEvent(`🌟 終極蛻變！蛻變為成年型態：${adultType}！`, 'evolve');
          }, 0);
        }

        // 8. Death from extreme neglect
        if (next.hunger === 0 && next.happiness === 0 && next.isSick) {
          if (Math.random() < 0.05 * multiplier) {
            next.stage = 'DEAD';
            sound.soundDeath();
            setTimeout(() => {
              logEvent('🪦 電子雞因為過度飢餓與重病離開了世界... (按 C 鍵重獲新生)', 'death');
            }, 0);
          }
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [logEvent]);

  // Tick for rendering animations
  useEffect(() => {
    if (!animType) return;
    const interval = setInterval(() => {
      setAnimTimer((t) => t + 1);
    }, 60);
    return () => clearInterval(interval);
  }, [animType]);

  // Minigame turn handler
  const handlePlayGameTurn = useCallback(
    (playerDir: number) => {
      if (gamePhase !== 'guessing') return;

      const petDir = Math.random() < 0.5 ? 0 : 1;
      setGamePetChoice(petDir);
      setGamePlayerChoice(playerDir);
      setGamePhase('revealing');

      const isMatch = playerDir === petDir;
      if (isMatch) {
        setGameScore((s) => s + 1);
        sound.soundCheer();
      } else {
        sound.soundFail();
      }

      setTimeout(() => {
        if (gameRound + 1 >= 5) {
          setGamePhase('final');
          setTimeout(() => {
            const finalScore = gameScore + (isMatch ? 1 : 0);
            const isWinner = finalScore >= 3;
            setState((prev) => ({
              ...prev,
              happiness: Math.min(4, prev.happiness + (isWinner ? 2 : 1)),
              weight: Math.max(1, prev.weight - 1),
              stats: {
                ...prev.stats,
                gamesPlayed: prev.stats.gamesPlayed + 1,
                gamesWon: prev.stats.gamesWon + (isWinner ? 1 : 0),
              },
            }));
            if (isWinner) {
              sound.soundCheer();
              logEvent(`⚽ 猜左右小遊戲獲勝！獲得 ${finalScore}/5 分，快樂度大增！`, 'game');
            } else {
              logEvent(`⚽ 猜左右小遊戲結束 (${finalScore}/5 分)，多運動身體好！`, 'game');
            }
            setActiveMenu('NONE');
            setSelectedIcon(-1);
          }, 1200);
        } else {
          setGameRound((r) => r + 1);
          setGamePlayerChoice(null);
          setGamePhase('guessing');
        }
      }, 700);
    },
    [gamePhase, gameRound, gameScore, logEvent]
  );

  // Button A: Select / Cycle
  const pressA = useCallback(() => {
    sound.soundSelect();
    const curr = stateRef.current;

    if (activeMenu === 'MEAL_SELECT') {
      setMenuIndex((prev) => (prev === 0 ? 1 : 0));
      return;
    }
    if (activeMenu === 'STATUS') {
      setStatusPageIndex((prev) => (prev + 1) % 4);
      return;
    }
    if (activeMenu === 'GAME') {
      handlePlayGameTurn(0); // Choose Left
      return;
    }

    if (curr.stage === 'DEAD' || curr.stage === 'EGG') return;

    // Cycle top/bottom icons (0 to 6)
    setSelectedIcon((prev) => (prev + 1) % 7);
  }, [activeMenu, handlePlayGameTurn]);

  // Button B: Confirm / Execute
  const pressB = useCallback(() => {
    sound.soundConfirm();
    const curr = stateRef.current;

    if (curr.stage === 'DEAD') return;

    if (activeMenu === 'MEAL_SELECT') {
      if (menuIndex === 0) {
        // MEAL (Meal)
        setState((prev) => ({
          ...prev,
          hunger: Math.min(4, prev.hunger + 1),
          weight: prev.weight + 1,
          stats: { ...prev.stats, mealsEaten: prev.stats.mealsEaten + 1 },
        }));
        sound.soundEat();
        triggerAnimation('EATING');
        logEvent('🍙 餵食了美味正餐，飽食度+1，體重+1g。', 'feed');
      } else {
        // SNACK (Snack)
        setState((prev) => ({
          ...prev,
          happiness: Math.min(4, prev.happiness + 1),
          weight: prev.weight + 2,
          stats: { ...prev.stats, snacksEaten: prev.stats.snacksEaten + 1 },
        }));
        sound.soundEat();
        triggerAnimation('EATING');
        logEvent('🍰 餵食了甜點點心，心情變得超棒！體重+2g。', 'feed');
      }
      return;
    }

    if (activeMenu === 'STATUS') {
      setActiveMenu('NONE');
      setSelectedIcon(-1);
      return;
    }

    if (activeMenu === 'GAME') {
      handlePlayGameTurn(1); // Choose Right
      return;
    }

    // Execute based on selectedIcon
    switch (selectedIcon) {
      case 0: // Feed
        setActiveMenu('MEAL_SELECT');
        setMenuIndex(0);
        break;
      case 1: // Light switch (Sleep)
        setState((prev) => {
          const nextSleeping = !prev.isSleeping;
          logEvent(
            nextSleeping ? '🌙 關上了電燈，讓電子雞好好安睡。' : '☀️ 打開了電燈，電子雞精神抖擻地醒來了！',
            'sleep'
          );
          return { ...prev, isSleeping: nextSleeping };
        });
        setSelectedIcon(-1);
        break;
      case 2: // Game
        if (curr.isSleeping || curr.isSick) {
          sound.soundCancel();
        } else {
          setActiveMenu('GAME');
          setGameRound(0);
          setGameScore(0);
          setGamePlayerChoice(null);
          setGamePhase('guessing');
        }
        break;
      case 3: // Medicine
        if (curr.isSick) {
          setState((prev) => ({
            ...prev,
            isSick: false,
            stats: { ...prev.stats, medicinesGiven: prev.stats.medicinesGiven + 1 },
          }));
          sound.soundHeal();
          triggerAnimation('MEDICINE');
          logEvent('💉 施打了特效針劑，電子雞康復了！', 'heal');
        } else {
          sound.soundCancel();
        }
        break;
      case 4: // Flush poop
        if (curr.poopCount > 0) {
          setState((prev) => ({
            ...prev,
            poopCount: 0,
            stats: { ...prev.stats, poopsCleaned: prev.stats.poopsCleaned + prev.poopCount },
          }));
          sound.soundFlush();
          triggerAnimation('CLEANING');
          logEvent('🛁 啟動沖水馬桶，環境被打掃得乾乾淨淨！', 'clean');
        } else {
          sound.soundCancel();
        }
        break;
      case 5: // Check status
        setActiveMenu('STATUS');
        setStatusPageIndex(0);
        break;
      case 6: // Discipline
        setState((prev) => ({
          ...prev,
          discipline: Math.min(100, prev.discipline + 25),
          stats: { ...prev.stats, scoldsGiven: prev.stats.scoldsGiven + 1 },
        }));
        triggerAnimation('DISCIPLINE');
        logEvent('⚡ 嚴格進行了管教與訓話，紀律值大幅提升！', 'discipline');
        break;
      default:
        // No icon selected, quick check status
        setActiveMenu('STATUS');
        setStatusPageIndex(0);
        break;
    }
  }, [activeMenu, menuIndex, selectedIcon, triggerAnimation, handlePlayGameTurn, logEvent]);

  // Button C: Cancel / Reset
  const pressC = useCallback(() => {
    sound.soundCancel();
    const curr = stateRef.current;

    if (curr.stage === 'DEAD') {
      // Reincarnate new egg
      resetPet();
      return;
    }

    // Cancel menus and unselect
    setActiveMenu('NONE');
    setSelectedIcon(-1);
  }, []);

  const resetPet = useCallback(() => {
    const fresh: TamagotchiState = {
      ...INITIAL_STATE,
      bornTime: Date.now(),
      lastTick: Date.now(),
      eventLogs: [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          text: '新生之卵誕生了！請懷抱愛心細心照顧！',
          type: 'birth',
        },
      ],
    };
    setState(fresh);
    setActiveMenu('NONE');
    setSelectedIcon(-1);
    sound.soundConfirm();
  }, []);

  const hatchInstantly = useCallback(() => {
    setState((prev) => {
      if (prev.stage !== 'EGG') return prev;
      sound.soundHatch();
      logEvent('⚡ 蛋提前破殼而出！', 'birth');
      return {
        ...prev,
        stage: 'BABY',
        characterId: 'BABYTCHI',
        eggTimer: 0,
        hunger: 4,
        happiness: 4,
        bornTime: Date.now(),
      };
    });
  }, [logEvent]);

  const setTimeSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, timeSpeed: speed }));
  }, []);

  return {
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
    triggerAnimation,
  };
}
