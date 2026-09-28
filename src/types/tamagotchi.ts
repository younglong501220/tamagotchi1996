export type Stage = 'EGG' | 'BABY' | 'CHILD' | 'TEEN' | 'ADULT' | 'DEAD';

export type AdultCharacter = 
  | 'MAMETCHI'      // Perfect care, high discipline (Classic smart bunny)
  | 'GINJIROTCHI'   // Good care, active (Penguin)
  | 'KUCHIPATCHI'   // Medium care, big eater (Duck-billed cute creature)
  | 'MASKTCHI'      // Medium-low care, shy (Masked ninja)
  | 'OYAJITCHI';    // Secret special adult (Uncle with beret)

export interface TamagotchiState {
  stage: Stage;
  characterId: AdultCharacter | 'BABYTCHI' | 'MARUTCHI' | 'TAMATCHI';
  name: string;
  age: number;          // In "days" or virtual years
  weight: number;       // Grams (e.g. 5g - 99g)
  hunger: number;       // 0 to 4 hearts
  happiness: number;    // 0 to 4 hearts
  discipline: number;   // 0 to 100%
  isSleeping: boolean;
  isSick: boolean;
  poopCount: number;    // 0 to 4
  needsCall: boolean;
  callReason: string;
  eggTimer: number;     // seconds countdown until hatch
  bornTime: number;     // timestamp
  lastTick: number;     // timestamp of last calculation
  timeSpeed: number;    // 1 for normal, 5 for turbo, 20 for fast demo
  mistakesCount: number;
  stats: {
    mealsEaten: number;
    snacksEaten: number;
    gamesWon: number;
    gamesPlayed: number;
    poopsCleaned: number;
    medicinesGiven: number;
    scoldsGiven: number;
  };
  eventLogs: Array<{
    id: string;
    timestamp: number;
    text: string;
    type: 'birth' | 'evolve' | 'feed' | 'clean' | 'sick' | 'heal' | 'game' | 'discipline' | 'sleep' | 'death';
  }>;
}

export type MenuType = 'NONE' | 'MEAL_SELECT' | 'STATUS' | 'GAME' | 'ANIMATION';

export type ShellTheme = 'pink' | 'originalWhite' | 'cyberSmoke' | 'neonCyan' | 'vintageYellow' | 'lavender';

export interface ShellStyle {
  id: ShellTheme;
  name: string;
  nameEn: string;
  bodyGradient: string;
  borderColor: string;
  btnColor: string;
  btnShadow: string;
  bezelBg: string;
}
